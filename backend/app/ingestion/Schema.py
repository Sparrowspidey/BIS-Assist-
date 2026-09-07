"""
Shared data schema for the ingestion pipeline.

Every other module (embeddings, vectorstore, rag) should depend on THIS
schema rather than reaching into raw crawler/cleaner output directly.
If the schema needs to change, change it here and update downstream
consumers deliberately.
"""

from __future__ import annotations

from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from enum import Enum
import hashlib


class SourceCategory(str, Enum):
    """Which part of the PS 26107 scope this content belongs to."""

    STANDARDS = "standards"              # Indian Standards catalogue (IS numbers, scope)
    CERTIFICATION = "certification"      # ISI, CRS, FMCS certification schemes
    HALLMARKING = "hallmarking"          # Hallmarking / HUID process
    CONSUMER_AFFAIRS = "consumer_affairs"  # Consumer grievance / rights info
    TESTING_LABS = "testing_labs"        # BIS-recognized lab directory (structured, not RAG text)


@dataclass
class CrawlLog:
    """
    Record of a recursive crawl run: what was visited, what succeeded,
    what failed and why, and what was deliberately skipped (disallowed
    by robots.txt, outside allowed domains, or over the page/depth cap).

    This exists so a crawl run is auditable — anyone can look at this
    log and see exactly what happened, rather than trusting a
    hand-maintained URL list.
    """

    succeeded: list[str] = field(default_factory=list)
    failed: dict[str, str] = field(default_factory=dict)          # url -> reason
    skipped_disallowed: dict[str, str] = field(default_factory=dict)  # url -> robots rule
    skipped_out_of_scope: list[str] = field(default_factory=list)  # domain not in ALLOWED_DOMAINS
    skipped_over_cap: list[str] = field(default_factory=list)      # hit max_pages/max_depth
    started_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    finished_at: str = ""

    def to_dict(self) -> dict:
        return asdict(self)

    def summary(self) -> str:
        return (
            f"succeeded={len(self.succeeded)} "
            f"failed={len(self.failed)} "
            f"skipped_disallowed={len(self.skipped_disallowed)} "
            f"skipped_out_of_scope={len(self.skipped_out_of_scope)} "
            f"skipped_over_cap={len(self.skipped_over_cap)}"
        )


@dataclass
class RawPage:
    """Output of the crawler, before cleaning."""

    url: str
    category: SourceCategory
    html: str
    fetched_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )

    def page_id(self) -> str:
        """Stable ID derived from the URL, used as a filename-safe key."""
        return hashlib.sha256(self.url.encode("utf-8")).hexdigest()[:16]


@dataclass
class CleanedDocument:
    """Output of the cleaner: one page reduced to its meaningful text."""

    page_id: str
    url: str
    category: SourceCategory
    title: str
    text: str
    fetched_at: str

    def to_dict(self) -> dict:
        d = asdict(self)
        d["category"] = self.category.value
        return d


@dataclass
class LabRecord:
    """
    A single BIS-recognized testing laboratory.

    Field names match BIS's REAL published PDF columns (verified against
    actual Group-1/Group-2 lab list PDFs, Sept 2026):
        Sl. No. | Name of Lab | State | Status | OSL Code |
        Recognition valid up to | Remarks

    Note there is NO separate address/city/accreditation-scope/contact
    column in the real source — an earlier draft of this schema guessed
    those fields before anyone had looked at the actual PDF. "State" is
    the only location field BIS provides. "Status" is Govt/Private.
    "Remarks" often contains suspension/deferral notes, which matters
    for FR7 (don't recommend a suspended lab).

    This is structured/tabular data, not RAG text — it powers a
    filter/lookup feature (FR7: "suggest relevant testing laboratories"),
    not semantic search. Keep it separate from the Chunk pipeline.
    """

    lab_id: str
    name: str
    state: str
    status: str = ""                    # "Govt" or "Private"
    osl_code: str = ""
    recognition_valid_upto: str = ""
    remarks: str = ""                   # suspension/deferral notes, if any
    source_url: str = ""
    fetched_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class Chunk:
    """
    A single retrievable unit. This is what gets embedded and stored in FAISS.
    Keep chunk_id stable across re-runs so re-indexing can be incremental later.
    """

    chunk_id: str
    page_id: str
    url: str
    category: SourceCategory
    title: str
    text: str
    chunk_index: int
    fetched_at: str

    def to_dict(self) -> dict:
        d = asdict(self)
        d["category"] = self.category.value
        return d