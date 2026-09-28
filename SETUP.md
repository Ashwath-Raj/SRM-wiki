# Portable Claude Code Hackathon Harness

This branch replaces the one-off bootstrap scripts with two repeatable, machine-specific setup entry points:

- `scripts/setup.sh` — Linux
- `scripts/setup.ps1` — Windows PowerShell

The repository remains the portable source of truth for the project harness. Machine-local credentials, plugin caches, OAuth state, Claude-Mem data, and provider-specific settings are not committed.

## Branch intent

The `setup` branch is a local setup/portability branch. It is intentionally **not pushed** by the setup procedure.

The existing project harness from `main` is preserved. This branch only:

1. removes the three one-off maxxer installers used during initial bootstrap;
2. adds the two repeatable platform installers;
3. adds this document.

The new installers do **not** perform repository cleanup when run. Cleanup happens once while creating the `setup` branch, so future runs are idempotent and do not unexpectedly delete project files.

The runtime `.sh` hooks under `.claude/hooks/` are **not** deleted; they are part of the actual Claude Code harness and are different from the old bootstrap installers.

## One-time setup

### Linux

From the repository root:

```bash
bash scripts/setup.sh
```

The script is intentionally safe to rerun: it updates machine-local tooling and configuration but does not delete or rewrite the repository harness.

To skip the optional non-live Headroom/OmniRoute installation:

```bash
bash scripts/setup.sh --no-optional
```

### Windows

Run from PowerShell in the repository root:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\setup.ps1
```

Skip the optional non-live tools with:

```powershell
.\scripts\setup.ps1 -NoOptional
```

Git for Windows is required because the shared project hooks are POSIX shell scripts.

## What the installers configure

### Claude Code

Uses Anthropic's current native installers:

- Linux: `curl -fsSL https://claude.ai/install.sh | bash`
- Windows: `irm https://claude.ai/install.ps1 | iex`

The setup scripts require Node.js 20+ for the broader skills/MCP bootstrap in this repository. Git for Windows is also required on Windows because the shared project hooks are POSIX shell scripts.

### Free-only model path

The local machine configuration is written outside Git:

- Linux: `~/.config/claude-code/openrouter.sh`
- Windows: `%USERPROFILE%\.config\claude-code\openrouter.ps1`

The active path is locked to:

```text
Claude Code
   -> https://openrouter.ai/api
   -> openrouter/free
```

The following model environment variables are all set to `openrouter/free`:

- `ANTHROPIC_MODEL`
- `ANTHROPIC_DEFAULT_OPUS_MODEL`
- `ANTHROPIC_DEFAULT_SONNET_MODEL`
- `ANTHROPIC_DEFAULT_HAIKU_MODEL`
- `CLAUDE_CODE_SUBAGENT_MODEL`

The setup also keeps the explicit context/window settings used by this harness.

**Never commit the machine-local OpenRouter configuration file.**

### Agent Skills

The installer refreshes globally available Agent Skills from:

- Anthropic Skills — `anthropics/skills`
- wshobson Agents — `wshobson/agents`
- Vercel Agent Skills — `vercel-labs/agent-skills`
- Mobbin — `mobbin/skills`
- Refero — `referodesign/refero_skill`
- Taste — `senlindesign/taste-skill`
- Emil Kowalski — `emilkowalski/skills`
- Task Observer — `rebelytics/one-skill-to-rule-them-all`
- Microsoft Playwright — `microsoft/playwright`
- Context7 `find-docs` — `upstash/context7`

The installer targets all detected Agent-Skills-compatible harnesses rather than baking user-specific global skill folders into the Git repository.

### Claude Code plugins

The setup installs the project stack's official plugins at user scope, including:

- `claude-code-setup`
- `claude-md-management`
- `code-review`
- `code-simplifier`
- `commit-commands`
- `feature-dev`
- `figma`
- `frontend-design`
- `hookify`
- `planning-with-files`
- `plugin-dev`
- `pr-review-toolkit`
- `security-guidance`
- `claude-mem`
- Refero
- Impeccable

The official Anthropic marketplace is registered from `anthropics/claude-plugins-official`.

### MCP servers

The setup registers these user-scope MCP servers:

| Server | Endpoint / command | Authentication |
|---|---|---|
| Figma | `https://mcp.figma.com/mcp` | OAuth/browser |
| Mobbin | `https://api.mobbin.com/mcp` | OAuth/browser |
| Context7 | `https://mcp.context7.com/mcp` | No key in this setup |
| Refero | `https://api.refero.design/mcp` | OAuth/browser |
| Playwright | `npx -y @playwright/mcp@latest` | Local |

The setup script does **not** store MCP bearer tokens or OAuth material in the repository.

After the installer finishes, start a **new** Claude Code session and run:

```text
/mcp
```

Authenticate Figma, Mobbin, or Refero when their OAuth flow appears.

Do not run `/learn-codebase` as part of machine setup. The project memory layer should remain idle until actual project work starts.

## Memory/state model

The repository already contains the shared project state under `agent-state/` and the Claude Code configuration under `.claude/`.

The intended split is:

```text
CLAUDE.md                 durable project instructions
.claude/rules/            durable routing/security/design rules
.claude/agents/           specialized agent roles
.claude/skills/           project-portable skills
agent-state/              current execution truth
Claude-Mem                cross-session observations, machine-local
native memory             platform-managed memory
```

Claude-Mem's database/cache remains machine-local. It must not be committed.

## Design stack

The setup preserves the design-routing architecture already committed to the repository:

```text
Refero research
   ↓
Mobbin concrete references
   ↓
Figma source of truth
   ↓
Impeccable structural/visual polish
   ↓
Taste design-direction checks
   ↓
Emil motion/interaction craft
   ↓
Playwright verification
```

## Optional tools that are deliberately NOT on the live model path

The setup can install two previously evaluated tools:

- Headroom — installed as a local experimentation/compression tool.
- OmniRoute — installed as a local gateway/router for separate evaluation.

Neither is configured as Claude Code's `ANTHROPIC_BASE_URL`, proxy, fallback router, or model gateway.

The live model path remains `OpenRouter -> openrouter/free`.

This is intentional: adding a proxy/router layer during the hackathon would introduce another failure surface before it has been benchmarked against the current harness.

Use `--no-optional` / `-NoOptional` on machines where these experiments are not needed.

## Portability boundary

### Committed and portable

- `CLAUDE.md`
- `.claude/agents/`
- `.claude/hooks/`
- `.claude/rules/`
- `.claude/settings.json`
- `.claude/skills/`
- `agent-state/`
- `.gitignore`
- `scripts/setup.sh`
- `scripts/setup.ps1`

### Machine-local and intentionally not committed

- OpenRouter API key
- OAuth credentials/tokens
- `~/.claude.json`
- Claude Code plugin caches
- Claude-Mem database/cache
- global Agent Skill caches
- user shell profiles
- OS-specific binary caches
- editor configuration

This distinction matters because Claude Code plugin installation stores machine-specific installation paths; copying plugin registries or caches across machines can break them.

## Verification

At the end of setup, verify:

```bash
claude --version
claude mcp list
```

and check the model environment:

```bash
printf '%s\n' "$ANTHROPIC_BASE_URL"
printf '%s\n' "$ANTHROPIC_MODEL"
printf '%s\n' "$CLAUDE_CODE_SUBAGENT_MODEL"
```

Expected values:

```text
https://openrouter.ai/api
openrouter/free
openrouter/free
```

On Windows PowerShell:

```powershell
$env:ANTHROPIC_BASE_URL
$env:ANTHROPIC_MODEL
$env:CLAUDE_CODE_SUBAGENT_MODEL
```

## Git workflow for this branch

Create the branch from the clean `main` commit, remove the one-off installers, add the repeatable setup files, inspect the staged diff, and commit locally:

```bash
git switch -c setup
rm -f claude-code-hackathon-maxxer.sh finish-claude-code-maxxer.sh add-design-memory-maxxer.sh
mkdir -p scripts
# copy scripts/setup.sh, scripts/setup.ps1 and SETUP.md into this branch

git add -A
git status
git diff --cached --stat
git diff --cached --name-only

git commit -m "chore: replace one-off harness installers with portable setup"
git status
git log -1 --oneline
```

Do **not** run `git push` for this branch unless the team later decides the setup branch should be published.

## Upstream references

- Claude Code: https://github.com/anthropics/claude-code
- Official Claude Code plugins: https://github.com/anthropics/claude-plugins-official
- Anthropic Skills: https://github.com/anthropics/skills
- wshobson Agents: https://github.com/wshobson/agents
- Vercel Skills CLI: https://github.com/vercel-labs/skills
- Mobbin Skills: https://github.com/mobbin/skills
- Refero Skill: https://github.com/referodesign/refero_skill
- Taste Skill: https://github.com/senlindesign/taste-skill
- Emil Kowalski Skills: https://github.com/emilkowalski/skills
- Task Observer: https://github.com/rebelytics/one-skill-to-rule-them-all
- Playwright Skills: https://github.com/microsoft/playwright
- Claude-Mem: https://github.com/thedotmack/claude-mem
- Impeccable: https://github.com/pbakaus/impeccable
- Headroom: https://github.com/headroomlabs-ai/headroom
- OmniRoute: https://github.com/artzy/OmniRoute
