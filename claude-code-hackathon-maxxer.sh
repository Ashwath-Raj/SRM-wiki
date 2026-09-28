#!/usr/bin/env bash
# ==============================================================================
# CLAUDE CODE HACKATHON MAXXER — FREE-ONLY BOOTSTRAPPER
# ==============================================================================
#
# Purpose:
#   Turn a fresh Claude Code project into a high-capability, context-efficient,
#   security-aware hackathon harness while enforcing a $0 OpenRouter model policy.
#
# Design goals:
#   - OpenRouter is the only model gateway.
#   - Paid Anthropic/OpenRouter models are NOT configured as defaults.
#   - Free model discovery is dynamic; the free catalog changes.
#   - Skills/plugins/MCPs are installed globally where appropriate.
#   - Project-specific rules, agents, hooks, and task-state live in this repo.
#   - Existing files are backed up; the script is idempotent.
#   - No API key is printed.
#   - No account-rotation automation or quota-evasion logic.
#
# Run:
#   chmod +x ./claude-code-hackathon-maxxer.sh
#   ./claude-code-hackathon-maxxer.sh
#
# Optional:
#   ./claude-code-hackathon-maxxer.sh --dry-run
#   ./claude-code-hackathon-maxxer.sh --skip-plugins
#   ./claude-code-hackathon-maxxer.sh --skip-mcps
#   ./claude-code-hackathon-maxxer.sh --skip-skills
#   ./claude-code-hackathon-maxxer.sh --skip-playwright
#   ./claude-code-hackathon-maxxer.sh --no-backup
#
# After installation:
#   source ~/.config/claude-code/openrouter.sh
#   claude
#
# Recommended test:
#   /status
#
# ==============================================================================

set -Eeuo pipefail
IFS=$'\n\t'

SCRIPT_VERSION="1.0.0"
ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
ROOT_DIR="$(cd "$ROOT_DIR" && pwd)"
CLAUDE_DIR="$ROOT_DIR/.claude"
AGENT_STATE_DIR="$ROOT_DIR/agent-state"
GLOBAL_CFG_DIR="${HOME}/.config/claude-code"
GLOBAL_SKILLS_DIR="${HOME}/.claude/skills"
SOURCE_ROOT="${HOME}/.local/share/claude-hackathon-maxxer/sources"
BACKUP_ROOT="${HOME}/.local/share/claude-hackathon-maxxer/backups"
BIN_DIR="${HOME}/.local/bin"
FREE_PROFILE="${GLOBAL_CFG_DIR}/openrouter.sh"
FREE_MODE_MARKER="${GLOBAL_CFG_DIR}/FREE_ONLY_MODE"
FREE_MODELS_JSON="${GLOBAL_CFG_DIR}/free-models.json"
LOG_FILE="${GLOBAL_CFG_DIR}/install.log"

DRY_RUN=0
SKIP_PLUGINS=0
SKIP_MCPS=0
SKIP_SKILLS=0
SKIP_PLAYWRIGHT=0
NO_BACKUP=0
INSTALL_FIGMA=1
INSTALL_MOBBIN=1
INSTALL_CONTEXT7=1
INSTALL_PLANNING_WITH_FILES=1

C_RESET=$'\033[0m'
C_BOLD=$'\033[1m'
C_GREEN=$'\033[1;32m'
C_BLUE=$'\033[1;34m'
C_YELLOW=$'\033[1;33m'
C_RED=$'\033[1;31m'
C_CYAN=$'\033[1;36m'
C_DIM=$'\033[2m'

emit() {
  local msg="$1"
  if (( DRY_RUN )); then
    printf '%s\n' "$msg" >&2
  else
    printf '%s\n' "$msg" | tee -a "$LOG_FILE" >&2
  fi
}
log()    { emit "${C_BLUE}[maxxer]${C_RESET} $*"; }
ok()     { emit "${C_GREEN}[ok]${C_RESET} $*"; }
warn()   { emit "${C_YELLOW}[warn]${C_RESET} $*"; }
die()    { emit "${C_RED}[fatal]${C_RESET} $*"; exit 1; }
section(){ printf '\n%s\n%s\n' "${C_BOLD}${C_CYAN}== $* ==${C_RESET}" "$(printf '%0.s-' {1..76})" >&2; }

run() {
  if (( DRY_RUN )); then
    printf '%s\n' "${C_DIM}+ $*${C_RESET}" >&2
  else
    "$@"
  fi
}

run_shell() {
  if (( DRY_RUN )); then
    printf '%s\n' "${C_DIM}+ $*${C_RESET}" >&2
  else
    bash -lc "$*"
  fi
}

backup_file() {
  local src="$1"
  [[ -e "$src" ]] || return 0
  (( NO_BACKUP )) && return 0
  local stamp
  stamp="$(date +%Y%m%d-%H%M%S)"
  local dst="${BACKUP_ROOT}/${stamp}${src//\//__}"
  mkdir -p "$(dirname "$dst")"
  cp -a "$src" "$dst"
  warn "Backup created: $dst"
}

has_cmd() { command -v "$1" >/dev/null 2>&1; }

append_unique() {
  local file="$1"
  local line="$2"
  if (( DRY_RUN )); then
    printf '%s\n' "${C_DIM}--- would ensure ${file} contains: ${line}${C_RESET}" >&2
    return 0
  fi
  touch "$file"
  grep -Fqx "$line" "$file" 2>/dev/null || printf '%s\n' "$line" >> "$file"
}

safe_json_write() {
  local file="$1"
  local content="$2"
  mkdir -p "$(dirname "$file")"
  if [[ -e "$file" ]]; then
    backup_file "$file"
  fi
  if (( DRY_RUN )); then
    printf '%s\n' "${C_DIM}--- would write ${file} ---${C_RESET}" >&2
    printf '%s\n' "$content" >&2
  else
    printf '%s\n' "$content" > "$file"
  fi
}

trap 'rc=$?; if (( rc != 0 )); then warn "Installer stopped with exit code ${rc}. Existing files were backed up where enabled."; fi' EXIT

usage() {
  cat <<'EOF'
Claude Code Hackathon Maxxer — free-only bootstrapper

Usage:
  ./claude-code-hackathon-maxxer.sh [options]

Options:
  --dry-run           Show actions without mutating the system/repo.
  --skip-plugins      Skip Claude Code marketplace plugins.
  --skip-mcps         Skip MCP registrations.
  --skip-skills       Skip Agent Skills installations.
  --skip-playwright   Skip Playwright CLI + skills.
  --no-backup         Do not back up existing files before modifying them.
  --help              Show this help.

What this script changes:
  GLOBAL:
    ~/.config/claude-code/openrouter.sh
    ~/.config/claude-code/free-models.json
    ~/.config/claude-code/...
    ~/.claude/skills/...
    ~/.local/bin/claude-hackathon*
    Claude Code user-scope plugins
    Claude Code user-scope MCP servers

  PROJECT:
    CLAUDE.md (managed block only; existing text preserved)
    .claude/settings.json
    .claude/rules/
    .claude/agents/
    .claude/skills/
    .claude/hooks/
    .claude/harness/
    agent-state/

No OpenRouter API key is printed to stdout/stderr by this script.
EOF
}

while (($#)); do
  case "$1" in
    --dry-run) DRY_RUN=1 ;;
    --skip-plugins) SKIP_PLUGINS=1 ;;
    --skip-mcps) SKIP_MCPS=1 ;;
    --skip-skills) SKIP_SKILLS=1 ;;
    --skip-playwright) SKIP_PLAYWRIGHT=1 ;;
    --no-backup) NO_BACKUP=1 ;;
    --help|-h) usage; exit 0 ;;
    *) die "Unknown option: $1" ;;
  esac
  shift
done

if (( ! DRY_RUN )); then
  mkdir -p "$GLOBAL_CFG_DIR" "$BIN_DIR"
  touch "$LOG_FILE"
  chmod 600 "$LOG_FILE" 2>/dev/null || true
fi

section "Preflight"

[[ -d "$ROOT_DIR" ]] || die "Project root not found."

for c in git curl python3; do
  has_cmd "$c" || die "Missing required command: $c"
done

has_cmd node || die "Node.js is required."
has_cmd npm || die "npm is required."
has_cmd npx || die "npx is required."
has_cmd claude || die "Claude Code CLI is not installed or is not on PATH."

NODE_VERSION="$(node --version | sed 's/^v//')"
CLAUDE_VERSION="$(claude --version 2>/dev/null | head -n1 || true)"
GIT_VERSION="$(git --version | head -n1)"

log "Project: $ROOT_DIR"
log "Node: $NODE_VERSION"
log "Git: $GIT_VERSION"
log "Claude: $CLAUDE_VERSION"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  warn "Directory is not a Git repository. The harness can still be installed, but checkpoints will be weaker."
fi

section "Project scaffolding"

mkdir -p \
  "$CLAUDE_DIR/rules" \
  "$CLAUDE_DIR/agents" \
  "$CLAUDE_DIR/skills" \
  "$CLAUDE_DIR/hooks" \
  "$CLAUDE_DIR/harness" \
  "$AGENT_STATE_DIR"

# ---------------------------------------------------------------------------
# Managed CLAUDE.md block
# ---------------------------------------------------------------------------
CLAUDE_MD="$ROOT_DIR/CLAUDE.md"
MANAGED_START="<!-- CLAUDE-HACKATHON-MAXXER:START -->"
MANAGED_END="<!-- CLAUDE-HACKATHON-MAXXER:END -->"

if [[ -e "$CLAUDE_MD" ]]; then
  backup_file "$CLAUDE_MD"
else
  : > "$CLAUDE_MD"
fi

if ! grep -Fq "$MANAGED_START" "$CLAUDE_MD" 2>/dev/null; then
  cat >> "$CLAUDE_MD" <<'EOF'

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
EOF
  ok "Managed CLAUDE.md block installed."
else
  ok "Managed CLAUDE.md block already present."
fi

# ---------------------------------------------------------------------------
# Durable task state
# ---------------------------------------------------------------------------
write_if_missing() {
  local f="$1"
  local body="$2"
  if [[ ! -e "$f" ]]; then
    if (( DRY_RUN )); then
      printf '%s\n' "${C_DIM}--- would create ${f} ---${C_RESET}" >&2
    else
      printf '%s\n' "$body" > "$f"
    fi
  fi
}

write_if_missing "$AGENT_STATE_DIR/GOAL.md" \
"# GOAL

Define the one-sentence outcome this hackathon build must achieve.

## Success criteria
- [ ] Core demo journey works
- [ ] Critical requirements satisfied
- [ ] Tests/verification pass
- [ ] Security review completed
- [ ] Demo environment starts cleanly
"

write_if_missing "$AGENT_STATE_DIR/PLAN.md" \
"# PLAN

## Phase 0 — Requirements
- [ ] Read and normalize the problem statement
- [ ] Record judging criteria
- [ ] Record constraints

## Phase 1 — Design
- [ ] Mobbin research
- [ ] Figma design language
- [ ] Core prototype

## Phase 2 — Architecture
- [ ] System architecture
- [ ] Data model
- [ ] API contracts

## Phase 3 — Implementation
- [ ] Backend foundation
- [ ] Frontend foundation
- [ ] Core features

## Phase 4 — Verification
- [ ] Integration
- [ ] Security
- [ ] E2E
- [ ] Accessibility
- [ ] Demo hardening
"

write_if_missing "$AGENT_STATE_DIR/TASKS.md" "# TASKS

## Current
- [ ] Replace this with the active task

## Backlog
- [ ] Add tasks as they become concrete
"

write_if_missing "$AGENT_STATE_DIR/PROGRESS.md" "# PROGRESS

Use one compact entry per meaningful change.

## Template
- YYYY-MM-DD HH:MM
- Phase:
- Change:
- Verification:
- Commit:
"

write_if_missing "$AGENT_STATE_DIR/DECISIONS.md" "# DECISIONS

Record durable architecture and product decisions only.

Format:
- Decision:
- Reason:
- Alternatives:
- Consequence:
"

write_if_missing "$AGENT_STATE_DIR/BLOCKERS.md" "# BLOCKERS

No known blockers.
"

write_if_missing "$AGENT_STATE_DIR/SESSION.md" "# SESSION

## Start
$(date -Is)

## Resume instructions
Read GOAL.md, PLAN.md, TASKS.md, PROGRESS.md, DECISIONS.md and BLOCKERS.md
before making major changes.
"

ok "Durable agent-state ledger initialized."

# ---------------------------------------------------------------------------
# Project rules
# ---------------------------------------------------------------------------
cat > "$CLAUDE_DIR/rules/free-hackathon.md" <<'EOF'
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
EOF

cat > "$CLAUDE_DIR/rules/design.md" <<'EOF'
# Design Rules

## Pipeline
Requirements
→ Mobbin/reference research
→ Figma context
→ design system
→ implementation
→ Playwright verification
→ accessibility
→ performance
→ visual refinement

## Rules
- Use Mobbin for pattern research, not copying.
- Use official Figma MCP for targeted frames/components/variables.
- Extract tokens before implementing repeated visual values.
- Do not dump entire Figma files into context.
- Do not generate generic UI when an established design language exists.
EOF

cat > "$CLAUDE_DIR/rules/security.md" <<'EOF'
# Security Rules

Protected:
- .env
- .env.*
- secrets/**
- credentials/**

Never:
- commit secrets
- print API keys
- modify provider credentials without explicit user intent
- force-push
- run destructive database operations automatically
- delete cloud infrastructure automatically

Review:
- authn/authz
- input validation
- injection
- XSS
- SSRF
- IDOR
- path traversal
- unsafe deserialization
- secrets
- dependency/supply-chain risks
EOF

cat > "$CLAUDE_DIR/rules/stack-routing.md" <<'EOF'
# Stack Routing

Detect stack from repository markers before loading framework-specific guidance.

package.json / tsconfig.json → TypeScript/JavaScript
React/Next → frontend-design + focused Vercel guidance
pyproject.toml → Python/testing/typing
FastAPI → API validation/security guidance
pom.xml / build.gradle → Java
go.mod → Go
Cargo.toml → Rust
CMakeLists.txt / Makefile → C/C++
Dockerfile / k8s/ → container/infrastructure
SQL migrations / PostgreSQL → schema/migration/testing guidance

Do not preload unrelated language/framework rules.
EOF

# ---------------------------------------------------------------------------
# Local project skills
# ---------------------------------------------------------------------------

mkdir -p \
  "$CLAUDE_DIR/skills/free-model-operations" \
  "$CLAUDE_DIR/skills/hackathon-product" \
  "$CLAUDE_DIR/skills/security-gate" \
  "$CLAUDE_DIR/skills/demo-hardening" \
  "$CLAUDE_DIR/skills/context-hygiene"

cat > "$CLAUDE_DIR/skills/free-model-operations/SKILL.md" <<'EOF'
---
name: free-model-operations
description: Operate Claude Code under the project's $0 OpenRouter policy without quota waste or paid-model drift.
---

# Free Model Operations

1. Confirm the active base URL is OpenRouter.
2. Confirm the selected model is zero-priced.
3. Prefer `openrouter/free`.
4. Use explicit rescue profiles only when quality or availability justifies the switch.
5. Do not create or rotate accounts to evade limits.
6. Before a major task, confirm durable state exists.
7. After a stable feature, commit.
8. If the account quota is exhausted, stop cleanly with state saved.
EOF

cat > "$CLAUDE_DIR/skills/hackathon-product/SKILL.md" <<'EOF'
---
name: hackathon-product
description: Drive the complete hackathon product workflow from requirements through design, implementation, verification, security, and demo hardening.
---

# Hackathon Product

## Order
1. Requirements
2. UX research
3. Design language
4. Figma prototype
5. Architecture
6. Backend
7. Frontend
8. Integration
9. Security
10. E2E
11. Accessibility
12. Demo hardening

## Rule
Do not mass-implement before the active architecture and primary user journey are understood.

Keep summaries short and write durable state to `agent-state/`.
EOF

cat > "$CLAUDE_DIR/skills/security-gate/SKILL.md" <<'EOF'
---
name: security-gate
description: Perform a focused security review of a feature or release candidate.
---

# Security Gate

Inspect:
- authentication
- authorization
- object-level access control
- input validation
- injection
- XSS
- SSRF
- IDOR
- path traversal
- uploads
- secrets
- unsafe deserialization
- dependency risks

Produce:
- finding
- evidence
- impact
- remediation
- verification

Never declare software "secure"; report remaining risks.
EOF

cat > "$CLAUDE_DIR/skills/demo-hardening/SKILL.md" <<'EOF'
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
EOF

cat > "$CLAUDE_DIR/skills/context-hygiene/SKILL.md" <<'EOF'
---
name: context-hygiene
description: Prevent context bloat during long Claude Code sessions.
---

# Context Hygiene

- Search before reading.
- Read targeted ranges.
- Never dump huge logs into the main context.
- Delegate context-heavy exploration.
- Return artifact paths plus concise evidence.
- Put durable state in `agent-state/`.
- Put large reference material beside the relevant skill.
- Prefer deterministic scripts for formatting, extraction and validation.
EOF

ok "Project rules and local skills installed."

# ---------------------------------------------------------------------------
# Agents
# ---------------------------------------------------------------------------
cat > "$CLAUDE_DIR/agents/researcher.md" <<'EOF'
---
name: researcher
description: Repository, requirements, documentation and dependency research. Return findings and paths, not transcripts.
tools: Read, Grep, Glob, WebFetch, Bash
---

You are the research specialist.

Inspect only what is needed.
Search before large reads.
Record durable findings in agent-state/DECISIONS.md or task-specific artifacts.
Do not edit application code unless explicitly asked.
Return:
- DONE/BLOCKED/FAILED
- findings
- files consulted
- commands
- verification evidence
EOF

cat > "$CLAUDE_DIR/agents/architect.md" <<'EOF'
---
name: architect
description: Design system architecture, data model and API contracts before large implementation.
tools: Read, Grep, Glob, Bash
---

You are the architecture specialist.

Produce:
- component boundaries
- data flow
- data model
- API contracts
- authn/authz boundaries
- integration points
- risks
- implementation sequence

Do not perform broad implementation.
Return evidence and artifact paths.
EOF

cat > "$CLAUDE_DIR/agents/frontend-engineer.md" <<'EOF'
---
name: frontend-engineer
description: Implement frontend features against the established design system with visual and accessibility verification.
tools: Read, Grep, Glob, Edit, Write, Bash
---

You own frontend implementation.

Use existing components before inventing new ones.
Follow Figma/design tokens when available.
Handle loading, empty, error and success states.
Run focused checks.
Return changed files and verification evidence.
EOF

cat > "$CLAUDE_DIR/agents/backend-engineer.md" <<'EOF'
---
name: backend-engineer
description: Implement backend APIs, validation, business logic and persistence with explicit error handling.
tools: Read, Grep, Glob, Edit, Write, Bash
---

You own backend implementation.

Validate external input.
Respect authn/authz boundaries.
Keep transport, business logic and persistence concerns separated.
Do not leak secrets or internal database details.
Run focused tests.
Return changed files and verification evidence.
EOF

cat > "$CLAUDE_DIR/agents/test-qa.md" <<'EOF'
---
name: test-qa
description: Verify features with deterministic tests, browser QA and regression checks.
tools: Read, Grep, Glob, Bash
---

You are the verification gate.

Prefer deterministic local commands.
Use Playwright CLI for browser flows.
Test happy path plus important failure states.
Return:
- tests run
- failures
- artifacts/screenshots
- exact commands
- residual risks
EOF

cat > "$CLAUDE_DIR/agents/security-reviewer.md" <<'EOF'
---
name: security-reviewer
description: Focused security review of implementation and diff.
tools: Read, Grep, Glob, Bash
---

Review the changed attack surface.
Inspect authn/authz, input boundaries, secrets, injection, SSRF, XSS, IDOR,
path traversal, unsafe deserialization, uploads and dependency risks.

Do not over-report low-confidence issues.
Return evidence with file/line references where possible.
EOF

cat > "$CLAUDE_DIR/agents/code-reviewer.md" <<'EOF'
---
name: code-reviewer
description: Final high-confidence review for correctness, regressions and project conventions.
tools: Read, Grep, Glob, Bash
---

Review the actual diff and surrounding code.
Look for bugs, broken assumptions, silent failures, missing tests and convention violations.
Do not restate obvious style preferences.
Return only actionable findings with evidence.
EOF

ok "Specialized agents installed."

# ---------------------------------------------------------------------------
# Hook scripts
# ---------------------------------------------------------------------------
cat > "$CLAUDE_DIR/hooks/pretool-free-guard.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

INPUT="$(cat)"
COMMAND="$(python3 - "$INPUT" <<'PY'
import json,sys
try:
    x=json.loads(sys.argv[1])
    print((x.get("tool_input") or {}).get("command",""))
except Exception:
    print("")
PY
)"

case "$COMMAND" in
  *"git push --force"*|*"git push -f"*|*"git push origin main"*|*"git push origin master"*)
    echo '{"decision":"block","reason":"Free-hackathon guard: protected/force push requires explicit human action."}'
    exit 0
    ;;
  *"rm -rf /"*|*"rm -rf /*"*|*"dropdb "*|*"kubectl delete namespace"*|*"terraform destroy"*)
    echo '{"decision":"block","reason":"Free-hackathon guard: destructive system/infrastructure operation blocked."}'
    exit 0
    ;;
esac

# Prevent accidental display of obvious secret assignments in tool output.
if grep -Eq '(sk-or-v1-|OPENROUTER_API_KEY=sk-|ANTHROPIC_API_KEY=sk-)' <<<"$COMMAND"; then
  echo '{"decision":"block","reason":"Free-hackathon guard: command appears to contain an API key literal."}'
  exit 0
fi

printf '%s\n' '{"decision":"allow"}'
EOF

cat > "$CLAUDE_DIR/hooks/session-bootstrap.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
STATE="$ROOT/agent-state"
mkdir -p "$STATE"

{
  echo "# SESSION BOOT"
  echo
  echo "- time: $(date -Is)"
  echo "- cwd: $ROOT"
  echo
  echo "## Git"
  git -C "$ROOT" status --short 2>/dev/null || true
  echo
  echo "## Task state files"
  ls -1 "$STATE" 2>/dev/null || true
} > "$ROOT/.claude/harness/session-bootstrap.txt"

echo "Hackathon harness ready: free-only OpenRouter mode + durable state."
EOF

cat > "$CLAUDE_DIR/hooks/posttool-state.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
STATE="$ROOT/agent-state"
mkdir -p "$STATE"

{
  echo "- $(date -Is) post-tool checkpoint"
  git -C "$ROOT" status --short 2>/dev/null || true
} >> "$STATE/SESSION.md"
EOF

cat > "$CLAUDE_DIR/hooks/precompact-state.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
STATE="$ROOT/agent-state"
mkdir -p "$STATE"

{
  echo
  echo "## Pre-compact checkpoint $(date -Is)"
  git -C "$ROOT" status --short 2>/dev/null || true
  echo
  echo "Resume from GOAL.md, PLAN.md, TASKS.md, PROGRESS.md, DECISIONS.md and BLOCKERS.md."
} >> "$STATE/SESSION.md"
EOF

chmod +x "$CLAUDE_DIR/hooks/"*.sh

ok "Deterministic hooks installed."

# ---------------------------------------------------------------------------
# Claude Code project settings
# ---------------------------------------------------------------------------
SETTINGS_FILE="$CLAUDE_DIR/settings.json"

if [[ -e "$SETTINGS_FILE" ]]; then
  backup_file "$SETTINGS_FILE"
fi

cat > "$SETTINGS_FILE" <<'EOF'
{
  "env": {
    "OPENROUTER_FREE_MODE": "1",
    "CLAUDE_CODE_MAX_RETRIES": "2",
    "CLAUDE_CODE_EFFORT_LEVEL": "high",
    "MAX_MCP_OUTPUT_TOKENS": "6000",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "75",
    "ENABLE_PATTERN_RULES": "1",
    "ENABLE_CODE_SECURITY_REVIEW": "0"
  },
  "permissions": {
    "allow": [
      "Bash(git status*)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(git branch*)",
      "Bash(npm test*)",
      "Bash(npm run lint*)",
      "Bash(npm run typecheck*)",
      "Bash(npx tsc*)",
      "Bash(pytest*)",
      "Bash(playwright-cli*)",
      "Bash(npx playwright*)"
    ],
    "deny": [
      "Bash(git push --force*)",
      "Bash(git push -f*)",
      "Bash(git push origin main*)",
      "Bash(git push origin master*)",
      "Bash(rm -rf /)",
      "Bash(rm -rf /*)",
      "Bash(dropdb*)",
      "Bash(terraform destroy*)",
      "Bash(kubectl delete namespace*)"
    ]
  },
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/session-bootstrap.sh"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/pretool-free-guard.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/posttool-state.sh"
          }
        ]
      }
    ],
    "PreCompact": [
      {
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/precompact-state.sh"
          }
        ]
      }
    ]
  }
}
EOF

ok "Project settings installed."

# ---------------------------------------------------------------------------
# Global Free-Only OpenRouter configuration
# ---------------------------------------------------------------------------
section "Free-only OpenRouter provider"

if [[ -e "$FREE_PROFILE" ]]; then
  backup_file "$FREE_PROFILE"
fi

EXISTING_KEY=""
if [[ -f "$FREE_PROFILE" ]]; then
  EXISTING_KEY="$(python3 - "$FREE_PROFILE" <<'PY'
import re,sys
p=sys.argv[1]
try:
    text=open(p,encoding="utf-8").read()
except Exception:
    text=""
m=re.search(r'^\s*export\s+OPENROUTER_API_KEY="([^"]*)"\s*$', text, re.M)
print(m.group(1) if m else "")
PY
)"
fi

if [[ -z "${OPENROUTER_API_KEY:-}" && -z "$EXISTING_KEY" && ! $DRY_RUN ]]; then
  printf 'Enter your NEW OpenRouter API key (input hidden): ' >&2
  read -r -s KEY_INPUT
  printf '\n' >&2
  [[ -n "$KEY_INPUT" ]] || die "No OpenRouter key supplied."
  EXISTING_KEY="$KEY_INPUT"
fi

if [[ -n "${OPENROUTER_API_KEY:-}" ]]; then
  EXISTING_KEY="$OPENROUTER_API_KEY"
fi

if [[ -z "$EXISTING_KEY" && $DRY_RUN -eq 0 ]]; then
  die "OpenRouter key is missing."
fi

cat > "$FREE_PROFILE" <<EOF
#!/usr/bin/env bash
# Generated by claude-code-hackathon-maxxer.sh
# Free-only OpenRouter profile. The key is stored locally and never printed.

export OPENROUTER_API_KEY="${EXISTING_KEY}"

export ANTHROPIC_BASE_URL="https://openrouter.ai/api"
export ANTHROPIC_AUTH_TOKEN="\$OPENROUTER_API_KEY"
export ANTHROPIC_API_KEY=""

# Safe default: dynamic zero-priced router.
export ANTHROPIC_DEFAULT_OPUS_MODEL="openrouter/free"
export ANTHROPIC_DEFAULT_SONNET_MODEL="openrouter/free"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="openrouter/free"
export ANTHROPIC_MODEL="openrouter/free"

# Cost/retry/context guards.
export OPENROUTER_FREE_MODE="1"
export CLAUDE_CODE_MAX_RETRIES="2"
export CLAUDE_CODE_EFFORT_LEVEL="high"
export MAX_MCP_OUTPUT_TOKENS="6000"
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE="75"
export ENABLE_PATTERN_RULES="1"
export ENABLE_CODE_SECURITY_REVIEW="0"

# Do not expose or discover paid gateway model menus.
unset CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY
EOF

chmod 600 "$FREE_PROFILE"

cat > "$FREE_MODE_MARKER" <<'EOF'
FREE_ONLY=1
PAID_MODELS=BLOCKED_BY_DEFAULT
ACCOUNT_QUOTA_EVASION=DISABLED
EOF

ok "Free-only OpenRouter profile written."

# ---------------------------------------------------------------------------
# Dynamic free model inventory
# ---------------------------------------------------------------------------
section "Discover zero-priced OpenRouter models"

if (( ! DRY_RUN )); then
  python3 - "$EXISTING_KEY" "$FREE_MODELS_JSON" <<'PY'
import json, sys, urllib.request, urllib.error
key, out = sys.argv[1], sys.argv[2]
req = urllib.request.Request(
    "https://openrouter.ai/api/v1/models",
    headers={
        "Authorization": f"Bearer {key}",
        "User-Agent": "claude-code-hackathon-maxxer/1.0",
    },
)
try:
    with urllib.request.urlopen(req, timeout=20) as r:
        data = json.load(r)
except Exception as e:
    print(f"[warn] Could not fetch OpenRouter model catalog: {e}", file=sys.stderr)
    data = {"data": []}

free=[]
for m in data.get("data", []):
    p=m.get("pricing") or {}
    # OpenRouter prices are commonly decimal strings.
    try:
        prompt=float(p.get("prompt", 1))
        completion=float(p.get("completion", 1))
    except Exception:
        continue
    if prompt == 0 and completion == 0:
        free.append({
            "id": m.get("id"),
            "name": m.get("name"),
            "context_length": m.get("context_length"),
            "architecture": m.get("architecture"),
            "supported_parameters": m.get("supported_parameters", []),
        })

free.sort(key=lambda x: (-(x.get("context_length") or 0), x.get("id") or ""))
json.dump(
    {
        "generated_at": __import__("datetime").datetime.now().astimezone().isoformat(),
        "count": len(free),
        "models": free,
    },
    open(out,"w",encoding="utf-8"),
    indent=2,
)
print(f"Discovered {len(free)} zero-priced models.")
PY
else
  log "Would create free-model inventory: $FREE_MODELS_JSON"
fi

# ---------------------------------------------------------------------------
# Global launcher wrappers
# ---------------------------------------------------------------------------
section "Install one-command launchers"

mkdir -p "$GLOBAL_CFG_DIR/profiles"

write_launcher() {
  local path="$1"
  local body="$2"
  if (( DRY_RUN )); then
    log "Would create launcher: $path"
    return 0
  fi
  if [[ -e "$path" ]]; then
    backup_file "$path"
  fi
  cat > "$path" <<EOF
#!/usr/bin/env bash
set -euo pipefail
$body
EOF
  chmod 755 "$path"
}

write_launcher "$BIN_DIR/claude-hackathon" '
source "$HOME/.config/claude-code/openrouter.sh"
exec claude "$@"
'

write_launcher "$BIN_DIR/claude-hackathon-auto" '
source "$HOME/.config/claude-code/openrouter.sh"
source "$HOME/.config/claude-code/profiles/auto.sh" 2>/dev/null || true
exec claude "$@"
'

write_launcher "$BIN_DIR/claude-hackathon-model" '
source "$HOME/.config/claude-code/openrouter.sh"
MODEL="${1:-openrouter/free}"
shift || true
case "$MODEL" in
  */*|openrouter/free|*:free) ;;
  *) echo "Refusing non-router/non-model identifier." >&2; exit 2 ;;
esac
export ANTHROPIC_MODEL="$MODEL"
export ANTHROPIC_DEFAULT_OPUS_MODEL="$MODEL"
export ANTHROPIC_DEFAULT_SONNET_MODEL="$MODEL"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="$MODEL"
exec claude "$@"
'

cat > "$GLOBAL_CFG_DIR/profiles/auto.sh" <<'EOF'
export ANTHROPIC_MODEL="openrouter/free"
export ANTHROPIC_DEFAULT_OPUS_MODEL="openrouter/free"
export ANTHROPIC_DEFAULT_SONNET_MODEL="openrouter/free"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="openrouter/free"
EOF

cat > "$GLOBAL_CFG_DIR/profiles/model.sh" <<'EOF'
# Usage:
#   source ~/.config/claude-code/openrouter.sh
#   MODEL='provider/model:free' source ~/.config/claude-code/profiles/model.sh
#
# Or use the launcher:
#   claude-hackathon-model provider/model:free
#
# Only zero-priced IDs discovered from OpenRouter should be used.
MODEL="${MODEL:-openrouter/free}"
case "$MODEL" in
  openrouter/free|*:free) ;;
  *) echo "Refusing model without :free suffix (or openrouter/free)." >&2; return 2 ;;
esac
export ANTHROPIC_MODEL="$MODEL"
export ANTHROPIC_DEFAULT_OPUS_MODEL="$MODEL"
export ANTHROPIC_DEFAULT_SONNET_MODEL="$MODEL"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="$MODEL"
EOF

ok "Launchers installed in $BIN_DIR."

# Make ~/.local/bin available in interactive bash.
append_unique "$HOME/.bashrc" 'export PATH="$HOME/.local/bin:$PATH"'
append_unique "$HOME/.bashrc" '# Claude Code Hackathon Maxxer'
append_unique "$HOME/.bashrc" 'alias claude-free="$HOME/.local/bin/claude-hackathon"'
append_unique "$HOME/.bashrc" 'alias claude-free-auto="$HOME/.local/bin/claude-hackathon-auto"'

# ---------------------------------------------------------------------------
# Clone/audit source repositories
# ---------------------------------------------------------------------------
section "Clone selected skill/plugin repositories"

if (( ! DRY_RUN )); then
  mkdir -p "$SOURCE_ROOT"
fi

clone_shallow() {
  local url="$1"
  local dest="$2"
  if [[ -d "$dest/.git" ]]; then
    log "Updating $dest"
    run git -C "$dest" fetch --depth=1 origin
    run git -C "$dest" reset --hard "origin/HEAD" 2>/dev/null || true
  else
    if (( DRY_RUN )); then
      log "Would clone $url -> $dest"
    else
      rm -rf "$dest"
      git clone --depth=1 --filter=blob:none "$url" "$dest"
    fi
  fi
}

clone_shallow "https://github.com/anthropics/claude-plugins-official.git" \
  "$SOURCE_ROOT/claude-plugins-official"

clone_shallow "https://github.com/mobbin/skills.git" \
  "$SOURCE_ROOT/mobbin-skills"

clone_shallow "https://github.com/vercel-labs/agent-skills.git" \
  "$SOURCE_ROOT/vercel-agent-skills"

clone_shallow "https://github.com/OthmanAdi/planning-with-files.git" \
  "$SOURCE_ROOT/planning-with-files"

ok "Reference repositories cloned shallowly."

# ---------------------------------------------------------------------------
# Skills installer
# ---------------------------------------------------------------------------
section "Install focused Agent Skills globally"

install_skill() {
  local repo="$1"
  shift
  run_shell "npx skills add \"$repo\" \"$@\" -g -a claude-code -y"
}

if (( ! SKIP_SKILLS )); then
  # Mobbin
  install_skill "mobbin/skills" --skill "mobbin-search"

  # Vercel focused skills
  install_skill "vercel-labs/agent-skills" \
    --skill "vercel-react-best-practices" \
    --skill "vercel-composition-patterns" \
    --skill "web-design-guidelines"

  ok "Focused skills installed."
else
  warn "Skipping Agent Skills installation."
fi

# ---------------------------------------------------------------------------
# Playwright CLI + skills
# ---------------------------------------------------------------------------
section "Install Playwright CLI + skills"

if (( ! SKIP_PLAYWRIGHT )); then
  run npm install -g @playwright/cli@latest
  run_shell 'playwright-cli install --skills -g'
  ok "Playwright CLI + global skills installed."
else
  warn "Skipping Playwright installation."
fi

# ---------------------------------------------------------------------------
# Claude Code marketplace plugins
# ---------------------------------------------------------------------------
section "Install Claude Code plugins"

install_plugin() {
  local name="$1"
  if (( DRY_RUN )); then
    log "Would install plugin: ${name}@claude-plugins-official"
    return
  fi

  if claude plugin install "${name}@claude-plugins-official" >/tmp/claude-plugin-install.out 2>&1; then
    ok "Plugin installed/available: $name"
    return
  fi

  warn "Direct install failed for $name; adding official marketplace and retrying."
  claude plugin marketplace add anthropics/claude-plugins-official >/tmp/claude-marketplace.out 2>&1 || true

  if claude plugin install "${name}@claude-plugins-official" >/tmp/claude-plugin-install-retry.out 2>&1; then
    ok "Plugin installed after marketplace registration: $name"
  else
    warn "Plugin $name could not be installed automatically. See ~/.config/claude-code/install.log."
  fi
}

if (( ! SKIP_PLUGINS )); then
  install_plugin "frontend-design"
  install_plugin "feature-dev"
  install_plugin "pr-review-toolkit"
  install_plugin "security-guidance"
  install_plugin "hookify"
  install_plugin "commit-commands"
  install_plugin "figma"

  if (( INSTALL_PLANNING_WITH_FILES )); then
    if ! claude plugin install planning-with-files@planning-with-files >/tmp/pwf-install.out 2>&1; then
      claude plugin marketplace add OthmanAdi/planning-with-files >/tmp/pwf-marketplace.out 2>&1 || true
      claude plugin install planning-with-files@planning-with-files >/tmp/pwf-install-retry.out 2>&1 || \
        warn "planning-with-files plugin install failed; its source repo is cloned for manual recovery."
    else
      ok "planning-with-files installed."
    fi
  fi
else
  warn "Skipping Claude Code plugin installation."
fi

# ---------------------------------------------------------------------------
# MCPs
# ---------------------------------------------------------------------------
section "Install user-scope MCPs"

mcp_add_http() {
  local name="$1"
  local url="$2"
  if (( DRY_RUN )); then
    log "Would register MCP: $name -> $url"
    return
  fi

  # Remove stale entry if it exists. Failure is harmless.
  claude mcp remove --scope user "$name" >/dev/null 2>&1 || true
  if claude mcp add --scope user --transport http "$name" "$url" >/tmp/claude-mcp.out 2>&1; then
    ok "MCP registered: $name"
  else
    warn "MCP registration failed: $name"
  fi
}

if (( ! SKIP_MCPS )); then
  if (( INSTALL_MOBBIN )); then
    mcp_add_http "mobbin" "https://api.mobbin.com/mcp"
  fi

  # Context7 is installed via its official setup flow; it can run anonymously.
  if (( INSTALL_CONTEXT7 )); then
    if (( DRY_RUN )); then
      log "Would run: npx ctx7 setup --mcp --claude --yes"
    else
      if npx ctx7 setup --mcp --claude --yes >/tmp/context7-setup.out 2>&1; then
        ok "Context7 configured."
      else
        warn "Context7 setup failed. Run: npx ctx7 setup --claude"
      fi
    fi
  fi
else
  warn "Skipping MCP registration."
fi

# ---------------------------------------------------------------------------
# Free model profile discovery helpers
# ---------------------------------------------------------------------------
section "Install free-model inspection helper"

cat > "$BIN_DIR/claude-free-models" <<'EOF'
#!/usr/bin/env python3
import json
import os
from pathlib import Path

p = Path.home()/".config/claude-code/free-models.json"
if not p.exists():
    print("No free-model inventory yet. Re-run the bootstrapper.")
    raise SystemExit(1)

data = json.loads(p.read_text())
print(f"Generated: {data.get('generated_at')}")
print(f"Zero-priced models: {data.get('count', 0)}")
print()
for m in data.get("models", []):
    params = set(m.get("supported_parameters") or [])
    tools = "tools" in params or "tool_choice" in params
    print(
        f"{m.get('id','?')}\t"
        f"context={m.get('context_length') or '?'}\t"
        f"tools={'yes' if tools else 'no'}\t"
        f"{m.get('name','')}"
    )
EOF
chmod 755 "$BIN_DIR/claude-free-models"

cat > "$BIN_DIR/claude-free-status" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

echo "=== Claude Code Hackathon Free Status ==="
echo
echo "Claude:"
claude --version 2>/dev/null || true
echo
echo "Base URL:"
printf '%s\n' "${ANTHROPIC_BASE_URL:-<not loaded>}"
echo
echo "Active model:"
printf '%s\n' "${ANTHROPIC_MODEL:-${ANTHROPIC_DEFAULT_SONNET_MODEL:-<not loaded>}}"
echo
if [[ -n "${OPENROUTER_API_KEY:-}" ]]; then
  echo "OpenRouter key: loaded"
else
  echo "OpenRouter key: not loaded"
fi
echo
echo "Free marker:"
cat "$HOME/.config/claude-code/FREE_ONLY_MODE" 2>/dev/null || true
echo
echo "Use: claude-free-models"
EOF
chmod 755 "$BIN_DIR/claude-free-status"

# ---------------------------------------------------------------------------
# .gitignore additions — keep credentials/local state out
# ---------------------------------------------------------------------------
GITIGNORE="$ROOT_DIR/.gitignore"
if (( ! DRY_RUN )); then
  touch "$GITIGNORE"
fi
append_unique "$GITIGNORE" ".claude/settings.local.json"
append_unique "$GITIGNORE" ".claude/harness/session-bootstrap.txt"
append_unique "$GITIGNORE" ".playwright-cli/"
append_unique "$GITIGNORE" "task_plan.md"
append_unique "$GITIGNORE" "findings.md"
append_unique "$GITIGNORE" "progress.md"

# Note: .claude/agents, rules, project skills and settings.json are intended to
# be shareable and are NOT ignored.

# ---------------------------------------------------------------------------
# Final audit
# ---------------------------------------------------------------------------
section "Audit"

printf 'Project root:               %s\n' "$ROOT_DIR"
printf 'Claude Code:                %s\n' "$CLAUDE_VERSION"
printf 'Free profile:               %s\n' "$FREE_PROFILE"
printf 'Project rules:              %s\n' "$CLAUDE_DIR/rules"
printf 'Project skills:             %s\n' "$CLAUDE_DIR/skills"
printf 'Agents:                     %s\n' "$CLAUDE_DIR/agents"
printf 'Hooks:                      %s\n' "$CLAUDE_DIR/hooks"
printf 'Task state:                 %s\n' "$AGENT_STATE_DIR"
printf 'Skill source cache:         %s\n' "$SOURCE_ROOT"
printf 'Launcher:                   %s\n' "$BIN_DIR/claude-hackathon"
printf 'Free model inventory:       %s\n' "$FREE_MODELS_JSON"

if (( ! DRY_RUN )); then
  # Verify the shell config syntax without sourcing its secret.
  bash -n "$FREE_PROFILE"
  bash -n "$CLAUDE_DIR/hooks/pretool-free-guard.sh"
  bash -n "$CLAUDE_DIR/hooks/session-bootstrap.sh"
  bash -n "$CLAUDE_DIR/hooks/posttool-state.sh"
  bash -n "$CLAUDE_DIR/hooks/precompact-state.sh"

  python3 -m json.tool "$SETTINGS_FILE" >/dev/null

  if grep -q 'openrouter/free' "$FREE_PROFILE"; then
    ok "Free model guard present."
  else
    die "Free model guard missing."
  fi

  if grep -q 'ANTHROPIC_API_KEY=""' "$FREE_PROFILE"; then
    ok "Anthropic API key override is empty."
  else
    die "ANTHROPIC_API_KEY is not explicitly empty."
  fi
fi

section "What to do next"

cat >&2 <<'EOF'
1. Reload the shell:
     source ~/.bashrc
     source ~/.config/claude-code/openrouter.sh

2. Confirm:
     claude-free-status
     claude-free-models

3. Launch from THIS project:
     claude-hackathon

4. Inside Claude Code:
     /status
     /plugin list

5. Recommended first prompt:
     "Read CLAUDE.md and agent-state/*.md.
      Audit this repository. Do not modify files.
      Detect the tech stack, extract requirements, identify the primary user journey,
      and propose the minimum architecture needed for tomorrow's hackathon."

6. Commit the generated harness before implementation:
     git add CLAUDE.md .claude agent-state .gitignore
     git commit -m "chore: install hackathon agent harness"

IMPORTANT:
- Free OpenRouter quotas are account/provider limits; this script does not bypass them.
- If the free quota is exhausted, save state + commit + resume later or switch to
  another legitimate provider you have access to.
- The script never automates account rotation or quota evasion.
- Security-guidance's expensive LLM review layer is disabled by default in this
  free-only profile; its deterministic pattern warnings remain enabled.
EOF

if (( ! DRY_RUN )); then
  ok "Claude Code Hackathon Maxxer installation complete."
else
  ok "Dry-run complete. No changes were applied."
fi
