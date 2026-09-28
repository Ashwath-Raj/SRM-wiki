---
name: demo-hardening
description: Break the hackathon demo path and repair reliability issues before presentation.
---

# Demo Hardening

Test:
- cold start
- empty state
- invalid input
- network failure
- auth failure
- refresh/reconnect
- slow API
- mobile viewport
- missing environment configuration

Use Playwright CLI when applicable.
Fix only issues that materially affect the judging/demo path.
Commit the stable result.
