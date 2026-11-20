# code ← wshobson (improvement)

Sources: https://github.com/wshobson/agents `plugins/conductor/commands/revert.md`, `plugins/conductor/commands/implement.md` @9c61ab2 (MIT)
Status: draft, not adopted

## What it brings

A safe undo of one merged plan item or one finished task, when user says "drop task 3".
The undo uses revert commits only, shows its list first, and stops on the first conflict.

## Cons

- `code` is at its `max-lines` (219); changes 1 and 2 add about 8 lines.
- A fast-forward merge of a worktree branch leaves no merge commit, so item boundaries
  hide in history. Change 3 fixes that with a commit trailer, which touches `implement`.
- Overlaps `plan` §Amendments: a dropped requirement already needs user's yes there.
- The source keeps per-task SHAs in its plan file. Armory does not adopt that: it would add
  a status commit per merge and a second copy of `git log` (SSOT).

## Proposed changes

### 1. Revert flow for a merged item or task

- Target: `code` §Running the plan (add bullet)
- Text:
  - To undo a plan item merged into task branch, or a task merged into `<base>`, main
    session MUST have an agent list its commits: by the item's merge commit, else by the
    `Refs:` trailer (`implement` §Commits), else by the range its coder reported. Main
    session MUST show user that list with the files it changes, and MUST revert only on
    user's yes. It MUST use `git revert`, newest commit first, and MUST NOT reset, rebase
    or force-push; history MUST stay. A dropped requirement MUST also go through `plan`
    §Amendments, in the same question. With a tracker bound, a status write back to open
    MUST join that question. Done when each listed commit has its revert commit, or user
    said no.
- Why: armory has no undo path; an agent left alone may reach for `reset --hard` or a
  force push and lose work.
- Evidence needed: a session where user asked to drop a merged item or task, and the
  undo lost commits, rewrote pushed history or left stray changes.

### 2. Stop on a revert conflict

- Target: `code` §Running the plan (add bullet, after change 1)
- Text:
  - A revert that conflicts MUST stop the flow: main session MUST run
    `git revert --abort`, MUST NOT resolve the conflict itself, and MUST ask user, naming
    the reverts already made and the conflicted files. Done when user has answered.
- Why: an automatic resolve of a revert conflict can silently keep half of the dropped
  work.
- Evidence needed: a revert conflict seen in an armory run.

### 3. Commit trailer that names the requirement

- Target: `implement` §Commits (add bullet)
- Text:
  - A commit that serves a plan `TR` SHOULD end its body with the line
    `Refs: <TR ids>`, so a later undo finds the item's commits by `git log --grep`.
- Why: after a fast-forward merge, nothing in history ties a commit to its plan item.
- Evidence needed: an undo or a review range that could not find an item's commits.

### 4. Trigger for the undo case

- Target: `code` frontmatter `description` (add trigger)
- Text: add `"undo a task"` to the quoted trigger list.
- Why: without a trigger, a request such as "drop task 3" may not load `code`.
- Evidence needed: an eval case in `evals/` where "undo task 3" did not load `code`.
