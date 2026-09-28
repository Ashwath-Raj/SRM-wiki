#!/usr/bin/env bash
set -euo pipefail

INPUT="$(cat)"

COMMAND="$(
  python3 - "$INPUT" <<'PY'
import json
import sys

try:
    data = json.loads(sys.argv[1])
    print((data.get("tool_input") or {}).get("command", ""))
except Exception:
    print("")
PY
)"

deny() {
  python3 - "$1" <<'PY'
import json
import sys

print(json.dumps({
    "hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": sys.argv[1]
    }
}))
PY
}

# Protected Git operations
case "$COMMAND" in
  *"git push --force"*|*"git push -f"*)
    deny "Free-hackathon guard: force-push is blocked."
    exit 0
    ;;
  *"git push origin main"*|*"git push origin master"*)
    deny "Free-hackathon guard: direct push to the protected branch is blocked."
    exit 0
    ;;
esac

# Destructive infrastructure/system operations
case "$COMMAND" in
  *"rm -rf /"*|*"rm -rf /*"*|*"dropdb "*|*"terraform destroy"*|*"kubectl delete namespace"*)
    deny "Free-hackathon guard: destructive operation is blocked."
    exit 0
    ;;
esac

# Obvious literal API-key injection
if grep -Eq 'sk-or-v1-|OPENROUTER_API_KEY=sk-|ANTHROPIC_API_KEY=sk-' <<<"$COMMAND"; then
  deny "Free-hackathon guard: API-key literal detected in command."
  exit 0
fi

# No decision: let Claude Code's normal permission system handle it.
exit 0
