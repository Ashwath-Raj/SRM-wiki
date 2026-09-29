# 10_REPO_STRUCTURE.md
# SRM AP Information Navigator — Repository Structure & System Boundaries

**Status:** Pre-build implementation contract  
**Version:** v1.1  
**Project type:** 3-hour prototype  
**Deployment:** Platform-agnostic  
**Deployment ownership:** Separate deployment/cloud workstream  
**Primary repository owners:**  
- Member A — scraping/data ingestion
- Member B — system/AI/semantics
- Member C — UI/integration
- Deployment owner — final cloud packaging/deployment

---

# 1. Purpose

This document defines the **actual repository architecture**.

It answers:

- Where does scraped SRM AP data live?
- Where does the RAG system live?
- Where does Text-to-SQL live?
- Where does CAG/static context live?
- Where does the Gemini integration live?
- Where does the UI live?
- Where are schemas and shared types?
- Where do ingestion scripts live?
- What is runtime code versus offline preparation code?
- What belongs in the repository versus the deployment environment?
- How can a different teammate deploy the same project to **any reasonable cloud/platform** without restructuring the application?

The repository should make the system understandable without needing a verbal explanation from the original author.

---

# 2. Core Repository Principle

The repository must separate:

```text
PRODUCT CODE
DATA
OFFLINE INGESTION
AI / RETRIEVAL
UI
CONFIGURATION
DOCUMENTATION
TESTS
```

Do not mix everything into one giant `app.ts`.

Do not bury scraped data inside frontend components.

Do not put prompts inside random routes.

Do not let the deployment platform dictate the application architecture.

---

# 3. Platform-Agnostic Rule

The application repository should **not be designed around Vercel, AWS, Azure, Google Cloud, Render, Railway, or any other single deployment provider**.

Deployment is an adapter around the project.

The repository should support the conceptual model:

```text
                    APPLICATION REPOSITORY
                            │
             ┌──────────────┼──────────────┐
             │              │              │
          Frontend       Backend        Data/AI
             │              │              │
             └──────────────┼──────────────┘
                            │
                     Deployment Adapter
                            │
              ┌─────────────┼─────────────┐
              │             │             │
            Cloud A       Cloud B       Cloud C
```

The application must remain portable.

---

# 4. Do Not Build Around "Serverless Functions"

The prototype may eventually be deployed as:

```text
single service
```

or:

```text
frontend + backend
```

or:

```text
serverless frontend + API
```

or:

```text
container
```

The repository must not require one of these.

The source tree should expose clear application boundaries so the deployment owner can package it however appropriate.

---

# 5. Recommended Final Repository Tree

```text
srm-ap-information-navigator/
│
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── .gitignore
├── .env.example
│
├── apps/
│   ├── web/
│   │   ├── index.html
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Navigator.tsx
│   │   │   │   └── Explore.tsx
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── chat/
│   │   │   │   ├── navigation/
│   │   │   │   ├── resources/
│   │   │   │   ├── events/
│   │   │   │   └── layout/
│   │   │   │
│   │   │   ├── lib/
│   │   │   │   ├── api.ts
│   │   │   │   ├── navigation.ts
│   │   │   │   └── client-config.ts
│   │   │   │
│   │   │   ├── types/
│   │   │   │   └── api.ts
│   │   │   │
│   │   │   └── styles/
│   │   │       └── index.css
│   │   │
│   │   └── package.json
│   │
│   └── server/
│       ├── src/
│       │   ├── main.ts
│       │   │
│       │   ├── api/
│       │   │   ├── chat.ts
│       │   │   ├── health.ts
│       │   │   └── resources.ts
│       │   │
│       │   ├── ai/
│       │   │   ├── router.ts
│       │   │   ├── prompt.ts
│       │   │   ├── response.ts
│       │   │   └── model.ts
│       │   │
│       │   ├── retrieval/
│       │   │   ├── retriever.ts
│       │   │   ├── rag.ts
│       │   │   ├── structured.ts
│       │   │   ├── navigation.ts
│       │   │   └── ranking.ts
│       │   │
│       │   ├── context/
│       │   │   └── cag.ts
│       │   │
│       │   ├── data/
│       │   │   ├── loader.ts
│       │   │   └── repository.ts
│       │   │
│       │   ├── schemas/
│       │   │   ├── resource.ts
│       │   │   ├── event.ts
│       │   │   ├── announcement.ts
│       │   │   ├── organization.ts
│       │   │   └── navigator-response.ts
│       │   │
│       │   ├── config/
│       │   │   └── env.ts
│       │   │
│       │   └── utils/
│       │       ├── logging.ts
│       │       ├── urls.ts
│       │       └── errors.ts
│       │
│       └── package.json
│
├── packages/
│   ├── shared/
│   │   ├── src/
│   │   │   ├── schemas/
│   │   │   ├── types/
│   │   │   └── constants/
│   │   └── package.json
│   │
│   └── ui/
│       ├── src/
│       └── package.json
│
├── data/
│   ├── README.md
│   │
│   ├── curated/
│   │   ├── resources.json
│   │   ├── events.json
│   │   ├── announcements.json
│   │   ├── organizations.json
│   │   ├── departments.json
│   │   └── contacts.json
│   │
│   ├── navigation/
│   │   ├── taxonomy.json
│   │   ├── navigation.json
│   │   └── aliases.json
│   │
│   ├── documents/
│   │   ├── policies/
│   │   ├── regulations/
│   │   ├── procedures/
│   │   ├── notices/
│   │   └── general/
│   │
│   ├── retrieval/
│   │   ├── chunks.jsonl
│   │   ├── metadata.json
│   │   └── vector-index/
│   │
│   ├── context/
│   │   └── cached_context.json
│   │
│   └── manifests/
│       ├── crawl-manifest.json
│       ├── dataset-manifest.json
│       └── source-manifest.json
│
├── ingestion/
│   ├── README.md
│   ├── config/
│   │   ├── sources.json
│   │   └── crawl-policy.json
│   │
│   ├── crawler/
│   │   ├── crawl.ts
│   │   ├── fetch.ts
│   │   ├── robots.ts
│   │   └── links.ts
│   │
│   ├── extractors/
│   │   ├── html.ts
│   │   ├── pdf.ts
│   │   ├── metadata.ts
│   │   └── dates.ts
│   │
│   ├── transforms/
│   │   ├── clean.ts
│   │   ├── normalize.ts
│   │   ├── deduplicate.ts
│   │   └── classify.ts
│   │
│   ├── chunking/
│   │   └── chunk.ts
│   │
│   ├── indexing/
│   │   ├── build-index.ts
│   │   ├── build-structured-data.ts
│   │   └── build-navigation.ts
│   │
│   └── pipeline.ts
│
├── scripts/
│   ├── bootstrap.ts
│   ├── validate-data.ts
│   ├── validate-schemas.ts
│   ├── inspect-index.ts
│   └── build-all.ts
│
├── tests/
│   ├── unit/
│   │   ├── router.test.ts
│   │   ├── retrieval.test.ts
│   │   ├── ranking.test.ts
│   │   └── resource-resolution.test.ts
│   │
│   ├── integration/
│   │   ├── chat.test.ts
│   │   └── retrieval-pipeline.test.ts
│   │
│   └── evaluation/
│       ├── golden-queries.json
│       └── evaluate.ts
│
├── config/
│   ├── app.json
│   └── retrieval.json
│
├── deployment/
│   ├── README.md
│   ├── interfaces.md
│   └── examples/
│       ├── Dockerfile.example
│       └── env.example
│
├── docs/
│   ├── 00_START_HERE.md
│   ├── 01_PRODUCT_UX.md
│   ├── 01_PROJECT_PLAN.md
│   ├── 02_DATA_CLOUD_ONBOARDING.md
│   ├── 03_TEAM_TASK_BOARD.md
│   ├── 05_AI_ROUTING_RAG_SQL_CAG.md
│   └── 10_REPO_STRUCTURE.md
│
└── public/
    └── assets/
```

---

# 6. Why `apps/`, `packages/`, `data/`, and `ingestion/` Are Separate

These four boundaries are intentional.

```text
apps/
    actual running application

packages/
    shared contracts

data/
    prepared institutional knowledge

ingestion/
    process that creates the data
```

This prevents a common prototype failure:

```text
scraper code
+
raw data
+
AI prompts
+
React UI
+
deployment logic
```

all becoming one tangled folder.

---

# 7. Runtime vs Offline Boundary

This is one of the most important architectural boundaries.

## Runtime

```text
apps/web
apps/server
packages/shared
data/
```

The deployed application reads the prepared data.

## Offline preparation

```text
ingestion/
scripts/
```

These generate the data consumed by the runtime.

---

# 8. Actual Production/Runtime Systems

Regardless of cloud provider, the running application conceptually consists of:

```text
WEB APPLICATION
     │
     ▼
SERVER APPLICATION
     │
     ├── AI Router
     ├── Retrieval
     ├── Navigation
     ├── Structured queries
     ├── CAG
     └── Gemini adapter
             │
             ▼
        Gemini API

     +

Prepared SRM AP data
```

There should not be a second hidden system.

---

# 9. `apps/web/`

This is the student-facing product.

Responsibilities:

- render UI,
- collect queries,
- display responses,
- display navigation paths,
- display source cards,
- display events/resources,
- maintain local conversation state,
- call backend API.

It does NOT:

- call Gemini directly,
- scrape SRM AP,
- contain API secrets,
- decide which retrieval mechanism to use.

---

# 10. `apps/server/`

This is the application intelligence/runtime layer.

It owns:

```text
API
AI routing
RAG retrieval
structured retrieval
navigation resolution
cached context
response construction
Gemini integration
```

It should be deployable as one backend service if desired.

The internal module boundaries matter more than whether the cloud later turns them into separate services.

---

# 11. `apps/server/src/api/`

API boundary.

Recommended:

```text
chat.ts
health.ts
resources.ts
```

### `chat.ts`

Primary user query endpoint.

Conceptually:

```text
POST /api/chat
```

### `health.ts`

Service health.

```text
GET /api/health
```

### `resources.ts`

Optional deterministic resource browsing endpoint.

```text
GET /api/resources
```

This is not mandatory for the first vertical slice.

---

# 12. `apps/server/src/ai/`

This directory contains **model-facing logic**.

```text
ai/
├── router.ts
├── prompt.ts
├── response.ts
└── model.ts
```

### `router.ts`

Determines:

```text
intent
domain
retrieval mode
```

### `prompt.ts`

Centralized model instructions.

### `response.ts`

Parses/validates structured output.

### `model.ts`

Encapsulates the Gemini client.

---

# 13. Gemini Adapter

The rest of the application should NOT directly import the Gemini SDK everywhere.

Use:

```text
apps/server/src/ai/model.ts
```

Example conceptual interface:

```ts
export interface LanguageModel {
  generateNavigationResponse(input: ModelInput): Promise<ModelOutput>;
}
```

The Gemini implementation sits behind this interface.

This means later the team could replace:

```text
Gemini
```

with another model without rewriting:

- retrieval,
- navigation,
- UI,
- data layers.

For the hackathon, Gemini is the actual implementation.

---

# 14. Gemini API Key Boundary

The repository must treat the Gemini key as **runtime configuration**, not source code.

Local:

```text
.env.local
```

Production:

```text
deployment platform's secret/environment system
```

Code:

```text
process.env.GEMINI_API_KEY
```

Do not create:

```text
data/gemini-key.json
config/secrets.ts
src/gemini-key.ts
```

or any equivalent.

---

# 15. `apps/server/src/retrieval/`

This is the retrieval layer.

```text
retrieval/
├── retriever.ts
├── rag.ts
├── structured.ts
├── navigation.ts
└── ranking.ts
```

### `retriever.ts`

High-level retrieval interface.

### `rag.ts`

Document retrieval.

### `structured.ts`

Structured/event/resource queries.

### `navigation.ts`

Information hierarchy/resource resolution.

### `ranking.ts`

Evidence/resource ranking.

---

# 16. Retrieval Abstraction

The AI router should call an abstraction:

```ts
const evidence = await retrieve({
  intent,
  query,
  filters,
});
```

The router should not know:

```text
where the vector index file physically lives
```

or:

```text
whether structured data is JSON or SQLite.
```

Those are data-layer details.

---

# 17. `apps/server/src/context/cag.ts`

CAG/static context layer.

Loads:

```text
data/context/cached_context.json
```

Provides compact high-frequency information such as:

- institution identity,
- top-level taxonomy,
- common portals,
- standard naming,
- common navigation assumptions.

It must not contain the entire corpus.

---

# 18. `apps/server/src/data/`

The runtime data-access abstraction.

```text
data/
├── loader.ts
└── repository.ts
```

### `loader.ts`

Loads data from the prepared dataset.

### `repository.ts`

Provides structured access:

```text
getResource()
getEvent()
getOrganization()
searchResources()
```

The rest of the application should use the repository layer rather than manually opening JSON files all over the codebase.

---

# 19. Repository Pattern for Prototype

Even though the data is static, use a small abstraction.

Example:

```ts
export interface ResourceRepository {
  getById(id: string): Resource | null;
  search(query: string): Resource[];
  listByCategory(category: string): Resource[];
}
```

Implementation:

```text
JsonResourceRepository
```

later could become:

```text
SqlResourceRepository
PostgresResourceRepository
RemoteResourceRepository
```

without changing the UI or AI logic.

---

# 20. `apps/server/src/schemas/`

Domain schemas.

Examples:

```text
resource.ts
event.ts
announcement.ts
organization.ts
navigator-response.ts
```

These define what the application considers a valid object.

Do not rely on undocumented conventions.

---

# 21. `packages/shared/`

Shared contracts between frontend and backend.

This is where the strongest cross-team interface should live.

Recommended:

```text
packages/shared/src/
├── schemas/
├── types/
└── constants/
```

Examples:

```text
NavigatorResponse
NavigatorResource
NavigatorAction
PathNode
Event
Organization
```

---

# 22. Why Shared Schemas Matter

Without shared schemas, this happens:

### Backend

```json
{
  "resources": [...]
}
```

### Frontend assumes

```json
{
  "sources": [...]
}
```

Then one person changes the backend and breaks the UI.

Shared schemas prevent this.

---

# 23. `packages/ui/`

Optional shared UI component package.

Only create reusable UI components here when they are genuinely shared.

For a 3-hour prototype, it can be minimal.

Do not create a design-system monorepo for six buttons.

---

# 24. `data/` Is a First-Class System

The scraped SRM AP dataset should be visible and inspectable.

It is not:

```text
/tmp
```

It is not hidden inside:

```text
scripts/
```

It is not generated magically during app startup.

It is an explicit product asset.

---

# 25. `data/curated/`

This is the structured institutional knowledge layer.

```text
curated/
├── resources.json
├── events.json
├── announcements.json
├── organizations.json
├── departments.json
└── contacts.json
```

Use it for data that behaves like records.

---

# 26. `data/navigation/`

Contains the information hierarchy.

```text
taxonomy.json
navigation.json
aliases.json
```

### `taxonomy.json`

Defines categories and types.

### `navigation.json`

Defines actual paths.

### `aliases.json`

Maps informal student language to canonical concepts.

Example:

```json
{
  "acad calendar": "Academic Calendar",
  "attendance rule": "Attendance",
  "clubs": "Student Organizations"
}
```

This can dramatically improve routing.

---

# 27. `data/documents/`

Stores important source documents used for RAG.

Recommended:

```text
policies/
regulations/
procedures/
notices/
general/
```

Use clear filenames.

Example:

```text
academic-regulations.pdf
attendance-policy.pdf
hostel-application-procedure.pdf
```

Do not create cryptic filenames such as:

```text
doc_83af17.pdf
```

unless required by an ingestion system.

---

# 28. `data/retrieval/`

Generated retrieval artifacts.

```text
chunks.jsonl
metadata.json
vector-index/
```

### `chunks.jsonl`

One chunk per line.

Example:

```json
{
  "chunk_id": "r001-c07",
  "resource_id": "r001",
  "section": "Attendance",
  "text": "...",
  "url": "https://..."
}
```

### `metadata.json`

Maps chunks to resources.

### `vector-index/`

The actual index.

---

# 29. `data/context/`

Contains:

```text
cached_context.json
```

Only stable/high-value information belongs here.

---

# 30. `data/manifests/`

This is important for reproducibility.

Recommended:

```text
crawl-manifest.json
dataset-manifest.json
source-manifest.json
```

### `crawl-manifest.json`

Records:

```text
crawl timestamp
domains
pages visited
failures
counts
```

### `dataset-manifest.json`

Records:

```text
dataset version
resource count
document count
event count
index version
```

### `source-manifest.json`

Records:

```text
resource_id
source_url
source type
last_seen
```

This makes the prototype explainable.

---

# 31. Dataset Versioning

Treat the scraped corpus as a versioned artifact.

Example:

```text
dataset version:
2026-09-29-v1
```

Inside the manifest:

```json
{
  "version": "2026-09-29-v1",
  "generated_at": "2026-09-29T10:30:00+05:30",
  "resource_count": 143,
  "document_count": 28,
  "event_count": 19
}
```

The application can display this internally if needed.

---

# 32. `ingestion/`

This is the **offline SRM AP data engineering system**.

It is separate from runtime code.

```text
ingestion/
├── config/
├── crawler/
├── extractors/
├── transforms/
├── chunking/
├── indexing/
└── pipeline.ts
```

---

# 33. `ingestion/config/sources.json`

List crawl entry points.

Example:

```json
{
  "sources": [
    {
      "name": "main",
      "url": "https://...",
      "category": "institution"
    },
    {
      "name": "academics",
      "url": "https://...",
      "category": "academics"
    }
  ]
}
```

Do not hard-code every URL across different scripts.

---

# 34. `ingestion/config/crawl-policy.json`

Defines crawler behavior.

Conceptually:

```json
{
  "max_depth": 4,
  "delay_ms": 300,
  "respect_robots": true,
  "allow_pdfs": true,
  "max_pages": 1000
}
```

Values should be adjusted to the actual site.

The point is central configuration.

---

# 35. `ingestion/crawler/`

Crawler mechanics.

```text
crawl.ts
fetch.ts
robots.ts
links.ts
```

These modules should know how to:

- fetch,
- follow links,
- respect crawl policy,
- avoid duplicates,
- identify PDF resources.

They should NOT decide what a policy means.

Classification belongs elsewhere.

---

# 36. `ingestion/extractors/`

Transforms raw sources into extracted information.

```text
html.ts
pdf.ts
metadata.ts
dates.ts
```

Examples:

```text
HTML page
→ clean text

PDF
→ text + headings

page
→ title/date/type
```

---

# 37. `ingestion/transforms/`

Normalization stage:

```text
clean.ts
normalize.ts
deduplicate.ts
classify.ts
```

Pipeline:

```text
RAW
 ↓
CLEAN
 ↓
NORMALIZE
 ↓
DEDUP
 ↓
CLASSIFY
```

Do not embed all transformations in the crawler.

---

# 38. `ingestion/chunking/`

Creates RAG chunks.

It should preserve:

```text
resource ID
section
URL
authority
content
```

Avoid chunks that lose provenance.

---

# 39. `ingestion/indexing/`

Creates final runtime artifacts.

```text
build-index.ts
build-structured-data.ts
build-navigation.ts
```

This is where offline data becomes application-ready.

---

# 40. `ingestion/pipeline.ts`

A single entry point.

Conceptually:

```text
npm run ingest
```

executes:

```text
crawl
→ extract
→ clean
→ normalize
→ deduplicate
→ classify
→ chunk
→ build structured data
→ build navigation
→ build retrieval index
→ generate manifests
→ validate
```

---

# 41. Data Validation

Every ingestion run should validate:

```text
missing title?
missing URL?
duplicate ID?
duplicate URL?
invalid category?
invalid resource type?
broken source?
empty document?
missing authority?
```

Bad data should be caught before it reaches the AI system.

---

# 42. Source Provenance Rules

Every resource must retain:

```text
resource_id
source_url
source_domain
authority
last_seen
```

Every RAG chunk must retain:

```text
chunk_id
resource_id
source_url
```

The AI should never have to guess where a chunk came from.

---

# 43. Runtime Data Access

The runtime should not import:

```text
ingestion/*
```

The boundary is:

```text
ingestion
     ↓
data artifacts
     ↓
runtime data layer
```

This prevents the production application from accidentally becoming a crawler.

---

# 44. Offline vs Runtime Dependency Rule

### Allowed

```text
ingestion
depends on:
HTTP
HTML parser
PDF parser
embedding/index tools
```

### Runtime

```text
apps/server
depends on:
prepared data
AI SDK
application libraries
```

The runtime should not need the crawler dependencies.

---

# 45. Configuration

Keep non-secret application configuration in:

```text
config/
```

Examples:

```text
config/app.json
config/retrieval.json
```

Environment-dependent secrets and endpoints belong in environment variables.

---

# 46. Environment Variables

`.env.example` should contain names only:

```env
GEMINI_API_KEY=
GEMINI_MODEL=

APP_ENV=
DATA_ROOT=

# Optional if a future external service is introduced
DATABASE_URL=
VECTOR_STORE_URL=
```

Do not require unnecessary variables for the prototype.

---

# 47. Gemini Model Configuration

Keep the selected model configurable:

```env
GEMINI_MODEL=...
```

The code should load:

```text
GEMINI_MODEL
```

rather than scattering a model identifier across multiple files.

The exact model can be changed by the deployment owner without restructuring the application.

---

# 48. Deployment Boundary

This repository deliberately does **not** prescribe one cloud provider.

Deployment should consume:

```text
built frontend
+
backend service
+
data artifacts
+
environment variables
```

A deployment adapter may package it as:

```text
one container
```

or:

```text
frontend + backend
```

or:

```text
platform-native application
```

---

# 49. `deployment/`

This folder contains **deployment contracts and examples**, not provider lock-in.

```text
deployment/
├── README.md
├── interfaces.md
└── examples/
    ├── Dockerfile.example
    └── env.example
```

The deployment owner can create provider-specific material outside the core architecture.

---

# 50. `deployment/interfaces.md`

This should specify:

## Backend start contract

Example:

```text
command:
npm run start:server
```

## Frontend build contract

```text
npm run build:web
```

## Health contract

```text
GET /api/health
```

## Main API contract

```text
POST /api/chat
```

## Required environment

```text
GEMINI_API_KEY
GEMINI_MODEL
```

## Data contract

```text
DATA_ROOT or packaged /data
```

The deployment person can map these to any platform.

---

# 51. Deployment Portability

The project should be portable to:

```text
Vercel
Cloud Run
Railway
Render
AWS
Azure
self-hosted Docker
local LAN
```

without changing:

```text
AI router
RAG logic
data schema
navigation model
scraper
UI behavior
```

Only the deployment adapter should change.

---

# 52. Optional Container Contract

If the deployment person chooses Docker later, the repository should support a generic model:

```text
build
  ↓
container
  ↓
start server
  ↓
serve application
```

An example Dockerfile can live at:

```text
deployment/examples/Dockerfile.example
```

rather than being required for the core repository.

---

# 53. Why This Matters

The deployment owner may discover that the fastest available platform is not what the team expected.

For example:

```text
Cloud A works better for this repo
```

The team should not need to rewrite:

```text
AI
data
retrieval
frontend
```

just to deploy it.

---

# 54. No Cloud Credentials in Repository

Never commit:

```text
service-account.json
cloud credentials
API keys
provider tokens
private certificates
```

Repository:

```text
code + data + configuration templates
```

Deployment environment:

```text
secrets + platform credentials
```

---

# 55. `scripts/`

Scripts are developer tools.

Recommended:

```text
bootstrap.ts
validate-data.ts
validate-schemas.ts
inspect-index.ts
build-all.ts
```

These should be safe to run locally.

---

# 56. Golden Query Evaluation

Store:

```text
tests/evaluation/golden-queries.json
```

Example:

```json
[
  {
    "query": "Where can I find the attendance policy?",
    "intent": "POLICY_LOOKUP",
    "expected_resource": "resource-001"
  },
  {
    "query": "What workshops are happening this week?",
    "intent": "EVENT_DISCOVERY"
  }
]
```

This lets the team test whether an architectural change broke the product.

---

# 57. Test Organization

## Unit

Test:

```text
routing
ranking
resource resolution
schema validation
```

## Integration

Test:

```text
query
→ retrieval
→ response
```

## Evaluation

Test:

```text
realistic student queries
```

The prototype does not need 90% test coverage.

It needs tests around the critical path.

---

# 58. README Architecture Diagram

The root README should contain:

```text
             SRM AP SOURCES
                   │
                   ▼
              INGESTION
                   │
                   ▼
                DATA/
                   │
          ┌────────┴────────┐
          ▼                 ▼
      STRUCTURED          RAG INDEX
          │                 │
          └────────┬────────┘
                   ▼
               SERVER
        ┌──────────┼──────────┐
        ▼          ▼          ▼
      ROUTER      CAG       NAVIGATION
        │          │          │
        └──────────┼──────────┘
                   ▼
                 GEMINI
                   │
                   ▼
                WEB UI
```

A new contributor should understand the architecture from this diagram.

---

# 59. Ownership by Directory

| Directory | Primary owner | Purpose |
|---|---|---|
| `apps/web/` | Member C | Student UI |
| `apps/server/` | Member B | Runtime system/AI |
| `packages/shared/` | B + C | Shared contracts |
| `data/` | Member A | Prepared SRM AP data |
| `ingestion/` | Member A | Scraping/indexing |
| `scripts/` | A + B | Build/validation tooling |
| `tests/` | All | Product reliability |
| `config/` | B | Application configuration |
| `deployment/` | Deployment owner | Provider-neutral deployment contract |
| `docs/` | All | Project operating documents |

---

# 60. Cross-Team Workflow

### Member A

```text
SRM AP web
 ↓
ingestion/
 ↓
data/
```

### Member B

```text
data/
 ↓
apps/server/
 ↓
AI response
```

### Member C

```text
shared response
 ↓
apps/web/
```

### Deployment owner

```text
apps/web
+
apps/server
+
data
+
environment
 ↓
cloud
```

This creates parallel work without coupling the team to a deployment platform.

---

# 61. Important Shared Interface

The most important object is:

```text
NavigatorResponse
```

The entire team works around it.

```json
{
  "answer": "...",
  "intent": "POLICY_LOOKUP",
  "path": [
    {
      "label": "Academics"
    },
    {
      "label": "Academic Regulations"
    },
    {
      "label": "Attendance",
      "resource_id": "resource-001"
    }
  ],
  "resources": [
    {
      "resource_id": "resource-001",
      "title": "Academic Regulations"
    }
  ],
  "actions": [
    {
      "type": "OPEN_RESOURCE",
      "resource_id": "resource-001",
      "label": "Open Official Source"
    }
  ],
  "related": []
}
```

The frontend renders it.

The backend generates it.

The data layer resolves its resources.

---

# 62. Resource-ID-First Design

The AI should output:

```text
resource_id
```

not invent:

```text
URL
```

The application resolves:

```text
resource_id
→ resources.json
→ actual URL
```

This prevents hallucinated destinations.

---

# 63. URL Resolution

Centralize URL resolution:

```text
apps/server/src/utils/urls.ts
```

or:

```text
apps/server/src/data/repository.ts
```

Never have 15 components constructing institutional URLs manually.

---

# 64. No Scraping During Chat

This is mandatory.

Wrong:

```text
Student query
↓
crawler
↓
SRM AP website
↓
wait
↓
Gemini
```

Correct:

```text
Student query
↓
prepared indexed data
↓
retrieval
↓
Gemini
```

This makes the demo:

- faster,
- deterministic,
- less dependent on external websites,
- easier to debug.

---

# 65. No "API BS" in the Prototype

Do not build unnecessary:

```text
API gateway
API registry
service mesh
external crawler API
RAG microservice API
SQL microservice API
```

The application may expose a simple backend HTTP interface.

Internally, use normal function/module boundaries.

Keep:

```text
one web app
+
one backend runtime
+
prepared data
```

unless deployment constraints require otherwise.

---

# 66. Internal Architecture Is More Important Than Deployment Shape

Whether deployment eventually becomes:

```text
Vercel
```

or:

```text
Cloud Run
```

or:

```text
Docker
```

the logical application remains:

```text
WEB
 ↓
SERVER
 ├── ROUTER
 ├── RETRIEVAL
 ├── NAVIGATION
 ├── CAG
 ├── DATA
 └── GEMINI
```

This is the architecture the team should optimize.

---

# 67. Build Commands

The repository should eventually support a small, predictable set of commands.

```bash
npm install
npm run dev
npm run build
npm test
npm run ingest
npm run validate
```

Optional:

```bash
npm run server
npm run web
npm run eval
```

Avoid 25 scripts that nobody remembers.

---

# 68. Suggested Root `package.json`

Conceptually:

```json
{
  "scripts": {
    "dev": "...",
    "build": "...",
    "start": "...",
    "test": "...",

    "ingest": "tsx ingestion/pipeline.ts",
    "validate": "tsx scripts/validate-data.ts",
    "validate:schemas": "tsx scripts/validate-schemas.ts",
    "eval": "tsx tests/evaluation/evaluate.ts"
  }
}
```

The exact monorepo tooling can remain simple.

Do not introduce Turborepo/Nx solely for appearance.

---

# 69. Prototype Dependency Rule

For each dependency ask:

> Does this materially reduce build time or improve the demo?

If not:

```text
do not add it.
```

Especially avoid unnecessary:

- databases,
- cache servers,
- orchestration frameworks,
- monitoring platforms,
- hosted vector systems.

---

# 70. Future Evolution

The repository is intentionally prepared for future migration.

### Today

```text
JSON / static index
```

### Later

```text
PostgreSQL
+
vector DB
+
object storage
+
scheduled ingestion
```

The application does not need to change radically because the data access abstraction is already separated.

---

# 71. Future Data Architecture

Potential later architecture:

```text
SRM AP
   ↓
Scheduled crawler
   ↓
Object Storage
   ├── raw HTML
   └── PDFs
   ↓
Processing
   ↓
PostgreSQL ─────────┐
                    │
Vector DB ──────────┤
                    ▼
               Runtime API
                    │
                  Gemini
                    │
                  Web UI
```

This is explicitly **future architecture**, not the 3-hour requirement.

---

# 72. Future Deployment Architecture

Potential later:

```text
CDN / Frontend
      │
      ▼
Application API
      │
 ┌────┼─────────────┐
 ▼    ▼             ▼
SQL  Vector DB    Object Store
 │      │
 └──────┼──────────┘
        ▼
      Gemini
```

Again, the repository's boundaries already support this evolution.

---

# 73. Final Repository Definition of Done

## Structure

```text
[ ] frontend separated from backend
[ ] runtime separated from ingestion
[ ] data is explicit
[ ] shared schemas exist
[ ] AI logic centralized
[ ] deployment is provider-neutral
```

## Data

```text
[ ] resource catalogue exists
[ ] navigation graph exists
[ ] RAG chunks exist
[ ] provenance exists
[ ] manifests exist
```

## AI

```text
[ ] Gemini adapter exists
[ ] router exists
[ ] retrieval abstraction exists
[ ] structured retrieval exists
[ ] CAG exists
[ ] response validation exists
```

## UI

```text
[ ] chat
[ ] navigation path
[ ] source
[ ] action
[ ] explore
```

## Deployment boundary

```text
[ ] backend start contract documented
[ ] environment variables documented
[ ] health endpoint exists
[ ] no cloud-specific logic in core application
[ ] deployment examples separated from core system
```

---

# 74. Final Repository Map

The entire project should be understandable as:

```text
REPOSITORY
│
├── apps/
│   ├── web/             ← student experience
│   └── server/          ← actual application intelligence
│
├── packages/
│   └── shared/          ← contracts between systems
│
├── data/                ← SRM AP knowledge
│   ├── curated/         ← structured records
│   ├── navigation/      ← information paths
│   ├── documents/       ← source documents
│   ├── retrieval/       ← RAG artifacts
│   ├── context/         ← cached context
│   └── manifests/       ← provenance/versioning
│
├── ingestion/           ← scraper + data engineering
│
├── scripts/             ← developer utilities
│
├── tests/               ← correctness/evaluation
│
├── config/              ← non-secret configuration
│
├── deployment/          ← cloud-neutral deployment contract
│
└── docs/                ← team project docs
```

---

# 75. Final System Boundary

The strongest way to think about the project is:

```text
                 ┌─────────────────────────┐
                 │       SRM AP WEB        │
                 └────────────┬────────────┘
                              │
                              ▼
                       OFFLINE INGESTION
                              │
                              ▼
                            DATA/
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
             STRUCTURED      RAG         NAVIGATION
                │             │             │
                └─────────────┼─────────────┘
                              ▼
                         SERVER / AI
                              │
                       ┌──────┴──────┐
                       ▼             ▼
                    ROUTER         GEMINI
                       │             │
                       └──────┬──────┘
                              ▼
                       NAVIGATOR RESPONSE
                              │
                              ▼
                         WEB APPLICATION
                              │
                              ▼
                           STUDENT
```

Deployment can wrap this system however necessary.

---

# 76. Final Rule

> **The repository owns the product architecture. The cloud provider only owns the packaging and hosting of that architecture.**

For this prototype:

```text
SCRAPE ONCE
→ PREPARE DATA
→ INDEX DATA
→ RUN LOCAL/SERVER LOGIC
→ GEMINI
→ SHOW PATH
```

Do not build the prototype around a particular hosting provider.

Do not require live SRM APIs.

Do not scrape at query time.

Do not expose the Gemini API key.

Do not let deployment concerns leak into the data/AI/UI architecture.

The repository should remain a clean, portable implementation of:

> **Question → Direction → Official Source → Action.**