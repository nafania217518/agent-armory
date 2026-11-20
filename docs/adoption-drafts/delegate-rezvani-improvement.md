# delegate ← rezvani (improvement)

Sources: https://github.com/alirezarezvani/claude-skills `engineering/skills/git-worktree-manager/SKILL.md`, `engineering/agenthub/skills/agenthub/SKILL.md`, `engineering/autoresearch-agent/skills/autoresearch-agent/SKILL.md` @f8593c4 (MIT)
Status: draft, not adopted

## What it brings

Makes parallel worktree agents safe for gates that start a server: each gets its own port,
and untracked env files reach the worktree. Adds an opt-in best-of-N run for a `TR` whose
goal is a measured gain, judged by the plan's locked measurement command.

## Cons

- Change 1 is a `setup` item, not a `delegate` rule: the host copies listed files by
  itself (below), so the main-checkout exception is dropped. A `.worktreeinclude` is not
  processed when a `WorktreeCreate` hook is used, and a `**/` pattern inside a wholly
  ignored directory needs the directory named.
- Change 2 helps only when gate commands read the port from the environment.
- Change 3 multiplies coder cost by N, and it needs an exception to "Two agents that run
  at once MUST NOT edit the same file".
- The source's "remove only merged and clean worktrees" rule is left out here:
  `code-superpowers-improvement.md` change 4 covers a refused removal.
- `delegate` is at its `max-lines` (225); changes 2 and 3 add about 10 lines; change 1 edits `setup`, not `delegate`.
- The judge-based form of competing drafts is in `delegate-cek-improvement.md` change 3.

## Proposed changes

### 1. Gitignored env files for a worktree

- Target: `setup` §4 Project context, Write (add bullet)
- Text:
  - Setup MUST write, or propose to user, a `.worktreeinclude` file in the project root
    (gitignore syntax) that lists the project's gitignored env files. Host then copies
    each file that matches it and is gitignored into every worktree it creates with git,
    subagent worktrees included. Done when the file lists each such env file, or user
    declined it.
- Why: a fresh worktree lacks ignored local files, so an integration or e2e gate fails in
  it while it passes in main checkout. Live probe 2026-11-18 (Claude Code 2.1.274): a
  gitignored `.probe-env` listed in `.worktreeinclude` appeared, with its content, in a
  fresh subagent worktree (`isolation: worktree`). Source: host worktrees page, read
  2026-11-18. The `delegate` bullet on main checkout stays as it is.
- Evidence needed: a coder `stuck:` report or gate failure caused by a missing env file
  in its worktree.

### 2. One port range per parallel agent

- Target: `delegate` §Delegation and worktrees (add bullet, after "Two agents that run at
  once MUST NOT edit the same file")
- Text:
  - When two agents that run at once each start a server for a gate, each brief MUST give
    its agent its own port: the base port plus its index times 10.
- Why: two dev servers on one port make one gate fail or test the other agent's code.
- Evidence needed: a gate failure from a port clash between parallel agents.

### 3. Best-of-N for a measured-gain TR

- Target: `delegate` §Delegation and worktrees (add bullet)
- Text:
  - For a `TR` whose goal is a measured gain (`plan` §The plan), main session MAY, after
    user's yes, spawn 2 or 3 coders at once on the same brief, each in its own worktree;
    the same-file ban does not hold between them. The plan's measurement command MUST
    decide, run by main session on each branch, and each brief MUST name it as a boundary
    the coder must not change. Main session MUST merge only the best branch, keep each
    other one as the tag `attempt/<TR id>-<n>`, and name the scores in the task report.
    Done when one branch is merged and each other one is tagged.
- Why: a tuning task with a fixed metric can gain from independent attempts, and the
  locked command stops an attempt from winning by changing the measure.
- Evidence needed: a measured-gain `TR` whose single attempt missed its bar, where a
  second attempt met it.
