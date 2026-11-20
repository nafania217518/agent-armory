# setup ← wshobson (improvement)

Sources:
- https://github.com/wshobson/agents `plugins/block-no-verify/skills/block-no-verify-hook/SKILL.md` @9c61ab2 (MIT)
- https://github.com/wshobson/agents `plugins/review-agent-governance/skills/review-agent-setup/SKILL.md` @9c61ab2 (MIT)

Status: draft, not adopted

## What it brings

A guard hook that the plugin ships: before a shell command runs, it denies a git command
that skips git's own hooks or signing (`--no-verify`, `--no-gpg-sign`, `-n` on commit).
`setup` probes it like the `core` hook. Gates that a project runs from git hooks then
cannot be skipped by habit.

## Cons

- `docs/DESIGN.md` §Decisions, 2026-11-02, dropped a guard hook that blocks a push and a
  commit on `<base>`: the prose guard held in every run, and a host script must still let
  an approved push through. This draft blocks only bypass flags, which no armory step
  needs; the push guard is not proposed here (see `setup-mattpocock-improvement`).
- A text match is easy to evade on purpose, for example with `-c core.hooksPath=…`; it
  stops a habit, not an attacker.
- The guard is host-specific: it needs an extended `core` §Host terms `hook` term, and
  `core` sits under the 10,000-character hook cap.
- The approval-flag and signed-receipt gate of review-agent-setup is not proposed: it
  needs extra tools and duplicates `code` §Finish questions.
- The plugin change (hook entry, script, test) is code and config, outside a writer's
  scope; it is described here, not drafted.

## Proposed changes

### 1. Extend the hook term

- Target: `core` §Host terms (replace bullet "hook: host's command that injects `core`")
- Text:
  ```
  - hook: host's command that runs at a host event. The `core` hook injects `core` at
    session and subagent start; the guard hook checks a shell command before it runs.
    Fallback: the pointer (`setup` §Install), and no guard.
  ```
- Why: skills may name only host terms, and today the term covers only the `core` hook.
- Evidence needed: the gain of change 2 (below).

### 2. Plugin ships the guard hook (not skill text)

- Target: plugin hook config and a new script with its test (a coder task, not a skill
  edit)
- Text: on a shell command, deny it with a message when it holds `--no-verify`,
  `--no-gpg-sign`, a shorter prefix of either that git accepts, or a short option group
  with `n` after `commit`. The message tells the agent to fix what the git hook reports.
  Every other command passes. The script reads the command from the event JSON on stdin.
- Why: no armory rule or hook stops a git-hook bypass.
- Evidence needed: a session where an agent ran a commit or push with `--no-verify`. This draft
  found none on record.

### 3. Rule for the agent

- Target: `implement` §Gates per commit (add bullet)
- Text:
  ```
  - A commit, merge or push MUST NOT skip git's own hooks or signing. When a git hook
    fails, the coder MUST fix its cause, or report `stuck:` with its output.
  ```
- Why: the guard needs a rule that names the behavior to do instead (AGENTS.md
  `MUST NOT` rule).
- Evidence needed: as change 2.

### 4. Probe the guard

- Target: `setup` §Self-report (add bullet)
- Text:
  ```
  - Main session MUST also probe the guard hook with one harmless blocked command, a
    dry-run commit with `--no-verify`. Guard MUST count as present only when host denied
    that command. Report MUST say whether it is present.
  ```
- Why: like the `core` hook, a config entry alone does not prove the guard runs.
- Evidence needed: as change 2.
