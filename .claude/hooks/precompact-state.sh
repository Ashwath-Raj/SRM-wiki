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
