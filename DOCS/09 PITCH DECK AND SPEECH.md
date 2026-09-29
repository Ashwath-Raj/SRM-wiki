# 09_PITCH_DECK_AND_SPEECH.md

# Pitch Deck & Demo Speech

## 1. One-Line Product Definition

> **A single navigation and discovery hub for the SRM AP digital ecosystem — connecting official portals, university resources, student projects, events, workshops, announcements, and verified links, with a lightweight AI layer that helps users find the right destination.**

---

# 2. The Problem

SRM AP information is distributed across many places.

A user may need to search through:

```text
University website
Student portal
ERP
Department pages
Event pages
Club pages
Research pages
Student projects
External academic portals
Social media
Announcements
```

The problem is not necessarily that the information doesn't exist.

The problem is:

> **Users don't know where to find it.**

---

# 3. Example

A student asks:

> "Where do I register for this workshop?"

They may need to search:

```text
Google
      ↓
SRM AP website
      ↓
Department page
      ↓
Event page
      ↓
Registration link
```

Our platform turns that into:

```text
Question
   ↓
SRM AP Hub
   ↓
Workshop
   ↓
Registration
```

---

# 4. What We Are Building

The platform has four major layers.

### 1. Resource Directory

A structured collection of:

- Official portals
- Departments
- Programs
- Research resources
- University services
- External academic resources

### 2. Events & Announcements

A live-oriented layer containing:

- Current events
- Upcoming events
- Workshops
- Seminars
- Hackathons
- Club events
- Important announcements
- Urgent university notifications

### 3. Student Ecosystem

A discovery layer for:

- Student projects
- GitHub repositories
- Clubs
- Communities
- Student initiatives

These are clearly separated from official university resources.

### 4. AI Navigation

A simple chatbot that converts natural-language questions into:

```text
Relevant resource
+
Short explanation
+
Official/source link
```

---

# 5. What Makes It Different

This is **not another campus chatbot**.

It does not try to become:

```text
"Ask me anything about your university."
```

Instead:

```text
Search
 ↓
Identify intent
 ↓
Retrieve verified resource
 ↓
Navigate user
```

The AI is a navigation layer, not the product itself.

---

# 6. Example User Questions

### Portal

> "Where is the student portal?"

→ Student Portal

### Event

> "What workshops are happening this week?"

→ Upcoming workshops

### Notification

> "What's the latest university notification?"

→ Latest verified official announcement

### Academic

> "Show me CSE resources."

→ CSE department/program/resources

### Projects

> "Where can I see SRM student projects?"

→ Student project directory

---

# 7. Architecture

```text
              SRM AP SOURCES
                    │
        ┌───────────┼───────────┐
        ↓           ↓           ↓
     Websites     Events     Projects
        │           │           │
        └───────────┼───────────┘
                    ↓
                 Crawler
                    ↓
              Data Processing
                    ↓
          ┌─────────┴─────────┐
          ↓                   ↓
       SQL DB             Vector DB
          │                   │
          └─────────┬─────────┘
                    ↓
                 Router
                    ↓
                  Gemini
                    ↓
              Navigation UI
```

---

# 8. Why the Database Matters

The AI should not be expected to remember SRM AP's constantly changing information.

Instead:

```text
Crawler
    ↓
Fresh data
    ↓
Database
    ↓
Retrieval
    ↓
AI
```

When an event changes, the database changes.

The AI then retrieves the new information.

---

# 9. Trust Model

The platform distinguishes sources.

```text
OFFICIAL
SRM AP website / official portal

INSTITUTIONAL
Government / academic repositories

STUDENT
Student projects / GitHub

COMMUNITY
Clubs / student organizations

EXTERNAL
Other useful resources
```

This prevents users from confusing a student project with an official university resource.

---

# 10. Homepage Demo

Show the homepage.

```text
SRM AP HUB

"Where do you want to go?"

[ Search / Ask a question ]

IMPORTANT
Exam notification

UPCOMING
AI Workshop
Hackathon
Seminar

QUICK ACCESS
Student Portal
Admissions
Library
ERP
```

---

# 11. Chatbot Demo

Type:

> "What workshops are happening this week?"

The system responds:

```text
I found 3 upcoming workshops.

AI Workshop
Oct 2 · 10:00 AM
[View Event]

Robotics Workshop
Oct 4 · 2:00 PM
[View Event]

Research Workshop
Oct 5 · 11:00 AM
[View Event]
```

Then demonstrate clicking:

```text
View Event
      ↓
Original SRM AP source
```

---

# 12. Second Demo

Ask:

> "Where can I access student services?"

The system retrieves:

```text
Student Portal

Official SRM AP resource

[Open Portal →]
```

The important part of the demonstration is that the AI **takes the user somewhere useful**.

---

# 13. Third Demo

Ask:

> "Show me SRM AP student projects."

The system returns:

```text
Student Projects

Project A
GitHub
Student Project

Project B
GitHub
Student Project

Project C
Website
Student Project
```

The interface clearly labels these as student/community resources.

---

# 14. Sudden Notification Demo

Show:

```text
IMPORTANT NOTICE

University announcement

Published:
Today · 09:20 AM

Source:
Official SRM AP

[Read Official Notice →]
```

This demonstrates the freshness layer.

---

# 15. 60-Second Speech

> "SRM AP has a lot of information, but that information is distributed across different websites, portals, department pages, event pages, project repositories and announcements.
>
> The problem isn't necessarily finding information that doesn't exist. The problem is knowing where to go.
>
> So we built SRM AP Hub — a centralized navigation and discovery platform for the SRM AP digital ecosystem.
>
> It brings official portals, academic resources, research, student projects, events, workshops and important announcements into one structured interface.
>
> On top of that, we added a lightweight AI layer. Instead of trying to replace the university's websites, the AI understands what the user is looking for and directs them to the correct resource.
>
> For example, if I ask, 'What workshops are happening this week?', it retrieves the current events and gives me the event details and original source.
>
> If I ask, 'Where is the student portal?', it simply takes me there.
>
> So our goal isn't to build another campus chatbot.
>
> **We're building a navigation layer for the entire SRM AP digital ecosystem.**"

---

# 16. Closing Statement

> **"One university. Many websites. One place to find them."**

Alternative:

> **"Don't search the university. Navigate it."**

---

# 17. Demo Flow

The live demo should follow this order:

```text
1. Homepage
      ↓
2. Show quick-access portals
      ↓
3. Show upcoming events
      ↓
4. Show announcement
      ↓
5. Ask chatbot about events
      ↓
6. Open event source
      ↓
7. Ask for Student Portal
      ↓
8. Open portal
      ↓
9. Show student projects
      ↓
10. Explain architecture
```

---

# 18. What Not To Say

Avoid:

> "Our AI knows everything about SRM."

Instead:

> "Our AI retrieves information from our structured SRM AP knowledge base."

Avoid:

> "The chatbot replaces SRM's websites."

Instead:

> "The platform helps users reach the correct official destination."

Avoid:

> "We scrape everything."

Instead:

> "We collect and structure publicly available resources from defined sources."

Avoid:

> "AI gives the answer."

Instead:

> "AI helps interpret the query and navigate the user to verified information."

---

# 19. Core Product Message

```text
                 SRM AP
                   │
     ┌─────────────┼─────────────┐
     │             │             │
   PORTALS       EVENTS       RESOURCES
     │             │             │
     └─────────────┼─────────────┘
                   ↓
               SRM AP HUB
                   ↓
          SEARCH + AI NAVIGATION
                   ↓
          THE RIGHT DESTINATION
```

The product's value is not another information source.

Its value is **organizing the existing SRM AP digital ecosystem and making the correct destination easy to discover.**
