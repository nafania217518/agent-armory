# code ← superpowers (improvement)

Sources: https://github.com/obra/superpowers `skills/receiving-code-review/SKILL.md`, `skills/finishing-a-development-branch/SKILL.md` @22f0b46 (MIT)
Status: draft, not adopted

## What it brings

Two checks for outside PR feedback that the shared flow lacks: a caller search before a
"do it properly" request, and a reply in the thread. Plus three finish safety rules: gates
on the merged result, no forced worktree removal, no force push after a rejected push.

## Cons

- The PR feedback part depends on `code-cek-improvement.md` change 3 (§Outside review),
  which holds the shared flow; this file only adds to it.
- `code` is at its `max-lines` (219); changes 3 to 5 add about 10 lines.
- The source's fix order (blocking, then simple, then complex) is left out: §Review loop
  already runs every fix through review, so order does not change the result.
- The source's ban on thanks and praise is left out: `core` §Writing and questions already
  bans filler.

## Proposed changes

### 1. Caller search before a "do it properly" request

- Target: `code` §Outside review, step 3 (add sentence; section from
  `code-cek-improvement.md` change 3)
- Text: For a request that asks to complete or harden a feature, the check MUST search for
  its callers; a feature with no caller MUST get the verdict "against plan" with the
  proposal to delete it (`core` §Design principles, YAGNI).
- Why: an outside reviewer may ask to build out code that nothing uses.
- Evidence needed: a PR comment that asked to extend unused code, and the run did so.

### 2. Reply inside the thread

- Target: `code` §Outside review, step 4 (add sentence)
- Text: A reply MUST go into the item's own thread, not as a new top-level PR comment.
- Why: a top-level reply loses the link to the code line and to the thread's resolve state.
- Evidence needed: a run that answered an inline thread with a top-level comment.

### 3. Gates on the merged result

- Target: `code` §Finish (add bullet, after "A merge into `<base>` MUST merge into the
  local default branch")
- Text:
  - After a merge into `<base>` that was not a fast-forward, main session MUST run `lint`
    and `unit` on the merged result before the push question. A failure MUST stop the
    finish and go to user, with the branch kept. Done when both pass, or user has
    answered.
- Why: §Task end step 10 runs the gates on the task-branch tip only; a merge with a moved
  `<base>` makes a new, untested tree.
- Evidence needed: a merge into `<base>` whose result failed a gate that passed on the
  task branch.

### 4. No forced worktree removal

- Target: `delegate` §Delegation and worktrees (add bullet, after the unlock bullet)
- Text:
  - When removal of an agent worktree fails because it holds modified or untracked files,
    main session MUST NOT force it. It MUST list those files and ask user: commit them as
    a WIP commit, copy them out, or delete them. Done when user has answered and the
    worktree is removed.
- Why: a forced removal deletes the only copy of files that exist only in that worktree.
- Evidence needed: a refused worktree removal in an armory run.

### 5. No force push after a rejected push

- Target: `code` §Branch and plan file (add bullet, after "MUST ask user before any push")
- Text:
  - A yes to a push MUST NOT count as a yes to a force push. When a push is rejected,
    main session MUST fetch, report how the remote branch moved, and ask user how to go
    on. Done when user has answered.
- Why: a rejected push means the remote holds commits the local branch lacks; a force push
  deletes them.
- Evidence needed: a rejected push in an armory run.
