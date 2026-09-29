# 04_SCRAPING_AND_DATA_SPEC.md

# Scraping & Data Specification

## 1. Purpose

The system collects, normalizes, verifies, and indexes publicly available SRM University-AP information so users can find the correct resource, event, announcement, project, or portal from one place.

The system is a **resource aggregation and navigation platform**.

It is not intended to replace SRM AP's official websites or authenticated portals.

The platform should always preserve the original source URL.

---

# 2. Data Source Hierarchy

Sources are divided into trust levels.

## Tier 1 — Official SRM AP

Highest priority.

Examples:

- `srmap.edu.in`
- Official SRM AP subdomains
- Official department pages
- Official event pages
- Official notices/announcements
- Official university social accounts
- Official research/lab pages
- Official admission pages
- Official portal pages

These sources should receive the highest retrieval priority.

### Example

```text
source_type = official
trust_level = 1
verified = true
```

---

## Tier 2 — Institutional / Government Sources

Examples:

- Shodhganga
- DigiLocker
- Government scholarship portals
- National academic repositories
- Official accreditation/research databases

These are trusted external resources associated with university processes.

```text
source_type = institutional
trust_level = 2
```

---

## Tier 3 — Student / Club / Community Resources

Examples:

- Student GitHub repositories
- Student project websites
- Student organizations
- Club pages
- Hackathon/project repositories
- Student-maintained documentation

These should be clearly labeled.

```text
source_type = community
trust_level = 3
```

They must never be presented as official SRM AP information unless independently verified.

---

# 3. Crawl Scope

The crawler should initially cover:

```text
srmap.edu.in
├── Academics
├── Admissions
├── Schools
├── Departments
├── Programs
├── Research
├── Laboratories
├── Student Resources
├── Faculty Resources
├── Events
├── News
├── Announcements
├── Notices
├── Library
├── Careers
├── Contact
└── Other public resources
```

The crawler should also discover relevant SRM AP subdomains.

---

# 4. What Should NOT Be Crawled

Do not attempt to crawl private or authenticated user information.

Examples:

- Student grades
- Personal attendance
- Private ERP data
- Password-protected pages
- Personal student information
- Private faculty information
- Authentication tokens
- Cookies
- Session data

The platform should only index public information and publicly accessible resource destinations.

For authenticated portals, store the portal's public login URL and describe what the portal is used for.

---

# 5. Resource Metadata

Every resource should be normalized into a structured record.

```json
{
  "id": "student-portal",
  "title": "Student Portal",
  "url": "https://...",
  "description": "SRM AP student services portal",
  "type": "portal",
  "category": "student-services",
  "audience": ["students"],
  "source_type": "official",
  "trust_level": 1,
  "tags": [
    "student",
    "erp",
    "fees",
    "academics"
  ],
  "last_crawled": "2026-09-29T10:00:00Z",
  "last_verified": "2026-09-29T10:00:00Z",
  "status": "active"
}
```

---

# 6. Resource Types

Use a controlled vocabulary.

```text
portal
department
school
program
admission
research
laboratory
project
publication
library
event
workshop
seminar
announcement
notification
club
student-organization
service
document
external-resource
social
contact
```

Avoid creating arbitrary categories for every page.

---

# 7. Events Data Model

Events require additional fields.

```json
{
  "title": "Workshop Name",
  "description": "Workshop description",
  "event_type": "workshop",
  "organizer": "Department / Club",
  "source_type": "official",
  "start_time": "2026-10-05T10:00:00",
  "end_time": "2026-10-05T16:00:00",
  "venue": "SRM AP Campus",
  "registration_url": "...",
  "source_url": "...",
  "registration_deadline": "...",
  "status": "upcoming"
}
```

Supported event states:

```text
upcoming
ongoing
completed
cancelled
postponed
unknown
```

---

# 8. Announcements & Notifications

Announcements should have:

```text
title
summary
source_url
published_at
expiry_at
source_type
priority
category
status
```

Priority:

```text
normal
important
urgent
```

Examples of potentially urgent information:

- Exam changes
- Campus closure
- Emergency notices
- Deadline changes
- Important administrative announcements

The platform should never invent urgency.

Urgency must come from the source or a defined editorial rule.

---

# 9. Freshness

Different data types require different refresh intervals.

| Data | Suggested Refresh |
|---|---:|
| Emergency announcements | 15–30 min |
| Events | 1–6 hours |
| News | 6–12 hours |
| Portals | Daily |
| Departments | Daily |
| Programs | Daily |
| Static resources | Weekly |
| Student projects | Weekly/monthly |

Every indexed item should contain:

```text
last_crawled
last_verified
next_check
```

---

# 10. Link Verification

For every URL:

```text
HTTP status
redirect destination
response time
content availability
last successful check
```

Possible states:

```text
active
redirected
temporarily_unavailable
not_found
blocked
unknown
```

A broken link should not immediately be deleted.

Instead:

```text
status = not_found
needs_review = true
```

This prevents temporary outages from destroying the dataset.

---

# 11. Duplicate Detection

The crawler should detect duplicate URLs and duplicate content.

Normalize:

```text
https://example.com
https://example.com/
```

as the same canonical URL when appropriate.

For content duplication, calculate a content hash:

```text
content_hash
```

If the hash has not changed, the system does not need to re-embed the content.

---

# 12. Chunking

Long pages should not be stored as one giant chunk.

Recommended hierarchy:

```text
Page
 ↓
Section
 ↓
Paragraph
 ↓
Chunk
```

Each chunk should retain metadata:

```json
{
  "chunk_id": "...",
  "document_id": "...",
  "text": "...",
  "title": "...",
  "section": "...",
  "url": "...",
  "source_type": "official",
  "category": "academics"
}
```

Do not use only:

```text
chunk_1
chunk_2
chunk_3
```

without source metadata.

The AI must always be able to trace a retrieved chunk back to its original page.

---

# 13. Embeddings

Only information useful for semantic retrieval should be embedded.

Examples:

```text
department descriptions
program descriptions
portal descriptions
event descriptions
project descriptions
announcements
FAQs
```

Do not embed sensitive or authenticated data.

---

# 14. Database vs Vector Database

Use SQL for structured entities.

```text
resources
events
announcements
departments
projects
sources
crawl_logs
```

Use vector search for semantic text retrieval.

```text
documents
chunks
embeddings
```

The two systems should work together.

Example:

```text
User:
"What workshops are happening this week?"

        ↓

SQL
        ↓
Events filtered by date

        ↓

Relevant events
```

Whereas:

```text
User:
"Where do I access my academic services?"

        ↓

Semantic retrieval
        ↓

Relevant portal/resource chunks
```

---

# 15. Data Quality Rules

Every resource should have:

- Valid URL
- Title
- Resource type
- Source type
- Verification status
- Last verified timestamp

Official resources should additionally have:

- Official-domain verification
- Canonical URL
- Relevant category

Student/community resources should additionally have:

- Clearly identified ownership/source
- Community label
- Original project URL

---

# 16. Golden Rule

The database is the source of truth for the application.

The AI should not invent:

- URLs
- Events
- Deadlines
- University policies
- Portal names
- Announcements

If the system cannot find reliable information:

```text
"I couldn't find a verified SRM AP resource for that.
Try browsing Academics / Portals / Events."
```

Never hallucinate an answer.
