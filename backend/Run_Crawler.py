"""
Entry point for the data ingestion pipeline.

Usage:
    uv run python backend/Run_crawler.py                 # recursive crawl (default), everything in config.py
    uv run python backend/Run_crawler.py --category standards
    uv run python backend/Run_crawler.py --category standards --category hallmarking
    uv run python backend/Run_crawler.py --max-depth 5    # crawl deeper (default 3)
    uv run python backend/Run_crawler.py --flat           # old behavior: only the exact SOURCES URLs, no link-following

After a recursive run, check data/raw/crawl_log.jsonl for a full record
of every URL touched — success, failure, or why it was skipped
(disallowed by robots.txt, login/admin path, wrong domain, etc.).
"""

from __future__ import annotations

import argparse
import asyncio
import logging
import sys
from pathlib import Path

# Allow `python backend/Run_crawler.py` to find the `app` package
sys.path.insert(0, str(Path(__file__).parent))

from app.ingestion.Config import MAX_CRAWL_DEPTH
from app.ingestion.Pipeline import run_pipeline
from app.ingestion.Schema import SourceCategory

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the Standard_AI data ingestion pipeline.")
    parser.add_argument(
        "--category",
        action="append",
        choices=[c.value for c in SourceCategory],
        help="Limit the crawl to one or more categories. Omit to crawl everything.",
    )
    parser.add_argument(
        "--flat",
        action="store_true",
        help="Disable recursive link-following — fetch only the exact URLs in SOURCES.",
    )
    parser.add_argument(
        "--max-depth",
        type=int,
        default=MAX_CRAWL_DEPTH,
        help=f"How many link-hops to follow from each seed URL (default {MAX_CRAWL_DEPTH}). Ignored with --flat.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    categories = [SourceCategory(c) for c in args.category] if args.category else None
    asyncio.run(run_pipeline(categories, recursive=not args.flat, max_depth=args.max_depth))


if __name__ == "__main__":
    main()