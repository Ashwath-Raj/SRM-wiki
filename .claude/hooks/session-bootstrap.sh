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
