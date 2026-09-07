"""
config.py
=========
Central configuration for Standard_AI.

All paths and AI settings are defined here.
Import from this file anywhere in the project — never hardcode paths.
"""

from pathlib import Path

# ── Project root (4 levels up from backend/app/config/config.py) ──────────
PROJECT_ROOT = Path(__file__).resolve().parents[3]

# ── Directory paths ───────────────────────────────────────────────────────
BACKEND_DIR    = PROJECT_ROOT / "backend"
APP_DIR        = BACKEND_DIR  / "app"
DATA_DIR       = PROJECT_ROOT / "data"
DOCS_DIR       = PROJECT_ROOT / "docs"
FRONTEND_DIR   = PROJECT_ROOT / "frontend"
LOGS_DIR       = PROJECT_ROOT / "logs"
SECURITY_DIR   = PROJECT_ROOT / "security"
VECTORSTORE_DIR = PROJECT_ROOT / "vectorstore_data"

# ── Data subdirectories ───────────────────────────────────────────────────
RAW_DIR        = DATA_DIR / "raw"
WEBSITE_DIR    = RAW_DIR  / "website"   # crawled HTML pages
PDF_DIR        = RAW_DIR  / "pdf"       # PDFs downloaded while crawling
PROCESSED_DIR  = DATA_DIR / "processed"

# Per-category processed chunk files (produced by app/ingestion/pipeline.py)
STANDARDS_CHUNKS_PATH        = PROCESSED_DIR / "standards.jsonl"
CERTIFICATION_CHUNKS_PATH    = PROCESSED_DIR / "certification.jsonl"
HALLMARKING_CHUNKS_PATH      = PROCESSED_DIR / "hallmarking.jsonl"
CONSUMER_AFFAIRS_CHUNKS_PATH = PROCESSED_DIR / "consumer_affairs.jsonl"

# Structured (non-RAG) lookup data
TESTING_LABS_PATH         = PROCESSED_DIR / "testing_labs.json"
PRODUCT_STANDARD_MAP_PATH = PROCESSED_DIR / "product_standard_map.json"

# ── FAISS index ────────────────────────────────────────────────────────────
FAISS_INDEX_PATH = VECTORSTORE_DIR / "index.faiss"
CHUNKS_PATH      = VECTORSTORE_DIR / "chunks_for_retrieval.pkl"
CHUNKS_RAW_PATH  = VECTORSTORE_DIR / "chunks_with_metadata.pkl"

# ── Embedding model ────────────────────────────────────────────────────────
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

# ── LLM (Ollama) ───────────────────────────────────────────────────────────
LLM_PROVIDER   = "ollama"
LLM_MODEL      = "mistral"
OLLAMA_URL     = "http://localhost:11434/api/generate"
OLLAMA_TIMEOUT = 120  # seconds

# ── RAG settings ───────────────────────────────────────────────────────────
TOP_K_RESULTS        = 5
SIMILARITY_THRESHOLD = 0.30

# ── Chunking settings (word-count based — see app/ingestion/chunker.py) ────
CHUNK_SIZE_WORDS    = 250
CHUNK_OVERLAP_WORDS = 40

# ── Multilingual support ────────────────────────────────────────────────────
DEFAULT_LANGUAGE      = "en"
SUPPORTED_LANGUAGES   = ["en", "hi"]
TRANSLATION_PROVIDER  = "none"  # set once a provider is chosen (e.g. "indictrans2", "google")

# ── CORS ───────────────────────────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]

# ── Backend server ───────────────────────────────────────────────────────────
BACKEND_HOST = "0.0.0.0"
BACKEND_PORT = 8000