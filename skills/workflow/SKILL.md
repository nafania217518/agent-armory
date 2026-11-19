---
name: workflow
description: >
  Abstract: load only through a skill that extends it. The claim, branches, caveat-base
  writes, finish and the done write that the main-session skills share.
metadata:
  type: abstract
  extends: [core-main, tracking]
  max-lines: 133
user-invocable: false
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core-main` before your first step when its rules are not in your context.
Load `tracking` before your first step when its rules are not in your context.

# workflow

## 1. Claim

These rules hold with a tracker bound.

- Task run MUST claim its task item right after it reads the item, before any quiz round
  or spawn. User's start request is the yes for this write. When the item is closed or
  has any assignee, user included, run MUST stop and ask user: pick another ready task
  (recommended), take it over, or stop. A task item the run creates after approval MUST
  be claimed right after its create.
- Just before a run cuts the task branch, it MUST read its task item again. When the item
  is closed or has an assignee other than user, the run MUST NOT cut the branch. It MUST
  stop and ask user instead: pick another task (recommended), take it over, or stop.
- On a resume of an existing task branch, a task item claimed by user MUST count as the
  run's claim.

## 2. Branches

- MUST work on one branch per task.
- `<base>` MUST mean the same branch in every armory skill: with a remote, `origin/HEAD`
  (first command below; when it finds none, the fallback command, then the lookup again);
  without one, or when the fallback also fails (a remote with no commits), the local
  default branch (`main` or `master`, whichever exists), else the current branch.
- Tech quiz MAY confirm `<base>` when it is unclear.
- MUST cut task branch from `<base>`. With a remote, MUST run `git fetch origin` first.
- MUST NOT commit to `<base>` or the local default branch, except the merge of §4 and the
  first commit of a new repo. MUST commit on a branch cut from `<base>` instead.
- MUST ask user before any push, and before any merge into `<base>`, PR merges too.

```
git symbolic-ref --short refs/remotes/origin/HEAD
git remote set-head origin -a    # fallback: no origin/HEAD
git fetch origin
git switch --no-track -c <task-branch> <base>
```

## 3. Caveats

Caveat base, caveat slot, caveat format, subagent ban and recorded items are in
`core` §6.

- A caveat found during planning MUST wait in the plan-mode proposal, not in the plan
  file. Right after the planning run's first commit, main session MUST have each such
  caveat written into the caveat base, except a held caveat.
- Main session MUST write each caveat-base line itself, root `## Caveats` and topic files
  alike, and MUST commit each write (`core-main` §3).
- Main session MUST have each caveat it receives or finds after the plan-file commit
  written into the caveat base immediately, unless the next bullet defers it.
- A caveat of the bullet above, or a planning caveat, about code that a `TR` of this task
  still builds or changes is a held caveat. It MUST wait until that `TR` merges into the
  task branch; main session MUST then have it written as this section says.
- Before that write, main session MUST check the line against `core` §6 and its place
  against the bullets below, and MUST check its claim against the code, with a search of
  the named file for the fact: by a short read when that settles it, else by a researcher
  that returns a verdict, not the lines. A line that fails MUST be split, cut, moved or
  dropped.
- A caveat MUST go to root `## Caveats` only when every task needs it. Else it MUST go to
  the topic file whose pointer fits, or to a new topic file when none fits.
- A line that says what to do is a rule: it MUST go to the project context `## Rules`.
- A caveat that a doc states MUST become a link to that doc section. One that a test,
  check, code comment or message text states MUST be dropped. A duplicate MUST be merged.
- A topic entry MAY carry one indented line: its cause, its workaround or a doc link.
- Root `## Caveats` MUST hold one pointer line per topic file:
  `- <topic>: <when to read it> : <docs>/caveats/<topic>.md`.
- A topic file over 40 entries MUST be split; an empty one MUST be deleted, with its
  pointer line.
- Before main session briefs work on a file, it MUST pass the agent the path of each
  topic file whose pointer fits that work.
- Cleanup: for each caveat-base entry whose file the task changed, moved or deleted
  (`git diff --name-status <base>...HEAD`), main session MUST re-check the entry's claim
  as the "Before that write" bullet sets, then have entry kept, its path fixed or it
  dropped, by bullets above.

## 4. Finish

- MUST ask user whether to push, open a PR, merge into `<base>`, or stop. §2 guards each
  push and merge. Recommended option MUST be a PR when the repo has a remote, else a merge
  into `<base>`.
- A merge into `<base>` MUST merge into the local default branch. With a remote, main
  session MUST then ask a separate question whether to push that branch.
- After a push to a branch with an open PR, main session MUST have an agent compare the PR
  body's Summary and Evidence with plan's Design and latest gate and measured results, and
  return each stale line with its new text. Main session MUST update those lines in the
  same step. The push yes covers that edit. When the task-end cleanup removed the Design,
  the brief MUST name the commit before that cleanup to read it from.
- A PR body MUST take the sections and order of `templates/pr.md`, relative to this
  skill, each filled as its format line says, with no format line.
- With a tracker bound and a closing reference form in `closes by PR merge:`, the PR body
  MUST end with one closing line per item of the tracker done write (§5): that form with
  the item's id filled in. Else it MUST hold no closing line.

## 5. Done write

- Docs done write, with no tracker bound: when task has a milestone, main session MUST
  itself mark task done in milestone doc and, when task was milestone's last open one,
  milestone done in `<docs>/DESIGN.md` (`tracking` §2). It MUST then commit both marks
  in one commit, the last on task branch. That commit MUST change only status lines. It
  MUST NOT be committed directly on `<base>`. A task with no milestone MUST skip it.
- Tracker done write, with a tracker bound: after the finish answer, main session MUST
  comment on the task item with the branch and, when they exist, the kept plan file path,
  PR link and merge commit (the merged HEAD commit on a fast-forward). It MUST make no
  repo commit for status. "The items" MUST mean the task item, and the milestone item too
  when the task was its last open one. Per finish answer:
  - merge into `<base>`: MUST set the items done after the push of §4, or after the merge
    with no remote; on a no to that push, MUST leave the items open and tell user;
  - PR, with a closing reference form in `closes by PR merge:`: the run MUST leave the
    status to the PR merge;
  - PR, with `closes by PR merge: no`: MUST set the items done only when run merges PR
    itself after user's yes; else report MUST say the items stay open;
  - push only or stop: MUST comment only; the task item MUST keep its claim.
- A task-level planning run that adds no task to a milestone and reads that all its tasks
  are done MUST ask user whether to mark the milestone done. On a yes, it MUST cut a
  `design-<topic>` branch, make the status-line edit in `<docs>/DESIGN.md` itself, and
  commit it as that branch's first commit, with the finish question of §4, or, with a
  tracker bound, a status write under the tracker write rules of `tracking` §1. That ask
  MUST NOT replace the done write of a code run.
