# Caveats: core and cards

Format: the caveat line of the armory `core` skill, section Reports.

- A control character in `skills/core/SKILL.md` other than tab, CR and LF breaks the SubagentStart JSON of `core-context.sh` : scripts/core-context.sh
- A CRLF `skills/core/SKILL.md` makes `core-context.sh` exit 1 with "missing or has no body", because `/^---$/` does not match `---\r` : scripts/core-context.sh
- `wc -m` counts bytes in the C locale, so it overcounts a `core` that holds non-ASCII characters : skills/core/SKILL.md
- The main-session reply rules in `core` section 2 reach every subagent through the hook : skills/core/SKILL.md
- On Claude Code, the host's subagent prompt makes a subagent add a `Files:` list of absolute paths that no card asks for : skills/setup/templates/agents/coder.md
- A caveat line with an unchecked claim ends with ` : Unverified: ...`, see `review` section Output : skills/review/SKILL.md
- A worktree agent cannot check out the task branch while the main checkout has it, so it commits on its own branch cut from the task-branch tip : skills/setup/templates/agents/coder.md
- A Bash command whose text holds `git rev-parse`, or a heredoc body that holds `commit`, is refused in a worktree-isolated agent, so edit a card through the file-write tool : skills/setup/templates/agents/coder.md : Unverified: in a worktree agent, run git commit --allow-empty -m x (expect a pass), then a cat <<EOF whose body holds commit (expect a refusal)
- A Haiku self-probe reports the project CLAUDE.md missing from a Claude Code subagent's context; a Sonnet exact-text probe finds it : skills/delegate/SKILL.md
- A Claude Code subagent spawn costs about 55k tokens before its first tool call : skills/delegate/SKILL.md
- The hook runs `core-context.sh` from `${CLAUDE_PLUGIN_ROOT}`, so it injects the installed plugin's `core`, not this repo's `skills/core/SKILL.md` : hooks/hooks.json
- On Claude Code, Edit and Write refuse an existing file not Read first, so each main-session write case needs a read case : skills/core/SKILL.md
- The writer card, unlike the coder and debugger cards, has no reset-to-commit rule : skills/setup/templates/agents/writer.md
- A new `.claude/agents/` card is not spawnable right after it lands; the host lists it later in the same session : .claude/agents/squire.md
