"""
Structured extraction for BIS-recognized testing laboratories (FR7).

This is deliberately separate from crawler.py / cleaner.py / chunker.py:
lab data is tabular lookup data (name, location, accreditation scope),
not prose to embed and semantically search. Treating it as RAG text
would make "find a lab near me that tests X" much worse than a plain
structured filter.

Three entry points, since BIS exposes lab data in different formats
across different pages:

  - extract_labs_from_html(html, column_map)  — parses an HTML <table>
  - load_labs_from_csv(path, column_map)      — parses a CSV export
  - pdf_to_csv(pdf_path, out_csv_path)         — extracts PDF tables to
                                                  a raw CSV, then
                                                  load_labs_from_csv()
                                                  does the actual
                                                  LabRecord mapping

BIS's real "list of recognized labs" is published as PDF files (e.g.
Group_1_*.pdf, Group-2_*.pdf) rather than an HTML table — see
config.py's comments. The PDF path deliberately reuses the CSV loader
rather than mapping PDF rows to LabRecord directly: PDF table
extraction is inherently a bit messy (merged cells, inconsistent
columns across pages), so splitting "get the raw rows out" from
"interpret the columns" means you can eyeball/fix the intermediate
CSV by hand before the second, already-tested step runs.

All three funnel into the same LabRecord schema and the same save
function, so downstream code (the lookup/filter endpoint) doesn't
care which path the data came from.
"""

from __future__ import annotations

import csv
import json
import logging
from pathlib import Path

from bs4 import BeautifulSoup

from app.config.Config import PROCESSED_DIR
from app.ingestion.Schema import LabRecord

logger = logging.getLogger(__name__)

# Maps our LabRecord field names -> the column header text on the source.
# VERIFIED against real BIS Group-1 lab list PDFs (Sept 2026) via search —
# actual columns are: Sl. No., Name of Lab, State, Status, OSL Code,
# Recognition valid up to, Remarks. Still worth a final check against
# whatever specific PDF you download, since BIS's exact header wording
# has drifted slightly across different dated versions of this list.
DEFAULT_COLUMN_MAP = {
    "name": "Name of Lab",
    "state": "State",
    "status": "Status",
    "osl_code": "OSL Code",
    "recognition_valid_upto": "Recognition valid up to",
    "remarks": "Remarks",
}


def _make_lab_id(name: str, state: str) -> str:
    import hashlib

    return hashlib.sha256(f"{name}|{state}".encode("utf-8")).hexdigest()[:16]


def _get(row: dict[str, str], key: str) -> str:
    """Safely get a field, treating both missing keys AND None values as empty."""
    val = row.get(key)
    return (val or "").strip()


def _row_to_lab(row: dict[str, str], column_map: dict[str, str], source_url: str = "") -> LabRecord | None:
    """Map a raw {header: value} row to a LabRecord using column_map."""
    name = _get(row, column_map.get("name", ""))
    if not name:
        return None

    state = _get(row, column_map.get("state", ""))

    return LabRecord(
        lab_id=_make_lab_id(name, state),
        name=name,
        state=state,
        status=_get(row, column_map.get("status", "")),
        osl_code=_get(row, column_map.get("osl_code", "")),
        recognition_valid_upto=_get(row, column_map.get("recognition_valid_upto", "")),
        remarks=_get(row, column_map.get("remarks", "")),
        source_url=source_url,
    )


def extract_labs_from_html(
    html: str,
    column_map: dict[str, str] = DEFAULT_COLUMN_MAP,
    source_url: str = "",
) -> list[LabRecord]:
    """
    Parse the first <table> found in the HTML into LabRecords.

    Assumes a standard table: one <tr> of <th> headers, then one <tr>
    per lab. If BIS's real page uses a different structure (e.g. a
    JS-rendered grid, or multiple tables), this will need adjusting
    once you've inspected the actual page — that's expected, this is
    a starting point, not a guaranteed fit.
    """
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table")
    if table is None:
        logger.warning("No <table> found in HTML — nothing to extract.")
        return []

    rows = table.find_all("tr")
    if not rows:
        return []

    headers = [th.get_text(strip=True) for th in rows[0].find_all(["th", "td"])]

    labs: list[LabRecord] = []
    for tr in rows[1:]:
        cells = [td.get_text(strip=True) for td in tr.find_all("td")]
        if len(cells) != len(headers):
            continue  # malformed row, skip rather than guess
        row_dict = dict(zip(headers, cells))
        lab = _row_to_lab(row_dict, column_map, source_url)
        if lab:
            labs.append(lab)

    return labs


def pdf_to_csv(pdf_path: str | Path, out_csv_path: str | Path | None = None) -> Path:
    """
    Extract every table found in a PDF into a single raw CSV.

    This does NOT map columns to LabRecord fields — it just gets the
    table data out of the PDF and into an editable format. After
    running this, open the CSV, check/fix the header row and any
    misaligned rows (multi-page PDFs sometimes repeat headers or split
    rows oddly), then feed it to load_labs_from_csv() with a matching
    column_map.

    Requires pdfplumber (see pyproject.toml dependencies).
    """
    import pdfplumber

    pdf_path = Path(pdf_path)
    out_csv_path = Path(out_csv_path) if out_csv_path else pdf_path.with_suffix(".csv")

    all_rows: list[list[str]] = []
    header: list[str] | None = None
    page_count = 0

    with pdfplumber.open(pdf_path) as pdf:
        page_count = len(pdf.pages)
        for page_num, page in enumerate(pdf.pages, start=1):
            tables = page.extract_tables()
            if not tables:
                continue
            for table in tables:
                if not table:
                    continue
                page_header, *page_rows = table
                page_header = [(cell or "").strip() for cell in page_header]

                if header is None:
                    header = page_header
                elif page_header == header:
                    pass  # repeated header on a later page — skip, already have it
                else:
                    # Table on this page doesn't start with a header row
                    # (common when a table continues across pages) —
                    # treat the whole thing as data rows instead.
                    page_rows = table

                for row in page_rows:
                    cleaned = [(cell or "").strip() for cell in row]
                    if any(cleaned):  # skip fully blank rows
                        all_rows.append(cleaned)

    if header is None:
        logger.warning("No tables found in %s — nothing extracted.", pdf_path)
        header = []

    with out_csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if header:
            writer.writerow(header)
        writer.writerows(all_rows)

    logger.info(
        "Extracted %d rows from %d-page PDF to %s (VERIFY the header/columns before parsing further)",
        len(all_rows),
        page_count,
        out_csv_path,
    )
    return out_csv_path


def extract_labs_from_pdf(
    pdf_path: str | Path,
    column_map: dict[str, str] = DEFAULT_COLUMN_MAP,
    keep_intermediate_csv: bool = True,
) -> list[LabRecord]:
    """
    Convenience wrapper: PDF -> raw CSV (via pdf_to_csv) -> LabRecords
    (via load_labs_from_csv).

    Only use this directly once you already know the PDF's column
    headers match column_map. If you're not sure, call pdf_to_csv()
    yourself first, inspect the output, and adjust column_map before
    calling load_labs_from_csv() — that's the safer path for a PDF
    you haven't looked at yet.
    """
    pdf_path = Path(pdf_path)
    csv_path = pdf_to_csv(pdf_path)

    labs = load_labs_from_csv(csv_path, column_map)

    if not keep_intermediate_csv:
        csv_path.unlink(missing_ok=True)

    return labs


def load_labs_from_csv(
    path: str | Path,
    column_map: dict[str, str] = DEFAULT_COLUMN_MAP,
) -> list[LabRecord]:
    """Parse a CSV export (e.g. downloaded manually from BIS's site) into LabRecords."""
    path = Path(path)
    labs: list[LabRecord] = []

    with path.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            lab = _row_to_lab(row, column_map, source_url=str(path))
            if lab:
                labs.append(lab)

    return labs


def save_labs(labs: list[LabRecord]) -> Path:
    """Save extracted labs as JSON for the backend lookup endpoint to load."""
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    out_path = PROCESSED_DIR / "testing_labs.json"

    with out_path.open("w", encoding="utf-8") as f:
        json.dump([lab.to_dict() for lab in labs], f, ensure_ascii=False, indent=2)

    logger.info("Saved %d lab records to %s", len(labs), out_path)
    return out_path


def process_pdf_directory(
    pdf_dir: Path | None = None,
    column_map: dict[str, str] = DEFAULT_COLUMN_MAP,
) -> list[LabRecord]:
    """
    Automatically process every PDF sitting in pdf_dir (default: PDF_DIR,
    where crawler.py's download_pdf() saves files it finds while crawling)
    into LabRecords, deduplicated by lab_id, and save the result.

    This is the "no manual step" version — run automatically at the end
    of a crawl (see pipeline.py). column_map is DEFAULT_COLUMN_MAP, which
    was verified against BIS's real Group-1/Group-2 PDF structure, but if
    BIS changes their PDF layout in the future this will start silently
    extracting nothing useful — the per-PDF row/column counts logged here
    are the signal to watch for that, not a guarantee of correctness.

    Non-lab PDFs that happen to get downloaded (if a seed page links to
    something else) will just produce zero or garbage rows — harmless,
    but worth a periodic manual glance at data/processed/testing_labs.json
    rather than assuming this is perfect forever.
    """
    from app.config.Config import PDF_DIR

    pdf_dir = pdf_dir or PDF_DIR
    if not pdf_dir.exists():
        logger.info("No PDF directory at %s yet — nothing to process.", pdf_dir)
        return []

    pdf_files = sorted(pdf_dir.glob("*.pdf"))
    if not pdf_files:
        logger.info("No PDFs found in %s.", pdf_dir)
        return []

    all_labs: dict[str, LabRecord] = {}  # lab_id -> LabRecord, dedupes across files
    for pdf_path in pdf_files:
        try:
            labs = extract_labs_from_pdf(pdf_path, column_map, keep_intermediate_csv=True)
        except Exception as exc:  # noqa: BLE001 — one bad PDF shouldn't stop the rest
            logger.error("Failed to process %s: %s", pdf_path, exc)
            continue

        logger.info("Extracted %d lab rows from %s", len(labs), pdf_path.name)
        for lab in labs:
            all_labs[lab.lab_id] = lab  # last file wins on duplicate lab_id

    merged = list(all_labs.values())
    if merged:
        save_labs(merged)
    else:
        logger.warning(
            "Processed %d PDF(s) but extracted 0 labs — DEFAULT_COLUMN_MAP likely "
            "doesn't match these PDFs' actual columns. Check the intermediate CSV "
            "next to each PDF in %s to see the real headers.",
            len(pdf_files), pdf_dir,
        )

    return merged