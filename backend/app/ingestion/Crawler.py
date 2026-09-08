"""
Fetches rendered HTML using Playwright, with two modes:

  - fetch_all()       — the original flat mode: fetch exactly the URLs
                         given, no link-following. Kept for cases where
                         you already know exactly what you want.
  - crawl_recursive()  — starts from seed URLs and follows links found
                         on each page (breadth-first), staying within
                         ALLOWED_DOMAINS and respecting each domain's
                         robots.txt automatically. This is the default
                         mode going forward — see Run_crawler.py.

When crawl_recursive() encounters a link to a PDF, it downloads the
file directly (via httpx — PDFs don't need JS rendering) into
PDF_DIR, rather than skipping it. This is how BIS actually publishes
some content (e.g. the testing labs directory) — better to grab it
automatically while crawling than to hunt down PDF URLs by hand
afterwards. Downloaded PDFs are logged as "downloaded_pdf", not
followed for further links (can't extract <a> tags from a PDF this
way), and left for a human/labs_extractor.py to decide what to do
with — the crawler's job is just to fetch, not to interpret.

Using a real browser for HTML (rather than plain requests) matters
because some BIS/government portal pages render content via JS — the
College_AI project hit exactly this issue with SPA rendering, so
we're building that lesson in from the start rather than discovering
it again later.
"""

from __future__ import annotations

import asyncio
import json
import logging
from collections import deque
from pathlib import Path
from urllib.parse import urljoin, urlparse, urldefrag

from bs4 import BeautifulSoup
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError

from app.config.Config import PDF_DIR
from app.ingestion.Config import (
    ALLOWED_DOMAINS,
    CRAWL_DELAY_SECONDS,
    CRAWL_LOG_PATH,
    MAX_CRAWL_DEPTH,
    MAX_PAGES_PER_DOMAIN,
    REQUEST_TIMEOUT_MS,
    SKIP_EXTENSIONS,
    SKIP_PATH_HINTS,
    USER_AGENT,
)
from app.ingestion.Robots_checker import is_allowed_by_robots
from app.ingestion.Schema import RawPage, SourceCategory

logger = logging.getLogger(__name__)


def _is_allowed_domain(url: str) -> bool:
    domain = urlparse(url).netloc
    return domain in ALLOWED_DOMAINS


def _normalize_url(url: str) -> str:
    """Strip fragment; drop nothing else — query params can be meaningful on this site."""
    url, _fragment = urldefrag(url)
    return url.rstrip("/")


def _has_skip_extension(url: str) -> bool:
    path = urlparse(url).path.lower()
    return any(path.endswith(ext) for ext in SKIP_EXTENSIONS)


def _is_pdf(url: str) -> bool:
    return urlparse(url).path.lower().endswith(".pdf")


def _has_skip_path_hint(url: str) -> bool:
    path = urlparse(url).path.lower()
    return any(hint in path for hint in SKIP_PATH_HINTS)


def _extract_links(html: str, base_url: str) -> list[str]:
    """Pull every <a href> out of a page, resolved to absolute URLs."""
    soup = BeautifulSoup(html, "html.parser")
    links = []
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if not href or href.startswith(("mailto:", "tel:", "javascript:", "#")):
            continue
        absolute = urljoin(base_url, href)
        if absolute.startswith(("http://", "https://")):
            links.append(_normalize_url(absolute))
    return links


def _pdf_filename(url: str) -> str:
    """Derive a safe local filename for a downloaded PDF, keeping the
    original name where possible (helps a human recognize what it is
    later) but falling back to a hash if the URL has no clean filename.
    """
    import hashlib

    raw_name = Path(urlparse(url).path).name
    if raw_name.lower().endswith(".pdf") and raw_name not in ("", ".pdf"):
        return raw_name
    return hashlib.sha256(url.encode("utf-8")).hexdigest()[:16] + ".pdf"


async def download_pdf(url: str, dest_dir: Path = PDF_DIR) -> Path | None:
    """
    Download a PDF directly via HTTP (no browser/JS rendering needed for
    a binary file). Returns the saved path, or None on failure.

    Caller is responsible for domain/robots checks before calling this —
    same as fetch_page(), this function just fetches.
    """
    import httpx  # lazy import — keeps this module importable/testable
                   # in environments without httpx installed yet

    dest_dir.mkdir(parents=True, exist_ok=True)
    dest_path = dest_dir / _pdf_filename(url)

    try:
        async with httpx.AsyncClient(timeout=60.0, follow_redirects=True) as client:
            resp = await client.get(url, headers={"User-Agent": USER_AGENT})
            resp.raise_for_status()
            dest_path.write_bytes(resp.content)
        return dest_path
    except httpx.HTTPError as exc:
        logger.error("Failed to download PDF %s: %s", url, exc)
        return None


class CrawlLogger:
    """Appends one JSON line per URL processed: success, failure, or skip reason."""

    def __init__(self, log_path: str = CRAWL_LOG_PATH):
        self.log_path = Path(log_path)
        self.log_path.parent.mkdir(parents=True, exist_ok=True)
        self._counts: dict[str, int] = {}

    def record(self, url: str, status: str, depth: int, parent_url: str = "", detail: str = "") -> None:
        self._counts[status] = self._counts.get(status, 0) + 1
        entry = {
            "url": url,
            "status": status,
            "depth": depth,
            "parent_url": parent_url,
            "detail": detail,
        }
        with self.log_path.open("a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")

    def summary(self) -> dict[str, int]:
        return dict(self._counts)

    def log_summary(self) -> None:
        logger.info("Crawl summary: %s", self.summary())
        logger.info("Full per-URL log at: %s", self.log_path)


async def fetch_page(context, url: str, category: SourceCategory) -> RawPage | None:
    """Fetch a single URL and return its rendered HTML, or None on failure."""
    if not _is_allowed_domain(url):
        logger.warning("Skipping URL outside allowed domains: %s", url)
        return None

    page = await context.new_page()
    try:
        await page.goto(url, timeout=REQUEST_TIMEOUT_MS, wait_until="networkidle")
        html = await page.content()
        return RawPage(url=url, category=category, html=html)
    except PlaywrightTimeoutError:
        logger.error("Timed out fetching %s", url)
        return None
    except Exception as exc:  # noqa: BLE001 — log and continue, one bad page shouldn't kill the run
        logger.error("Failed to fetch %s: %s", url, exc)
        return None
    finally:
        await page.close()


async def fetch_all(urls_by_category: dict[SourceCategory, list[str]]) -> list[RawPage]:
    """Fetch exactly the URLs given, no link-following. See crawl_recursive() for that."""
    results: list[RawPage] = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(user_agent=USER_AGENT, ignore_https_errors=True)

        for category, urls in urls_by_category.items():
            for url in urls:
                page_result = await fetch_page(context, url, category)
                if page_result is not None:
                    results.append(page_result)
                    logger.info("Fetched [%s] %s", category.value, url)
                await asyncio.sleep(CRAWL_DELAY_SECONDS)

        await browser.close()

    return results


async def crawl_recursive(
    seed_urls_by_category: dict[SourceCategory, list[str]],
    max_depth: int = MAX_CRAWL_DEPTH,
    max_pages_per_domain: int = MAX_PAGES_PER_DOMAIN,
    log_path: str = CRAWL_LOG_PATH,
) -> list[RawPage]:
    """
    Breadth-first crawl starting from seed URLs, following <a> links found
    on each page. A page inherits its seed's category — pages several
    hops deep keep whatever category the crawl started from, since BIS's
    site sections are internally consistent about topic.

    Every URL encountered is logged (success/failure/skip + reason) to
    log_path via CrawlLogger, so the team can review exactly what was
    and wasn't crawled and why, rather than guessing from console output.
    """
    results: list[RawPage] = []
    visited: set[str] = set()
    domain_page_counts: dict[str, int] = {}
    crawl_log = CrawlLogger(log_path)

    # Queue items: (url, category, depth, parent_url)
    queue: deque[tuple[str, SourceCategory, int, str]] = deque()
    for category, seeds in seed_urls_by_category.items():
        for seed in seeds:
            queue.append((_normalize_url(seed), category, 0, ""))

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(user_agent=USER_AGENT, ignore_https_errors=True)

        while queue:
            url, category, depth, parent_url = queue.popleft()

            if url in visited:
                continue
            visited.add(url)

            domain = urlparse(url).netloc

            if not _is_allowed_domain(url):
                crawl_log.record(url, "skipped_domain_not_allowed", depth, parent_url)
                continue

            if _is_pdf(url):
                saved_path = await download_pdf(url)
                await asyncio.sleep(CRAWL_DELAY_SECONDS)
                if saved_path is not None:
                    crawl_log.record(url, "downloaded_pdf", depth, parent_url, detail=str(saved_path))
                    logger.info("Downloaded PDF: %s -> %s", url, saved_path)
                else:
                    crawl_log.record(url, "failed_pdf_download", depth, parent_url)
                continue  # PDFs aren't parsed for further links

            if _has_skip_extension(url):
                crawl_log.record(url, "skipped_extension", depth, parent_url)
                continue

            if _has_skip_path_hint(url):
                crawl_log.record(url, "skipped_login_or_admin_path", depth, parent_url)
                continue

            if domain_page_counts.get(domain, 0) >= max_pages_per_domain:
                crawl_log.record(url, "skipped_domain_page_cap_reached", depth, parent_url)
                continue

            if not await is_allowed_by_robots(url):
                crawl_log.record(url, "skipped_robots_disallowed", depth, parent_url)
                continue

            page_result = await fetch_page(context, url, category)
            await asyncio.sleep(CRAWL_DELAY_SECONDS)

            if page_result is None:
                crawl_log.record(url, "failed_fetch", depth, parent_url)
                continue

            domain_page_counts[domain] = domain_page_counts.get(domain, 0) + 1
            results.append(page_result)
            crawl_log.record(url, "success", depth, parent_url)
            logger.info("Fetched [%s] depth=%d %s", category.value, depth, url)

            if depth < max_depth:
                for link in _extract_links(page_result.html, url):
                    if link not in visited:
                        queue.append((link, category, depth + 1, url))

        await browser.close()

    crawl_log.log_summary()
    return results