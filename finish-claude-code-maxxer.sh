#!/usr/bin/env bash
# ============================================================================
# finish-claude-code-maxxer.sh
#
# Completes the previously interrupted hackathon harness WITHOUT reinstalling
# the whole base environment.
#
# It does NOT automate account/quota evasion.
# It keeps OpenRouter in $0-only mode.
# ============================================================================

set -Eeuo pipefail
ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
GLOBAL_CFG="${HOME}/.config/claude-code"
PROFILE="${GLOBAL_CFG}/openrouter.sh"
BIN="${HOME}/.local/bin"
mkdir -p "${GLOBAL_CFG}/profiles" "${BIN}"

say() { printf '\n[maxxer-finish] %s\n' "$*" >&2; }
ok()  { printf '[ok] %s\n' "$*" >&2; }
warn(){ printf '[warn] %s\n' "$*" >&2; }

command -v claude >/dev/null 2>&1 || { echo "Claude Code not found" >&2; exit 1; }
command -v npx >/dev/null 2>&1 || { echo "npx not found" >&2; exit 1; }

say "Hardening OpenRouter free-only profile"

python3 - "$PROFILE" <<'PY'
from pathlib import Path
import re, sys

p = Path(sys.argv[1])
s = p.read_text() if p.exists() else ""

required = {
    "export ANTHROPIC_BASE_URL=": 'export ANTHROPIC_BASE_URL="https://openrouter.ai/api"',
    "export ANTHROPIC_AUTH_TOKEN=": 'export ANTHROPIC_AUTH_TOKEN="$OPENROUTER_API_KEY"',
    "export ANTHROPIC_API_KEY=": 'export ANTHROPIC_API_KEY=""',
    "export ANTHROPIC_MODEL=": 'export ANTHROPIC_MODEL="openrouter/free"',
    "export ANTHROPIC_DEFAULT_OPUS_MODEL=": 'export ANTHROPIC_DEFAULT_OPUS_MODEL="openrouter/free"',
    "export ANTHROPIC_DEFAULT_SONNET_MODEL=": 'export ANTHROPIC_DEFAULT_SONNET_MODEL="openrouter/free"',
    "export ANTHROPIC_DEFAULT_HAIKU_MODEL=": 'export ANTHROPIC_DEFAULT_HAIKU_MODEL="openrouter/free"',
    "export CLAUDE_CODE_SUBAGENT_MODEL=": 'export CLAUDE_CODE_SUBAGENT_MODEL="openrouter/free"',
    "export CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT=": 'export CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT="1"',
    "export CLAUDE_CODE_MAX_CONTEXT_TOKENS=": 'export CLAUDE_CODE_MAX_CONTEXT_TOKENS="200000"',
    "export CLAUDE_CODE_MAX_RETRIES=": 'export CLAUDE_CODE_MAX_RETRIES="2"',
    "export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=": 'export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE="75"',
}

for prefix, line in required.items():
    lines = s.splitlines()
    replaced = False
    out=[]
    for old in lines:
        if old.lstrip().startswith(prefix):
            if not replaced:
                out.append(line)
                replaced=True
            # drop duplicate lines
        else:
            out.append(old)
    if not replaced:
        out.append(line)
    s="\n".join(out).rstrip()+"\n"

p.write_text(s)
PY
chmod 600 "$PROFILE"
ok "Free-only profile hardened; subagents and unknown-model window behavior are covered."

say "Creating status/model helpers"

cat > "${BIN}/claude-free-status" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
echo "=== Claude Code Hackathon Free Status ==="
echo "Claude: $(claude --version 2>/dev/null || echo unknown)"
echo "Base URL: ${ANTHROPIC_BASE_URL:-<unset>}"
echo "Model: ${ANTHROPIC_MODEL:-${ANTHROPIC_DEFAULT_SONNET_MODEL:-<unset>}}"
if [[ -n "${OPENROUTER_API_KEY:-}" ]]; then
  echo "OpenRouter key: loaded"
else
  echo "OpenRouter key: NOT LOADED"
fi
echo "Subagent model: ${CLAUDE_CODE_SUBAGENT_MODEL:-<unset>}"
echo "Unknown-model window enforcement: ${CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT:-0}"
echo "Max context assumption: ${CLAUDE_CODE_MAX_CONTEXT_TOKENS:-<unset>}"
EOF
chmod 755 "${BIN}/claude-free-status"

cat > "${BIN}/claude-free-models" <<'EOF'
#!/usr/bin/env python3
import json
from pathlib import Path

p = Path.home()/".config/claude-code/free-models.json"
if not p.exists():
    print("No cached free-model inventory. Re-run the main bootstrapper to refresh it.")
    raise SystemExit(1)

data=json.loads(p.read_text())
print(f"Cached catalog: {data.get('generated_at','unknown')}")
print(f"Zero-priced models discovered: {data.get('count',0)}")
print()
for m in data.get("models", []):
    params=set(m.get("supported_parameters") or [])
    print(f"{m.get('id','?')}\tctx={m.get('context_length') or '?'}\ttools={'yes' if ('tools' in params or 'tool_choice' in params) else 'no'}")
EOF
chmod 755 "${BIN}/claude-free-models"

export PATH="${BIN}:${PATH}"

say "Installing ALL skills from the major skill repos requested"

# Official Anthropic Agent Skills repository: every exposed skill.
npx skills add anthropics/skills --all -g -a claude-code -y

# wshobson's full Agent Skills catalog: all 183 skills, progressive disclosure.
npx skills add wshobson/agents --all -g -a claude-code -y

# Reconcile the specific vendor skill sources.
npx skills add mobbin/skills --all -g -a claude-code -y
npx skills add vercel-labs/agent-skills --all -g -a claude-code -y

say "Installing remaining official Claude Code plugins"
for plugin in \
  claude-code-setup \
  claude-md-management \
  code-review \
  code-simplifier \
  plugin-dev
do
  if claude plugin install "${plugin}@claude-plugins-official" >/tmp/claude-plugin-finish.out 2>&1; then
    ok "${plugin}"
  else
    warn "Could not install ${plugin}; inspect /tmp/claude-plugin-finish.out"
  fi
done

say "Registering the remaining planned MCPs"

# Figma and Mobbin already exist; this is idempotent.
claude mcp remove --scope user figma >/dev/null 2>&1 || true
claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp

claude mcp remove --scope user mobbin >/dev/null 2>&1 || true
claude mcp add --scope user --transport http mobbin https://api.mobbin.com/mcp

# Context7 full MCP mode. Existing OAuth/device authentication is reused when
# possible; otherwise ctx7 will present its device login flow.
if npx ctx7 setup --mcp --claude --yes >/tmp/context7-finish.out 2>&1; then
  ok "Context7 MCP configured"
else
  warn "Context7 MCP setup did not complete automatically."
  warn "Run: npx ctx7 setup --mcp --claude"
fi

# Microsoft Playwright MCP in addition to the already installed Playwright CLI.
claude mcp remove --scope user playwright >/dev/null 2>&1 || true
claude mcp add --scope user playwright npx @playwright/mcp@latest

say "Optional GitHub MCP registration"
if [[ -n "${GITHUB_PERSONAL_ACCESS_TOKEN:-}" ]]; then
  claude mcp remove --scope user github >/dev/null 2>&1 || true
  claude mcp add --scope user github \
    -e "GITHUB_PERSONAL_ACCESS_TOKEN=${GITHUB_PERSONAL_ACCESS_TOKEN}" \
    -- docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server
  ok "GitHub MCP registered from GITHUB_PERSONAL_ACCESS_TOKEN"
else
  warn "GitHub MCP NOT registered because no GITHUB_PERSONAL_ACCESS_TOKEN is present."
  warn "This is intentional; do not put a GitHub token in this script."
fi

say "Refreshing shell path"
grep -Fqx 'export PATH="$HOME/.local/bin:$PATH"' "${HOME}/.bashrc" 2>/dev/null \
  || echo 'export PATH="$HOME/.local/bin:$PATH"' >> "${HOME}/.bashrc"

say "Final verification"
source "$PROFILE"

echo
echo "===== FREE STATUS ====="
"${BIN}/claude-free-status"

echo
echo "===== MCP ====="
claude mcp list || true

echo
echo "===== PLUGINS ====="
claude plugin list || true

echo
echo "===== SKILLS COUNTS ====="
printf 'Anthropic/Wshobson/etc. installed under ~/.claude/skills: '
find "${HOME}/.claude/skills" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l

echo
echo "DONE."
echo
echo "Next:"
echo "  source ~/.bashrc"
echo "  source ~/.config/claude-code/openrouter.sh"
echo "  claude-free-status"
echo "  claude mcp list"
echo "  claude plugin list"
echo "  claude-hackathon"
