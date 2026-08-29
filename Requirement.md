# Requirement Document
## AI-powered Intelligent Assistant for Indian Standards and BIS Services

**Problem Statement ID:** 26107
**Organization:** Ministry of Consumer Affairs, Food & Public Distribution
**Department:** Department of Consumer Affairs (DoCA)
**Category:** Software | **Theme:** Smart Automation
**Team Size:** 6

---

## 1. Project Overview

BIS (Bureau of Indian Standards) publishes thousands of Indian Standards and runs several
services — product certification, hallmarking, laboratory recognition, Standards Clubs,
training, consumer affairs, and conformity assessment. Users (especially MSMEs, startups,
students, and consumers) currently struggle to find applicable standards, certification
requirements, licensing procedures, testing requirements, and answers to technical queries
across scattered documents, portals, and PDFs.

This project builds an **AI-powered conversational assistant** that answers natural-language
queries about Indian Standards and BIS services, with source-backed, cited responses.

---

## 2. Objectives

- Let users ask questions about Indian Standards in plain language and get accurate,
  cited answers.
- Recommend applicable IS standards based on a product description.
- Guide users through BIS certification schemes and processes.
- Answer general consumer queries (grievances, rights, complaint routes).
- Guide users on hallmarking (HUID, jeweller registration, etc.).
- Suggest relevant BIS-recognized testing laboratories.
- Support multilingual interaction (Hindi + English minimum; regional languages as stretch goal).

---

## 3. Functional Requirements

| ID | Requirement | Type |
|----|-------------|------|
| FR1 | Answer natural-language questions about Indian Standards | RAG (retrieval + generation) |
| FR2 | Recommend applicable IS standard(s) from a product description | Structured matching / classification |
| FR3 | Explain BIS certification schemes (ISI, CRS, FMCS, etc.) | RAG |
| FR4 | Explain certification process step-by-step | RAG + guided flow |
| FR5 | Answer consumer-facing queries (grievances, rights) | RAG |
| FR6 | Guide on hallmarking process | RAG |
| FR7 | Suggest relevant testing laboratories (by location/scope) | Structured lookup/filter |
| FR8 | Support multilingual input/output | Translation layer or multilingual embeddings |
| FR9 | Every answer cites the source document/clause | Response formatting |

## 4. Non-Functional Requirements

- **Accuracy:** responses must be source-grounded — no unverified/hallucinated claims about
  compliance requirements.
- **Latency:** answers within a few seconds for a good demo/user experience.
- **Availability:** local-first (Ollama) so it can run without external API dependency.
- **Scalability of data:** corpus/index should be easy to rebuild as new standards/schemes are added.
- **Usability:** simple chat UI, usable by non-technical consumers and MSME owners alike.
- **Data privacy:** no user query data sent to third-party services if avoidable.

---

## 5. System Architecture

```
React (chat UI, language selector)
   │  JSON over HTTP
   ▼
FastAPI (backend)
   ├── Intent Router — decides RAG vs. structured lookup
   ├── RAG path   → FAISS (retrieval) → Ollama/Mistral (generation)
   ├── Structured path → product-category → standard mapping, lab directory filter
   └── Response formatter → attaches source doc/clause reference
   │
   ▼
Ollama (local LLM) ── FAISS index ── Structured datasets (labs, product-standard map)
```

---

## 6. Data Requirements

| Data Source | Content | Acquisition Method |
|---|---|---|
| BIS Standards catalogue | IS numbers, titles, scope summaries | Crawl `bis.gov.in` / standards portal |
| Certification scheme pages | ISI mark, CRS, FMCS, licensing docs | Crawl + clean (Playwright + BeautifulSoup) |
| Hallmarking pages | HUID process, jeweller registration | Crawl + clean |
| Consumer affairs pages | Grievance process, consumer rights | Crawl + clean |
| Testing labs directory | Lab name, location, accreditation scope | Structured extraction (may need manual curation) |
| Product → Standard mapping | Category to IS number mapping | Curated dataset (manual + scraped) |

---

## 7. Tech Stack

- **LLM runtime:** Ollama (Mistral or similar local model)
- **Vector search:** FAISS
- **Backend:** FastAPI (Python, async)
- **Frontend:** React + Vite
- **Crawling/scraping:** Playwright, BeautifulSoup
- **Data storage:** local files / lightweight DB for structured datasets (labs, product-mapping)

---

## 8. Module Breakdown & Team Assignment

*(Draft split — adjust based on individual strengths/interests.)*

| Module | Scope | Assigned To |
|---|---|---|
| **1. Data Acquisition & Corpus Building** | Crawl and clean BIS standards, scheme, hallmarking, and consumer pages; produce clean text corpus for indexing | **Vivek** |
| **2. Structured Data (Labs + Product-Standard Mapping)** | Build/curate testing lab directory and product-category → IS standard mapping used for FR2 and FR7 | **Vivek** |
| **3. Embeddings & Retrieval (FAISS)** | Chunking strategy, embedding generation, FAISS index build/update pipeline | **** |
| **4. Backend & Intent Routing** | FastAPI endpoints, intent router (RAG vs. structured lookup), multilingual handling, response formatting with citations | **** |
| **5. Frontend (React UI)** | Chat interface, language selector, source-citation display, lab/standard result views | **Joyal** |
| **6. Documentation, Testing & Presentation** | Problem understanding write-up, PPT, demo script, QA/testing across modules, integration coordination | **** |



---
