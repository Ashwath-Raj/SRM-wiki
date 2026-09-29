# SRM AP Wiki — UI/UX Specification

> **This document defines the visual language, information architecture, interaction patterns, responsive behavior, and UX rules for SRM AP Wiki.**
>
> The implementation agent should follow this document when building or modifying the frontend.

---

# 1. Product Identity

## Product

**SRM AP Wiki**

## Tagline

**Everything SRM AP, in one place.**

## Product Type

A modern university information and knowledge platform.

It is:

- A directory
- A search engine
- An event discovery platform
- A notification hub
- A student project directory
- A document repository
- An AI-powered navigation interface

It is **not** primarily a chatbot.

---

# 2. Design Goal

The interface should answer one question immediately:

> **"What do I need to find?"**

The user should be able to reach important information within a few seconds.

The interface should feel:

- Clean
- Modern
- Fast
- Trustworthy
- Academic
- Information-dense
- Easy to scan
- Minimal
- Responsive

Avoid making it look like:

- A generic AI chatbot
- A social media platform
- A university ERP
- A marketing website
- A Wikipedia clone

---

# 3. Primary UX Principle

The website should be **browse-first, search-first, AI-second**.

Priority:

```text
1. Search
2. Quick access
3. Current information
4. Browse categories
5. AI assistance
```

The AI should supplement navigation rather than replace it.

---

# 4. Information Architecture

```text
SRM AP WIKI
│
├── Home
│
├── Explore
│   ├── Portals
│   ├── Events
│   ├── Notices
│   ├── Projects
│   ├── Organizations
│   ├── Opportunities
│   └── Documents
│
├── Pulse
│
├── Search
│
├── AI
│
└── About
```

---

# 5. Desktop Navigation

Desktop header:

```text
┌────────────────────────────────────────────────────────────┐
│ SRM AP WIKI    Explore   Events   Notices   Projects       │
│                                      Search    Ask AI       │
└────────────────────────────────────────────────────────────┘
```

Logo:

```text
SRM AP
WIKI
```

or:

```text
SRM AP Wiki
```

The logo should remain compact.

Navigation should not contain too many items.

Recommended:

```text
Explore
Events
Notices
Projects
Pulse
```

Right side:

```text
Search
Ask AI
```

---

# 6. Mobile Navigation

Use a bottom navigation bar.

```text
┌────────────────────────────────────┐
│                                    │
│             CONTENT                │
│                                    │
├────────────────────────────────────┤
│ Home  Explore  Pulse  Search  AI  │
└────────────────────────────────────┘
```

Bottom navigation should remain visible while scrolling where appropriate.

Secondary pages should be accessible through `Explore`.

---

# 7. Global Search

Search is the most important interaction.

Desktop:

```text
┌───────────────────────────────────────────────┐
│ Search SRM AP Wiki...                         │
└───────────────────────────────────────────────┘
```

Mobile:

```text
┌───────────────────────────────┐
│ 🔍 Search SRM AP...           │
└───────────────────────────────┘
```

The search should support:

- Portals
- Events
- Notices
- Projects
- Organizations
- Documents
- Opportunities

---

# 8. Search Interaction

When the user clicks the search field:

```text
Search SRM AP Wiki

Recent searches

Popular:
• Examination portal
• Academic calendar
• Events
• Library
• LMS
```

After typing:

```text
Search: examination

PORTALS
Examination Portal

NOTICES
Mid-Semester Examination Notice

DOCUMENTS
Examination Regulations

EVENTS
Examination Orientation
```

Search results should be grouped by type.

---

# 9. Search Filters

Desktop sidebar:

```text
FILTER

Content type
○ Everything
○ Portals
○ Events
○ Notices
○ Projects
○ Documents
○ Organizations

Date
○ Any time
○ Today
○ This week
○ This month

Source
○ Official
○ Student
○ Organization
```

Mobile filters should appear in a bottom sheet.

---

# 10. Homepage

The homepage should be focused on discovery.

Order:

```text
1. Hero + Search
2. Quick Access
3. Pulse
4. Today
5. Latest Notices
6. Upcoming Events
7. Student Projects
8. Popular Resources
9. AI entry point
```

---

# 11. Hero Section

Keep the hero compact.

Do not consume half the screen with a huge marketing banner.

Example:

```text
                 SRM AP Wiki

          Everything SRM AP,
              in one place.

     Find portals, events, notices,
        projects and resources.

 ┌─────────────────────────────────────┐
 │ Search SRM AP Wiki...          🔍  │
 └─────────────────────────────────────┘
```

Under search:

```text
Popular:
Exams · LMS · Events · Calendar · Library
```

---

# 12. Quick Access

Immediately below the hero.

```text
QUICK ACCESS

┌─────────┐ ┌─────────┐ ┌─────────┐
│ Exams   │ │ LMS     │ │ Library │
└─────────┘ └─────────┘ └─────────┘

┌─────────┐ ┌─────────┐ ┌─────────┐
│ Calendar│ │ Hostel  │ │ Fees    │
└─────────┘ └─────────┘ └─────────┘
```

Use simple icons and labels.

Do not use large decorative illustrations.

---

# 13. SRM AP Pulse

Pulse is the live information overview.

Section:

```text
SRM AP PULSE

┌──────────────┐
│ 3            │
│ New Notices  │
└──────────────┘

┌──────────────┐
│ 5            │
│ Events       │
└──────────────┘

┌──────────────┐
│ 2            │
│ Deadlines    │
└──────────────┘
```

Clicking a metric navigates to the corresponding filtered page.

---

# 14. Pulse Page

Full page:

```text
SRM AP PULSE

What's happening at SRM AP?

────────────────────────────────

NEW
• New examination notice
• Workshop registration opened

TODAY
• AI Workshop
• Club Meeting
• Seminar

UPCOMING
• Hackathon
• Research Seminar

DEADLINES
• Competition registration
• Workshop registration

RECENTLY ADDED
• Student Project
• New Organization
```

---

# 15. "What's New" Component

Show a chronological activity feed.

```text
TODAY

11:42 AM
New examination notice
Official

10:20 AM
AI workshop added
Organization

09:15 AM
New student project
Student

YESTERDAY

...
```

Each item should show:

- Time/date
- Title
- Type
- Source badge
- Click target

---

# 16. Today Section

Homepage should show current events.

```text
TODAY AT SRM AP

10:00 AM
AI Workshop
Block A

2:00 PM
Guest Lecture
Auditorium

5:00 PM
Club Meeting
Student Activity Center

[View today's events]
```

If no events:

```text
No events scheduled for today.
```

Do not show an empty card grid.

---

# 17. Notice Section

Homepage:

```text
LATEST NOTICES

┌────────────────────────────────────────────┐
│ Examination timetable released             │
│ Official · 20 minutes ago                 │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ Workshop registration opened               │
│ Organization · 2 hours ago                 │
└────────────────────────────────────────────┘

[View all notices]
```

---

# 18. Notice Card

Structure:

```text
┌─────────────────────────────────────────┐
│ OFFICIAL                               │
│                                         │
│ Mid-Semester Examination Schedule       │
│                                         │
│ Published 29 Sep 2026                   │
│ Examination                             │
│                                         │
│ [Read Notice]                           │
└─────────────────────────────────────────┘
```

Priority should be visually distinguishable.

Do not overuse red.

---

# 19. Event Card

```text
┌─────────────────────────────────────────┐
│ WORKSHOP                                │
│                                         │
│ Machine Learning Workshop               │
│                                         │
│ 02 OCT · 4:00 PM                        │
│ Block A                                 │
│                                         │
│ Organized by XYZ                        │
│                                         │
│ [View Event]                            │
└─────────────────────────────────────────┘
```

Important information should be visible without opening the card.

---

# 20. Event Page

Layout:

```text
EVENT

Machine Learning Workshop

02 OCTOBER 2026
4:00 PM

Venue
Block A

Organized by
XYZ Organization

────────────────────────

Description

...

────────────────────────

[Register]

Source
Official / Organization

[Original Source]
```

---

# 21. Calendar

Provide:

```text
Calendar
List
Today
This Week
This Month
```

Desktop calendar:

```text
MON   TUE   WED   THU   FRI   SAT   SUN
────────────────────────────────────────
 28    29    30     1     2     3     4
             •            •
```

Events should be represented with small indicators.

Clicking a day filters events.

---

# 22. Portal Directory

Page header:

```text
PORTALS

Official SRM AP portals and useful services.

[Search portals...]
```

Categories:

```text
Academic
Administration
Student
Library
Examination
Career
Other
```

---

# 23. Portal Card

```text
┌────────────────────────────────────┐
│ Examination Portal                 │
│                                    │
│ Official examination services.     │
│                                    │
│ ● VERIFIED                         │
│ Last verified today                │
│                                    │
│ [Open Portal ↗]                   │
└────────────────────────────────────┘
```

The external-link indicator should make it clear that the user is leaving SRM AP Wiki.

---

# 24. Source Badges

Use consistent source badges.

```text
OFFICIAL
STUDENT
ORGANIZATION
COMMUNITY
EXTERNAL
```

Example:

```text
[OFFICIAL]
[STUDENT PROJECT]
[ORGANIZATION]
```

The badge should be subtle but clearly visible.

---

# 25. Verification Badges

Use:

```text
VERIFIED
PENDING
OUTDATED
```

Do not display internal states such as `DISCOVERED` to normal users unless useful.

---

# 26. Student Projects

Project discovery page:

```text
STUDENT PROJECTS

Explore projects built by the SRM AP community.

[Search projects...]

AI
Web
Robotics
IoT
Research
Open Source
```

Cards:

```text
┌────────────────────────────────────┐
│ AI Campus Navigation               │
│                                    │
│ CSE · 2026                         │
│                                    │
│ Python · React · AI                │
│                                    │
│ [View Project]                     │
└────────────────────────────────────┘
```

---

# 27. Project Detail

```text
AI Campus Navigation

Student Project

Description
...

Team
...

Department
CSE

Technologies
Python · React · AI

Links
[GitHub]
[Demo]
[Documentation]

Related
Organization
Events
```

---

# 28. Organizations

Organization directory:

```text
ORGANIZATIONS

Clubs
Labs
Chapters
Communities
Societies
```

Organization card:

```text
┌──────────────────────────────┐
│ Robotics Club                │
│                              │
│ Technical Organization       │
│                              │
│ 3 upcoming events            │
│ 5 projects                   │
│                              │
│ [View Organization]          │
└──────────────────────────────┘
```

---

# 29. Organization Page

```text
ROBOTICS CLUB

Description

...

UPCOMING EVENTS

...

PROJECTS

...

LINKS

Website
Socials
Contact
```

---

# 30. Documents

Document directory:

```text
DOCUMENTS

Academic
Regulations
Handbooks
Forms
Circulars
Guidelines

[Search documents...]
```

Document card:

```text
┌────────────────────────────────────┐
│ Academic Regulations               │
│                                    │
│ Official document                  │
│ Updated: 29 Sep 2026               │
│                                    │
│ [Read Document]                   │
└────────────────────────────────────┘
```

---

# 31. AI Assistant UX

The AI should have its own page, but also be accessible globally.

Desktop:

```text
                    ASK SRM AP WIKI

        What are you looking for?

 ┌───────────────────────────────────────────┐
 │ Where can I register for exams?           │
 └───────────────────────────────────────────┘

 Suggested:
 • What's happening today?
 • Show upcoming workshops
 • Find the examination portal
```

---

# 32. AI Chat Interface

Once a conversation begins:

```text
USER

Where do I register for exams?


SRM AP WIKI

You can access examination registration
through the official examination portal.

[Open Examination Portal]

SOURCE
Official SRM AP
Last verified today
```

The interface should remain compact.

Do not imitate ChatGPT's entire UI.

---

# 33. AI Source Cards

Every source returned by AI should use a compact source card.

```text
┌────────────────────────────────────┐
│ Examination Portal                 │
│ OFFICIAL · VERIFIED                │
│                                    │
│ Official examination services.     │
│                                    │
│ [Open Source ↗]                    │
└────────────────────────────────────┘
```

---

# 34. AI Loading State

Use:

```text
Searching SRM AP Wiki...
```

rather than:

```text
Thinking...
```

This communicates that the system is retrieving information.

For RAG:

```text
Searching documents...
```

---

# 35. AI Empty / Unknown State

If no verified information is found:

```text
I couldn't find a verified source for that.

Try searching:
• Portals
• Events
• Notices
• Documents
```

Do not produce a confident speculative answer.

---

# 36. AI Follow-up Suggestions

After an answer:

```text
Related

[Show upcoming events]
[Open academic calendar]
[Find examination notices]
```

These should be clickable actions.

---

# 37. Breadcrumbs

Use breadcrumbs on deeper pages.

Example:

```text
Home / Events / Workshops / AI Workshop
```

Mobile:

```text
← Events
```

Do not display long breadcrumb chains on small screens.

---

# 38. Cards

Cards should be used for:

- Events
- Projects
- Organizations
- Portals
- Notices

Do not put every text element inside a card.

Cards should group meaningful objects.

---

# 39. Tables

Use tables for administrative or highly structured information.

Good examples:

```text
Portal status
Crawler status
Source management
Admin content lists
```

Avoid tables for mobile-facing public content.

---

# 40. Typography

Use a modern sans-serif font.

Recommended hierarchy:

```text
Display
48–64px

H1
36–48px

H2
28–36px

H3
20–24px

Body
15–17px

Small
12–14px
```

Use responsive sizing rather than rigid desktop-only values.

---

# 41. Typography Rules

Headings should be:

- Short
- Clear
- Sentence case

Prefer:

```text
Upcoming events
```

over:

```text
UPCOMING EVENTS AND ACTIVITIES
```

Do not overuse uppercase text.

Uppercase is primarily for small metadata/badges.

---

# 42. Color System

The interface should use a restrained color system.

Define semantic tokens:

```text
--background
--surface
--surface-secondary
--text-primary
--text-secondary
--border
--accent
--success
--warning
--danger
```

Do not hard-code colors throughout components.

---

# 43. Color Usage

Use color primarily for meaning.

```text
Accent
→ primary actions

Success
→ verified / active

Warning
→ pending / upcoming deadline

Danger
→ urgent / broken

Neutral
→ metadata
```

Do not make every card colorful.

---

# 44. Dark Mode

Support dark mode if practical.

Dark mode should preserve the same hierarchy.

Do not simply invert colors.

Maintain:

```text
Background contrast
Text readability
Border visibility
Badge readability
Focus states
```

---

# 45. Buttons

Primary:

```text
[Open Portal]
[Register]
[Search]
```

Secondary:

```text
[View Details]
[Read More]
```

Tertiary:

```text
[Original Source ↗]
```

Avoid having multiple primary buttons competing in one component.

---

# 46. External Links

Whenever a link takes the user outside SRM AP Wiki, show:

```text
↗
```

Example:

```text
[Open Portal ↗]
```

This communicates navigation behavior.

---

# 47. Status Indicators

Use compact indicators.

Example:

```text
● VERIFIED
● ONLINE
● UPCOMING
```

Do not use animated indicators unless there is an actual live state.

---

# 48. Loading States

Every asynchronous component needs a loading state.

Use skeletons for:

```text
Event cards
Notice lists
Search results
Pulse
Projects
```

Example:

```text
┌─────────────────────────┐
│ ███████████████         │
│ █████████               │
│ ██████                  │
└─────────────────────────┘
```

Avoid full-screen loading screens for small operations.

---

# 49. Error States

Example:

```text
Something went wrong.

We couldn't load the events.

[Try again]
```

Do not expose backend stack traces.

---

# 50. Empty States

Examples:

### No events

```text
No upcoming events found.

Check back later or explore other categories.
```

### No projects

```text
No projects found for this category.
```

### No notices

```text
No recent notices.
```

Empty states should explain what happened and what the user can do next.

---

# 51. Responsive Breakpoints

Use standard responsive breakpoints.

Suggested:

```text
Mobile
< 640px

Tablet
640px – 1024px

Desktop
1024px+

Large desktop
1440px+
```

The exact breakpoint values may be adjusted to the framework.

---

# 52. Desktop Layout

Maximum content width:

```text
1200–1400px
```

Center the main content.

Avoid extremely wide text lines.

Use:

```text
main content
+
optional sidebar
```

for search/filter pages.

---

# 53. Mobile Layout

Cards become single-column.

Filters become:

```text
[Filters]
```

which opens a bottom sheet.

Navigation becomes bottom navigation.

Sidebars disappear.

---

# 54. Accessibility

The website must support:

- Keyboard navigation
- Visible focus states
- Semantic HTML
- Proper heading hierarchy
- Accessible buttons
- Accessible forms
- Alt text for meaningful images
- Sufficient contrast
- Screen-reader labels

Do not rely solely on color to communicate state.

---

# 55. Keyboard Navigation

Required:

```text
Tab
Shift + Tab
Enter
Escape
Arrow keys where appropriate
```

Search should be keyboard accessible.

AI input should support:

```text
Enter → submit
Shift + Enter → newline
```

---

# 56. Focus States

Every interactive element must have a visible focus state.

Do not remove:

```text
outline
```

without replacing it with an accessible equivalent.

---

# 57. Accessibility Labels

Icons that perform actions must have labels.

Bad:

```text
[🔍]
```

Better:

```text
Search
```

or an accessible `aria-label`.

---

# 58. Animation

Use animation sparingly.

Good:

- Page transitions
- Hover states
- Modal transitions
- Skeleton shimmer
- Expand/collapse

Avoid:

- Constant motion
- Large animated backgrounds
- Excessive parallax
- Distracting AI animations

Animation should communicate state, not decorate the interface.

---

# 59. Interaction Feedback

Actions should provide immediate feedback.

Example:

```text
Saving...
Saved
```

or:

```text
Submitting...
Submitted for review
```

For errors:

```text
Couldn't save.
Try again.
```

---

# 60. Notifications

If browser notifications are supported, permission should be requested only after explaining the benefit.

Example:

```text
Get notified about important SRM AP updates?

[Enable notifications]
[Not now]
```

Do not request notification permission immediately on first page load.

---

# 61. Personalization

If users optionally choose:

```text
Department
Year
Interests
```

the UI can show:

```text
For You

Events
Notices
Projects
Opportunities
```

Personalization must never be required to browse the site.

---

# 62. Homepage Personalization

Do not hide global information behind personalization.

The homepage should always retain:

```text
Latest notices
Current events
Important updates
Search
Quick access
```

Personalized content can appear underneath.

---

# 63. Trust UX

Every factual item should make its source discoverable.

Example:

```text
Mid-Semester Examination Notice

OFFICIAL · VERIFIED

Published 29 Sep 2026

[Read Notice]

Source:
SRM AP official source
```

Users should never wonder:

> "Where did this information come from?"

---

# 64. Source Detail

Clicking the source should reveal:

```text
SOURCE

Official SRM AP source

Original URL
https://...

Last checked
29 Sep 2026

Last verified
29 Sep 2026
```

---

# 65. Homepage Footer

Footer:

```text
SRM AP Wiki

Everything SRM AP, in one place.

Explore
Events
Notices
Projects
Portals
Documents

Information
About
Sources
Submit information
Report an issue

SRM AP Wiki is an information aggregation platform.
Original sources remain authoritative.
```

---

# 66. 404 Page

Use:

```text
404

Page not found.

The information you're looking for
may have moved or been removed.

[Go Home]
[Search SRM AP Wiki]
```

---

# 67. Performance UX

The website should feel fast.

Prioritize:

- Server-side rendering where useful
- Image optimization
- Lazy loading
- Minimal JavaScript
- Pagination
- Cached API responses
- Search debouncing
- Skeleton states

Do not load the entire event/project database on initial page load.

---

# 68. Search Debouncing

Search requests should be debounced.

Do not send an API request for every keystroke.

Example:

```text
User types:
exam

Wait briefly

Send search request
```

---

# 69. Pagination

Use pagination or infinite loading for large datasets.

For desktop search:

```text
1 2 3 4 5 ... Next
```

For mobile:

```text
[Load more]
```

---

# 70. URL Structure

Public URLs should be readable.

Examples:

```text
/portals/examination
/events/ai-workshop
/notices/mid-semester-examination
/projects/campus-navigation
/organizations/robotics-club
/documents/academic-regulations
```

Avoid:

```text
/page?id=1928
```

for public pages.

---

# 71. SEO

Public pages should include:

```text
Title
Description
Canonical URL
OpenGraph metadata
Structured data where appropriate
```

Important pages:

- Events
- Notices
- Organizations
- Projects
- Documents
- Portals

---

# 72. Shareable Pages

Every important entity should have a stable URL.

Users should be able to share:

```text
SRM AP Wiki event
SRM AP Wiki notice
SRM AP Wiki project
SRM AP Wiki portal
```

The recipient should immediately see the relevant content.

---

# 73. Mobile Event Experience

On mobile:

```text
AI Workshop

02 OCT
4:00 PM

Block A

Organized by XYZ

[Register]

[Add to Calendar]

Source
Official
```

Important actions should remain visible without excessive scrolling.

---

# 74. Mobile AI Experience

The AI page should resemble a lightweight search assistant.

```text
Ask SRM AP Wiki

┌─────────────────────────────┐
│ Ask anything...             │
│                         ↑   │
└─────────────────────────────┘

Try:
"What's happening today?"
"Find exam portal"
"Show upcoming workshops"
```

Avoid a visually heavy chat interface.

---

# 75. Design System Components

Create reusable components:

```text
Header
MobileNav
SearchBar
SearchResults
FilterBar
Card
PortalCard
EventCard
NoticeCard
ProjectCard
OrganizationCard
DocumentCard
SourceBadge
VerificationBadge
StatusBadge
PulseCard
SectionHeader
EmptyState
ErrorState
Skeleton
Modal
Drawer
BottomSheet
Pagination
Breadcrumbs
AIMessage
AISourceCard
```

Do not duplicate component implementations.

---

# 76. Design Tokens

Create a central token system.

Example:

```text
colors
spacing
radius
shadows
typography
breakpoints
transitions
```

Use tokens instead of arbitrary values throughout the application.

---

# 77. Border Radius

Use a restrained radius system.

Example:

```text
Small
6px

Medium
10px

Large
14px

Pill
999px
```

Do not make every element extremely rounded.

---

# 78. Shadows

Use subtle shadows only where hierarchy requires them.

Prefer:

```text
border
+
subtle shadow
```

over heavy floating cards.

---

# 79. Grid System

Desktop:

```text
12-column grid
```

Cards:

```text
3-column
4-column
```

depending on content.

Tablet:

```text
2-column
```

Mobile:

```text
1-column
```

---

# 80. Content Density

SRM AP Wiki is an information platform.

Prioritize:

```text
Title
Date
Category
Source
Status
Action
```

Do not fill cards with unnecessary descriptions.

Descriptions should be truncated where appropriate.

---

# 81. Information Hierarchy

Every screen should have:

```text
Primary information
      ↓
Secondary information
      ↓
Metadata
      ↓
Actions
```

Example:

```text
AI Workshop                ← Primary

02 Oct · 4 PM              ← Secondary

Block A · XYZ Club         ← Metadata

[Register]                 ← Action
```

---

# 82. Explore Page UX

The Explore page should feel like the directory root.

```text
EXPLORE

What are you looking for?

┌──────────────┐
│ Portals      │
│ Official     │
└──────────────┘

┌──────────────┐
│ Events       │
│ What's next  │
└──────────────┘

┌──────────────┐
│ Notices      │
│ Latest       │
└──────────────┘

...
```

---

# 83. Pulse vs Home

Home:

> General overview.

Pulse:

> What's changed / happening now.

Do not duplicate the entire homepage on the Pulse page.

---

# 84. Home vs Search

Home should help users discover.

Search should help users locate.

Do not turn the homepage into a giant search-results page.

---

# 85. Home vs AI

Search:

> User knows roughly what they're looking for.

AI:

> User doesn't know where the information is or wants a natural-language answer.

Example:

```text
Search:
"examination"

AI:
"Where do I register for exams?"
```

Both should coexist.

---

# 86. Admin UI

Admin interface can be denser than the public site.

Use:

```text
Sidebar
Data tables
Filters
Bulk actions
Review queues
Status indicators
```

Example:

```text
ADMIN

Dashboard
────────────
Sources
Events
Notices
Projects
Documents
Review Queue
Crawler
System Health
```

---

# 87. Admin Dashboard Layout

```text
ADMIN DASHBOARD

CONTENT

Events       42
Notices      18
Projects     97
Portals      31

REVIEW

4 events
2 notices
7 projects

SYSTEM

128 links online
2 broken
5 changed sources
```

---

# 88. Review UX

Review screen:

```text
NEW CONTENT

AI Workshop

Source:
Official SRM AP source

Detected:
29 Sep 2026

Extracted information:

Title: AI Workshop
Date: 02 Oct
Time: 4 PM
Venue: Block A

[Approve]
[Edit]
[Reject]
```

Show the original source beside or below the extracted information where practical.

---

# 89. User Submission UX

Example:

```text
Submit a Project

Project name
[                    ]

Description
[                    ]

Department
[                    ]

GitHub
[                    ]

Demo
[                    ]

[Submit for Review]
```

After submission:

```text
Your project has been submitted for review.
```

---

# 90. Final UX Principles

The entire interface should follow these principles:

### Discoverability

Users should quickly see what exists.

### Directness

Important actions should require few clicks.

### Source transparency

Users should always be able to identify the original source.

### Consistency

The same content type should look the same everywhere.

### Simplicity

Do not add UI simply because the technology allows it.

### AI as assistance

AI should help users navigate the information system.

### Mobile-first

The website must work well on phones.

### Accessibility

Information should be usable by everyone.

### Trust

Never make unverified information look official.

---

# 91. Final Screen Map

```text
                         SRM AP WIKI
                              │
              ┌───────────────┼────────────────┐
              │               │                │
             HOME           EXPLORE           AI
              │               │                │
      ┌───────┼───────┐       │                │
      │       │       │       ├── Portals      │
    Pulse   Events  Notices   ├── Events       │
      │       │       │       ├── Notices      │
      │       │       │       ├── Projects     │
      │       │       │       ├── Organizations│
      │       │       │       ├── Documents    │
      │       │       │       └── Opportunities│
      │       │       │
      └───────┴───────┘
              │
              ▼
          SEARCH
```

---

# 92. Final Homepage

The finished homepage should approximately communicate:

```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  SRM AP WIKI          Explore  Events  Notices  Pulse       │
│                                      Search     Ask AI       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                     SRM AP Wiki                             │
│                                                             │
│              Everything SRM AP, in one place.               │
│                                                             │
│       ┌─────────────────────────────────────────┐           │
│       │ Search SRM AP Wiki...              🔍 │           │
│       └─────────────────────────────────────────┘           │
│                                                             │
│       Exams · LMS · Library · Events · Calendar             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  QUICK ACCESS                                               │
│                                                             │
│  [Exams] [LMS] [Library] [Calendar] [Hostel] [Fees]         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SRM AP PULSE                                               │
│                                                             │
│  [ 3 New Notices ] [ 5 Events ] [ 2 Deadlines ]             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TODAY AT SRM AP                          [View all →]       │
│                                                             │
│  10:00  AI Workshop                                        │
│  14:00  Guest Lecture                                      │
│  17:00  Club Event                                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  LATEST NOTICES                           [View all →]       │
│                                                             │
│  Examination timetable released        OFFICIAL             │
│  Workshop registration opened          ORGANIZATION          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  STUDENT PROJECTS                        [Explore →]         │
│                                                             │
│  [Project]        [Project]        [Project]                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                     ASK SRM AP WIKI                         │
│                                                             │
│       "Where do I register for exams?"                      │
│                                                             │
│                    [Ask AI →]                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 93. Final Product Experience

The user experience should ultimately be:

```text
OPEN SRM AP WIKI
       │
       ▼
SEE WHAT'S HAPPENING
       │
       ├───────────────┐
       ▼               ▼
SEARCH              BROWSE
       │               │
       └───────┬───────┘
               ▼
          FIND INFORMATION
               │
          Can't find it?
               │
               ▼
             ASK AI
               │
               ▼
       VERIFIED RESULT
               │
               ▼
        ORIGINAL SOURCE
```

The design should make **SRM AP Wiki feel like a single information layer over the fragmented SRM AP web ecosystem**, not like another portal competing with the university's existing portals.