# retro ← gsd (improvement)

Sources: https://github.com/gsd-build/get-shit-done `get-shit-done/workflows/forensics.md` @bdcaab2 (MIT)
Status: draft, not adopted

## What it brings

Git-history signals for `retro`: a stuck fix loop, test churn and scope drift. They give
checkable evidence that does not depend on the session text alone.

## Cons

- The thresholds and phrase lists are guesses in the source too.
- The source checks scope against a per-phase file list. An armory plan file lists no
  files, so scope drift here compares commits with `TR` items, which needs judgment.
- Not taken: crash and abandonment signals (uncommitted changes, orphan worktrees, an old
  last commit). They map to no `retro` class and name no file to change.
- Not taken: the missing-artifact check of the source's own planning files.
- `retro` is at `max-lines: 86`; this change adds about 8 lines.

## Proposed changes

### 1. Git signals
- Target: `retro` §2 Finding classes (add bullet before "Done when")
- Text:
  ```
  - When the session committed, an agent MUST read the git log of its branches for these
    signals, each with confidence high, medium or low:
    - stuck loop: one file in 3 or more commits in a row; high when the subjects are
      alike fixes;
    - test churn: subjects that hold revert, fix test or regression;
    - scope drift: a commit that matches no `TR` of the plan file.
    Each signal MUST be checked as a miss of class Checks and review rules.
  ```
- Why: today a retro reads only the session; a fix loop or out-of-scope commit can pass
  unnoticed when the session text looks calm.
- Evidence needed: a task branch with a stuck loop or scope drift that its retro did not
  report.
