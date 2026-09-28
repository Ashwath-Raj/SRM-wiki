# Claude Code Hackathon Maxxer — Free-Only

This bootstrapper is designed for the temporary hackathon setup discussed in chat.

## What it does

- Configures Claude Code to use OpenRouter's zero-priced `openrouter/free` route by default.
- Preserves `ANTHROPIC_API_KEY=""` and `ANTHROPIC_AUTH_TOKEN` compatibility for the OpenRouter gateway.
- Creates free-only launchers and a dynamic free-model inventory from OpenRouter's model catalog.
- Installs selected official Claude Code plugins:
  - frontend-design
  - feature-dev
  - pr-review-toolkit
  - security-guidance (LLM review disabled in the free profile; pattern warnings stay on)
  - hookify
  - commit-commands
  - figma
- Installs the planning-with-files plugin.
- Installs global Agent Skills from Mobbin and Vercel's Agent Skills repository.
- Installs Playwright CLI + global skills.
- Configures Context7 for Claude Code.
- Registers Mobbin MCP at user scope.
- Creates project-specific rules, agents, skills, hooks, durable `agent-state/`, and permission guards.
- Backups existing configuration files before changing them unless `--no-backup` is supplied.

## Run

From the project root:

```bash
chmod +x ./claude-code-hackathon-maxxer.sh
./claude-code-hackathon-maxxer.sh
```

For a preview:

```bash
./claude-code-hackathon-maxxer.sh --dry-run
```

Then:

```bash
source ~/.bashrc
source ~/.config/claude-code/openrouter.sh
claude-free-status
claude-hackathon
```

## Important

This script does NOT automate free-tier quota evasion or account rotation. It also does not promise unlimited free inference. It is designed to maximize useful work while preserving recoverable project state.

The repository/tool choices reflect the user's supplied Claude Code research documents and current public installation instructions where those instructions were time-sensitive.
