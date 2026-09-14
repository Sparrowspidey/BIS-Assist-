"""
Source URL registry for the crawler.

URLs below were found by manually browsing bis.gov.in's real navigation
menu (Sept 2026) and checking each domain's robots.txt. They are a
verified STARTING POINT, not a guarantee of content quality — before a
real crawl run, the data acquisition owner should:

  1. Open each URL in a browser and confirm it actually has useful
     prose content (not just a login form or an empty listing page).
  2. Add more URLs as you discover them navigating the site further —
     BIS's menu is very deep, this list intentionally starts narrow.
  3. Re-check robots.txt per domain (see ALLOWED_DOMAINS below) if you
     add a new domain — each subdomain has its OWN robots.txt, the one
     on www.bis.gov.in does not cover the others.

Categories map 1:1 to SourceCategory in schema.py.

Deliberately EXCLUDED from SOURCES (do not add without re-checking):
  - Anything under a /login path (services.bis.gov.in, manakonline.in
    logins) — behind auth, out of scope for a public-data crawler.
  - standardsbis.bsbedge.com — this is BIS's PAID standards store.
    Full Indian Standard documents are sold, not freely licensed; see
    https://www.bis.gov.in/copyright-policy/. Crawl scope/title-level
    metadata only, never attempt to scrape full paid IS documents.
  - Testing lab directory — BIS publishes this as PDF files, not HTML
    tables. Use labs_extractor.py's PDF path instead of this crawler.
"""

from app.ingestion.Schema import SourceCategory

SOURCES: dict[SourceCategory, list[str]] = {
    SourceCategory.STANDARDS: [
        "https://standards.bis.gov.in/website/published-standards/department-wise",
        "https://standards.bis.gov.in/website/know-your-standards",
        "https://standards.bis.gov.in/website/technical-departments/department-list",
    ],
    SourceCategory.CERTIFICATION: [
        "https://www.bis.gov.in/product-certification/product-certification-overview/",
        "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/",
        "https://www.bis.gov.in/product-certification/product-certification-process/",
        "https://www.bis.gov.in/product-certification/product-certification-faq/",
        "https://www.bis.gov.in/system-certification-overview/",
        "https://www.bis.gov.in/system-certification-overview/systems-certification/",
        "https://www.bis.gov.in/system-certification-overview/who-can-apply/",
        "https://www.bis.gov.in/fmcs/fmcs-overview/",
        "https://www.bis.gov.in/fmcs/certification-process/who-can-apply/",
        "https://www.bis.gov.in/fmcs/certification-process/how-to-apply/",
        "https://www.crsbis.in/BIS/about-crs.do",
        "https://www.crsbis.in/BIS/registration-page.do",
    ],
    SourceCategory.HALLMARKING: [
        "https://www.bis.gov.in/hallmarking-overview/",
        "https://www.bis.gov.in/hallmarking-overview/hallmarking-faqs/",
        "https://www.bis.gov.in/hallmarking-overview/hallmarking-faqs/hallmarking-faq/",
        "https://www.bis.gov.in/hallmarking-overview/hallmarking-faqs/mandatory/",
        "https://www.bis.gov.in/hallmarking-overview/jewellers-registration-scheme/",
        "https://www.bis.gov.in/hallmarking-overview/hallmarking-centre/",
        "https://www.bis.gov.in/hallmarking-overview/mandatory-hallmarking-order/",
        "https://www.bis.gov.in/hallmarking-overview/consumer-protection/",
    ],
    SourceCategory.CONSUMER_AFFAIRS: [
        "https://www.bis.gov.in/consumer-overview/",
        "https://www.bis.gov.in/consumer-overview/consumer-protection/",
        "https://www.bis.gov.in/consumer-overview/for-consumers-faq/",
        "https://www.bis.gov.in/consumer-overview/online-complaint-registration/",
        "https://www.bis.gov.in/consumer-overview/citizen-charter/",
        "https://www.bis.gov.in/consumer-overview/standards-india/",
        # DoCA's own site — confirmed reachable directly (Sept 2026):
        "https://consumeraffairs.nic.in/consumer-corner/national-consumers-helpline",
    ],
    SourceCategory.TESTING_LABS: [
        # This is the LISTING page, not a PDF itself — the crawler will
        # visit it as normal, find the Group_1/Group_2 PDF links on it,
        # and auto-download them to data/raw/pdf/ (see crawler.py's
        # download_pdf()). The listing page's own HTML is mostly just
        # links/table-of-contents, not real prose, so it won't produce
        # much as a RAG chunk — that's expected, its job here is to be
        # a source of PDF links, not chunkable text.
        "https://www.bis.gov.in/laboratorys/list-of-bis-recognized-lab/",
    ],
}

# Domains the crawler is allowed to touch. Anything outside this list
# gets skipped even if accidentally added to SOURCES above — a basic
# safety net against crawling unrelated/unauthorized sites.
#
# robots.txt was checked for www.bis.gov.in only (Disallow: /wp-admin/
# — otherwise permissive). Each of these OTHER domains has its own
# separate robots.txt that has NOT been checked yet — check
# https://<domain>/robots.txt for each before crawling it for real.
ALLOWED_DOMAINS = [
    "bis.gov.in",
    "www.bis.gov.in",
    "services.bis.gov.in",       # robots.txt check: 503 at time of check, retry later
    "standards.bis.gov.in",      # robots.txt CHECKED (Sept 2026): only blocks
                                  # /login, account/session flows, and admin
                                  # surfaces — our /website/... URLs are unaffected
    "crsbis.in",                 # robots.txt CHECKED (Sept 2026): 404 (no
                                  # robots.txt = no restrictions). NOTE: this
                                  # domain has an invalid/missing TLS cert —
                                  # crawler.py sets ignore_https_errors=True
                                  # to handle it.
    "www.crsbis.in",             # same as above — verify separately if used,
                                  # www. subdomain may differ
    "consumeraffairs.nic.in",    # robots.txt: connection reset when checked
                                  # from browser (likely local network issue —
                                  # domain itself confirmed reachable and
                                  # serving real content). Treating as
                                  # unrestricted public government info site,
                                  # same rate-limit/no-login rules as others.
]

USER_AGENT = "StandardAI-Crawler/1.0 (SIH26107 educational project)"
REQUEST_TIMEOUT_MS = 30_000
CRAWL_DELAY_SECONDS = 1.5  # be polite — don't hammer a government site

# --- Raw data layout ---
# Actual path constants (RAW_DIR, WEBSITE_DIR, PDF_DIR, PROCESSED_DIR) live
# in app/config/config.py — the single source of truth for paths across
# the whole project. This file only needs CRAWL_LOG_PATH, derived from
# that central RAW_DIR so it can't drift out of sync.
from app.config.Config import RAW_DIR as _RAW_DIR

CRAWL_LOG_PATH = str(_RAW_DIR / "crawl_log.jsonl")

# --- Recursive crawl settings ---
MAX_CRAWL_DEPTH = 1            # how many link-hops from a seed URL to follow
MAX_PAGES_PER_DOMAIN = 300     # safety cap so one domain can't run forever

# File extensions that are never worth fetching as RAG text (binary/media).
# PDFs are NOT in this list — they're downloaded (not skipped) by the
# crawler into PDF_DIR (see app/config/config.py), since BIS publishes
# real content (e.g. the testing labs directory) only as PDF. See
# crawler.py's download_pdf().
SKIP_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", ".ico",
    ".mp4", ".mp3", ".avi", ".mov",
    ".zip", ".rar", ".7z",
    ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    ".css", ".js",
}

# URL path fragments that indicate account/session/admin flows — skip
# following links into these even if robots.txt doesn't explicitly say to,
# since they're never useful RAG content and can trap a crawler in
# infinite login/redirect loops.
SKIP_PATH_HINTS = [
    "/login", "/logout", "/signin", "/signup", "/register",
    "/forgot-password", "/change-password", "/reset-password",
    "/admin", "/control-board", "/dashboard",
    "/manak-manthan", "/bis-talks", "/standardization-cells",
    "/sitemap", "/privacy-policy", "/terms-and-conditions",
    "/how-to-use", "/gallery-category",
]