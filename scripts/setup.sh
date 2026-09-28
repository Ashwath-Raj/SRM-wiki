#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

log()  { printf '\n[setup] %s\n' "$*"; }
warn() { printf '\n[setup][WARN] %s\n' "$*" >&2; }
fail() { printf '\n[setup][ERROR] %s\n' "$*" >&2; exit 1; }
have() { command -v "$1" >/dev/null 2>&1; }

WITH_OPTIONAL=1
for arg in "$@"; do
  case "$arg" in
    --no-optional) WITH_OPTIONAL=0 ;;
    -h|--help)
      cat <<'USAGE'
Usage: bash scripts/setup.sh [--no-optional]

Bootstraps the portable hackathon Claude Code environment on Linux.

Installs/configures:
  - Claude Code
  - hard free-only OpenRouter routing
  - portable Agent Skills from Anthropic, Vercel, wshobson, Mobbin,
    Refero, Taste, Emil Kowalski, Task Observer, Context7 and Playwright
  - official Claude Code plugins used by this harness
  - Claude-Mem
  - Figma, Mobbin, Refero, Context7 and Playwright MCPs
  - Impeccable
  - optional Headroom and OmniRoute research tools (never put on the live path)

Secrets are stored outside the repository.
No Git commit or push is performed by this script.
USAGE
      exit 0
      ;;
    *) fail "Unknown argument: $arg (use --help)" ;;
  esac
done

log "Checking prerequisites"
have git || fail "Git is required."
have curl || fail "curl is required."
have node || fail "Node.js is required for the skills/MCP installers."
have npm || fail "npm is required."
have npx || fail "npx is required."

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 20 ]; then
  fail "Node.js 20+ is required by the current toolchain. Found $(node -v)."
fi

log "Checking project-side harness"
for required in CLAUDE.md .claude/settings.json .claude/rules .claude/hooks agent-state; do
  [ -e "$ROOT/$required" ] || fail "Missing repository harness path: $required"
done
chmod +x .claude/hooks/*.sh 2>/dev/null || true

log "Installing/updating Claude Code"
if ! have claude; then
  curl -fsSL https://claude.ai/install.sh | bash
  export PATH="$HOME/.local/bin:$HOME/bin:$PATH"
fi
have claude || fail "Claude Code installation completed but 'claude' is not on PATH. Open a new terminal and rerun setup."

log "Configuring free-only OpenRouter"
CONFIG_DIR="$HOME/.config/claude-code"
mkdir -p "$CONFIG_DIR"
chmod 700 "$CONFIG_DIR"
OPENROUTER_FILE="$CONFIG_DIR/openrouter.sh"

if [ -n "${OPENROUTER_API_KEY:-}" ]; then
  OPENROUTER_KEY="$OPENROUTER_API_KEY"
else
  printf 'OpenRouter API key (input hidden): '
  IFS= read -r -s OPENROUTER_KEY
  printf '\n'
fi
[ -n "$OPENROUTER_KEY" ] || fail "No OpenRouter API key supplied."

# Recreate the machine-local secret file. %q gives bash-safe quoting.
{
  printf '%s\n' '# Machine-local Claude Code free-only OpenRouter configuration.'
  printf '%s\n' '# DO NOT COMMIT THIS FILE.'
  printf 'export OPENROUTER_API_KEY=%q\n' "$OPENROUTER_KEY"
  printf '%s\n' 'export ANTHROPIC_BASE_URL="https://openrouter.ai/api"'
  printf '%s\n' 'export ANTHROPIC_AUTH_TOKEN="$OPENROUTER_API_KEY"'
  printf '%s\n' 'export ANTHROPIC_API_KEY=""'
  printf '%s\n' 'export ANTHROPIC_MODEL="openrouter/free"'
  printf '%s\n' 'export ANTHROPIC_DEFAULT_OPUS_MODEL="openrouter/free"'
  printf '%s\n' 'export ANTHROPIC_DEFAULT_SONNET_MODEL="openrouter/free"'
  printf '%s\n' 'export ANTHROPIC_DEFAULT_HAIKU_MODEL="openrouter/free"'
  printf '%s\n' 'export CLAUDE_CODE_SUBAGENT_MODEL="openrouter/free"'
  printf '%s\n' 'export CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT="1"'
  printf '%s\n' 'export CLAUDE_CODE_MAX_CONTEXT_TOKENS="200000"'
  printf '%s\n' 'export CLAUDE_CODE_MAX_RETRIES="2"'
  printf '%s\n' 'export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE="75"'
} > "$OPENROUTER_FILE"
chmod 600 "$OPENROUTER_FILE"

# Load for this process and future interactive shells.
# Keep the profile change idempotent.
source "$OPENROUTER_FILE"
PROFILE_SNIPPET='[ -f "$HOME/.config/claude-code/openrouter.sh" ] && . "$HOME/.config/claude-code/openrouter.sh"'
for profile in "$HOME/.bashrc" "$HOME/.zshrc"; do
  touch "$profile"
  grep -Fqx "$PROFILE_SNIPPET" "$profile" || printf '\n%s\n' "$PROFILE_SNIPPET" >> "$profile"
done

log "Installing portable Agent Skills globally"
install_skills_repo() {
  local repo="$1"
  log "Skills: $repo"
  npx --yes skills@latest add "$repo" --all --global --copy || warn "Skills install failed for $repo; rerun setup later to retry."
}

install_skills_repo "anthropics/skills"
install_skills_repo "wshobson/agents"
install_skills_repo "vercel-labs/agent-skills"
install_skills_repo "mobbin/skills"
install_skills_repo "https://github.com/referodesign/refero_skill"
install_skills_repo "senlindesign/taste-skill"
install_skills_repo "emilkowalski/skills"
install_skills_repo "rebelytics/one-skill-to-rule-them-all"
install_skills_repo "microsoft/playwright"

log "Installing the Context7 find-docs skill"
npx --yes skills@latest add https://github.com/upstash/context7 --skill find-docs --global --copy -y \
  || warn "Context7 skill install failed; MCP registration will still be attempted."

log "Registering Claude Code marketplaces"
claude plugin marketplace add anthropics/claude-plugins-official --scope user >/dev/null 2>&1 || true
claude plugin marketplace add thedotmack/claude-mem --scope user >/dev/null 2>&1 || true
claude plugin marketplace add referodesign/refero_skill --scope user >/dev/null 2>&1 || true
claude plugin marketplace add pbakaus/impeccable --scope user >/dev/null 2>&1 || true

log "Installing official Claude Code plugins used by this harness"
OFFICIAL_PLUGINS=(
  claude-code-setup
  claude-md-management
  code-review
  code-simplifier
  commit-commands
  feature-dev
  figma
  frontend-design
  hookify
  planning-with-files
  plugin-dev
  pr-review-toolkit
  security-guidance
)
for plugin in "${OFFICIAL_PLUGINS[@]}"; do
  claude plugin install "$plugin@claude-plugins-official" --scope user >/dev/null 2>&1 \
    || warn "Could not install official plugin: $plugin"
done

log "Installing Claude-Mem"
claude plugin install claude-mem --scope user >/dev/null 2>&1 \
  || warn "Claude-Mem plugin installation failed; rerun setup and/or use the documented marketplace install."

log "Installing Refero"
claude plugin install refero@refero --scope user >/dev/null 2>&1 \
  || warn "Refero plugin installation failed; the standalone skill and MCP registration will still be attempted."

log "Installing Impeccable globally"
npx --yes impeccable install -y --providers=claude --scope=global \
  || warn "Impeccable global install failed. The repo already contains the project skill; rerun this step later if necessary."

log "Registering user-scope MCP servers"
add_http_mcp() {
  local name="$1"
  local url="$2"
  if claude mcp get "$name" >/dev/null 2>&1; then
    printf '[setup] MCP already present: %s\n' "$name"
    return 0
  fi
  claude mcp add --scope user --transport http "$name" "$url" >/dev/null 2>&1 \
    || warn "Could not register MCP: $name"
}

add_stdio_mcp() {
  local name="$1"
  shift
  if claude mcp get "$name" >/dev/null 2>&1; then
    printf '[setup] MCP already present: %s\n' "$name"
    return 0
  fi
  claude mcp add --scope user "$name" -- "$@" >/dev/null 2>&1 \
    || warn "Could not register MCP: $name"
}

add_http_mcp "figma" "https://mcp.figma.com/mcp"
add_http_mcp "mobbin" "https://api.mobbin.com/mcp"
add_http_mcp "context7" "https://mcp.context7.com/mcp"
add_http_mcp "refero" "https://api.refero.design/mcp"
add_stdio_mcp "playwright" npx -y @playwright/mcp@latest

if [ -n "${GITHUB_PERSONAL_ACCESS_TOKEN:-}" ]; then
  warn "GITHUB_PERSONAL_ACCESS_TOKEN is present in the environment; this setup script intentionally does not persist it or register an authenticated GitHub MCP automatically."
fi

if [ "$WITH_OPTIONAL" -eq 1 ]; then
  log "Installing optional non-live tools"

  # Headroom is installed for experimentation only. It is NOT placed in the
  # Claude Code request path by this script.
  if have uv; then
    uv tool install --python 3.13 "headroom-ai[all]" \
      || warn "Headroom install failed via uv."
  elif have pipx; then
    pipx install --python python3.13 "headroom-ai[all]" \
      || warn "Headroom install failed via pipx."
  elif have python3; then
    python3 -m pip install --user "headroom-ai[all]" \
      || warn "Headroom install failed via pip; a managed Python environment may be required."
  else
    warn "No Python installer available; skipped Headroom."
  fi

  # OmniRoute is installed but deliberately NOT configured as Claude's model
  # gateway. The live path remains direct -> OpenRouter/free.
  npm install -g omniroute >/dev/null 2>&1 \
    || warn "OmniRoute install failed. It is intentionally not wired into Claude Code."
else
  log "Skipping optional Headroom/OmniRoute tools (--no-optional)"
fi

log "Applying local permissions and validating config"
chmod +x .claude/hooks/*.sh 2>/dev/null || true
if have python3; then
  python3 -m json.tool .claude/settings.json >/dev/null \
    || fail ".claude/settings.json is not valid JSON."
fi

log "Final verification"
printf '\nClaude: '; claude --version || true
printf 'Base URL: %s\n' "${ANTHROPIC_BASE_URL:-<unset>}"
printf 'Model: %s\n' "${ANTHROPIC_MODEL:-<unset>}"
printf 'Subagent model: %s\n' "${CLAUDE_CODE_SUBAGENT_MODEL:-<unset>}"
printf '\nMCP status:\n'
claude mcp list || true

printf '\nInstalled global skill count (canonical/shared): '
if [ -d "$HOME/.agents/skills" ]; then
  find "$HOME/.agents/skills" -mindepth 1 -maxdepth 1 -type d | wc -l
else
  printf '0\n'
fi

cat <<'DONE'

[setup] Bootstrap complete.

NEXT HUMAN STEP:
  1. Start a NEW Claude Code session in this repository.
  2. Run /mcp once and authenticate Figma, Mobbin and Refero if prompted.
  3. Do NOT run /learn-codebase during setup; the project memory layer should remain idle until real work begins.

The live model path is intentionally:
  Claude Code -> OpenRouter -> openrouter/free

Headroom and OmniRoute are installed only as optional tooling and are NOT in the live request path.
No Git commit or push was performed.
DONE
