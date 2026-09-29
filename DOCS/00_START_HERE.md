# 00_START_HERE.md
# SRM AP Information Navigator — Team Operating Contract

**Status:** Pre-build master brief  
**Version:** v1.0  
**Target build window:** 3 hours  
**Primary deployment target:** Google Cloud / Google Gemini ecosystem  
**Project type:** Hackathon MVP  
**Team size:** 3 people

---

## 1. What We Are Building

### Product name

**SRM AP Information Navigator**

### One-line definition

> An AI-powered navigation layer over SRM University-AP's fragmented public information that helps students reach the right policy, portal, document, announcement, event, or service without forcing them to consume the entire information source.

### The core idea

The student does **not** primarily need another chatbot that knows a lot of information.

The student needs to answer questions such as:

- Where do I find the attendance policy?
- Which document contains the rule I need?
- Where do I apply for something?
- What is the process for this?
- Which portal handles this?
- What department/resource is responsible?
- Where was this announcement published?
- What events are relevant to me?
- What should I do next?

The system therefore treats AI as a **navigation and retrieval interface**, not as an authoritative replacement for SRM AP's official resources.

### Core product principle

> **Direction over information.**

The system should generally give the student:

1. a short explanation of what they are looking for,
2. the relevant information path,
3. the authoritative source,
4. the next action.

It should **not** automatically produce a comprehensive dump of everything it found.

---

# 2. Problem We Are Solving

SRM AP information is distributed across multiple pages, departments, PDFs, notices, event pages, forms, services, and institutional resources.

This creates a practical problem:

```text
Student has a goal
        ↓
searches web / portal
        ↓
opens multiple pages
        ↓
reads PDFs
        ↓
finds conflicting/irrelevant information
        ↓
asks a friend / CR / senior
        ↓
finally finds the correct source
```

The problem is therefore not simply:

> "Students lack information."

It is:

> **Students spend unnecessary cognitive effort locating the correct information and determining what to do with it.**

Our system compresses that path.

### Target transformation

```text
BEFORE

Question
  ↓
Search
  ↓
Many pages
  ↓
Long documents
  ↓
Guess
  ↓
Ask someone
  ↓
Action


AFTER

Question
  ↓
Intent
  ↓
Structured path
  ↓
Authoritative source
  ↓
Action
```

---

# 3. Product Mental Model

Think of the system as:

### Google Maps for institutional information

Google Maps does not tell you everything about every road.

It determines:

- where you are,
- where you want to go,
- which route matters,
- and how to get there.

Our system does the same for institutional information.

```text
Student goal
     ↓
Intent recognition
     ↓
Information domain
     ↓
Relevant source / section
     ↓
Navigation path
     ↓
Next action
```

The chatbot is therefore the **interface**.

The actual product underneath is:

> **A searchable institutional information graph with AI-assisted routing.**

---

# 4. What the Student Should Experience

## Example 1 — Policy

### Student

> "What's the attendance policy?"

### Bad answer

A 1,000-word generated summary of attendance rules.

### Desired answer

```text
Attendance Policy

You are looking for the official academic attendance rules.

Path:
Academics
→ Academic Regulations
→ Attendance

Official source:
[Academic Regulations]

Related:
• Examination eligibility
• Medical/leave rules
• Academic regulations
```

The system can provide a short contextual statement, but the student is routed to the authoritative source.

---

## Example 2 — Procedure

### Student

> "How do I apply for hostel?"

### Desired response

```text
Hostel Application

Path:
Campus
→ Hostel
→ Applications

Next step:
Open the official hostel application portal.

[Open Hostel Application]

Related:
• Hostel rules
• Hostel contact
```

---

## Example 3 — Discovery

### Student

> "What technical clubs can I join?"

This is one of the situations where a list is appropriate.

```text
Technical Clubs

Showing currently indexed technical student communities.

• Club A
• Club B
• Club C

[View all technical clubs]
[Find clubs currently recruiting]
```

The system should not manufacture a list if the underlying source is missing or stale.

---

## Example 4 — Event search

### Student

> "What workshops are happening this week?"

This is a structured query.

The system can return:

```text
Upcoming Workshops

Tuesday
• Workshop A

Thursday
• Workshop B

Friday
• Workshop C

[View event details]
```

This is where structured data / SQL is useful.

---

# 5. Core Architecture

The first architecture decision is that **all three team members build against one shared system contract**.

```text
                 ┌─────────────────────────┐
                 │       Student UI        │
                 │   Wiki + AI Navigator   │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │      AI Orchestrator    │
                 │   Gemini + intent route │
                 └────────────┬────────────┘
                              │
              ┌───────────────┼────────────────┐
              │               │                │
              ▼               ▼                ▼
        ┌──────────┐    ┌──────────┐     ┌────────────┐
        │   SQL    │    │   RAG    │     │ Navigation │
        │ structured│   │documents │     │   graph    │
        │   data   │    │  search  │     │ / taxonomy │
        └────┬─────┘    └────┬─────┘     └─────┬──────┘
             │               │                  │
             └───────────────┼──────────────────┘
                             ▼
                    ┌──────────────────┐
                    │ Gemini response  │
                    │ answer + path +  │
                    │ source + action  │
                    └────────┬─────────┘
                             ▼
                    ┌──────────────────┐
                    │ Student receives │
                    │ next destination │
                    └──────────────────┘
```

### Important architecture rule

Do **not** make Gemini the database.

Do **not** make Gemini the source of truth.

Do **not** make RAG the entire application.

Gemini should orchestrate and explain retrieved information.

The underlying source and indexed data remain the basis for the answer.

---

# 6. Three Information Modes

The system should distinguish three categories of knowledge.

## A. Structured information → SQL

Use structured storage for information that naturally behaves like records.

Examples:

- events,
- announcements,
- organizations,
- resources,
- departments,
- contact records,
- links,
- dates,
- categories,
- statuses.

Example query:

> "What workshops are happening this week?"

Possible flow:

```text
Natural language
      ↓
Intent extraction
      ↓
Structured query
      ↓
SQL
      ↓
Records
      ↓
Gemini formatting
```

---

## B. Unstructured institutional knowledge → RAG

Use document retrieval for:

- policies,
- regulations,
- guidelines,
- PDFs,
- web page sections,
- FAQs,
- department descriptions,
- procedural documents.

Example:

> "What does the attendance policy say?"

Flow:

```text
Question
   ↓
Semantic retrieval
   ↓
Relevant document sections
   ↓
Gemini
   ↓
Short explanation + official source
```

---

## C. High-frequency stable context → CAG / cached context

Some institutional context is accessed repeatedly.

Examples:

- main portals,
- common categories,
- campus structure,
- navigation hierarchy,
- common terminology,
- frequently referenced institutional metadata.

This information can be preloaded or cached so the model does not repeatedly reconstruct it.

The exact implementation may be simple in the MVP.

Do not build a complicated caching framework unless it materially helps the demo.

---

# 7. The Information Hierarchy

This hierarchy is one of the most important shared artifacts in the project.

All team members should build against the same conceptual taxonomy.

```text
SRM AP
│
├── Academics
│   ├── Academic Regulations
│   ├── Programmes
│   ├── Departments / Schools
│   ├── Curriculum
│   ├── Academic Calendar
│   ├── Examinations / Assessment
│   └── Courses
│
├── Student Life
│   ├── Clubs
│   ├── Organizations
│   ├── Events
│   ├── Workshops
│   └── Communities
│
├── Campus
│   ├── Library
│   ├── Hostel
│   ├── Facilities
│   └── Student Services
│
├── Administration
│   ├── Forms
│   ├── Notices
│   ├── Policies
│   └── Contacts
│
├── Opportunities
│   ├── Hackathons
│   ├── Internships
│   ├── Competitions
│   └── Other student opportunities
│
└── Portals / Links
    ├── Student Portal
    ├── LMS
    ├── ERP
    └── Other official systems
```

This taxonomy is a **shared contract**, not a suggestion.

---

# 8. Team Model

There are three members.

The team is deliberately **not** organized as:

```text
Person 1 finishes
       ↓
Person 2 starts
       ↓
Person 3 finishes
```

That wastes the most valuable resource: parallel work.

Instead:

```text
                SHARED CONTRACT
                     │
       ┌─────────────┼─────────────┐
       ↓             ↓             ↓
   Member A      Member B      Member C
   UX + Data     AI + System   Cloud + Demo
       │             │             │
       └─────────────┼─────────────┘
                     ↓
               Integration
                     ↓
                 Rehearsal
```

Each member owns a lane but contributes to the shared system.

---

# 9. Member A — UX + Data Discovery + Scraping

### Primary responsibility

Own the **information source layer and user-facing information structure**.

### Main work

- map SRM AP information domains,
- identify authoritative source pages,
- design resource hierarchy,
- build crawler/scraper,
- extract page metadata,
- extract useful document content,
- normalize URLs,
- classify resources,
- identify dates and notices,
- feed structured records,
- validate retrieved sources,
- contribute UI/navigation requirements.

### Member A should also work on UX

They should not become "the scraper person".

They should define:

- how paths are displayed,
- how source cards work,
- how categories are surfaced,
- how the student moves from question → resource,
- what information should NOT be shown by default.

### Definition of done

A usable indexed dataset exists.

At minimum the team should have:

- authoritative URLs,
- titles,
- categories,
- descriptions/snippets,
- source types,
- timestamps where available,
- document/page content,
- enough representative content for the demo.

---

# 10. Member B — AI + Semantics + Whole-System Logic

### Primary responsibility

Own the **reasoning and retrieval architecture**.

This person designs the semantic contract connecting:

```text
query
→ intent
→ retrieval strategy
→ evidence
→ navigation
→ response
```

### Main work

- Gemini integration,
- intent classification,
- routing,
- semantic taxonomy,
- RAG retrieval,
- Text-to-SQL,
- context construction,
- response schema,
- source grounding,
- confidence/ambiguity handling,
- integration with the navigation model.

### Critical distinction

Member B should **not** build an isolated chatbot.

The AI must consume the same resource objects generated by Member A and return outputs that Member C can deploy.

---

# 11. Member C — Google Cloud + Integration + Deployment + Pitch

### Primary responsibility

Own the **working environment and delivery layer**.

### Main work

- Google Cloud project setup,
- Gemini/API credentials,
- environment variables,
- deployment target,
- backend/frontend connection,
- production configuration,
- domain/URL if available,
- health checks,
- logging,
- demo environment,
- pitch deck,
- presentation flow,
- speech,
- final demo rehearsal.

### Critical clarification

"Pitch person" does not mean "wait until the end and make slides."

Member C should begin the cloud/deployment work immediately.

By the midpoint, there should already be a deployed skeleton.

---

# 12. Shared Interfaces

All three members must agree on these before implementation:

### Resource object

```json
{
  "id": "resource-001",
  "title": "Academic Regulations",
  "url": "https://example.edu/...",
  "category": "academics",
  "subcategory": "regulations",
  "type": "policy",
  "description": "...",
  "content": "...",
  "authority": "official",
  "source_domain": "srm.example.edu",
  "last_seen": "2026-09-29"
}
```

The exact schema may evolve, but everyone must use one shared model.

---

### AI response object

```json
{
  "answer": "Short contextual explanation.",
  "intent": "policy_lookup",
  "path": [
    "Academics",
    "Academic Regulations",
    "Attendance"
  ],
  "resources": [
    {
      "id": "resource-001",
      "title": "Academic Regulations",
      "url": "https://example.edu/..."
    }
  ],
  "actions": [
    {
      "label": "Open Official Policy",
      "url": "https://example.edu/..."
    }
  ],
  "related": [
    "Medical Leave",
    "Examination Eligibility"
  ]
}
```

The UI should render this rather than relying on free-form markdown alone.

---

# 13. Source Authority Rules

The system should distinguish source quality.

### Highest authority

- official SRM AP pages,
- official SRM AP documents,
- official institutional announcements,
- official portals.

### Lower authority

- secondary pages,
- student organization pages,
- external event references.

### Untrusted

- arbitrary search results,
- forum posts,
- user-generated claims,
- hallucinated knowledge.

For institutional policies, the system should strongly prefer official sources.

### Rule

> **The model may summarize an official source. It must not silently replace the official source.**

---

# 14. Hallucination Boundary

The system must have an explicit behavior for missing evidence.

### Do not do this

> "According to SRM AP policy, students must..."

when the policy was not found.

### Do this instead

> "I couldn't locate the official policy section for that question in the indexed SRM AP sources."

Then provide:

- related source,
- relevant navigation path,
- or a request for clarification.

A confidently wrong policy answer is worse than no answer.

---

# 15. Query Routing Contract

At a conceptual level:

```text
USER QUERY
    ↓
Intent extraction
    ↓
┌─────────────────────────────────┐
│ Is this a structured question?  │
└───────────────┬─────────────────┘
                │
       ┌────────┴────────┐
       ↓                 ↓
      YES                NO
       ↓                 ↓
    SQL query        RAG retrieval
       │                 │
       └────────┬────────┘
                ↓
         Navigation graph
                ↓
          Evidence bundle
                ↓
             Gemini
                ↓
    Short answer + route + source
```

Some questions can use more than one mode.

For example:

> "What clubs are recruiting and how do I join?"

could require:

- SQL for currently indexed clubs/events,
- RAG for joining procedure,
- navigation for the actual destination.

The router must therefore permit **multi-source retrieval**.

---

# 16. What We Are NOT Building

This section is important because three hours is extremely short.

We are **not** building:

- a replacement for SRM AP's official website,
- a full institutional ERP,
- a real-time enterprise notification infrastructure,
- an autonomous policy authority,
- a giant custom LLM,
- a production-grade recommendation engine,
- a full student social network,
- a general-purpose web search engine,
- a perfect crawler for every historical document,
- an elaborate agent framework.

We are building a compelling and functional **information navigation MVP**.

---

# 17. MVP Definition of Done

The project is "done enough" when a new student can ask several realistic questions and the system can reliably move them toward the correct source.

### Minimum success conditions

The deployed application must have:

- working UI,
- working Gemini integration,
- indexed SRM AP data,
- retrieval,
- structured resources,
- navigation paths,
- source links,
- at least one SQL-backed query,
- at least one RAG-backed query,
- a visible response path,
- deployment accessible from outside the developer machine.

### Demo quality

At least five strong queries should work reliably.

Recommended demo set:

1. "Where can I find the attendance policy?"
2. "How do I apply for hostel?"
3. "What workshops are happening this week?"
4. "I want to join a technical club."
5. "Where can I find the academic calendar?"

These should exercise different parts of the architecture.

---

# 18. 3-Hour Operating Rules

## Rule 1 — Freeze the product shape early

Within the first **15 minutes**, agree on:

- product statement,
- user flow,
- taxonomy,
- response schema,
- resource schema,
- demo questions.

After that, implementation starts.

---

## Rule 2 — Build vertically, not horizontally

Do not spend two hours building "all the backend" before connecting a UI.

Get one complete path working:

```text
query
→ retrieval
→ Gemini
→ path
→ source
→ browser
```

Then expand.

---

## Rule 3 — Prefer boring technology

The hackathon is not the place to prove that you can invent an orchestration framework.

Use technologies the team can deploy quickly.

---

## Rule 4 — Every feature must serve the core promise

Ask:

> Does this help a student reach the correct information with less cognitive effort?

If no, cut it.

---

## Rule 5 — Demo reliability beats feature count

Five working flows beat twenty unfinished ones.

---

# 19. Collaboration Protocol

The team should use a lightweight synchronization model.

### At the start — 15 minutes

All three members:

- read this file,
- agree on taxonomy,
- agree on schemas,
- agree on demo queries,
- create branches,
- confirm deployment target.

### Around 60 minutes

Quick integration checkpoint:

- Can the crawler produce the shared resource object?
- Can AI retrieve it?
- Can the UI render it?
- Is deployment alive?

### Around 120 minutes

Second integration checkpoint:

- End-to-end query works.
- Sources are clickable.
- AI output is bounded.
- Main demo path works.

### Final 30 minutes

No major architecture changes.

Only:

- bug fixes,
- UI cleanup,
- data quality,
- demo rehearsal,
- deployment verification.

---

# 20. Git Collaboration Rules

Recommended branch model:

```text
main
│
├── feature/data-scraper
├── feature/ai-routing
└── feature/ui-cloud-demo
```

Each member owns their branch.

Merge frequently.

Avoid massive end-of-project merges.

### Commit style

Use small meaningful commits:

```text
feat: add resource schema
feat: add crawler metadata extraction
feat: implement Gemini router
feat: add navigation response card
fix: handle missing source
deploy: configure production env
```

---

# 21. Secret Management

Never commit:

```text
GEMINI_API_KEY=...
GOOGLE_API_KEY=...
```

or service-account credentials.

Use:

- local `.env` for development,
- platform/cloud secret storage for deployment,
- `.env.example` containing variable names only.

Example:

```env
GEMINI_API_KEY=
GOOGLE_CLOUD_PROJECT=
GOOGLE_CLOUD_LOCATION=
```

The repository should contain no live secrets.

---

# 22. Google / Gemini Onboarding Rule

Only one person needs to perform the initial cloud account/project setup, but the output must be documented for everyone.

The shared team should know:

- project name,
- project ID,
- enabled APIs/services,
- Gemini credential strategy,
- deployment URL,
- environment variable names,
- ownership/access arrangement.

Credentials themselves should not be pasted into chat, commits, documents, screenshots, or the pitch deck.

---

# 23. Data Quality Rules

The crawler should preserve provenance.

Every indexed item should retain:

- original URL,
- page title,
- source type,
- category,
- extraction timestamp,
- content,
- authority level.

Do not strip the source URL out of the data pipeline.

The product's value partly depends on its ability to answer:

> **"Where did this come from?"**

---

# 24. Freshness Model

The first MVP can use a crawl snapshot.

It should nevertheless retain:

```text
last_seen
```

for every resource.

This allows the system to later support:

- scheduled recrawling,
- change detection,
- stale-source warnings,
- announcement updates.

Do not build the complete refresh infrastructure unless time permits.

---

# 25. Product Language

Use terminology that communicates the actual value.

### Prefer

- information navigation,
- institutional knowledge layer,
- guided retrieval,
- information path,
- authoritative source,
- next action,
- contextual navigation,
- grounded answer.

### Avoid overclaiming

Do not describe the system as:

- "knowing everything about SRM AP",
- "replacing the SRM website",
- "AI professor",
- "AI administration",
- "100% accurate",
- "fully autonomous institutional agent".

The product is a **navigation and retrieval layer**.

---

# 26. Pitch Thesis

The eventual presentation should demonstrate one thing:

### Information overload → guided path

Do not spend the entire pitch explaining RAG.

Show the problem first.

```text
Hundreds of pages
     +
PDFs
     +
Notices
     +
Portals
     +
Departments
     +
Events
     ↓
Information fragmentation
     ↓
Cognitive overload
```

Then show:

```text
Student question
       ↓
AI Navigator
       ↓
Intent
       ↓
Structured path
       ↓
Official resource
       ↓
Action
```

Then briefly explain that the system uses:

- scraped/indexed SRM AP data,
- semantic retrieval,
- structured queries,
- Gemini,
- cached institutional context.

The technology supports the product story.

It should not become the product story.

---

# 27. First 15 Minutes Checklist

Before anybody starts serious implementation, the team must have completed:

### Product

- [ ] One-line product definition agreed
- [ ] "Direction over information" accepted as the core UX rule
- [ ] Five demo questions selected

### Data

- [ ] Initial SRM AP domains agreed
- [ ] Resource schema agreed
- [ ] Source authority rule agreed
- [ ] Crawl targets identified

### AI

- [ ] Response schema agreed
- [ ] SQL vs RAG distinction agreed
- [ ] Gemini role agreed
- [ ] Hallucination/missing-source behavior agreed

### UI

- [ ] Navigation path component agreed
- [ ] Source card agreed
- [ ] Minimal dashboard structure agreed

### Cloud

- [ ] Google project identified
- [ ] Credential owner identified
- [ ] Deployment target identified
- [ ] Environment variable names agreed

### Team

- [ ] Member A lane confirmed
- [ ] Member B lane confirmed
- [ ] Member C lane confirmed
- [ ] Shared Git repository ready

---

# 28. First Working Slice

The first implementation milestone should be:

```text
User:
"Where can I find the attendance policy?"

        ↓

Frontend

        ↓

Backend

        ↓

Retriever

        ↓

SRM AP indexed source

        ↓

Gemini

        ↓

Structured response

        ↓

┌──────────────────────────────┐
│ Attendance Policy            │
│                              │
│ Path:                        │
│ Academics                    │
│ → Regulations                │
│ → Attendance                 │
│                              │
│ [Open Official Source]       │
└──────────────────────────────┘
```

Once this works, the system has its core identity.

Everything else is expansion.

---

# 29. Final Decision Rule

Whenever the team is uncertain about what to build next, ask:

> **Will this reduce the number of cognitive steps between a student's question and the authoritative SRM AP resource they need?**

If yes, prioritize it.

If it merely adds technical complexity, visual decoration, or AI novelty, it is secondary.

---

# 30. Project North Star

The entire team should remember one sentence:

> **We are not building an AI that tells students everything about SRM AP. We are building an AI that helps students find exactly where they need to go.**

That is the product.

RAG, Text-to-SQL, CAG, Gemini, scraping, databases, embeddings, cloud deployment, and the UI all exist to support that outcome.

**Do not lose the product while building the technology.**