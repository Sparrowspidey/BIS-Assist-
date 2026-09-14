"""
Entry point for extracting the BIS testing labs directory (structured
data, not RAG text — see app/ingestion/labs_extractor.py).

Usage:
    # If BIS publishes labs as an HTML page:
    uv run python backend/Run_labs_extractor.py --url https://bis.gov.in/labs-directory

    # If BIS publishes labs as a PDF (this is actually the real format
    # BIS uses — see Group_1_*.pdf / Group-2_*.pdf on bis.gov.in):
    uv run python backend/Run_labs_extractor.py --pdf path/to/Group_1_labs.pdf

    # If you already have a manually-prepared/verified CSV:
    uv run python backend/Run_labs_extractor.py --csv path/to/labs_export.csv

For --pdf, this runs the full pdf_to_csv() -> load_labs_from_csv()
pipeline in one step using DEFAULT_COLUMN_MAP. If the PDF's real column
headers don't match DEFAULT_COLUMN_MAP (likely, until someone checks
the actual PDF), run with --pdf-to-csv-only first, inspect/fix the CSV
and DEFAULT_COLUMN_MAP, then re-run with --csv on the fixed file.
"""

from __future__ import annotations

import argparse
import asyncio
import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.ingestion.Labs_extractor import (
    extract_labs_from_html,
    extract_labs_from_pdf,
    load_labs_from_csv,
    pdf_to_csv,
    save_labs,
)
from app.ingestion.Schema import SourceCategory

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Extract BIS testing lab directory.")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--url", help="URL of a page containing an HTML table of labs.")
    group.add_argument("--pdf", help="Path to a BIS lab-directory PDF (e.g. Group_1_*.pdf).")
    group.add_argument("--csv", help="Path to a locally downloaded/verified CSV export of labs.")
    parser.add_argument(
        "--pdf-to-csv-only",
        action="store_true",
        help="With --pdf: only extract raw tables to CSV for manual inspection, "
        "don't attempt to map columns to LabRecord yet.",
    )
    return parser.parse_args()


async def _fetch_html(url: str) -> str:
    # Reuses the same Playwright fetch as the main crawler so we get
    # consistent behavior (rendering, timeouts, allowed-domain check).
    from app.ingestion.Crawler import fetch_page
    from playwright.async_api import async_playwright

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        raw = await fetch_page(context, url, SourceCategory.TESTING_LABS)
        await browser.close()

    if raw is None:
        raise RuntimeError(f"Failed to fetch {url}")
    return raw.html


def main() -> None:
    args = parse_args()

    if args.csv:
        labs = load_labs_from_csv(args.csv)
    elif args.pdf and args.pdf_to_csv_only:
        csv_path = pdf_to_csv(args.pdf)
        logger.info(
            "Raw table extracted to %s — inspect/fix the header and columns, "
            "then re-run with --csv %s (adjusting DEFAULT_COLUMN_MAP first if needed).",
            csv_path,
            csv_path,
        )
        return
    elif args.pdf:
        labs = extract_labs_from_pdf(args.pdf)
    else:
        html = asyncio.run(_fetch_html(args.url))
        labs = extract_labs_from_html(html, source_url=args.url)

    if not labs:
        logger.warning(
            "No labs extracted. If using --url, the page structure likely "
            "doesn't match the assumed single-<table> layout — inspect the "
            "page and adjust extract_labs_from_html / DEFAULT_COLUMN_MAP."
        )
        return

    save_labs(labs)


if __name__ == "__main__":
    main()