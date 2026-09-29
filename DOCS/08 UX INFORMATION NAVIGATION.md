# 08_UX_INFORMATION_NAVIGATION.md

# UX & Information Navigation

## 1. Core UX Principle

The website should answer:

> "Where do I need to go?"

not:

> "Let me give you a giant paragraph about the university."

The product is a **navigation layer over the SRM AP ecosystem**.

---

# 2. Homepage

The homepage should immediately expose four things:

```text
┌─────────────────────────────────────────────┐
│                 SRM AP HUB                  │
│                                             │
│  What are you looking for?                 │
│  [ Search or ask a question...          ]  │
│                                             │
│  Portals   Events   Academics   Projects    │
└─────────────────────────────────────────────┘

IMPORTANT NOW

[ Important University Notification ]

UPCOMING

[ Event ] [ Workshop ] [ Seminar ]

QUICK ACCESS

[ Student Portal ]
[ Admissions ]
[ Library ]
[ Academic Resources ]
```

The user should not need to understand the site's entire hierarchy before using it.

---

# 3. Primary Navigation

Recommended:

```text
Home
Explore
Portals
Academics
Research & Projects
Events
Announcements
```

Optional:

```text
About
Submit Resource
```

---

# 4. Explore

"Explore" is the broad directory.

Categories:

```text
Academics
Admissions
Student Services
Portals
Research
Projects
Clubs
Events
University Resources
External Resources
```

---

# 5. Portals

The portal page should be extremely direct.

Example:

```text
PORTALS

Student
────────────────────────
Student Portal
Academic and student services
[Open Portal]

Faculty
────────────────────────
Faculty / ERP
[Open Portal]

Parent
────────────────────────
Parent Portal
[Open Portal]

Alumni
────────────────────────
Alumni Portal
[Open Portal]
```

Each card should answer:

1. What is this?
2. Who uses it?
3. Where does it go?

---

# 6. Resource Cards

Every resource should use a consistent structure.

```text
┌─────────────────────────────────────┐
│ Student Portal                      │
│                                     │
│ Student services and academic       │
│ resources.                          │
│                                     │
│ Official SRM AP                     │
│ Verified: 2 hours ago               │
│                                     │
│ [ Open Portal → ]                   │
└─────────────────────────────────────┘
```

Avoid displaying unnecessary metadata to normal users.

---

# 7. Events

Events deserve a dedicated section.

```text
EVENTS

Today
────────────────────────
10:00 AM
AI Workshop
Engineering Block
[Details]

Tomorrow
────────────────────────
2:00 PM
Student Seminar
[Details]

This Week
────────────────────────
Hackathon
Workshop
Club Event
Seminar
```

Filters:

```text
Date
Category
Organizer
Department
Event type
```

---

# 8. Event Card

```text
┌─────────────────────────────────────┐
│ WORKSHOP                            │
│                                     │
│ Introduction to Robotics            │
│                                     │
│ 05 OCT · 10:00 AM                   │
│ Engineering Block                   │
│                                     │
│ Organized by: XYZ                   │
│                                     │
│ [Register] [Details]                │
└─────────────────────────────────────┘
```

Always show the original source.

---

# 9. Announcements

Announcements should be separate from normal news.

```text
ANNOUNCEMENTS

URGENT
────────────────
Exam schedule updated
Today · Official SRM AP
[View Notice]

IMPORTANT
────────────────
Registration deadline extended
Yesterday · Official SRM AP
[View Notice]

GENERAL
────────────────
New workshop announced
[View]
```

Use urgency carefully.

The UI should distinguish:

```text
Official notification
Official news
Student/club announcement
Community resource
```

---

# 10. Search

Search should support:

```text
Exact search
Semantic search
Category filtering
Department filtering
Audience filtering
```

Example:

```text
Search:
"hostel"

Results:

Student Portal
Hostel application
Hostel information
Student services
```

---

# 11. AI Chat

The chatbot should appear as:

```text
Ask SRM Hub
```

rather than positioning itself as:

```text
SRM AI
Campus AI
University Assistant
```

This reinforces that the system is a navigation tool.

---

# 12. Chat Response

Bad:

```text
Here is a very detailed explanation of how SRM
University handles student services...
```

Good:

```text
For hostel-related student services, use:

Student Portal
Student services and hostel access

[Open Student Portal →]

Source: Official SRM AP
```

The goal is:

```text
Question
 ↓
Intent
 ↓
Relevant resource
 ↓
Action
```

---

# 13. Event Chat Queries

Example:

```text
User:
"What workshops are happening this week?"

Assistant:

I found 3 upcoming workshops.

1. AI Workshop
   Oct 2 · 10:00 AM
   [View Event]

2. Robotics Workshop
   Oct 4 · 2:00 PM
   [View Event]

3. Research Workshop
   Oct 5 · 11:00 AM
   [View Event]
```

---

# 14. Navigation Over Generation

If the user asks:

> "Where do I apply for something?"

The system should prioritize:

```text
[Relevant portal]
[Official page]
[Application page]
```

over generating instructions from memory.

---

# 15. Source Transparency

Every AI-generated result should have:

```text
Source: Official SRM AP
Verified: 2 hours ago
```

or:

```text
Source: Student Project
Verified: 2 days ago
```

This is particularly important because the platform aggregates both official and community resources.

---

# 16. Mobile UX

The most important actions should be accessible with one thumb.

Bottom navigation can contain:

```text
Home
Explore
Events
Search
Chat
```

The website should work fully without requiring the user to open the chatbot.

---

# 17. Information Hierarchy

The hierarchy should be:

```text
MOST IMPORTANT

Urgent announcements
Upcoming events
Frequently used portals

        ↓

IMPORTANT

Academics
Departments
Student services

        ↓

DISCOVERY

Research
Projects
Clubs
Community resources
```

---

# 18. Empty States

If nothing is found:

```text
No matching resources found.

Try:
• Searching by department
• Searching for a portal
• Browsing Events
• Browsing Academics
```

Do not show a blank page.

---

# 19. Trust Indicators

Use small labels:

```text
OFFICIAL
STUDENT PROJECT
COMMUNITY
EXTERNAL
```

Do not make community resources visually indistinguishable from official university information.

---

# 20. Final UX Rule

Every page should answer:

```text
What is this?
Who is it for?
Is it official?
Is it current?
Where do I go next?
```

If a page cannot answer those questions, its information hierarchy should be redesigned.
