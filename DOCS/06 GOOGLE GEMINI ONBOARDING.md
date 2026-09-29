# 06_GOOGLE_GEMINI_ONBOARDING.md

# Google Gemini Onboarding

## 1. Purpose

Gemini is used as the language and reasoning layer of the application.

It should **not** be treated as the database.

The architecture is:

```text
User
  ↓
Query Router
  ↓
SQL / Vector Search / Cache
  ↓
Relevant SRM AP data
  ↓
Gemini
  ↓
Structured response + source links
```

Gemini generates the final response from retrieved information.

---

# 2. Responsibilities of Gemini

Gemini should handle:

- Natural-language understanding
- Query classification
- Intent extraction
- Result summarization
- Natural-language response generation
- Choosing how to present retrieved results

Gemini should NOT be responsible for:

- Inventing URLs
- Deciding whether a website is official
- Storing university data
- Crawling websites
- Maintaining event data
- Replacing SQL filtering
- Replacing the vector database

---

# 3. Recommended Query Flow

Example:

```text
User:
"Are there any workshops this week?"

        ↓

Gemini / Router

Intent:
EVENT_SEARCH

        ↓

SQL

WHERE start_time >= today
AND start_time <= today + 7 days
AND event_type = workshop

        ↓

Results

        ↓

Gemini

        ↓

Natural response
```

---

# 4. Environment Variables

Create:

```text
.env
```

Example:

```env
GEMINI_API_KEY=your_api_key_here

GEMINI_MODEL=your_selected_model

DATABASE_URL=your_database_url

VECTOR_DB_URL=your_vector_database_url

ENVIRONMENT=development
```

Never commit `.env`.

---

# 5. .gitignore

The repository should contain:

```gitignore
.env
.env.*
!.env.example

__pycache__/
*.pyc

.venv/
venv/

node_modules/

*.log
```

---

# 6. .env.example

Commit this file:

```env
GEMINI_API_KEY=

GEMINI_MODEL=

DATABASE_URL=

VECTOR_DB_URL=

ENVIRONMENT=development
```

It contains no secrets.

---

# 7. API Key Rules

Never put the Gemini API key in frontend JavaScript.

Bad:

```javascript
const API_KEY = "AIza...";
```

The browser must never receive the secret key.

Correct:

```text
Frontend
   ↓
Backend API
   ↓
Gemini
```

The API key remains on the server.

---

# 8. Gemini Prompt Structure

The model should receive structured context.

Example:

```text
SYSTEM:

You are the AI navigation assistant for an SRM AP
information directory.

You answer only using the retrieved context.

Rules:
1. Do not invent URLs.
2. Do not invent events.
3. Prefer official sources.
4. Always provide the source URL.
5. If information is unavailable, say so.
6. Keep answers concise.
7. Do not claim to perform university services.
```

Then:

```text
USER QUERY:

Where can I access the student portal?

RETRIEVED CONTEXT:

Title: Student Portal
Type: Portal
Source: Official
URL: https://...

Generate a concise answer.
```

---

# 9. Structured Output

Prefer structured JSON from Gemini where possible.

Example:

```json
{
  "intent": "portal_lookup",
  "answer": "The Student Portal provides access to student services.",
  "results": [
    {
      "title": "Student Portal",
      "url": "https://...",
      "source_type": "official"
    }
  ]
}
```

The frontend can then render the response consistently.

---

# 10. Important Query Types

The router should recognize:

```text
PORTAL_LOOKUP
EVENT_SEARCH
ANNOUNCEMENT_SEARCH
DEPARTMENT_SEARCH
PROGRAM_SEARCH
PROJECT_SEARCH
RESEARCH_SEARCH
RESOURCE_SEARCH
CONTACT_SEARCH
GENERAL_NAVIGATION
UNKNOWN
```

Example:

```text
"Where is the student portal?"
→ PORTAL_LOOKUP

"What workshops are happening tomorrow?"
→ EVENT_SEARCH

"Show recent university notifications."
→ ANNOUNCEMENT_SEARCH

"Give me CSE projects."
→ PROJECT_SEARCH
```

---

# 11. Gemini + SQL

Use SQL when the query has structured constraints.

Example:

```text
"Events tomorrow"

SQL:
date = tomorrow
```

Do not ask the LLM to manually determine dates from hundreds of event records.

Use deterministic database filtering.

Gemini should explain the resulting records.

---

# 12. Gemini + Vector Search

Use vector retrieval when the query is semantic.

Example:

```text
"Where can I find resources related to student finance?"
```

The vector database can retrieve:

```text
Student Portal
Fee Payment
Scholarship
Finance Office
Student Services
```

Gemini then summarizes the retrieved results.

---

# 13. Gemini + Cached Context

Frequently requested information can be cached.

Examples:

```text
Student Portal
Admissions
Library
Upcoming Events
Latest Announcements
Departments
```

Flow:

```text
Query
 ↓
Cache
 ↓
If hit → return
 ↓
If miss
 ↓
Router
 ↓
SQL / Vector DB
 ↓
Gemini
```

This reduces latency and API usage.

---

# 14. Hallucination Prevention

The system should follow:

```text
No retrieved evidence
        ↓
No generated factual answer
```

For example:

User:

> "Is there a holiday tomorrow?"

If the system has no official notification:

```text
"I couldn't find a verified SRM AP announcement confirming
a holiday tomorrow. Check the latest official announcements."
```

Do not guess.

---

# 15. API Architecture

Recommended:

```text
Frontend
   |
   | POST /api/chat
   ↓
Backend
   |
   ├── Query Router
   |
   ├── SQL
   |
   ├── Vector Search
   |
   ├── Cache
   |
   └── Gemini
          |
          ↓
       Response
```

---

# 16. Error Handling

Gemini unavailable:

```text
Use normal search/navigation.
```

Database unavailable:

```text
Show cached resources where available.
```

No results:

```text
Show related categories.
```

Invalid query:

```text
Ask the user to clarify.
```

---

# 17. Security Checklist

Before deployment:

```text
[ ] API key is server-side
[ ] .env is gitignored
[ ] .env.example contains no secrets
[ ] API endpoints have rate limits
[ ] User input is validated
[ ] Logs don't contain API keys
[ ] Retrieved URLs are validated
[ ] Authentication portals aren't scraped
```

---

# 18. Core Principle

Gemini is the **language layer**.

The database is the **information layer**.

The crawler is the **freshness layer**.

The router is the **decision layer**.

The frontend is the **navigation layer**.

Together:

```text
Crawler
   ↓
Structured Data
   ↓
SQL + Vector DB
   ↓
Router
   ↓
Gemini
   ↓
Navigation UI
```
