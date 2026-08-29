# Standard_AI

An **AI-powered conversational assistant for Indian Standards and BIS Services**, built using **open-source LLMs**, **RAG (Retrieval-Augmented Generation)**, and a **secure, modular architecture**.
This project aims to help industries, MSMEs, startups, students, and consumers find applicable Indian Standards, understand BIS certification schemes, and get accurate, source-backed answers to their queries.

Built for **Smart India Hackathon (SIH) 2026** — Problem Statement **26107**.

---

## Project Vision

To build a **conversational assistant**, strictly grounded in official BIS/Indian Standards sources, capable of:

* Answering questions about Indian Standards
* Recommending applicable standards based on a product description
* Guiding users through BIS certification schemes and processes
* Answering consumer-related queries and hallmarking guidance
* Suggesting relevant BIS-recognized testing laboratories
* Supporting multilingual interaction
* Citing sources/clauses for every answer

This is a **team project** developed for SIH 2026 by Team Manak Mitra.

---

## Tech Stack

### Backend

* **Python 3.11+**
* **FastAPI** – backend API
* **LangChain** – RAG orchestration
* **FAISS (Meta)** – vector database
* **Sentence Transformers** – embeddings
* **Ollama** – local open-source LLMs (e.g., Mistral)
* **uv** – modern Python dependency & venv manager

### Frontend

* React (Vite)

### Security

* Rate limiting
* Environment-based secrets
* Secure API design

---

## High-Level Architecture

```
User → Frontend → FastAPI Backend
                     │
                     ├── LLM (Ollama)
                     ├── FAISS Vector Store
                     └── BIS Knowledge Base (Standards, Schemes, Hallmarking, Labs)
```

The assistant uses **RAG**:

1. User question
2. Relevant BIS/standards documents retrieved from FAISS
3. Context + question sent to LLM
4. Accurate, source-cited answer returned

---

## Repository Structure

```
Standard_AI
│
├── backend
│   └── app
│       ├── api
│       ├── rag
│       ├── vectorstore
│       ├── ingestion
│       ├── embeddings
│       ├── llm
│       └── config
│           └── settings.py
│
├── data
│   ├── raw
│   └── processed
│
├── vectorstore_data
│   └── index.faiss
│
├── docs
└── README.md
```

---

## Important Files Explained

### `pyproject.toml`

* Central configuration file for Python
* Defines:

  * Project metadata
  * Dependencies
  * Development tools (black, ruff, pytest)
  * Virtual environment name (`Standard-AI`)

### `uv.lock`

* Auto-generated lock file
* Ensures **same dependency versions** for all contributors
* Must be committed

### `vectorstore_data/`

* Stores FAISS indexes
* Enables fast semantic search over BIS standards, schemes, and hallmarking documents

---

## Setup Instructions (Local Development)

### 1️⃣ Clone the repository

* Create a folder with a name of your choice, open cmd in the folder, and paste this command:

```bash
git clone https://github.com/Sparrowspidey/Standard_AI.git
```

---

### 2️⃣ Install uv (one-time)

```bash
pip install uv
```

---

### 3️⃣ Create & sync virtual environment

```bash
uv sync
```

Activate the environment:

**Windows (PowerShell)**

```powershell
.venv\Scripts\Activate
```

You should see:

```
(Standard-AI)
```

---

### 4️⃣ Run the backend server

```bash
uvicorn app.main:app --reload
```

API available at:

```
http://127.0.0.1:8000
```

Docs:

```
http://127.0.0.1:8000/docs
```

---

## Security Considerations

* No secrets committed to GitHub
* Rate limiting enabled
* Local LLMs → no external data leakage
* Designed for future authentication & role-based access

---

## Git Workflow (Team)

* `main` → stable branch
* Feature branches → `name/feature`
* Use **Pull Requests** to merge
* PRs require review approval before merging
* Do NOT commit virtual environments or data files

---

## Roadmap

* [ ] Core RAG pipeline
* [ ] BIS standards & schemes knowledge ingestion
* [ ] Testing labs directory + product-standard mapping
* [ ] Multilingual support
* [ ] Secure API layer
* [ ] Frontend UI
* [ ] Deployment

---

## Contributors

1. Sparrowspidey (Team Lead)
2. Reshmitha
3. Mahima
4. Joel Stephan
5. Anil Kumar
6. Joyal Kumar

---

## License

MIT License

---

> **Standard_AI** — Built for Smart India Hackathon 2026, PS 26107.