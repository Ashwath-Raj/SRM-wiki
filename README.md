# SRM AP Wiki

> **Everything SRM AP, in one place.**

**SRM AP Wiki** is a centralized, searchable, continuously updated information platform that organizes the public SRM University–AP digital ecosystem into one place, with AI acting as a natural-language discovery and navigation layer.

---

## 1. System Architecture

```text
                     SRM AP WIKI
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
      Browse            Search             AI
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                  FastAPI REST API
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    PostgreSQL        Search Engine       RAG/pgvector
   (Structured Data) (FTS + Ranking)   (Docs + Chunks)
        ▲                                   ▲
        │                                   │
        └───────────── Crawler ─────────────┘
               (Fetch, Extract, Deduplicate,
                Detect Changes, Verify)
```

---

## 2. Technology Stack

- **Frontend:** Next.js (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend:** Python 3.12+, FastAPI, Pydantic v2, SQLAlchemy 2.0
- **Database:** PostgreSQL with pgvector (or zero-config SQLite for instant local development)
- **Crawler Subsystem:** httpx, BeautifulSoup4, domain allowlist, robots.txt handler, content deduplication, and change detection
- **RAG & AI Assistant:** Intent router, vector retrieval, source-grounded answers with provenance verification
- **Testing:** pytest, pytest-asyncio, FastAPI TestClient

---

## 3. Quick Start (Local Development)

### 3.1 Backend Setup

1. **Activate Virtual Environment & Install Dependencies:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r backend/requirements.txt
   ```

2. **Initialize Database & Seed Data:**
   ```bash
   PYTHONPATH=. python scripts/seed_data.py
   ```

3. **Start FastAPI Backend Server:**
   ```bash
   uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   - API Docs: `http://localhost:8000/api/v1/docs`
   - Health check: `http://localhost:8000/health`

### 3.2 Frontend Setup

1. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Next.js Development Server:**
   ```bash
   npm run dev
   ```
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Running with Docker Compose

To start PostgreSQL with pgvector, FastAPI, and Next.js together:

```bash
docker compose up --build
```

---

## 5. Running the Test Suite

```bash
source venv/bin/activate
PYTHONPATH=. pytest backend/tests/ -v
```

All 18 unit and integration tests verify:
- Health check endpoint
- Search engine keyword and facet ranking
- Entity endpoints (Portals, Events, Notices, Projects, Organizations, Documents, Opportunities)
- SRM AP Pulse live telemetry
- AI intent routing and grounded source attribution
- Review queue and User submission pipeline
- Admin authentication and dashboard metrics
- Crawler URL normalization, robots allowlist, and content hashing

---

## 6. Key Pages & Routes

- `/` — Homepage: Hero, Quick Access, Pulse Summary, Today at SRM AP, Notices, AI Entry Point
- `/explore` — Comprehensive directory root
- `/portals` & `/portals/[slug]` — Verified university portal access points
- `/events` & `/events/[slug]` — Campus workshops, hackathons, and cultural fests
- `/notices` & `/notices/[slug]` — Official circulars with priority tagging
- `/projects` & `/projects/[slug]` — Student innovation showcases and repositories
- `/organizations` & `/organizations/[slug]` — Student clubs and research laboratories
- `/documents` & `/documents/[slug]` — Academic regulations and handbooks
- `/opportunities` — Internships, research fellowships, and competitions
- `/pulse` — Live campus telemetry feed
- `/search` — Faceted global search engine
- `/ai` — Grounded natural-language navigation assistant
- `/submit` — Student project and announcement submission form
- `/admin` — Administration dashboard, review queue, and crawler controls

---

## 7. Security & Governance

- **Source Provenance:** Every public record links back to its verified source URL and authority category (`OFFICIAL`, `DEPARTMENT`, `ORGANIZATION`, `STUDENT`, `COMMUNITY`, `EXTERNAL`).
- **Privacy Assurance:** No private student data (grades, attendance, ERP passwords) is cataloged. Only public university resources and approved student works are indexed.
- **Admin Verification:** Submissions and newly crawled content enter a review queue before being published to the primary search index.
# srmwiki
