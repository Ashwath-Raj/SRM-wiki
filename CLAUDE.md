
<!-- CLAUDE-HACKATHON-MAXXER:START -->
# Hackathon Harness — Free-Only Mode

## Mission
Build a competition-ready product with a real design system, correct architecture,
working core flows, verification, security review, and demo reliability.

## Provider policy
- This project is operating in **free-only mode**.
- Never intentionally select a paid Anthropic/OpenRouter model.
- Prefer `openrouter/free` unless an explicit free rescue profile is selected.
- Do not create or rotate accounts to evade provider quotas.
- If the OpenRouter free quota is exhausted, preserve task state, commit work,
  and stop rather than silently switching to a paid route.

## Execution policy
- Search before reading large files.
- Read targeted ranges instead of dumping entire files.
- Delegate context-heavy exploration to a specialist agent.
- Use worktrees for genuinely parallel write-heavy tasks.
- Return evidence and artifact paths rather than transcript dumps.
- Never claim a feature works without verification evidence.
- Commit after each meaningful feature or stable checkpoint.

## Product workflow
requirements
→ research
→ design language
→ Figma prototype
→ architecture
→ backend
→ frontend
→ integration
→ security
→ E2E
→ accessibility
→ demo hardening

Security is continuous, with a dedicated final review.

## MCP discipline
Do not activate every MCP server at once.
Use design MCPs during design, docs tools when library knowledge is required,
and browser automation during implementation/QA.

## State
Use `agent-state/` for durable execution truth:
- GOAL.md
- PLAN.md
- TASKS.md
- PROGRESS.md
- DECISIONS.md
- BLOCKERS.md
- SESSION.md

Native Claude Code auto memory is for learned facts, not the current execution ledger.
<!-- CLAUDE-HACKATHON-MAXXER:END -->
