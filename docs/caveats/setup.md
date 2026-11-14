# Caveats: setup

Format: the caveat line of the armory `core` skill, section Reports.

- Moving the armory clone breaks the skills symlinked into a host's skill location : skills/setup/SKILL.md
- References to `setup` section Write, Flow or Answer checks resolve to subsections of `setup` section Project context : skills/setup/SKILL.md
- GitHub gives an item's linked branch name only by creating that branch : skills/setup/SKILL.md
- A tracker read binding made before commit c5ce9ea may return an item without its labels : skills/core/SKILL.md
- A GitHub read binding through `gh issue view` or `gh api` shows C1 control characters in caret form, so a body edit built from it changes the item text : skills/setup/SKILL.md
- No reader parses the format lines in the setup and plan templates; `setup` and `plan` copy them as text, so their wording can change without breaking a check : skills/setup/templates/AGENTS.md
