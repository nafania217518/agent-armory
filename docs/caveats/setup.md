# Caveats: setup

Format: the caveat line of the armory `core` skill, section Reports.

- GitHub gives an item's linked branch name only by creating that branch : skills/setup/SKILL.md
- A tracker read binding made before commit c5ce9ea may return an item without its labels : skills/tracking/SKILL.md
- A GitHub read binding through `gh issue view` or `gh api` shows C1 control characters in caret form, so a body edit built from it changes the item text : skills/setup/SKILL.md
- No reader parses the format lines in the setup and requirements templates, except their `§` refs, which skill-graph checks; `setup` and `plan` copy them as text, so their wording can change without breaking a check : skills/setup/templates/AGENTS.md
- An update run skips `setup` §Install except the bullets `setup` §Invocation names, so a new `setup` §Install bullet that an update run needs must join that list : skills/setup/SKILL.md
- Claude Code renders SessionStart hook stdout after `SessionStart:startup hook success: ` on the same line, so the first line of `hooks/main-payload.md` does not start a line in the main session's context : hooks/main-payload.md
- The fallback pointer sits in project context, which the host loads into every subagent, so a subagent that misreads its main-session clause loads `core-main` : skills/setup/SKILL.md
- An update run finds an old pointer only by its opening words "At session start, load the armory `core` skill", so a pointer edit that changes those words leaves old pointers unmatched : skills/setup/SKILL.md
