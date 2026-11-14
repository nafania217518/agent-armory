# Caveats: core and cards

Format: the caveat line of the armory `core` skill, section Reports.

- A control character in `skills/core/SKILL.md` other than tab, CR and LF breaks the SubagentStart JSON of `core-context.sh` : scripts/core-context.sh
- A CRLF `skills/core/SKILL.md` makes `core-context.sh` exit 1 with "missing or has no body", because `/^---$/` does not match `---\r` : scripts/core-context.sh
- `wc -m` counts bytes in the C locale, so it overcounts a `core` that holds non-ASCII characters : skills/core/SKILL.md
- The main-session reply rules in `core` section 2 reach every subagent through the hook : skills/core/SKILL.md
- On Claude Code, the host's subagent prompt makes a subagent add a `Files:` list of absolute paths that no card asks for : skills/setup/templates/agents/coder.md
- A caveat line with an unchecked claim ends with ` : Unverified: ...`, see `review` section Output : skills/review/SKILL.md
- A worktree agent cannot check out the task branch while the main checkout has it, so it commits on its own branch cut from the task-branch tip : skills/setup/templates/agents/coder.md
- A Bash command whose text holds `git rev-parse`, even inside a heredoc, is refused in a worktree-isolated agent, so edit a card through the file-write tool : skills/setup/templates/agents/coder.md
- A Haiku self-probe reports the project CLAUDE.md missing from a Claude Code subagent's context; a Sonnet exact-text probe finds it : skills/delegate/SKILL.md
- A Claude Code subagent spawn costs about 55k tokens before its first tool call : skills/delegate/SKILL.md
