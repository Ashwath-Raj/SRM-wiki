# 03_TEAM_TASK_BOARD.md
# SRM AP Information Navigator — 3-Member Collaborative Task Board

**Status:** Pre-build execution contract  
**Version:** v1.0  
**Build window:** 3 hours  
**Team size:** 3  
**Primary workstreams:**

1. **Member A — Scraping + Data + Source Intelligence**
2. **Member B — System Design + AI + Semantics**
3. **Member C — UI/UX + Cloud + Deployment + Demo Integration**

**Important:** These are ownership lanes, **not sequential stages**.

All three members start immediately and work against shared contracts.

---

# 1. TEAM OPERATING MODEL

The team is NOT:

```text
A finishes scraping
        ↓
B builds AI
        ↓
C deploys/UI
```

That is too slow for a 3-hour build.

The team is:

```text
                 SHARED PRODUCT CONTRACT
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
   A: DATA/          B: SYSTEM/         C: UI/CLOUD/
   SCRAPING          AI/SEMANTICS       DEPLOYMENT
        │                 │                 │
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
                     INTEGRATION
                          ▼
                       DEMO
```

Each member has a primary lane, but each lane must produce **interfaces other lanes can consume early**.

---

# 2. NON-NEGOTIABLE SHARED CONTRACTS

Before implementation becomes serious, all 3 members agree on these:

### Product

> Question → Direction → Official Source → Action

### Resource schema

```json
{
  "id": "resource-001",
  "title": "Academic Regulations",
  "url": "https://...",
  "type": "policy",
  "category": "academics",
  "subcategory": "regulations",
  "description": "...",
  "content": "...",
  "authority": "official",
  "source_domain": "srm...",
  "last_seen": "2026-09-29"
}
```

### AI response schema

```json
{
  "answer": "Short contextual explanation.",
  "intent": "POLICY_LOOKUP",
  "path": [
    "Academics",
    "Academic Regulations",
    "Attendance"
  ],
  "resources": [
    {
      "id": "resource-001",
      "title": "Academic Regulations",
      "url": "https://..."
    }
  ],
  "actions": [
    {
      "label": "Open Official Source",
      "url": "https://..."
    }
  ],
  "related": [
    "Medical Leave"
  ]
}
```

### Core information hierarchy

```text
Academics
Student Life
Campus
Administration
Opportunities
Portals
```

The exact taxonomy may expand, but no member creates an incompatible hierarchy independently.

---

# 3. MEMBER A — SCRAPING + DATA + SOURCE INTELLIGENCE

## Mission

Build the **institutional information substrate**.

Member A is responsible for turning SRM AP's publicly available web information into structured, searchable, trustworthy resources that the AI and UI can consume.

The output is **not merely scraped HTML**.

The output is:

> clean, classified, source-linked institutional resources.

---

# 4. MEMBER A — PRIMARY RESPONSIBILITIES

### A1. Crawl scope

Identify useful SRM AP sources across:

```text
Main institutional pages
Academic pages
Schools/departments
Regulations
Policies
Academic calendar
Programmes
Courses
Student services
Clubs
Organizations
Events
Announcements
Facilities
Library
Hostel
Forms
Portals
Public PDFs
Public notices
```

Do not crawl arbitrary external websites just to increase document count.

---

### A2. Crawler

Implement the simplest reliable crawler possible.

Recommended:

```text
Python
requests/httpx
BeautifulSoup
PDF parser where needed
Playwright only when a site genuinely requires rendering
```

Do not spend the first hour building a generalized enterprise crawler.

---

### A3. URL handling

Each item should preserve:

```text
canonical URL
source URL
parent URL where useful
```

Normalize:

- trailing slashes,
- fragments,
- obvious tracking parameters,
- duplicate URL forms.

---

### A4. HTML cleaning

Remove obvious boilerplate:

```text
navigation
footer
cookie banners
repeated menus
scripts
styles
irrelevant page chrome
```

Retain:

```text
heading hierarchy
body text
links
document references
dates
important labels
```

---

### A5. PDF ingestion

Public PDFs are particularly important for:

- regulations,
- policies,
- academic documents,
- circulars,
- forms,
- notices.

Extract:

```text
document title
text
source URL
publication/updated date if available
section headings where possible
```

Do not assume every PDF is text-searchable.

For scanned PDFs, prioritize documents that matter to the demo and use the minimum required extraction path.

---

### A6. Resource classification

Assign each source a type:

```text
policy
regulation
procedure
portal
form
event
announcement
department
organization
facility
course
programme
academic_calendar
contact
document
webpage
```

And category:

```text
academics
student_life
campus
administration
opportunities
portals
```

---

### A7. Authority classification

At minimum:

```text
official
institutional_secondary
unknown
```

The MVP should favor:

```text
official
```

for policy and procedural answers.

---

### A8. Metadata extraction

Every source should attempt to retain:

```text
title
URL
type
category
subcategory
description
content
authority
source_domain
last_seen
publication_date if available
```

---

# 5. MEMBER A — FIRST 30 MINUTES

## 0:00–0:10

- Read `00_START_HERE.md`
- Read `01_PROJECT_PLAN.md`
- Read this file
- Agree on taxonomy
- Select initial crawl domains/pages
- Confirm resource schema

## 0:10–0:20

Build crawler skeleton.

Goal:

```text
URL
 ↓
HTML
 ↓
title + clean text + links
```

## 0:20–0:30

Produce the first usable resource objects.

Example:

```json
{
  "id": "r001",
  "title": "...",
  "url": "...",
  "type": "...",
  "category": "...",
  "content": "..."
}
```

**Do not wait for the entire corpus.**

---

# 6. MEMBER A — 30–90 MINUTES

Expand coverage.

Priority order:

```text
1. Academic regulations/policies
2. Academic calendar
3. Student services
4. Portals/forms
5. Clubs/organizations
6. Events
7. Announcements
8. General pages
```

Why this order?

Because the primary demo should prove:

```text
"I need something"
      ↓
"Here is the official place to find it"
```

not:

> "Look, we scraped thousands of pages."

---

# 7. MEMBER A — 90–150 MINUTES

Clean and improve the corpus.

Tasks:

- deduplicate pages,
- remove boilerplate,
- validate URLs,
- improve metadata,
- group related documents,
- identify policy pages,
- identify event records,
- extract dates,
- produce chunks for RAG,
- produce structured rows for SQL.

---

# 8. MEMBER A — 150–180 MINUTES

Freeze a demo-ready dataset.

Deliver:

```text
data/
├── resources.json
├── events.json
├── announcements.json
└── documents/
```

or the equivalent database/index.

Ensure Member B and Member C know exactly where the data lives.

---

# 9. MEMBER A — DEFINITION OF DONE

```text
[ ] Crawler runs
[ ] Relevant SRM AP pages identified
[ ] HTML extraction works
[ ] PDF extraction works for priority PDFs
[ ] URLs preserved
[ ] Resources classified
[ ] Authority retained
[ ] Dates retained where available
[ ] Duplicates reduced
[ ] Structured events exist
[ ] RAG-ready documents exist
[ ] Shared resource schema respected
[ ] Dataset can be consumed by Member B
```

---

# 10. MEMBER B — SYSTEM DESIGN + AI + SEMANTICS

## Mission

Build the **intelligence and routing layer**.

Member B owns the logic that turns:

```text
student language
        ↓
intent
        ↓
retrieval strategy
        ↓
evidence
        ↓
path
        ↓
response
```

The role is broader than "prompt engineer."

Member B owns the semantic model of the whole application.

---

# 11. MEMBER B — PRIMARY RESPONSIBILITIES

### B1. System architecture

Define:

```text
frontend
↓
backend
↓
query router
↓
retrieval
↓
evidence
↓
Gemini
↓
structured response
```

and establish APIs/interfaces.

---

### B2. Intent model

Recommended initial labels:

```text
POLICY_LOOKUP
PROCEDURE_LOOKUP
RESOURCE_LOOKUP
PORTAL_LOOKUP
EVENT_DISCOVERY
ORGANIZATION_DISCOVERY
FACILITY_LOOKUP
ACADEMIC_LOOKUP
ANNOUNCEMENT_LOOKUP
CONTACT_LOOKUP
GENERAL_NAVIGATION
AMBIGUOUS
UNKNOWN
```

Keep this small.

Do not create 100 intent classes during a three-hour hackathon.

---

### B3. Retrieval routing

Determine:

```text
SQL
RAG
Navigation
```

or combinations.

Example:

```text
"What workshops are happening this week?"
→ SQL

"What does the attendance policy say?"
→ RAG

"Where is the academic calendar?"
→ Navigation + RAG

"What technical clubs are recruiting?"
→ SQL + resource retrieval
```

---

### B4. RAG architecture

Implement:

```text
query
 ↓
embedding/retrieval
 ↓
top relevant chunks
 ↓
metadata/source
 ↓
evidence bundle
 ↓
Gemini
```

The key output is not merely text.

It must preserve:

```text
source
section
URL
resource ID
```

---

### B5. Text-to-SQL

Define controlled schemas for:

```text
events
announcements
resources
organizations
```

The model may produce a query against these schemas.

But:

```text
AI-generated SQL
        ↓
validation
        ↓
read-only execution
```

Never give the LLM unrestricted write access.

---

### B6. Navigation semantics

The system needs a representation of:

```text
Academics
 ↓
Regulations
 ↓
Attendance
```

This should map to actual resources.

A generated path without a corresponding resource is not useful.

---

### B7. Response generation

The final model output should be structured.

Example:

```json
{
  "answer": "...",
  "intent": "POLICY_LOOKUP",
  "path": [
    "Academics",
    "Academic Regulations",
    "Attendance"
  ],
  "resources": [],
  "actions": [],
  "related": []
}
```

---

# 12. MEMBER B — SYSTEM DESIGN DELIVERABLES

Member B must produce:

```text
ARCHITECTURE
        ↓
API CONTRACT
        ↓
DATA CONTRACT
        ↓
RETRIEVAL CONTRACT
        ↓
AI RESPONSE CONTRACT
```

The team should not be forced to reverse-engineer system behavior from code.

---

# 13. MEMBER B — FIRST 30 MINUTES

## 0:00–0:10

- Read shared docs.
- Freeze semantic taxonomy.
- Freeze response schema.
- Identify retrieval modes.

## 0:10–0:20

Implement:

```text
FastAPI skeleton
POST /api/chat
GET /health
```

## 0:20–0:30

Connect Gemini.

Run:

```text
question
→ Gemini
→ structured JSON
```

Do not wait for the complete scraper.

Create a tiny mocked resource set if necessary.

---

# 14. MEMBER B — 30–75 MINUTES

Implement the first vertical path:

```text
query
→ intent
→ RAG
→ source
→ Gemini
→ response
```

Target:

> "Where can I find the attendance policy?"

Get this working end-to-end first.

---

# 15. MEMBER B — 75–120 MINUTES

Add:

```text
Text-to-SQL
```

Target:

> "What workshops are happening this week?"

Then add:

```text
combined retrieval
```

where useful.

---

# 16. MEMBER B — 120–165 MINUTES

Improve:

- source grounding,
- ambiguous query handling,
- no-result behavior,
- response formatting,
- path validity,
- retrieval quality.

Do NOT spend this time building elaborate agent orchestration.

---

# 17. MEMBER B — 165–180 MINUTES

Freeze API.

Notify Member C:

```text
POST /api/chat
GET /health
```

Required environment variables:

```text
GEMINI_API_KEY
```

Optional:

```text
DATABASE_URL
VECTOR_INDEX_PATH
```

---

# 18. MEMBER B — DEFINITION OF DONE

```text
[ ] Gemini connection works
[ ] API works locally
[ ] /health works
[ ] Intent routing exists
[ ] RAG works
[ ] SQL route works
[ ] Response schema is stable
[ ] Source metadata retained
[ ] Hallucination/missing-source behavior exists
[ ] UI can consume response
[ ] Deployment can consume API
```

---

# 19. MEMBER C — UI/UX + CLOUD + DEPLOYMENT + INTEGRATION

## Mission

Build the **actual student experience** and keep the entire product deployable.

Member C owns:

```text
UI
+
UX
+
Google Cloud
+
production deployment
+
demo integration
```

This is deliberately one lane.

The person responsible for the visible product should know how the system behaves in production.

---

# 20. MEMBER C — PRIMARY RESPONSIBILITIES

### C1. UX implementation

Build:

```text
Home
Explore
Chat/Navigator
Resource card
Path component
Event card
Source/action button
```

The interface should communicate:

> "I'll show you where to go."

not:

> "Here's an AI answer."

---

### C2. Frontend/backend integration

Consume the shared response schema.

Do not parse arbitrary Markdown from Gemini.

Render:

```text
answer
path
resources
actions
related
```

as components.

---

### C3. Google Cloud

Set up:

```text
Google Cloud project
Gemini credentials
Secret Manager
Cloud Run
service account
deployment
```

See `02_DATA_CLOUD_ONBOARDING.md`.

---

### C4. Production deployment

Deploy early.

Do not wait until minute 170.

The application should have a reachable skeleton early enough to discover:

- build failures,
- CORS failures,
- environment issues,
- routing problems.

---

# 21. MEMBER C — FIRST 30 MINUTES

## 0:00–0:10

- Read shared docs.
- Create/confirm Google Cloud project.
- Select deployment region.
- Confirm Gemini credential strategy.

## 0:10–0:20

Start frontend shell:

```text
Home
Chat
Explore
```

## 0:20–0:30

Create initial cloud/deployment skeleton.

Goal:

```text
hello application
```

is deployed or deployable.

---

# 22. MEMBER C — 30–75 MINUTES

Build the first usable interface:

```text
Search prompt
↓
chat response
↓
navigation path
↓
source card
↓
action button
```

Use mocked response data until Member B's API is ready.

This lets UI work proceed independently.

---

# 23. MEMBER C — 75–120 MINUTES

Integrate the real API.

Target:

```text
Browser
 ↓
/api/chat
 ↓
AI
 ↓
structured response
 ↓
rendered path
```

At this point the application should look like the actual product.

---

# 24. MEMBER C — 120–150 MINUTES

Deploy the real system.

Verify:

```text
production URL
 ↓
frontend
 ↓
backend
 ↓
Gemini
 ↓
data
```

Fix integration bugs.

---

# 25. MEMBER C — 150–180 MINUTES

Freeze implementation.

Focus on:

- typography,
- spacing,
- source visibility,
- path visibility,
- responsive layout,
- loading states,
- error states,
- demo reliability.

Then:

```text
pitch deck
+
speech
+
demo rehearsal
```

Do not introduce major product features here.

---

# 26. MEMBER C — DEFINITION OF DONE

```text
[ ] Home page works
[ ] Chat works
[ ] Path renders
[ ] Sources render
[ ] Actions work
[ ] Explore works at least minimally
[ ] Mobile layout acceptable
[ ] Production build succeeds
[ ] Cloud Run service works
[ ] Gemini secret works in production
[ ] Demo URL works
[ ] Main demo queries work
[ ] Presentation ready
```

---

# 27. COLLABORATIVE CHECKPOINTS

These are mandatory.

---

## CHECKPOINT 0 — 15 MINUTES

Everyone stops for 3 minutes.

Confirm:

```text
Product:
Question → Direction → Source → Action

Schema:
Resource object agreed

API:
POST /api/chat

AI:
SQL + RAG + Navigation

UI:
Path + Source + Action

Cloud:
Deployment target confirmed
```

If any of these are unresolved, resolve them before continuing.

---

# 28. CHECKPOINT 1 — 45 MINUTES

Expected state:

### Member A

Has:

```text
first resource objects
```

### Member B

Has:

```text
working Gemini/API skeleton
```

### Member C

Has:

```text
frontend shell + deployment skeleton
```

No one should still be "planning."

---

# 29. CHECKPOINT 2 — 75 MINUTES

Build the first vertical slice.

```text
User:
"Where is the attendance policy?"

        ↓

Frontend

        ↓

Backend

        ↓

RAG / resource lookup

        ↓

Gemini

        ↓

JSON response

        ↓

UI path

        ↓

Official source
```

This is the most important checkpoint.

---

# 30. CHECKPOINT 3 — 120 MINUTES

Expected:

```text
Policy query
✅

Structured event query
✅

Source click
✅

Production URL
✅
```

Anything else is secondary.

---

# 31. CHECKPOINT 4 — 150 MINUTES

Freeze architecture.

From here:

```text
NO NEW ARCHITECTURE
NO NEW FRAMEWORK
NO NEW MAJOR FEATURE
```

Only:

```text
fix
polish
verify
rehearse
```

---

# 32. TEAM COMMUNICATION RULES

Use one shared team channel.

Every member should post compact status:

```text
DONE:
...

WORKING:
...

BLOCKED:
...

NEED:
...
```

Example:

```text
DONE:
Crawler extracts 70 resources.

WORKING:
PDF parsing.

BLOCKED:
Two PDF URLs return 403.

NEED:
Use alternative official source.
```

Do not send giant status essays during the hackathon.

---

# 33. BLOCKER RULE

A blocker gets **10 minutes max** before escalating.

Do not let one person disappear into a problem for 45 minutes.

After 10 minutes:

```text
TRY SIMPLER APPROACH
```

Examples:

- Browser automation fails → use requests if possible.
- Vector DB installation fails → use FAISS/simple local index.
- Cloud deployment is blocked → use a simpler deployment route.
- Advanced SQL generation fails → constrain query templates.
- Full scraping fails → use curated high-value sources.
- UI library becomes troublesome → use basic React/CSS.

---

# 34. SHARED BRANCH STRATEGY

Recommended:

```text
main
│
├── feature/data-crawler
├── feature/ai-system
└── feature/ui-cloud
```

Merge frequently.

Do not wait until minute 170.

---

# 35. Commit Strategy

Use small commits.

### Member A

```text
feat(data): add SRM crawler
feat(data): normalize resource metadata
feat(data): add PDF extraction
feat(data): add event parser
```

### Member B

```text
feat(ai): add Gemini client
feat(ai): add intent router
feat(ai): add RAG retrieval
feat(ai): add text-to-sql
feat(api): add chat response schema
```

### Member C

```text
feat(ui): add navigator shell
feat(ui): add path component
feat(ui): add source card
feat(cloud): add deployment config
feat(ui): connect chat API
```

---

# 36. Shared API Contract

Member B owns the endpoint.

Member C owns the frontend consumer.

### Request

```http
POST /api/chat
Content-Type: application/json
```

```json
{
  "message": "Where can I find the attendance policy?",
  "conversation_id": "optional"
}
```

### Response

```json
{
  "answer": "You're looking for the official attendance regulations.",
  "intent": "POLICY_LOOKUP",
  "path": [
    "Academics",
    "Academic Regulations",
    "Attendance"
  ],
  "resources": [
    {
      "id": "resource-001",
      "title": "Academic Regulations",
      "url": "https://..."
    }
  ],
  "actions": [
    {
      "label": "Open Official Source",
      "url": "https://..."
    }
  ],
  "related": [
    "Medical Leave"
  ]
}
```

---

# 37. UI CONTRACT

Member C renders:

```text
answer
↓
path
↓
resource/source
↓
primary action
↓
related resources
```

The UI must not require:

```text
raw Gemini Markdown
```

to understand the response.

---

# 38. DATA CONTRACT

Member A produces resources in the shared model.

Member B consumes them.

Member C can display them.

```text
A
↓
resource object
↓
B
↓
AI response
↓
C
↓
source card
```

This is how the team remains parallel.

---

# 39. AI CONTRACT

Member B must ensure:

### If source exists

Return it.

### If source is uncertain

Say it is uncertain / ask a focused clarification.

### If source doesn't exist

Do not fabricate.

### If query is ambiguous

Ask one short question or present 2–4 clear choices.

### If multiple sources matter

Return the most relevant primary source and related resources.

---

# 40. UI/UX CONTRACT

Member C must ensure:

### Default answer

Short.

### Primary visual

Path.

### Trust visual

Source.

### Next action

Button/link.

### List

Only when the task requires discovery.

### Error

Useful, non-technical.

---

# 41. DEMO CONTRACT

The system must reliably support these five scenarios.

## 1 — Policy

> Where can I find the attendance policy?

Expected:

```text
Academics
→ Academic Regulations
→ Attendance
→ official source
```

---

## 2 — Event

> What workshops are happening this week?

Expected:

```text
structured event list
```

---

## 3 — Procedure

> How do I apply for hostel?

Expected:

```text
Campus
→ Hostel
→ Application
→ official portal/source
```

---

## 4 — Club discovery

> What technical clubs can I join?

Expected:

```text
filtered organizations
```

---

## 5 — Resource

> Where is the academic calendar?

Expected:

```text
Academics
→ Academic Calendar
→ official source
```

---

# 42. DEMO FALLBACKS

Every major demo query needs a fallback.

If an exact source was not indexed:

```text
Show closest authoritative resource
```

If event records are weak:

```text
Demo using a populated structured event fixture
clearly sourced from indexed/official information.
```

If RAG fails:

```text
Use deterministic resource lookup
```

If SQL generation fails:

```text
Use a constrained query route/template
```

Do not let one AI failure destroy the presentation.

---

# 43. WHAT NOT TO DUPLICATE

Members should not independently build:

```text
3 taxonomies
3 resource schemas
3 API designs
3 Gemini prompts
3 deployment methods
```

There should be:

```text
ONE taxonomy
ONE resource schema
ONE response schema
ONE backend API
ONE deployment target
```

---

# 44. RESPONSIBILITY MATRIX

| Area | A — Data | B — System/AI | C — UI/Cloud |
|---|---:|---:|---:|
| Crawl scope | **Owner** | Consult | Consult |
| Scraper | **Owner** | Consult | — |
| Data cleaning | **Owner** | Consult | — |
| Resource taxonomy | **Owner** | **Co-owner** | Consult |
| SQL schema | Consult | **Owner** | — |
| RAG | Consult | **Owner** | — |
| Gemini | — | **Owner** | Deployment |
| API | Consult | **Owner** | Consumer |
| UX design | **Co-owner** | Consult | **Owner** |
| Frontend | Consult | Consult | **Owner** |
| Google Cloud | — | Consult | **Owner** |
| Deployment | — | Consult | **Owner** |
| Security/secrets | Consult | Consult | **Owner** |
| Pitch | Consult | Consult | **Owner** |
| Demo | Consult | **Co-owner** | **Owner** |

---

# 45. HANDOFF MATRIX

## A → B

Deliver:

```text
resources
documents
event records
metadata
source URLs
```

## B → C

Deliver:

```text
API endpoint
response schema
environment requirements
startup command
health endpoint
```

## C → A/B

Deliver:

```text
production API URL
deployment status
runtime failures
environment constraints
```

This makes collaboration bidirectional.

---

# 46. SHARED DEBUGGING FLOW

When something fails:

```text
User query fails
      ↓
Does UI send request?
      ↓
Does API receive request?
      ↓
Does router classify?
      ↓
Did retrieval find evidence?
      ↓
Did Gemini generate valid response?
      ↓
Does response match schema?
      ↓
Does UI render it?
      ↓
Does source open?
```

Identify the failed layer before changing code.

---

# 47. CODE OWNERSHIP

### Member A owns

```text
crawler/
ingestion/
parsing/
data/
```

### Member B owns

```text
backend/
ai/
retrieval/
routing/
schemas/
```

### Member C owns

```text
frontend/
deployment/
cloud/
presentation/
```

Shared modifications should be discussed before overwriting another member's core files.

---

# 48. ENVIRONMENT OWNERSHIP

### A needs

```text
crawler config
source URLs
data/index path
```

### B needs

```text
GEMINI_API_KEY
data/index path
database config if applicable
```

### C needs

```text
GOOGLE_CLOUD_PROJECT
GOOGLE_CLOUD_REGION
deployment config
GEMINI_API_KEY for local testing
```

Production Gemini credentials must remain in Secret Manager.

---

# 49. TASK PRIORITY SYSTEM

Use:

```text
P0 = required for working demo
P1 = valuable if core works
P2 = polish / future
```

### P0

```text
Crawler/data
Gemini
RAG
SQL route
API
Path UI
Source link
Cloud deployment
```

### P1

```text
Explore page
events UI
related resources
mobile polish
better classification
```

### P2

```text
animations
analytics
personalization
advanced recommendations
real-time updates
```

---

# 50. KILL LIST

Cut immediately if they consume too much time:

```text
Custom authentication
Complex agent frameworks
Multiple databases
Neo4j unless already ready
Advanced graph algorithms
Fancy dashboards
Live web crawling at query time
Full notification infrastructure
Custom embeddings service
Elaborate state management
Full CMS
```

The project needs to be a **working navigation system**, not a miniature enterprise platform.

---

# 51. FINAL 30-MINUTE FREEZE

At approximately 150 minutes:

```text
NO:
- new architecture
- new frameworks
- new major screens
- database migration
- broad crawler rewrite
- model switching experiments
```

Allowed:

```text
- bug fixes
- source corrections
- prompt tuning
- UI spacing
- copy changes
- deployment fixes
- demo rehearsal
```

---

# 52. FINAL TEAM CHECKLIST

Before presenting:

## Data / Scraping — A

```text
[ ] Main sources indexed
[ ] Policies available
[ ] Events available
[ ] URLs valid
[ ] Metadata valid
[ ] Corpus frozen
```

## System / AI — B

```text
[ ] Gemini works
[ ] RAG works
[ ] SQL works
[ ] response schema stable
[ ] source grounding works
[ ] fallback works
[ ] backend deployed
```

## UI / Cloud — C

```text
[ ] UI works
[ ] path visible
[ ] source visible
[ ] source opens
[ ] deployment works
[ ] secret works
[ ] mobile view acceptable
[ ] demo URL stable
```

## All

```text
[ ] 5 demo queries tested
[ ] no API key in repository
[ ] pitch rehearsed
[ ] fallback demo ready
[ ] no one is blocked on another person's unfinished feature
```

---

# 53. FINAL OPERATING PRINCIPLE

The team should think in terms of:

```text
OWNERSHIP ≠ ISOLATION
```

Each member has a clear area of ownership.

But every output is designed as a reusable contract.

The target operating pattern is:

```text
A produces usable data
     ↘
      ↘
       B produces usable intelligence
          ↘
           ↘
            C turns it into a usable product
              ↘
               all three test together
```

Not:

```text
A → B → C
```

---

# 54. NORTH STAR

When deciding who does what, remember:

### Member A

> **Find and structure where the information lives.**

### Member B

> **Determine what the student means and which information path applies.**

### Member C

> **Make that path understandable, deploy it, and demonstrate it.**

Together:

> **Student asks → system understands → evidence is found → path is shown → official source is reached.**