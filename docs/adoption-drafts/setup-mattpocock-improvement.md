# setup ← mattpocock (improvement)

Sources:
- https://github.com/mattpocock/skills `skills/misc/git-guardrails-claude-code/SKILL.md` @5863806 (MIT)
- https://github.com/mattpocock/skills `skills/misc/git-guardrails-claude-code/scripts/block-dangerous-git.sh` @5863806 (MIT)

Status: draft, not adopted

## What it brings

Extends the guard hook of `setup-wshobson-improvement` to git commands that lose work or
leave the machine: push, `clean -f`, `checkout .`, `restore .`. For these the host asks
user, in place of a deny. The "no push without a yes" rule then has a structural check
behind the prose.

## Cons

- `docs/DESIGN.md` §Decisions, 2026-11-02, dropped a push guard: the prose guard held in
  every run. This draft found no later failure on record.
- Ask, not deny: the source exits with a block, which would break `code` §Finish after
  user's yes. With ask, user answers twice for one push: the finish question, then the
  host prompt.
- `reset --hard` stays out of the list: the coder, writer and debugger cards
  hard-reset their worktree at each spawn, so each spawn would prompt.
- `branch -D` is left out too: `code` §Task end step 8 deletes branches after user's
  answer, which would prompt again.
- The source's scope question (project or global settings) does not fit: `setup` MUST NOT
  write hook config into a project (`setup` §Install), so the guard ships with the plugin.
- Depends on `setup-wshobson-improvement` changes 1, 2 and 4.

## Proposed changes

### 1. Ask before a push or a work-losing git command (not skill text)

- Target: the guard-hook script of `setup-wshobson-improvement` change 2 (a coder task)
- Text: on a shell command that holds `git push`, `git clean -f`, `git checkout .` or
  `git restore .`, return the host's ask result with the matched pattern, so the host
  asks user. Every other command keeps the result of the bypass check.
- Why: the push rule of `code` §Branch and plan file is prose only; a slip has no second
  check.
- Evidence needed: a session where an agent pushed, or discarded uncommitted work,
  without user's yes. This draft found none; the 2026-11-02 decision records the opposite.

### 2. Name the asked commands in the setup report

- Target: `setup` §Report (replace "gates that are `off`; the `## Test levels` defaults.")
- Text:
  ```
  gates that are `off`; the `## Test levels` defaults; when the guard hook is present,
  the git commands it asks user about.
  ```
- Why: user should know the host will prompt on a push that a finish answer already
  approved.
- Evidence needed: as change 1.
