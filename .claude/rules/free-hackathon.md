# Free Hackathon Operating Rules

## Hard constraints
- This project uses a $0 model policy.
- Do not switch to a paid model.
- Do not use account rotation to evade provider limits.
- If a provider quota is exhausted, preserve state and stop cleanly.

## Request economy
- Combine independent read-only inspection when possible.
- Do not repeat the same documentation lookup.
- Avoid giant MCP payloads.
- Prefer scripts for deterministic transformations.
- Do not run redundant reviewers on the same diff.

## Recovery
Before compaction or session end:
- update agent-state/PROGRESS.md
- update agent-state/TASKS.md
- record decisions
- record blockers
- commit stable work

## Completion evidence
A feature is not complete unless there is evidence from:
- build/typecheck/lint where applicable
- focused tests
- browser QA for UI flows
- security checks for security-sensitive changes
- git diff/status
