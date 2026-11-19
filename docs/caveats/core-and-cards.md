# Caveats: core and cards

Format: the caveat line of the armory `core` skill, section Reports.

- On Claude Code, the host's subagent prompt makes a subagent add a `Files:` list of absolute paths that no card asks for : skills/setup/templates/agents/coder.md
- A caveat line with an unchecked claim ends with ` : Unverified: ...`, as `research` §1 sets : skills/research/SKILL.md
- A worktree-isolated agent's Bash guard refuses some command shapes (`cd` chained with `git reset`, an inline `node -e` script, a multi-line heredoc, any text with `git switch`, a grep pattern included) : skills/setup/templates/agents/coder.md
  Workaround: run git steps as plain separate commands, edit through the file-write tool, and read a `git switch` search pattern from a file (`grep -f`).
- A Haiku self-probe reports the project CLAUDE.md missing from a Claude Code subagent's context; a Sonnet exact-text probe finds it : skills/delegate/SKILL.md
- A worktree agent cannot check out the task branch while the main checkout has it, so it commits on its own branch cut from the task-branch tip : skills/setup/templates/agents/coder.md
- The hooks `cat` the committed `hooks/main-payload.md` and `hooks/agent-payload.json` from `${CLAUDE_PLUGIN_ROOT}`, so a session gets the installed plugin's last committed build, not this repo's `core` or `core-main` : hooks/hooks.json
- On Claude Code, Edit and Write refuse an existing file not Read first, so each main-session write case needs a read case : skills/core-main/SKILL.md
- A new `.claude/agents/` card is not spawnable right after it lands; the host lists it later in the same session : .claude/agents/coder.md
- On Claude Code, a subagent result's `totalTokens` is its context size at the last turn, not a sum over turns : skills/delegate/SKILL.md
- Subagents get a 5-minute cache TTL even on a subscription, unless `CLAUDE_CODE_SUBAGENT_PROMPT_CACHE_TTL`, `subagentPromptCacheTtl` or frontmatter `experimental.cacheTtl` sets 1h : skills/delegate/SKILL.md
- Hook `additionalContext` over 10,000 characters is not injected; Claude gets only a path and a 2,000-character preview : hooks/hooks.json
- A plugin agent's `agent_type` is `plugin:agent`, a project card's is its bare `name`, so a matcher for `coder` misses a plugin-shipped `coder` : hooks/hooks.json
- `doc-checks.mjs` drops every line that starts with `model:` or `effort:` before it compares a card copy with its template, so a copy that keeps `{{MODEL}}` or `{{EFFORT}}` passes lint : scripts/doc-checks.mjs
- Loading a skill that is already in context injects its full text again; the host does not deduplicate skill loads : skills/core/SKILL.md
- PostCompact stdout never reaches the model, so only SessionStart with source `compact` can re-inject `core` after a compaction : hooks/hooks.json
- SessionStart with source `compact` output lands after the compaction summary, so both marker lines are in context again; the 0.5.0 probe showed it on 2026-11-19 : hooks/hooks.json
- `.worktreeinclude` copies a file into a new worktree, subagent `isolation: worktree` included, only when the file is also gitignored : —
- `user-invocable: false` hides a skill from the `/` menu while the model can still load it; a load through a pointer is not yet probed : —
- A hook command that exits 1 is a non-blocking error: the session goes on and nothing is injected (code.claude.com/docs/en/hooks, read 2026-11-19) : hooks/hooks.json
- SubagentStart takes context only from `hookSpecificOutput.additionalContext` JSON, not from plain stdout (code.claude.com/docs/en/hooks, read 2026-11-19) : hooks/agent-payload.json
- The researcher card loads only `core` and `research`, so a rule that `dnd` adds for researchers reaches one only through the brief : skills/setup/templates/agents/researcher.md
- When armory is enabled at user scope, its hook payloads reach every project, so a `core` rule keyed on a project-context section also fires in projects that never ran `setup` : skills/core/SKILL.md
- `lint` does not compare the `docs/DESIGN.md` §4 load tables with the card load lines, so a card load change leaves both tables stale with no report : docs/DESIGN.md
