#!/bin/sh
# Prints the core skill body without its YAML frontmatter, for the plugin hooks.
# SessionStart takes plain stdout. SubagentStart takes only the JSON form, so the body
# goes into hookSpecificOutput.additionalContext there.
root=$(cd "$(dirname "$0")/.." && pwd)
body() {
  awk 'n >= 2 { print; next } /^---$/ { n++ }' "$root/skills/core/SKILL.md"
}
event='"hook_event_name"[[:space:]]*:[[:space:]]*"SubagentStart"'
if cat | grep -Eq "$event"; then
  printf '{"hookSpecificOutput":{"hookEventName":"SubagentStart","additionalContext":"'
  body | awk '
    {
      gsub(/\\/, "\\\\"); gsub(/"/, "\\\""); gsub(/\t/, "\\t"); gsub(/\r/, "\\r")
      printf "%s%s", sep, $0; sep = "\\n"
    }
    END { if (NR) printf "\\n" }'
  printf '"}}\n'
else
  body
fi
