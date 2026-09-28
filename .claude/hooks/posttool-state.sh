#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
STATE="$ROOT/agent-state"
mkdir -p "$STATE"

{
  echo "- $(date -Is) post-tool checkpoint"
  git -C "$ROOT" status --short 2>/dev/null || true
} >> "$STATE/SESSION.md"
