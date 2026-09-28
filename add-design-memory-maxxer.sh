#!/usr/bin/env bash
set -Eeuo pipefail

# ============================================================
# DESIGN + MEMORY + CONTEXT ADD-ON FOR THE EXISTING MAXXER
# ============================================================
#
# Adds:
#   - Refero design research MCP + skill
#   - Impeccable design skill
#   - Taste skill
#   - Emil Kowalski animation skills
#   - Task Observer
#   - Claude-Mem (persistent cross-session memory)
#   - Headroom (local context compression / MCP / wrapper)
#
# Intentionally NOT put into the model path:
#   - OmniRoute is NOT inserted in front of OpenRouter here.
#     It is a second gateway/router and would make the already-working
#     provider path harder to reason about. We still clone/research it
#     separately so it can be tested later as a provider failover layer.
#
# Existing harness remains authoritative:
#   OpenRouter free-only -> Claude Code -> skills/MCP/hooks/state
#
# Run from the project root:
#   chmod +x add-design-memory-maxxer.sh
#   ./add-design-memory-maxxer.sh
#
# ============================================================

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
CFG="$HOME/.config/claude-code"
SRC="$HOME/.local/share/claude-hackathon-maxxer/sources"
BIN="$HOME/.local/bin"

mkdir -p "$CFG" "$CFG/profiles" "$SRC" "$BIN"

ok(){ printf '[ok] %s\n' "$*"; }
warn(){ printf '[warn] %s\n' "$*" >&2; }
section(){ printf '\n== %s ==\n' "$*" >&2; }

section "Refreshing upstream sources"

clone_or_update() {
  local url="$1"
  local dest="$2"

  if [[ -d "$dest/.git" ]]; then
    git -C "$dest" fetch --depth=1 origin >/dev/null 2>&1 || true
    git -C "$dest" reset --hard origin/HEAD >/dev/null 2>&1 || true
    ok "Updated $dest"
  else
    git clone --depth=1 --filter=blob:none "$url" "$dest"
    ok "Cloned $dest"
  fi
}

clone_or_update "https://github.com/pbakaus/impeccable.git" \
  "$SRC/impeccable"

clone_or_update "https://github.com/Leonxlnx/taste-skill.git" \
  "$SRC/taste-skill"

clone_or_update "https://github.com/emilkowalski/skills.git" \
  "$SRC/emilkowalski-skills"

clone_or_update "https://github.com/thedotmack/claude-mem.git" \
  "$SRC/claude-mem"

clone_or_update "https://github.com/headroomlabs-ai/headroom.git" \
  "$SRC/headroom"

clone_or_update "https://github.com/sr4p/omniroute.git" \
  "$SRC/omniroute"

clone_or_update "https://github.com/rebelytics/one-skill-to-rule-them-all.git" \
  "$SRC/task-observer"

section "Install design skills"

# Impeccable: one integrated design system / audit skill rather than
# stacking multiple broad visual skills on top of each other.
if command -v npx >/dev/null 2>&1; then
  npx impeccable install
else
  warn "npx unavailable; Impeccable source is cloned for manual install."
fi

# Taste skill: dedicated anti-generic-design layer. It complements rather than
# replaces Impeccable: taste = aesthetic direction, Impeccable = implementation/
# audit discipline.
npx skills add https://github.com/Leonxlnx/taste-skill \
  --skill design-taste-frontend -g -a claude-code -y

# Emil's entire animation skill family. This repo is deliberately specialized,
# so install the complete set rather than guessing one animation skill.
npx skills add https://github.com/emilkowalski/skills \
  --all -g -a claude-code -y

# Task observer: install the cross-agent skill, not a separate framework.
npx skills add https://github.com/rebelytics/one-skill-to-rule-them-all \
  --skill task-observer -g -a claude-code -y || \
  npx skills add https://github.com/rebelytics/one-skill-to-rule-them-all \
  --all -g -a claude-code -y

section "Install Refero skill + MCP"

# Official Refero repo / skill.
npx skills add https://github.com/referodesign/refero_skill \
  --skill refero-design -g -a claude-code -y

claude mcp remove --scope user refero >/dev/null 2>&1 || true
claude mcp add --scope user --transport http refero \
  https://api.refero.design/mcp
ok "Refero MCP registered"

section "Install Claude-Mem"

# Official install path sets up hooks + worker + plugin.
# Does not inject a provider into your existing OpenRouter path.
npx claude-mem install --ide claude-code

section "Install Headroom"

# Install locally as a tool/library. We do NOT put it in front of Claude Code
# automatically because it would create another proxy layer over OpenRouter.
python3 -m pip install --user --upgrade "headroom-ai[all]" >/tmp/headroom-install.log 2>&1 || {
  warn "Headroom pip install failed. See /tmp/headroom-install.log"
}

# Expose a safe inspect helper.
cat > "$BIN/headroom-status" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
if command -v headroom >/dev/null 2>&1; then
  headroom --version || true
  echo
  headroom --help | head -40 || true
else
  echo "headroom CLI not on PATH"
fi
EOF
chmod 755 "$BIN/headroom-status"

section "Keep OmniRoute out of the live model path"

cat > "$CFG/omniroute-not-active" <<'EOF'
OmniRoute source is cached at:
~/.local/share/claude-hackathon-maxxer/sources/omniroute

Do NOT set ANTHROPIC_BASE_URL to OmniRoute in the free-only hackathon profile.

Current live path:
Claude Code -> OpenRouter -> openrouter/free

OmniRoute is reserved for a later benchmarked provider/router experiment.
This avoids introducing two routing layers and accidental paid fallbacks.
EOF

section "Write design-memory policy"

mkdir -p "$ROOT/.claude/rules"

cat > "$ROOT/.claude/rules/design-stack.md" <<'EOF'
# Design Stack

## Research
1. Refero — mandatory design research for styles, screens and flows.
2. Mobbin — concrete real-product screen references.
3. Figma — project-specific design source of truth.

## Synthesis
- Do not average references into generic UI.
- Record the design direction before implementation.
- Preserve product constraints and confirmed brand assets.
- Use the project's DESIGN.md when Impeccable creates it.

## Implementation
- Impeccable owns broad visual/UX audit and polish.
- Taste skill supplies anti-generic visual direction.
- Emil Kowalski skills own motion/animation decisions.
- Playwright verifies the rendered result.

## Overlap rules
- Do not use generic frontend-design as the final visual authority if Refero + Impeccable + Taste have established a direction.
- Animation skills only govern motion; they do not override layout/color/typography decisions.
EOF

cat > "$ROOT/.claude/rules/memory-stack.md" <<'EOF'
# Memory Stack

## Native memory
Use Claude Code native auto memory for durable project facts and learned conventions.

## Agent-state
Use agent-state/ for current execution truth:
GOAL, PLAN, TASKS, PROGRESS, DECISIONS, BLOCKERS, SESSION.

## Claude-Mem
Use Claude-Mem for cross-session observational memory and retrieval.
Do not treat it as the authoritative task ledger.

## Task Observer
Use Task Observer to capture reusable workflow friction, recurring corrections,
and opportunities to improve project skills.

## Headroom
Use Headroom for local context compression and diagnostics where it is safe.
Never compress protected secrets or the user's exact instructions.
Do not place Headroom as an unbenchmarked proxy in the live provider path.
EOF

ok "Design + memory policy installed"

section "Final checks"

source "$CFG/openrouter.sh" 2>/dev/null || true
echo "OpenRouter base: ${ANTHROPIC_BASE_URL:-<unset>}"
echo "OpenRouter model: ${ANTHROPIC_MODEL:-${ANTHROPIC_DEFAULT_SONNET_MODEL:-<unset>}}"

echo
echo "MCP:"
claude mcp list || true

echo
echo "Key skill directories:"
for d in \
  impeccable \
  design-taste-frontend \
  mobbin-search \
  refero-design \
  playwright-cli \
  find-docs \
  task-observer
do
  [[ -e "$HOME/.claude/skills/$d" ]] && echo "  ✓ $d" || echo "  - $d (may be plugin-scoped)"
done

echo
echo "Claude-Mem:"
command -v claude-mem >/dev/null 2>&1 && claude-mem status || warn "Claude-Mem CLI not found on PATH; restart shell before checking."

echo
echo "Headroom:"
"$BIN/headroom-status" || true

echo
echo "DONE — current live model path was NOT replaced."
echo "Live provider remains OpenRouter free-only."
