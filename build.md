# SRM AP Wiki — Master Build Specification

> **Version:** 1.0  
> **Project:** SRM AP Wiki  
> **Document:** Master Build Specification  
> **Purpose:** Complete implementation specification for an agentic coding IDE  
> **Status:** Primary source of truth for implementation
>
> The coding agent must read this document before making architectural or implementation decisions.
>
> The goal is to build a production-quality MVP, not a prototype that only demonstrates an AI chatbot.

---

# 1. PROJECT IDENTITY

## 1.1 Name

# SRM AP Wiki

## 1.2 Tagline

> **Everything SRM AP, in one place.**

## 1.3 One-line definition

**SRM AP Wiki is a centralized, searchable, continuously updated information platform that organizes the public SRM University–AP digital ecosystem into one place, with AI acting as a natural-language discovery and navigation layer.**

---

# 2. IMPORTANT PRODUCT DISTINCTION

This project is **NOT** a "Campus AI".

Do not build the application as:

```text
User
  ↓
Chatbot
  ↓
LLM
  ↓
Answer
```

That is not the product.

The product is:

```text
                    SRM AP WIKI
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
     Browse            Search             AI
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                  Knowledge Base
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
   Structured          Documents        Sources
      Data               /RAG
```

The website must remain useful even if the AI assistant is disabled.

---

# 3. PRODUCT PURPOSE

SRM AP information is distributed across:

- University websites
- Department pages
- Student portals
- Examination systems
- Library systems
- LMS
- Event pages
- Club websites
- Student organizations
- Public documents
- Project repositories
- Announcements
- Public social channels
- Other public university resources

The problem is not simply lack of information.

The problem is:

```text
Information exists
      ↓
Information is fragmented
      ↓
Users don't know where to look
      ↓
Users waste time finding the correct source
```

SRM AP Wiki solves this by creating:

```text
One discovery layer
        +
Structured information
        +
Search
        +
Live updates
        +
AI navigation
        +
Original source links
```

---

# 4. PRIMARY PRODUCT OBJECTIVES

The system must allow users to:

### Objective 1 — Find

Find official portals, links, documents and services.

### Objective 2 — Discover

Discover events, workshops, hackathons, clubs, organizations, projects and opportunities.

### Objective 3 — Stay updated

See current notifications, newly published information and upcoming deadlines.

### Objective 4 — Search

Search the entire SRM AP Wiki knowledge base.

### Objective 5 — Ask

Ask natural-language questions through the AI assistant.

### Objective 6 — Navigate

Open the original source after finding information.

---

# 5. CORE PRODUCT LOOP

The complete user loop:

```text
                 USER
                   │
          ┌────────┼─────────┐
          │        │         │
        Browse   Search     Ask
          │        │         │
          └────────┼─────────┘
                   ▼
              SRM AP WIKI
                   │
                   ▼
           Structured Knowledge
                   │
                   ▼
            Verified Information
                   │
                   ▼
             Original Source
```

---

# 6. PRIMARY USERS

## 6.1 Students

Primary users.

They should be able to:

- Find portals
- Find events
- Read notices
- Find documents
- Discover projects
- Find clubs
- Find opportunities
- Search university information
- Ask the AI

## 6.2 New students

The platform should help new students discover:

- University systems
- Important portals
- Academic resources
- Clubs
- Events
- Organizations
- Student projects

## 6.3 Faculty / staff

Useful for:

- Events
- Notices
- Departments
- Organizations
- Documents
- University resources

## 6.4 Student organizations

Useful for:

- Publishing events
- Publishing projects
- Discovering related organizations

---

# 7. MVP SCOPE

The MVP must include the following.

## Public

```text
Homepage
Global Search
Explore
Portals
Events
Notices
Projects
Organizations
Documents
Opportunities
SRM AP Pulse
AI Assistant
Source pages
```

## Backend

```text
REST API
PostgreSQL
Search
Crawler
Source registry
Content extraction
PDF extraction
Deduplication
Change detection
Scheduling
Provenance
```

## AI

```text
Intent routing
Structured database retrieval
Semantic search
RAG
Source-backed responses
```

## Admin

```text
Authentication
Dashboard
Source management
Portal management
Event management
Notice management
Project management
Organization management
Document management
Review queue
Crawler monitoring
Link health
```

---

# 8. MVP NON-GOALS

Do not implement these unless explicitly requested later:

```text
Private student data
Student grades
Attendance
Private LMS content
Private ERP content
Private university databases
Automatic login
Password management
Authentication bypass
Student financial records
Private email scraping
Private WhatsApp/Telegram data
University ERP replacement
Native mobile application
Complex social network
Full autonomous AI agent
```

The application should work entirely with publicly accessible and appropriately submitted information.

---

# 9. CORE PRODUCT MODULES

Build the system as these modules:

```text
1. Public Website
2. Search
3. Structured Knowledge Base
4. Data Ingestion / Crawler
5. Document / RAG Pipeline
6. AI Assistant
7. Admin Dashboard
8. Verification System
9. Notification / Pulse System
10. Monitoring
```

Each module should have clear responsibilities.

---

# 10. SYSTEM ARCHITECTURE

Use this high-level architecture:

```text
                           USER
                            │
                            ▼
                    ┌───────────────┐
                    │   NEXT.JS     │
                    │   FRONTEND    │
                    └───────┬───────┘
                            │
                         HTTP/API
                            │
                    ┌───────▼───────┐
                    │    FASTAPI    │
                    │    BACKEND    │
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
  PostgreSQL            Search Service       AI Service
        │                   │                   │
        │                   │            ┌──────┴──────┐
        │                   │            │             │
        │                   │          RAG            LLM
        │                   │            │
        │                   │         pgvector
        │
        ▲
        │
  ┌─────┴────────┐
  │ DATA INGESTION│
  └─────┬────────┘
        │
 ┌──────┼──────────────┐
 │      │              │
 ▼      ▼              ▼
Websites PDFs     Approved submissions
 │      │              │
 └──────┼──────────────┘
        ▼
   Extraction
        ▼
 Normalization
        ▼
Classification
        ▼
Deduplication
        ▼
Verification
        ▼
Knowledge Base
```

---

# 11. TECHNOLOGY STACK

Use the following stack unless there is a strong technical reason to change it.

## Frontend

```text
Next.js
React
TypeScript
Tailwind CSS
```

## Backend

```text
Python
FastAPI
Pydantic
SQLAlchemy
Alembic
```

## Database

```text
PostgreSQL
pgvector
```

## Crawling

```text
httpx
BeautifulSoup
trafilatura
Playwright
```

## Documents

```text
PyMuPDF
```

Optional OCR later.

## AI

Create provider abstractions:

```text
LLMProvider
EmbeddingProvider
```

Do not hard-code application logic directly against one AI provider.

---

# 12. REPOSITORY STRUCTURE

Use the following structure:

```text
srm-ap-wiki/
│
├── frontend/
│   ├── app/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── search/
│   │   ├── events/
│   │   ├── notices/
│   │   ├── portals/
│   │   ├── projects/
│   │   ├── organizations/
│   │   ├── documents/
│   │   ├── pulse/
│   │   └── ai/
│   │
│   ├── lib/
│   ├── hooks/
│   ├── types/
│   └── public/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   └── dependencies/
│   │   │
│   │   ├── core/
│   │   ├── database/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── main.py
│   │
│   └── tests/
│
├── crawler/
│   ├── fetcher/
│   ├── parsers/
│   ├── extractors/
│   ├── classifiers/
│   ├── normalizers/
│   ├── deduplication/
│   ├── scheduler/
│   ├── storage/
│   └── main.py
│
├── rag/
│   ├── ingestion/
│   ├── chunking/
│   ├── embeddings/
│   ├── retrieval/
│   ├── reranking/
│   └── pipeline/
│
├── data/
│   ├── seeds/
│   │   └── sources.yaml
│   ├── fixtures/
│   └── samples/
│
├── scripts/
│
├── docs/
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── README.md
└── BUILD.md
```

The agent may improve the organization if necessary, but should preserve the separation of concerns.

---

# 13. DATABASE ARCHITECTURE

Use PostgreSQL as the primary source of truth for structured information.

Core entities:

```text
Source
Page
Portal
Event
Notice
Project
Organization
Opportunity
Document
DocumentChunk
Contact
Category
Tag
```

Relationships:

```text
Source
 │
 ├── Pages
 ├── Portals
 ├── Events
 ├── Notices
 ├── Projects
 └── Documents

Organization
 │
 ├── Events
 └── Projects

Document
 │
 └── DocumentChunks
```

---

# 14. SOURCE TABLE

Fields:

```text
id
name
base_url
source_type
description
crawl_enabled
crawl_frequency
allowed_paths
blocked_paths
verification_status
created_at
updated_at
last_crawled_at
```

Source types:

```text
OFFICIAL
DEPARTMENT
ORGANIZATION
STUDENT
COMMUNITY
EXTERNAL
```

---

# 15. PAGE TABLE

Fields:

```text
id
source_id
url
canonical_url
title
description
content
content_hash
content_type
status_code
last_crawled_at
last_modified_at
created_at
updated_at
```

Pages represent raw/normalized crawled web content.

---

# 16. PORTAL TABLE

Fields:

```text
id
name
description
url
category_id
source_id
verification_status
last_verified_at
created_at
updated_at
```

Example categories:

```text
Academic
Examination
Student
Library
Administration
Career
Finance
Other
```

---

# 17. EVENT TABLE

Fields:

```text
id
title
description
start_time
end_time
venue
organizer
category_id
registration_url
source_id
source_url
verification_status
status
created_at
updated_at
```

Event status:

```text
UPCOMING
ONGOING
COMPLETED
CANCELLED
ARCHIVED
```

---

# 18. NOTICE TABLE

Fields:

```text
id
title
description
category_id
priority
published_at
expires_at
source_id
source_url
document_id
verification_status
status
created_at
updated_at
```

Priority:

```text
NORMAL
IMPORTANT
URGENT
```

---

# 19. PROJECT TABLE

Fields:

```text
id
title
description
team
department
year
technologies
github_url
demo_url
documentation_url
organization_id
source_id
verification_status
created_at
updated_at
```

---

# 20. ORGANIZATION TABLE

Fields:

```text
id
name
description
type
department
website_url
social_links
contact
source_id
verification_status
created_at
updated_at
```

Types:

```text
CLUB
LAB
CHAPTER
COMMUNITY
SOCIETY
STUDENT_ORGANIZATION
OTHER
```

---

# 21. DOCUMENT TABLE

Fields:

```text
id
title
description
document_type
file_url
source_url
source_id
published_at
content_hash
page_count
extracted_text
verification_status
created_at
updated_at
```

---

# 22. DOCUMENT CHUNK TABLE

Fields:

```text
id
document_id
chunk_index
content
section
page_number
embedding
metadata
created_at
```

Metadata:

```text
source_url
document_title
source_type
```

---

# 23. VERIFICATION MODEL

Every content object should support:

```text
DISCOVERED
PENDING_REVIEW
VERIFIED
PUBLISHED
REJECTED
ARCHIVED
```

Typical automated flow:

```text
Crawler
  ↓
DISCOVERED
  ↓
PENDING_REVIEW
  ↓
VERIFIED
  ↓
PUBLISHED
```

For trusted official sources, the system may have a configurable fast-track workflow.

Do not make every automatically discovered item appear authoritative without appropriate validation.

---

# 24. SOURCE PROVENANCE

Every important record must retain:

```text
source_id
source_url
source_type
last_crawled_at
last_verified_at
```

Example:

```json
{
  "title": "AI Workshop",
  "source_type": "OFFICIAL",
  "source_url": "https://example.edu/events/ai-workshop",
  "last_verified_at": "2026-09-29T10:00:00"
}
```

The frontend must expose this information.

---

# 25. CRAWLER DESIGN

The crawler is a separate subsystem.

Pipeline:

```text
Source Registry
      ↓
URL Discovery
      ↓
URL Queue
      ↓
Fetcher
      ↓
Content Detector
      ↓
HTML/PDF Parser
      ↓
Normalizer
      ↓
Classifier
      ↓
Entity Extractor
      ↓
Deduplicator
      ↓
Change Detector
      ↓
Database
      ↓
Review Queue
```

---

# 26. SOURCE DISCOVERY

Begin with verified seed sources.

Create:

```text
data/seeds/sources.yaml
```

Each source should specify:

```yaml
name:
base_url:
source_type:
crawl_enabled:
allowed_paths:
blocked_paths:
crawl_frequency:
```

The crawler must not discover arbitrary websites without scope controls.

---

# 27. DOMAIN ALLOWLIST

Implement an explicit domain allowlist.

The crawler may:

- Crawl approved domains.
- Follow internal links.
- Store external links as references.

The crawler should not recursively crawl unrelated external websites.

---

# 28. ROBOTS AND CRAWLING POLICY

Before crawling:

1. Check `robots.txt`.
2. Respect crawl restrictions.
3. Respect reasonable rate limits.
4. Use a descriptive User-Agent.
5. Avoid aggressive concurrency.
6. Do not bypass authentication.
7. Do not bypass technical access controls.

Suggested User-Agent:

```text
SRMAPWikiBot/1.0
```

---

# 29. FETCHING STRATEGY

Use normal HTTP requests first.

```text
httpx
```

Use Playwright only for public pages that require client-side rendering.

Do not use Playwright as the default fetcher.

---

# 30. URL NORMALIZATION

Normalize:

```text
Trailing slash
Protocol
Fragments
Tracking parameters
Relative paths
Canonical URLs
```

Store:

```text
original_url
canonical_url
```

---

# 31. HTML EXTRACTION

Extract:

```text
Title
Description
Headings
Main content
Links
Dates
Metadata
Structured data
```

Remove:

```text
Navigation
Footer
Scripts
Styles
Cookie banners
Repeated menus
Advertisements
```

Prefer the main article/content region.

---

# 32. STRUCTURED DATA EXTRACTION

Check for:

```text
Schema.org
JSON-LD
OpenGraph
Meta tags
```

Event pages may contain structured fields such as:

```text
name
startDate
endDate
location
organizer
url
```

Use these where available.

---

# 33. PDF PROCESSING

When a PDF is found:

```text
Download
 ↓
Validate
 ↓
Extract metadata
 ↓
Extract text
 ↓
Detect pages
 ↓
Normalize
 ↓
Store
 ↓
Chunk
 ↓
Embed
```

Use PyMuPDF.

If extraction fails:

```text
OCR_REQUIRED
```

Do not create empty RAG documents.

---

# 34. EVENT EXTRACTION

Extract:

```text
Title
Description
Date
Start time
End time
Venue
Organizer
Registration URL
Source
```

Extraction priority:

```text
1. Structured HTML metadata
2. Explicit page fields
3. Deterministic parsing
4. LLM fallback
```

The LLM must not be the only source of date parsing.

---

# 35. NOTICE EXTRACTION

Detect:

```text
Notification
Notice
Circular
Announcement
Academic notice
Examination notice
```

Extract:

```text
Title
Date
Category
Priority
Description
Document
Source
```

---

# 36. PAGE CLASSIFICATION

Classify pages as:

```text
PORTAL
EVENT
NOTICE
DOCUMENT
PROJECT
ORGANIZATION
OPPORTUNITY
DEPARTMENT
CONTACT
GENERAL
IRRELEVANT
```

Prefer deterministic rules.

Use AI classification only where deterministic classification is insufficient.

---

# 37. DEDUPLICATION

Duplicate detection should use:

```text
Canonical URL
Normalized URL
Content hash
Title
Date
Organizer
Venue
Similarity
```

Do not create duplicate event records merely because the same event appears on multiple pages.

---

# 38. CONTENT HASHING

Normalize content:

```text
HTML
 ↓
Extract
 ↓
Normalize whitespace
 ↓
Normalize text
 ↓
SHA-256
```

Store:

```text
content_hash
```

Compare hashes during subsequent crawls.

---

# 39. CHANGE DETECTION

If:

```text
old_hash == new_hash
```

do nothing.

If:

```text
old_hash != new_hash
```

then:

```text
Reprocess
 ↓
Identify changes
 ↓
Update database
 ↓
Record change
 ↓
Trigger review if necessary
```

---

# 40. INCREMENTAL CRAWLING

Do not crawl all sources at the same frequency.

Suggested defaults:

```text
Notices
30–60 minutes

Events
1–3 hours

Announcements
1–3 hours

Dynamic pages
6–12 hours

Static pages
24–72 hours
```

These values must be configurable.

---

# 41. CRAWLER PRIORITIES

Use:

```text
HIGH
Notices
Announcements
Events

MEDIUM
Opportunities
Academic information
Departments

LOW
Static information
Historical pages
```

---

# 42. CRAWLER ERROR HANDLING

Handle:

```text
Timeout
DNS errors
403
404
429
500
502
503
Malformed HTML
Broken PDF
JavaScript failures
Encoding errors
```

The crawler must continue processing other URLs.

---

# 43. RETRY SYSTEM

Use exponential backoff.

```text
Attempt 1
 ↓
Wait
 ↓
Attempt 2
 ↓
Wait longer
 ↓
Attempt 3
 ↓
FAILED
```

Store:

```text
retry_count
last_error
last_attempt_at
```

---

# 44. CRAWLER LOGGING

Every crawl should log:

```text
source
URL
start time
end time
HTTP status
response time
content type
content changed
extraction status
error
retry count
```

---

# 45. LINK HEALTH

Periodically check important stored URLs.

States:

```text
ONLINE
REDIRECTED
BROKEN
TIMEOUT
RESTRICTED
UNKNOWN
```

The admin dashboard must show broken links.

---

# 46. SCHEDULER

The crawler must run independently from the public request cycle.

Correct:

```text
Scheduler
   ↓
Crawler
   ↓
Database
   ↓
Website
```

Incorrect:

```text
User
 ↓
Website
 ↓
Scrape source
 ↓
Answer
```

The website must never wait for a live crawl during a normal request.

---

# 47. SEARCH SYSTEM

Search should combine:

```text
PostgreSQL full-text search
+
structured filters
+
semantic search where useful
```

Search categories:

```text
Portals
Events
Notices
Projects
Organizations
Documents
Opportunities
```

---

# 48. SEARCH API

Implement:

```text
GET /api/v1/search?q=
```

Support:

```text
query
category
date
source_type
department
organization
page
limit
```

Example:

```text
/api/v1/search?q=exam&category=portal
```

---

# 49. SEARCH RESULT RANKING

Rank using:

```text
Exact match
Title match
Description match
Full-text relevance
Semantic similarity
Freshness
Source trust
```

Do not let semantic similarity override obvious exact matches.

---

# 50. SRM AP PULSE

Pulse is the real-time/current information overview.

It should aggregate:

```text
New notices
Today's events
Upcoming events
Upcoming deadlines
Recently added projects
Recently updated sources
```

API:

```text
GET /api/v1/pulse
```

---

# 51. PULSE DATA

Example:

```json
{
  "new_notices": [],
  "today_events": [],
  "upcoming_events": [],
  "deadlines": [],
  "recent_projects": [],
  "recent_changes": []
}
```

---

# 52. FRONTEND PAGE STRUCTURE

Required public routes:

```text
/
 /explore
 /portals
 /portals/[slug]
 /events
 /events/[slug]
 /notices
 /notices/[slug]
 /projects
 /projects/[slug]
 /organizations
 /organizations/[slug]
 /opportunities
 /documents
 /documents/[slug]
 /pulse
 /search
 /ai
 /about
```

Admin:

```text
/admin
/admin/sources
/admin/portals
/admin/events
/admin/notices
/admin/projects
/admin/organizations
/admin/documents
/admin/opportunities
/admin/review
/admin/crawler
/admin/health
/admin/logs
```

---

# 53. HOMEPAGE

The homepage must contain:

```text
Hero
Global Search
Quick Access
SRM AP Pulse
Today's Events
Latest Notices
Upcoming Events
Student Projects
Popular Resources
AI Entry Point
Footer
```

The chatbot must not dominate the page.

---

# 54. HERO

Use:

```text
SRM AP Wiki

Everything SRM AP, in one place.

[ Search SRM AP Wiki... ]
```

Below the search:

```text
Popular:
Exams · LMS · Events · Calendar · Library
```

---

# 55. QUICK ACCESS

Show commonly used portals.

Examples:

```text
Examination
LMS
Library
Academic Calendar
Hostel
Fees
Course Registration
Placements
```

These should be configurable through the database/admin.

Do not hard-code the links into frontend components.

---

# 56. EVENT UX

Events should support:

```text
List
Calendar
Today
This week
This month
Category filters
Organization filters
```

Event cards should show:

```text
Title
Date
Time
Venue
Organizer
Source type
Action
```

---

# 57. NOTICE UX

Notices should support:

```text
Latest
Important
Examination
Academic
Administrative
Other
```

Each notice should show:

```text
Title
Date
Category
Priority
Source
Action
```

---

# 58. PROJECT UX

Projects should support:

```text
Category
Department
Year
Technology
Organization
```

Project cards should show:

```text
Title
Department
Year
Technology
Student Project badge
```

---

# 59. ORGANIZATION UX

Organizations should expose:

```text
Description
Events
Projects
Links
Contact
Source
```

---

# 60. DOCUMENT UX

Documents should show:

```text
Title
Type
Published date
Source
Page count
Open/read action
```

RAG-indexed documents should still provide the original document.

---

# 61. AI ASSISTANT

The AI is a retrieval and navigation interface.

The pipeline:

```text
User Question
      ↓
Intent Router
      ↓
Query Type
      │
      ├── Portal
      ├── Event
      ├── Notice
      ├── Project
      ├── Organization
      ├── Document
      └── RAG
      ↓
Retrieval
      ↓
Context
      ↓
LLM
      ↓
Answer + Sources
```

---

# 62. AI INTENT EXAMPLES

```text
"Where is the examination portal?"
→ PORTAL_LOOKUP

"What events are happening today?"
→ EVENT_SEARCH

"Show AI workshops."
→ EVENT_SEARCH

"Show student AI projects."
→ PROJECT_SEARCH

"What is the attendance rule?"
→ DOCUMENT_RAG

"What changed today?"
→ PULSE_QUERY
```

---

# 63. AI RESPONSE CONTRACT

The AI response should contain:

```text
answer
sources[]
related_results[]
```

Example:

```json
{
  "answer": "The examination registration portal is...",
  "sources": [
    {
      "title": "Examination Portal",
      "url": "...",
      "source_type": "OFFICIAL"
    }
  ]
}
```

---

# 64. AI SOURCE RULE

The AI must never invent a university URL.

Correct:

```text
Database
 ↓
Stored URL
 ↓
AI response
```

Incorrect:

```text
LLM
 ↓
Generated URL
```

If no verified URL exists:

```text
Do not invent one.
```

---

# 65. AI HALLUCINATION CONTROL

For SRM-specific questions:

1. Retrieve relevant Wiki data.
2. Provide retrieved context to the LLM.
3. Require source attribution.
4. If retrieval returns insufficient evidence, say so.
5. Never invent official policies.
6. Never invent events.
7. Never invent contacts.
8. Never invent portal links.

---

# 66. RAG SYSTEM

Use RAG for:

```text
Academic regulations
Handbooks
Circulars
Long PDFs
Guidelines
Official documents
Long-form pages
```

Do not put every structured record into RAG.

---

# 67. RAG PIPELINE

```text
Document
 ↓
Text Extraction
 ↓
Cleaning
 ↓
Structure Detection
 ↓
Semantic Chunking
 ↓
Metadata
 ↓
Embedding
 ↓
pgvector
```

---

# 68. RAG METADATA

Every chunk must retain:

```text
document_id
source_url
document_title
section
page_number
source_type
chunk_index
```

This is necessary for source attribution.

---

# 69. RAG RETRIEVAL

Query:

```text
User question
 ↓
Embedding
 ↓
Vector search
 ↓
Optional keyword search
 ↓
Reranking
 ↓
Top relevant chunks
 ↓
LLM
```

Use hybrid retrieval where practical.

---

# 70. ADMIN SYSTEM

The admin dashboard controls the information layer.

Dashboard should show:

```text
Total portals
Total events
Total notices
Total projects
Total organizations
Total documents
Pending review
Broken links
Failed crawls
Recently changed sources
```

---

# 71. ADMIN REVIEW QUEUE

The review queue is critical.

Example:

```text
PENDING REVIEW

AI Workshop
Source: official website
Detected: 10:20 AM

[View]
[Edit]
[Approve]
[Reject]
```

The reviewer should be able to compare extracted data with the original source.

---

# 72. ADMIN CRUD

Implement CRUD for:

```text
Portals
Events
Notices
Projects
Organizations
Opportunities
Documents
Sources
```

---

# 73. USER SUBMISSIONS

Future-ready submission endpoints:

```text
Submit Event
Submit Project
Submit Organization
Suggest Portal
Report Broken Link
```

Default:

```text
PENDING_REVIEW
```

No direct public publishing.

---

# 74. SOURCE TRUST

Display source categories clearly:

```text
OFFICIAL
DEPARTMENT
ORGANIZATION
STUDENT
COMMUNITY
EXTERNAL
```

The UI must never make a student-submitted source visually indistinguishable from an official source.

---

# 75. FRESHNESS

Store and display:

```text
Published
Updated
Last crawled
Last verified
```

Examples:

```text
Updated 20 minutes ago
Last verified today
Published yesterday
```

---

# 76. EVENT LIFECYCLE

Events automatically transition:

```text
UPCOMING
 ↓
ONGOING
 ↓
COMPLETED
 ↓
ARCHIVED
```

The frontend should automatically place events into appropriate sections.

---

# 77. NOTICE LIFECYCLE

Notices:

```text
ACTIVE
 ↓
EXPIRED
 ↓
ARCHIVED
```

Do not remove historical notices unnecessarily.

---

# 78. FRONTEND COMPONENT SYSTEM

Build reusable components.

Required:

```text
Header
MobileNavigation
SearchBar
SearchResults
FilterBar
SectionHeader
PortalCard
EventCard
NoticeCard
ProjectCard
OrganizationCard
DocumentCard
OpportunityCard
SourceBadge
VerificationBadge
StatusBadge
PulseCard
Breadcrumbs
Pagination
Skeleton
EmptyState
ErrorState
Modal
Drawer
BottomSheet
AIMessage
AISourceCard
```

Do not duplicate nearly identical components.

---

# 79. DESIGN SYSTEM

Use centralized design tokens:

```text
Colors
Typography
Spacing
Radius
Shadows
Breakpoints
Transitions
```

Do not scatter arbitrary values throughout the application.

---

# 80. VISUAL STYLE

The visual language should be:

```text
Clean
Modern
Academic
Minimal
Information-focused
Professional
```

Avoid:

```text
Excessive gradients
Huge hero illustrations
Excessive glassmorphism
Heavy animations
Overly rounded interfaces
ChatGPT clone appearance
```

---

# 81. COLOR SYSTEM

Define semantic variables:

```text
background
surface
surface-secondary
text-primary
text-secondary
border
accent
success
warning
danger
```

Use color for semantic meaning rather than decoration.

---

# 82. RESPONSIVE DESIGN

Required:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Suggested:

```text
< 640px
640–1024px
1024px+
1440px+
```

The application must remain functional at every breakpoint.

---

# 83. MOBILE NAVIGATION

Bottom navigation:

```text
Home
Explore
Pulse
Search
AI
```

Use Explore for secondary sections.

---

# 84. DESKTOP NAVIGATION

Desktop:

```text
SRM AP Wiki

Explore
Events
Notices
Projects
Pulse

Search
Ask AI
```

Keep navigation concise.

---

# 85. ACCESSIBILITY

Implement:

```text
Semantic HTML
Keyboard navigation
Focus states
ARIA labels
Accessible forms
Readable contrast
Screen reader compatibility
Alt text
```

Do not rely solely on color.

---

# 86. PERFORMANCE

Optimize:

```text
Server rendering
Caching
Pagination
Lazy loading
Image optimization
Search debouncing
API response caching
```

Do not load thousands of records into the browser.

---

# 87. API DESIGN

Base:

```text
/api/v1
```

Public endpoints:

```text
GET /api/v1/search
GET /api/v1/portals
GET /api/v1/events
GET /api/v1/notices
GET /api/v1/projects
GET /api/v1/organizations
GET /api/v1/opportunities
GET /api/v1/documents
GET /api/v1/pulse
POST /api/v1/ai/chat
```

Admin:

```text
/api/v1/admin/*
```

---

# 88. API REQUIREMENTS

Use:

```text
Pydantic validation
Pagination
Filtering
Sorting
Consistent errors
HTTP status codes
OpenAPI documentation
```

Example error:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Event not found"
  }
}
```

---

# 89. SECURITY

Never commit:

```text
API keys
Database passwords
Admin credentials
Tokens
Secrets
```

Use:

```text
.env
```

and provide:

```text
.env.example
```

Admin endpoints must be authenticated.

---

# 90. AUTHENTICATION

Public browsing should not require authentication.

Admin functionality must require authentication.

Future optional user accounts may support:

```text
Bookmarks
Personalization
Notifications
Submission history
```

but these are not required for MVP.

---

# 91. DATABASE MIGRATIONS

Use Alembic.

Every schema change must be represented as a migration.

Do not manually modify production database schemas.

---

# 92. TESTING STRATEGY

Tests must exist for:

## Backend

```text
Models
Repositories
Services
API endpoints
Validation
Search
```

## Crawler

```text
URL normalization
robots handling
HTML parsing
PDF parsing
Event extraction
Notice extraction
Deduplication
Hashing
Change detection
```

## RAG

```text
Chunking
Embedding
Retrieval
Metadata preservation
Source attribution
```

## Frontend

```text
Navigation
Search
Filters
Rendering
Responsive behavior
AI interaction
Error states
```

---

# 93. TEST FIXTURES

Do not make automated tests dependent on live university websites.

Create:

```text
data/fixtures/
```

with:

```text
event.html
notice.html
portal.html
sample.pdf
```

Tests should operate on deterministic fixtures.

---

# 94. MOCK DATA

The application should initially support development with seed/mock data.

Create realistic records for:

```text
5 portals
5 events
5 notices
5 projects
3 organizations
3 documents
```

These are development fixtures only.

Clearly mark them as mock data.

Do not present mock data as real SRM AP information.

---

# 95. DEVELOPMENT ENVIRONMENT

Provide Docker Compose for:

```text
PostgreSQL
pgvector
```

The README must document:

```text
Install dependencies
Configure .env
Start database
Run migrations
Seed database
Start backend
Start frontend
Run crawler
Run tests
```

---

# 96. OBSERVABILITY

Track:

```text
Crawler runs
Crawler failures
HTTP status
Response time
Extraction errors
Database errors
AI errors
Search errors
```

Admin should have basic visibility into system health.

---

# 97. LOGGING RULES

Logs should be structured.

Include:

```text
timestamp
service
operation
URL where applicable
status
error
duration
```

Never log:

```text
API keys
Passwords
Authentication tokens
Private user data
```

---

# 98. ERROR HANDLING

Frontend:

```text
Friendly error message
Retry action
```

Backend:

```text
Structured error
Appropriate HTTP status
Useful server logs
```

Crawler:

```text
Record failure
Retry where appropriate
Continue other jobs
```

AI:

```text
Graceful fallback
Explain that information was not found
Do not hallucinate
```

---

# 99. SEO

Public content should have:

```text
Unique title
Description
Canonical URL
OpenGraph metadata
Structured data where appropriate
```

Important SEO pages:

```text
Events
Notices
Projects
Organizations
Portals
Documents
```

---

# 100. URL DESIGN

Use human-readable URLs.

Correct:

```text
/events/ai-workshop
/notices/examination-schedule
/projects/campus-navigation
/organizations/robotics-club
/portals/examination
```

Avoid:

```text
/events?id=381
```

for public canonical URLs.

---

# 101. CACHING

Cache frequently requested public data:

```text
Events
Notices
Pulse
Portals
Search where practical
```

Invalidate cache when content changes.

Do not cache admin mutations indefinitely.

---

# 102. DATA FRESHNESS STRATEGY

The system should separate:

```text
Freshness
Verification
Authority
```

Example:

```text
Updated 5 minutes ago
Official
Verified
```

is different from:

```text
Updated 5 minutes ago
Student
Pending
```

Do not use freshness alone to imply trust.

---

# 103. NOTIFICATION ARCHITECTURE

The system should eventually support:

```text
New notice
New event
Deadline approaching
Source changed
Important announcement
```

For MVP, implement the data model and Pulse.

Browser/email notifications can be added after the core platform works.

---

# 104. CHANGE FEED

Create a change/event record system.

Examples:

```text
NEW_NOTICE
NEW_EVENT
UPDATED_NOTICE
UPDATED_EVENT
NEW_PROJECT
NEW_DOCUMENT
SOURCE_CHANGED
LINK_BROKEN
```

This powers:

```text
SRM AP Pulse
What's New
Admin Dashboard
Notifications
```

---

# 105. SOURCE CHANGE WORKFLOW

```text
Source crawled
      ↓
Content changed
      ↓
Change detected
      ↓
Determine type
      ↓
Create change event
      ↓
Update knowledge base
      ↓
Review if required
      ↓
Pulse
```

---

# 106. ADMIN SYSTEM HEALTH

Show:

```text
Crawler
 ├── Running
 ├── Last successful run
 ├── Failed runs
 └── Queue size

Sources
 ├── Active
 ├── Broken
 └── Changed

Database
 ├── Records
 └── Errors

AI
 ├── Requests
 └── Failures
```

---

# 107. AGENTIC IDE DEVELOPMENT RULE

The coding agent must not attempt to generate the entire application in one uncontrolled pass.

Use this loop:

```text
READ
 ↓
PLAN
 ↓
IMPLEMENT
 ↓
RUN
 ↓
TEST
 ↓
INSPECT
 ↓
FIX
 ↓
DOCUMENT
 ↓
NEXT PHASE
```

---

# 108. PHASE 0 — REPOSITORY INSPECTION

Before writing code:

1. Inspect the repository.
2. Check existing files.
3. Check package managers.
4. Check existing configuration.
5. Check Git status.
6. Check existing environment files.
7. Check whether frontend/backend already exist.
8. Preserve useful existing work.
9. Do not overwrite files blindly.

Then produce a short implementation plan internally before modifying the repository.

---

# 109. PHASE 1 — PROJECT FOUNDATION

Implement:

```text
Repository structure
Frontend setup
Backend setup
PostgreSQL
pgvector
Environment configuration
Docker Compose
Alembic
Basic API
Basic health endpoint
```

Health:

```text
GET /health
```

Expected:

```json
{
  "status": "ok"
}
```

---

# 110. PHASE 2 — DATABASE

Implement:

```text
Source
Page
Portal
Event
Notice
Project
Organization
Opportunity
Document
DocumentChunk
Category
Tag
```

Create:

```text
SQLAlchemy models
Pydantic schemas
Alembic migrations
Repositories
```

Test CRUD.

---

# 111. PHASE 3 — SOURCE REGISTRY

Implement:

```text
data/seeds/sources.yaml
```

Create source management functionality.

Admin should eventually be able to:

```text
Add source
Edit source
Enable/disable crawling
Set crawl frequency
Define paths
```

---

# 112. PHASE 4 — CRAWLER MVP

Implement:

```text
HTTP fetcher
robots handling
domain allowlist
URL normalization
link extraction
HTML extraction
content hashing
database storage
logging
retry system
```

Do not build advanced AI extraction yet.

First prove that basic crawling works.

---

# 113. PHASE 5 — CONTENT EXTRACTION

Implement:

```text
Event extraction
Notice extraction
Portal extraction
Document detection
PDF extraction
```

Test against local fixtures.

---

# 114. PHASE 6 — CHANGE DETECTION

Implement:

```text
Content hashes
Previous version comparison
Change records
Updated timestamps
Incremental processing
```

Test:

```text
same content → no update

changed content → update
```

---

# 115. PHASE 7 — PUBLIC WEBSITE

Implement:

```text
Homepage
Explore
Portals
Events
Notices
Projects
Organizations
Documents
Opportunities
Pulse
Search
```

Use mock/seed data initially.

---

# 116. PHASE 8 — SEARCH

Implement:

```text
Full-text search
Filters
Pagination
Ranking
Category filtering
```

Then integrate semantic search where beneficial.

---

# 117. PHASE 9 — RAG

Implement:

```text
Document ingestion
Cleaning
Chunking
Metadata
Embeddings
pgvector
Retrieval
Optional reranking
```

Test with sample documents.

---

# 118. PHASE 10 — AI

Implement:

```text
Intent router
Structured retrieval
RAG retrieval
LLM provider
Source formatting
Conversation history
Fallback behavior
```

Test with predefined queries.

---

# 119. PHASE 11 — ADMIN

Implement:

```text
Admin authentication
Dashboard
CRUD
Review queue
Source management
Crawler status
Link health
```

---

# 120. PHASE 12 — PRODUCTION HARDENING

Implement:

```text
Validation
Error handling
Security
Rate limiting where necessary
Caching
Logging
Testing
Responsive design
Accessibility
SEO
Performance optimization
```

---

# 121. ACCEPTANCE TEST — HOMEPAGE

The homepage passes when:

- [ ] SRM AP Wiki branding is visible.
- [ ] Search is immediately accessible.
- [ ] Quick links are visible.
- [ ] Pulse is visible.
- [ ] Today's events are visible.
- [ ] Latest notices are visible.
- [ ] Student projects are discoverable.
- [ ] AI entry point exists.
- [ ] Page works on mobile.
- [ ] No fake production data is displayed.

---

# 122. ACCEPTANCE TEST — SEARCH

Search passes when:

- [ ] User can search.
- [ ] Results are grouped.
- [ ] Filters work.
- [ ] Pagination works.
- [ ] Search handles no results.
- [ ] Result URLs work.
- [ ] Source type is displayed.
- [ ] Search does not fabricate results.

---

# 123. ACCEPTANCE TEST — EVENTS

Events pass when:

- [ ] Events can be listed.
- [ ] Events can be filtered.
- [ ] Event details work.
- [ ] Dates are correct.
- [ ] Source is displayed.
- [ ] Registration URL works where available.
- [ ] Past events are separated.
- [ ] Upcoming events appear in Pulse.

---

# 124. ACCEPTANCE TEST — NOTICES

Notices pass when:

- [ ] Notices can be listed.
- [ ] Categories work.
- [ ] Priority works.
- [ ] Publication date appears.
- [ ] Original source appears.
- [ ] Documents can be opened.
- [ ] Archived notices remain accessible where appropriate.

---

# 125. ACCEPTANCE TEST — CRAWLER

Crawler passes when:

- [ ] Source registry works.
- [ ] Domain restrictions work.
- [ ] robots.txt is respected.
- [ ] HTML extraction works.
- [ ] PDF extraction works.
- [ ] URLs are normalized.
- [ ] Duplicate content is detected.
- [ ] Content hashes work.
- [ ] Changes are detected.
- [ ] Failures are retried.
- [ ] Errors are logged.
- [ ] Crawler does not crash on one bad URL.

---

# 126. ACCEPTANCE TEST — RAG

RAG passes when:

- [ ] Documents can be ingested.
- [ ] Text can be extracted.
- [ ] Documents are chunked.
- [ ] Embeddings are stored.
- [ ] Retrieval works.
- [ ] Relevant chunks are returned.
- [ ] Source metadata is preserved.
- [ ] AI can cite the original document.

---

# 127. ACCEPTANCE TEST — AI

AI passes when:

- [ ] Portal questions work.
- [ ] Event questions work.
- [ ] Notice questions work.
- [ ] Project questions work.
- [ ] Document questions work.
- [ ] Follow-up questions work.
- [ ] Sources are shown.
- [ ] Original URLs are used.
- [ ] Unknown questions produce a safe fallback.
- [ ] AI does not invent SRM AP URLs.
- [ ] AI does not invent university policies.
- [ ] AI does not invent events.

---

# 128. ACCEPTANCE TEST — ADMIN

Admin passes when:

- [ ] Authentication works.
- [ ] Dashboard works.
- [ ] Content can be created.
- [ ] Content can be edited.
- [ ] Content can be archived.
- [ ] Sources can be managed.
- [ ] Pending content can be reviewed.
- [ ] Crawler health is visible.
- [ ] Broken links are visible.

---

# 129. SECURITY ACCEPTANCE

The system must satisfy:

- [ ] `.env` is ignored.
- [ ] Secrets are not committed.
- [ ] Admin endpoints require authentication.
- [ ] Input validation exists.
- [ ] Private information is not scraped.
- [ ] Authentication bypass is impossible through the crawler.
- [ ] Logs do not contain secrets.
- [ ] External URLs are validated.
- [ ] File uploads are validated if implemented.

---

# 130. PERFORMANCE ACCEPTANCE

The application should:

- Avoid unnecessary client-side JavaScript.
- Avoid fetching thousands of records at once.
- Use pagination.
- Use caching where appropriate.
- Debounce search.
- Lazy-load expensive components.
- Keep crawler workloads separate from user requests.
- Avoid running an LLM request when a simple database query can answer the question.

---

# 131. IMPORTANT AI ARCHITECTURE RULE

Do not send every user question directly to the LLM.

Correct:

```text
User
 ↓
Intent Router
 ↓
Determine information source
 ↓
Database / Search / RAG
 ↓
Retrieve evidence
 ↓
LLM
 ↓
Answer
```

Not:

```text
User
 ↓
LLM
 ↓
Guess
```

---

# 132. IMPORTANT DATA ARCHITECTURE RULE

Do not put every piece of information into the vector database.

Use:

```text
PostgreSQL
→ Events
→ Notices
→ Portals
→ Projects
→ Organizations
→ Opportunities

RAG / pgvector
→ Regulations
→ Handbooks
→ PDFs
→ Long-form documents
```

---

# 133. IMPORTANT CRAWLER RULE

Do not build a crawler that blindly downloads the entire SRM AP internet.

Use:

```text
Source Registry
      ↓
Allowed Domains
      ↓
Allowed Paths
      ↓
Relevant Content
```

---

# 134. IMPORTANT TRUST RULE

The following are different:

```text
Official
Student
Organization
Community
External
```

Never flatten them into one generic "SRM AP" source.

The user must be able to understand where information originated.

---

# 135. IMPORTANT SOURCE RULE

Every important item should have:

```text
Original URL
Source type
Last crawled
Last verified
```

The Wiki is an aggregator.

The original source remains authoritative.

---

# 136. IMPORTANT FRONTEND RULE

Do not make the website look like a chatbot.

The visual hierarchy should be:

```text
SRM AP Wiki
 ↓
Search
 ↓
Information
 ↓
Events / Notices / Projects
 ↓
AI
```

not:

```text
AI CHAT
 ↓
Everything else
```

---

# 137. IMPORTANT UX RULE

A user should be able to accomplish common tasks without AI.

For example:

```text
Find exam portal
→ Explore → Portals → Examination

Find today's events
→ Events → Today

Find latest notices
→ Notices → Latest

Find student projects
→ Projects
```

AI should provide a faster alternative.

---

# 138. IMPORTANT DEVELOPMENT RULE

Do not add infrastructure merely because it is popular.

Start with:

```text
Next.js
FastAPI
PostgreSQL
pgvector
Python crawler
```

Only introduce:

```text
Redis
Celery
Elasticsearch
Kafka
Kubernetes
microservices
```

when the actual requirements justify them.

The MVP should remain understandable by a small student development team.

---

# 139. DEFINITION OF COMPLETE MVP

The MVP is complete when a new user can:

```text
Open SRM AP Wiki
      ↓
Search "exam"
      ↓
Find the examination portal
      ↓
Open the original source

OR

Open Pulse
      ↓
See today's events
      ↓
Open an event
      ↓
Register

OR

Ask AI:
"Are there any AI workshops this week?"
      ↓
Receive actual matching events
      ↓
See their sources
      ↓
Open the original event

OR

Search:
"academic regulations"
      ↓
Find the document
      ↓
Ask AI about its contents
      ↓
Receive an answer
      ↓
Open the original document
```

All four workflows must work before the project is considered a functional MVP.

---

# 140. FINAL ARCHITECTURE

The final system should conceptually be:

```text
                         ┌──────────────────────┐
                         │      SRM AP WIKI     │
                         │      FRONTEND        │
                         └──────────┬───────────┘
                                    │
                         ┌──────────▼───────────┐
                         │       SEARCH         │
                         │       BROWSE         │
                         │       AI              │
                         └──────────┬───────────┘
                                    │
                         ┌──────────▼───────────┐
                         │       FASTAPI        │
                         │       BACKEND        │
                         └──────────┬───────────┘
                                    │
               ┌────────────────────┼────────────────────┐
               │                    │                    │
               ▼                    ▼                    ▼
        ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
        │ PostgreSQL  │      │   Search    │      │     RAG     │
        │             │      │             │      │             │
        │ Events      │      │ Full text   │      │ Documents   │
        │ Notices     │      │ Semantic    │      │ Chunks      │
        │ Portals     │      │ Filters     │      │ Embeddings  │
        │ Projects    │      └─────────────┘      └─────────────┘
        │ Orgs        │
        └──────▲──────┘
               │
        ┌──────┴──────┐
        │ DATA LAYER  │
        └──────▲──────┘
               │
     ┌─────────┼──────────────┐
     │         │              │
     ▼         ▼              ▼
 Websites    PDFs        Submissions
     │         │              │
     └─────────┼──────────────┘
               ▼
           CRAWLER
               │
               ▼
          EXTRACTION
               │
               ▼
         NORMALIZATION
               │
               ▼
        CLASSIFICATION
               │
               ▼
         DEDUPLICATION
               │
               ▼
        CHANGE DETECTION
               │
               ▼
          VERIFICATION
               │
               ▼
         KNOWLEDGE BASE
```

---

# 141. FINAL PRODUCT PRINCIPLE

The entire project should follow this rule:

> **Collect once, structure properly, verify appropriately, index intelligently, and expose the information through both a normal website and natural-language AI.**

The final product is not:

> "An AI that knows SRM AP."

The final product is:

> **SRM AP Wiki — a continuously updated information layer for the SRM University–AP ecosystem.**

The AI is simply the fastest way to navigate that information layer.

---

# 142. AGENT COMPLETION INSTRUCTION

When all implementation phases are complete, the coding agent must verify:

```text
Frontend starts
Backend starts
Database starts
Migrations work
Seed data works
Crawler works
Search works
Events work
Notices work
Projects work
Pulse works
RAG works
AI works
Admin works
Tests pass
Mobile layout works
No secrets are committed
No private data is collected
No fabricated URLs exist
Documentation is updated
```

Only after these checks should the project be considered **MVP COMPLETE**.

---

# 143. FINAL COMMAND TO THE IMPLEMENTATION AGENT

Build **SRM AP Wiki** as a real information platform.

Do not build a chatbot demo.

Do not fabricate university information.

Do not hard-code the entire application around example data.

Do not make the frontend dependent on live scraping.

Do not bypass authentication or access restrictions.

Do not mix official and unofficial information without labeling it.

Build the system in phases.

Test each phase.

Preserve provenance.

Keep the architecture maintainable.

The final user experience must be:

```text
                SRM AP WIKI

         Everything SRM AP,
              in one place.

                 SEARCH
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
      PORTALS     EVENTS      NOTICES
        │           │           │
        └───────────┼───────────┘
                    ▼
                 PULSE
                    │
                    ▼
              PROJECTS / ORGS
                    │
                    ▼
                 DOCUMENTS
                    │
                    ▼
                   AI
                    │
                    ▼
          VERIFIED INFORMATION
                    │
                    ▼
             ORIGINAL SOURCE
```

**This is the target product.**