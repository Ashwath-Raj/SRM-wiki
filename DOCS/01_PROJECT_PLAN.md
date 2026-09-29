# 01_PROJECT_PLAN.md
# SRM AP Information Navigator — Product & Execution Plan

**Project type:** 3-hour hackathon MVP  
**Team:** 3 members  
**Primary interface:** Web application + embedded Gemini chatbot  
**Core concept:** Institutional information navigation, not information dumping  
**Primary data strategy:** Crawl/index SRM AP public information, then retrieve from the local/indexed knowledge layer  
**Primary AI:** Google Gemini  
**Core retrieval modes:** RAG + Text-to-SQL + cached/static context  
**Deployment target:** Google Cloud / agreed cloud runtime

---

# 1. Executive Summary

## What we are building

The **SRM AP Information Navigator** is a web application that sits above SRM University-AP's fragmented public information ecosystem.

It allows a student to ask questions in normal language and receive:

- a concise explanation,
- a structured information path,
- the most relevant official resource,
- and the next action.

The system is intentionally designed to reduce **cognitive overload**.

The core problem is not that SRM AP lacks information.

The problem is that students must often figure out:

- where the information lives,
- which page is authoritative,
- which document applies,
- which department owns a process,
- which portal should be used,
- whether a notice is current,
- and what action to take next.

Our product turns that discovery problem into a guided navigation experience.

---

# 2. Product Definition

## One-line definition

> **An AI-powered information navigator that helps SRM AP students find the right policy, document, portal, event, service, or resource through a structured path instead of overwhelming them with information.**

## Product equation

```text
Fragmented institutional information
                +
Natural-language student intent
                ↓
        AI information routing
                ↓
Relevant institutional source
                +
Structured navigation path
                +
Next action
```

---

# 3. Problem Statement

SRM AP information can be distributed across:

- institutional webpages,
- departmental pages,
- PDFs,
- regulations,
- notices,
- event announcements,
- clubs,
- student organizations,
- facilities,
- service pages,
- portals,
- forms,
- contact pages,
- academic resources.

A student may know the outcome they want without knowing the terminology used by the institution.

For example:

> "I missed something because I was sick. Where do I check what I need to do?"

The student may not know whether to search for:

- attendance regulations,
- medical leave,
- assessment policy,
- examination eligibility,
- absence procedure,
- make-up examination procedure,
- or a departmental process.

That is an **information navigation problem**.

---

# 4. Product Thesis

The system should not optimize for:

> "How much information can the AI provide?"

It should optimize for:

> **"How quickly can the student reach the correct source and understand what to do next?"**

This means generated text is deliberately secondary to:

- path,
- provenance,
- resource,
- action.

---

# 5. Target Users

## Primary

### SRM AP students

Especially users who:

- are new to the campus,
- do not know institutional terminology,
- are looking for policies,
- need a specific portal or form,
- need to discover events or clubs,
- need to find an academic resource,
- need a department/facility/contact,
- do not want to search several institutional sites manually.

---

## Secondary

The architecture may eventually support:

- faculty,
- staff,
- student organizations,
- visitors,
- prospective students.

These are not primary MVP personas.

Do not expand product scope to accommodate them during the three-hour build.

---

# 6. Jobs To Be Done

The product should solve these user jobs.

## Job 1 — Find a policy

> "Where is the policy that governs this?"

Examples:

- attendance,
- assessment,
- examinations,
- academic regulations,
- student conduct,
- leave.

Expected result:

```text
Question
→ Policy path
→ Official document
→ Relevant section
```

---

## Job 2 — Find a procedure

> "What am I supposed to do?"

Examples:

- hostel application,
- club registration,
- form submission,
- student request,
- event registration.

Expected result:

```text
Goal
→ Procedure/resource
→ Required portal/form
→ Next action
```

---

## Job 3 — Find a resource

> "Where is it?"

Examples:

- academic calendar,
- syllabus,
- portal,
- library resource,
- department page,
- contact page.

Expected result:

```text
Resource
→ Category
→ Destination
```

---

## Job 4 — Discover options

> "What choices do I have?"

Examples:

- technical clubs,
- workshops,
- student organizations,
- events,
- opportunities.

Expected result:

```text
Intent
→ Filter
→ Relevant list
→ Details/action
```

---

## Job 5 — Find current information

> "What is happening now or soon?"

Examples:

- upcoming events,
- recent announcements,
- current registration opportunities.

Expected result:

```text
Structured query
→ filtered results
→ official event/announcement source
```

---

# 7. Product Scope

## In scope for MVP

### Information ingestion

- crawl/index relevant SRM AP public webpages,
- identify useful PDFs,
- extract page/document content,
- preserve source URLs,
- preserve metadata,
- classify resources,
- create structured records.

### Knowledge layer

- searchable document index,
- structured database,
- resource taxonomy,
- source provenance,
- path hierarchy.

### AI layer

- Gemini integration,
- intent detection,
- SQL routing,
- semantic retrieval,
- response grounding,
- concise answer generation,
- path generation.

### Frontend

- landing/search experience,
- chatbot,
- path visualization,
- source cards,
- resource exploration,
- event view if data is available.

### Deployment

- cloud-hosted application,
- working Gemini credentials,
- environment configuration,
- production URL.

---

# 8. Explicitly Out of Scope

Do not attempt these within three hours:

- full ERP integration,
- authenticated student portal integration,
- private institutional data ingestion,
- complete real-time notification infrastructure,
- full mobile app,
- personalized student profiles,
- autonomous institutional decision-making,
- custom LLM training,
- complex multi-agent orchestration,
- enterprise-grade analytics,
- perfect historical archive,
- full-scale distributed crawler architecture.

These may be future roadmap items.

They are not MVP requirements.

---

# 9. Feature Priority

## P0 — Mandatory

### P0.1 Natural-language query

Student can ask:

```text
"Where is the attendance policy?"
```

### P0.2 AI routing

System determines whether to use:

- SQL,
- RAG,
- navigation,
- or a combination.

### P0.3 Indexed SRM AP resources

The answer must come from indexed institutional resources.

### P0.4 Structured path

Example:

```text
Academics
→ Academic Regulations
→ Attendance
```

### P0.5 Official source link

Every grounded answer should expose the source.

### P0.6 Deployment

The application must be accessible externally.

---

## P1 — Important

- Explore/navigation hierarchy
- event discovery
- announcement discovery
- related resources
- conversation follow-up
- source metadata
- freshness indicator
- mobile layout

---

## P2 — Nice to have

- advanced filtering
- richer analytics
- semantic recommendation
- automated freshness jobs
- notification subscriptions
- personalization
- broader data connectors

---

# 10. Product Success Criteria

The MVP succeeds if a new student can go from a vague question to a correct destination substantially faster than manual browsing.

## Functional success

For at least five realistic demo questions:

```text
query
→ intent
→ retrieval
→ grounded result
→ path
→ source
→ action
```

must work.

---

## UX success

A first-time user should understand within seconds:

> "This helps me find where SRM AP information lives."

The product should not require training.

---

## Trust success

The system should distinguish:

- generated explanation,
- indexed evidence,
- official source.

It must not present unsupported AI output as official institutional policy.

---

# 11. Core Architecture Plan

```text
                     ┌─────────────────────┐
                     │     Student UI      │
                     │   Search + Chat     │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │    API / Backend    │
                     │ query orchestration │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │   Intent + Router   │
                     │       Gemini        │
                     └──────────┬──────────┘
                                │
              ┌─────────────────┼──────────────────┐
              │                 │                  │
              ▼                 ▼                  ▼
        ┌──────────┐      ┌──────────┐      ┌───────────┐
        │   SQL    │      │   RAG    │      │ Navigation│
        │ structured│     │ semantic │      │ hierarchy │
        │   data   │      │ retrieval│      │  / graph  │
        └────┬─────┘      └────┬─────┘      └────┬──────┘
             │                 │                  │
             └─────────────────┼──────────────────┘
                               ▼
                      ┌───────────────────┐
                      │ Evidence Bundle   │
                      │ + sources + path  │
                      └─────────┬─────────┘
                                ▼
                      ┌───────────────────┐
                      │ Gemini Response   │
                      └─────────┬─────────┘
                                ▼
                      ┌───────────────────┐
                      │ Navigation UI     │
                      │ answer + source   │
                      │ + next action     │
                      └───────────────────┘
```

---

# 12. Data Ingestion Plan

The team will crawl/index SRM AP's publicly accessible information rather than performing live calls for every user question.

## Ingestion pipeline

```text
SRM AP public web
        ↓
Crawler
        ↓
Page/PDF extraction
        ↓
Cleaning
        ↓
Deduplication
        ↓
Metadata extraction
        ↓
Classification
        ↓
┌───────┴──────────┐
│                  │
Structured       Documents
│                  │
SQL DB           Vector index
```

---

# 13. Data Strategy

The system should store both structured and unstructured representations.

## Structured data

Examples:

```text
events
announcements
resources
departments
organizations
facilities
contacts
portals
```

Use SQL where the question involves filtering, sorting, dates, categories, or explicit records.

---

## Unstructured data

Examples:

```text
policies
regulations
PDFs
web pages
guidelines
FAQs
procedural documents
```

Use semantic retrieval for questions about meaning or text content.

---

# 14. Resource Model

Every indexed resource should conceptually contain:

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

Do not allow each subsystem to invent its own representation.

---

# 15. Information Taxonomy

Initial taxonomy:

```text
SRM AP
│
├── Academics
│   ├── Regulations
│   ├── Programmes
│   ├── Departments
│   ├── Curriculum
│   ├── Courses
│   ├── Assessment
│   └── Academic Calendar
│
├── Student Life
│   ├── Clubs
│   ├── Organizations
│   ├── Events
│   └── Workshops
│
├── Campus
│   ├── Library
│   ├── Hostel
│   ├── Facilities
│   └── Services
│
├── Administration
│   ├── Notices
│   ├── Policies
│   ├── Forms
│   └── Contacts
│
├── Opportunities
│   ├── Hackathons
│   ├── Competitions
│   ├── Internships
│   └── Other opportunities
│
└── Portals
    ├── Student Portal
    ├── LMS
    ├── ERP
    └── Other official systems
```

This is an initial model, not a claim that SRM AP's official organization exactly matches these categories.

The scraper/data owner should refine the taxonomy based on actual sources.

---

# 16. AI Plan

## Gemini responsibilities

Gemini should perform:

- intent understanding,
- query classification,
- retrieval strategy selection,
- natural-language explanation,
- response structuring,
- concise contextualization.

Gemini should NOT:

- invent institutional rules,
- act as the authoritative source,
- execute unrestricted SQL,
- fabricate links,
- claim live information without evidence.

---

# 17. Query Routing

Typical routing:

```text
USER QUERY
    ↓
Intent classification
    ↓
┌─────────────────────────────────────┐
│ Determine information requirement   │
└─────────────────────────────────────┘
             │
   ┌─────────┼───────────┐
   ↓         ↓           ↓
  SQL       RAG       Navigation
   │         │           │
   └─────────┼───────────┘
             ↓
       Evidence bundle
             ↓
           Gemini
             ↓
   Response + Path + Source
```

Some questions may invoke multiple retrieval methods.

---

# 18. Text-to-SQL Plan

Text-to-SQL should be restricted to known schemas.

Example:

### User

> "What workshops are happening this week?"

The model generates a controlled query against a known events schema.

The backend then:

1. validates the query,
2. ensures read-only behavior,
3. executes it,
4. passes the resulting records to Gemini,
5. renders the result.

Never expose unrestricted database execution to the model.

---

# 19. RAG Plan

RAG should be used to locate source passages.

Example:

```text
User:
"What does the attendance policy say?"

        ↓
Query embedding
        ↓
Semantic search
        ↓
Relevant policy chunks
        ↓
Metadata + source URL
        ↓
Gemini
        ↓
Short grounded response
```

The retrieved chunks should preserve source identity.

---

# 20. Cached Context Plan

The MVP may preload stable, high-frequency context such as:

- top-level hierarchy,
- common portals,
- common categories,
- campus naming conventions,
- common navigation paths.

This can reduce repeated retrieval work.

Do not spend significant build time creating a complex cache invalidation system.

---

# 21. Response Contract

The backend should return a predictable structure.

```json
{
  "answer": "You are looking for the official attendance regulations.",
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
    "Medical Leave",
    "Examination Eligibility"
  ]
}
```

The UI should render the response object.

Do not make the frontend depend on parsing arbitrary AI prose.

---

# 22. Team Workstreams

All three members work in parallel.

## Member A — UX + Data + Scraping

Owns:

- information taxonomy,
- source mapping,
- crawler,
- document extraction,
- metadata,
- data quality,
- source authority,
- navigation UX.

### Primary outputs

```text
working crawler
+
indexed resources
+
validated source metadata
+
navigation/resource structure
```

---

## Member B — AI + Semantics + System

Owns:

- Gemini,
- query classification,
- retrieval router,
- RAG,
- Text-to-SQL,
- response schema,
- semantic labels,
- source grounding,
- backend query flow.

### Primary outputs

```text
working AI pipeline
+
shared response schema
+
RAG
+
SQL routing
+
end-to-end API
```

---

## Member C — Google Cloud + Integration + Demo

Owns:

- Google Cloud setup,
- credentials,
- deployment,
- environment configuration,
- application integration,
- production URL,
- pitch deck,
- speech,
- demo choreography.

### Primary outputs

```text
working cloud environment
+
deployed application
+
stable demo
+
pitch assets
```

Member C is not "only the presentation person."

---

# 23. Parallel Execution Model

The project should operate around shared contracts.

```text
             Shared Contracts
                  │
        ┌─────────┼─────────┐
        ↓         ↓         ↓
      DATA       AI       CLOUD/UI
        │         │         │
        ↓         ↓         ↓
     outputs   outputs   outputs
        │         │         │
        └─────────┼─────────┘
                  ↓
              Integration
                  ↓
               Demo
```

### Shared contract examples

- resource schema,
- response schema,
- taxonomy,
- demo questions,
- environment variable names,
- API endpoint shape.

---

# 24. Integration Checkpoints

## Checkpoint 0 — 15 minutes

All three confirm:

- product definition,
- taxonomy,
- schemas,
- demo queries,
- branch strategy,
- cloud target.

---

## Checkpoint 1 — ~60 minutes

The first vertical slice should work.

```text
Student query
→ API
→ retrieval
→ Gemini
→ path/source
→ UI
```

It does not need to be beautiful.

It must work.

---

## Checkpoint 2 — ~120 minutes

The deployed path works.

Verify:

- UI is reachable,
- backend is reachable,
- Gemini works,
- retrieval works,
- sources open,
- no local-only dependency blocks the demo.

---

## Final 30–40 minutes

Freeze architecture.

Only perform:

- bug fixes,
- data cleanup,
- response tuning,
- UI polishing,
- deployment verification,
- presentation rehearsal.

---

# 25. Three-Hour Timeline

The schedule is deliberately parallel.

## 0:00–0:15 — Alignment

All:

- read `00_START_HERE.md`,
- agree on the product statement,
- freeze core schemas,
- select demo questions.

Member A:
- identify crawl domains/pages.

Member B:
- define AI router contract.

Member C:
- initialize Google/cloud project.

---

## 0:15–0:45 — Foundation

Member A:

- start crawler,
- establish cleaning pipeline,
- produce first resource objects.

Member B:

- implement Gemini connection,
- implement intent/router,
- create API skeleton.

Member C:

- configure environment,
- initialize deployment,
- establish frontend shell,
- start pitch skeleton.

---

## 0:45–1:15 — First data + first AI

Member A:

- crawl first meaningful batch,
- classify resources,
- validate URLs.

Member B:

- implement RAG retrieval,
- implement response schema,
- integrate resource metadata.

Member C:

- connect frontend to backend,
- render answer/path/source.

---

## 1:15–1:45 — Vertical slice

Target:

```text
query
→ backend
→ retrieval
→ Gemini
→ JSON response
→ UI
```

At least one policy/resource query should work end to end.

---

## 1:45–2:15 — Expand

Member A:

- add more data,
- add events/announcements,
- improve classification.

Member B:

- add SQL path,
- improve routing,
- add multi-source retrieval.

Member C:

- improve UX,
- deployment,
- source cards,
- event/resource views.

---

## 2:15–2:35 — Integration

Run demo queries.

Record failures.

Fix only the failures that matter.

---

## 2:35–2:50 — Product polish

Focus on:

- typography,
- spacing,
- source prominence,
- path visibility,
- mobile behavior,
- loading state,
- errors.

---

## 2:50–3:00 — Rehearsal

Run:

```text
Problem
→ Ask question
→ AI finds route
→ Source
→ Action
→ Explain technology briefly
```

Do not discover major technical issues during the final minute.

---

# 26. Demo Strategy

The demo should not begin with architecture diagrams.

Begin with the student problem.

Example:

> "SRM AP has the information, but students often have to search through pages, PDFs, notices and portals just to find where the relevant information is."

Then:

> "So instead of asking students to search for the answer, we built an AI navigator that shows them the path to it."

Then demonstrate.

---

# 27. Recommended Demo Sequence

## Demo 1 — Policy

```text
"Where can I find the attendance policy?"
```

Show:

```text
Academics
→ Academic Regulations
→ Attendance

[Open Official Source]
```

This establishes the core idea.

---

## Demo 2 — Structured query

```text
"What workshops are happening this week?"
```

Show:

```text
SQL-backed event results
```

This establishes that the system is not only document RAG.

---

## Demo 3 — Procedure

```text
"How do I apply for hostel?"
```

Show:

```text
Campus
→ Hostel
→ Applications
→ Portal
```

This demonstrates cognitive-load reduction.

---

# 28. Pitch Architecture

The pitch should explain the product through three layers.

## Layer 1 — Problem

```text
Information fragmentation
+
Student uncertainty
=
Cognitive overload
```

## Layer 2 — Product

```text
Natural-language query
→ information routing
→ structured path
→ official source
→ action
```

## Layer 3 — Technology

```text
SRM AP crawler/index
+
SQL
+
RAG
+
cached context
+
Gemini
```

The pitch should never make the technical stack sound like the problem.

---

# 29. Trust Model

The product should communicate:

```text
Generated explanation
        ↓
Grounded evidence
        ↓
Official source
```

For policy questions:

> **Official source is the final authority.**

The product should make that explicit.

---

# 30. Failure Handling

The system must have controlled behavior when information is missing.

## No result

```text
I couldn't find an authoritative SRM AP source for that request.
```

Then offer:

- closest indexed resources,
- browse categories,
- clarification.

---

## Ambiguous result

Ask one question.

Example:

```text
Do you mean:

[Attendance policy]
[Exam eligibility]
[Attendance-related leave]
```

Do not ask a five-question questionnaire.

---

## Conflicting sources

Prefer the most authoritative/current source and expose the source dates where possible.

Do not silently combine incompatible policy text.

---

# 31. Security Plan

The application may initially use public institutional data.

Nevertheless:

- never commit API keys,
- do not expose backend secrets to browser code,
- use environment variables,
- use read-only DB access for AI-generated queries,
- validate URLs before ingestion where appropriate,
- log errors without secrets,
- keep deployment credentials outside Git.

---

# 32. Data Governance

For the MVP, use only information that is intended to be publicly accessible and appropriate for indexing.

Do not attempt to scrape:

- authenticated student records,
- private faculty systems,
- personal student information,
- restricted portals,
- private communications.

The system is an index over public institutional information.

---

# 33. Performance Priorities

In three hours, optimize for:

1. correctness,
2. predictable response,
3. deployment reliability,
4. reasonable latency,
5. visual clarity.

Do not spend the build making a microsecond-level optimized retrieval pipeline.

---

# 34. Future Roadmap

After the hackathon, potential extensions include:

### Phase 2 — Freshness

- scheduled crawling,
- change detection,
- stale content detection,
- update alerts.

### Phase 3 — Personalization

- program-aware navigation,
- year-aware content,
- role-aware resource routing.

### Phase 4 — Institutional integrations

- authorized portal integrations,
- campus services,
- structured student workflows.

### Phase 5 — Advanced intelligence

- semantic campus graph,
- relationship-aware navigation,
- proactive recommendations,
- multi-step task assistance.

These are not MVP requirements.

---

# 35. Metrics

Possible future metrics:

### Navigation success

Percentage of queries that reach a relevant source.

### Time to destination

How long from query to useful destination.

### Source click-through

Percentage of grounded answers where users open the source.

### Search reduction

Number of manual page-search steps avoided.

### Query resolution

Percentage of queries that produce a useful next action.

For the hackathon, do not build an elaborate analytics system unless there is spare time.

---

# 36. Definition of Done

The project can be considered MVP-complete when:

## Product

- [ ] Product purpose is immediately understandable.
- [ ] Natural-language questions are supported.
- [ ] The system behaves as a navigator rather than a content dump.

## Data

- [ ] SRM AP sources have been crawled/indexed.
- [ ] Source URLs are retained.
- [ ] Resources have useful metadata.
- [ ] Representative policies/resources/events exist.

## AI

- [ ] Gemini is connected.
- [ ] Query routing exists.
- [ ] RAG works.
- [ ] Text-to-SQL works for at least one useful structured query.
- [ ] Output is grounded.
- [ ] Response schema is deterministic.

## UI

- [ ] Chat works.
- [ ] Path is visible.
- [ ] Source is visible.
- [ ] Action is visible.
- [ ] One browse/explore path works.
- [ ] Mobile layout is acceptable.

## Cloud

- [ ] Application is deployed.
- [ ] Secrets are not committed.
- [ ] Public demo URL works.

## Presentation

- [ ] Pitch explains problem before architecture.
- [ ] Demo has a reliable sequence.
- [ ] Each member knows their speaking role.

---

# 37. Final Project Contract

All three members should make implementation decisions against these four questions:

### 1. Does this help students find the right destination?

If no, deprioritize it.

### 2. Is the information grounded in an actual indexed source?

If no, do not present it as institutional fact.

### 3. Can another team member consume the output?

If no, define a shared interface first.

### 4. Does this fit the three-hour build?

If no, cut scope.

---

# 38. The MVP in One Diagram

```text
              SRM AP PUBLIC INFORMATION
                         │
                         ▼
                 Crawl / Extract
                         │
                         ▼
                 Clean / Classify
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
          Structured             Documents
              │                     │
              ▼                     ▼
             SQL                 Vector Index
              │                     │
              └──────────┬──────────┘
                         ▼
                 Gemini Router
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
             SQL        RAG      Navigation
              └──────────┼──────────┘
                         ▼
                  Evidence Bundle
                         │
                         ▼
                       Gemini
                         │
                         ▼
              ┌─────────────────────┐
              │ Concise explanation │
              │ Information path    │
              │ Official source     │
              │ Next action         │
              └─────────────────────┘
                         │
                         ▼
                     STUDENT
```

---

# 39. Final Product Statement

> **SRM AP Information Navigator transforms fragmented institutional information into guided paths, allowing students to move from a natural-language question to the right official resource and next action without navigating the entire information ecosystem themselves.**

## Build around this.

Not around:

- "we used RAG,"
- "we used Gemini,"
- "we built Text-to-SQL,"
- "we scraped many pages."

Those are implementation mechanisms.

The product is:

> **Question → Direction → Source → Action.**