---
name: code
description: >
  Runs a coding task from the approved plan to the merge or PR: task branch, coder briefs,
  review and fix loop, task report, finish question. Load it before the first code
  search or edit of any coding task: "/code", "implement", "fix", "refactor", "add a
  feature".
max-lines: 202
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# code

Main session follows this skill after `plan` §Self-review and approval. Spawns follow
`delegate`. Coding rules are in `implement` and `test`.

- No approved plan: MUST run `plan` first.
- When main session codes itself, it MUST load `implement` and `test`; for a bug whose
  cause neither the plan nor a diagnose-only report names, also `debug`.

## 1. Branch and plan file

Plan file and its first commit follow `plan` §Plan file. Merge of a worktree branch into
the task branch is in `delegate` §Delegation and worktrees.

- MUST work on one branch per task.
- `<base>` MUST mean the same branch in every armory skill: with a remote, `origin/HEAD`
  (first command below; when it finds none, the fallback command, then the lookup again);
  without one, or when the fallback also fails (a remote with no commits), the local
  default branch (`main` or `master`, whichever exists), else the current branch.
- Tech quiz MAY confirm `<base>` when it is unclear.
- MUST cut task branch from `<base>`. With a remote, MUST run `git fetch origin` first.
- With a tracker bound, the task claim follows `plan` §Levels, tracker variant. Just
  before it cuts the task branch, the run MUST read its task item again. When the item is
  closed or has an assignee other than user, the run MUST NOT cut the branch. It MUST
  stop and ask user instead: take it over, pick another task, or stop.
- MUST NOT commit to `<base>`.
- MUST ask user before any push, and before any merge into `<base>`, PR merges too.

```
git symbolic-ref --short refs/remotes/origin/HEAD
git remote set-head origin -a    # fallback: no origin/HEAD
git fetch origin
git switch --no-track -c <task-branch> <base>
```

## 2. Caveats

Before the plan-file commit, a caveat goes into the plan (`plan` §The plan). Caveat slot,
caveat format, subagent ban and recorded items are in `core` §Reports.

Caveat base is the project context `## Caveats` plus topic files
`<docs>/caveats/<topic>.md`.

- Main session MUST write each caveat it receives or finds after the plan-file commit
  into the caveat base immediately, unless the next bullet defers it; a caveat with an
  `Unverified:` part first gets the check of §Review loop.
- A caveat about code that a later `TR` of this task still builds or changes MUST wait
  until that `TR` merges into the task branch; main session MUST then write it as this
  section says.
- Before that write, main session MUST check the line against `core` §Reports, its claim
  against the code, with a search of the named file for the fact, and its place against
  the bullets below. A line that fails MUST be split, cut, moved or dropped.
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
- Before main session briefs or edits work on a file, it MUST read each topic file whose
  pointer fits that work.
- Cleanup: for each caveat-base entry whose file the task changed, moved or deleted
  (`git diff --name-status <base>...HEAD`), main session MUST re-check the claim, then
  keep the entry, fix its path or drop it, and apply the bullets above.

## 3. Running the plan

Brief each item as `delegate` §Briefs sets. A requirement change during the work follows
`plan` §Amendments.

- MUST start each plan item once every item it needs is merged into the task branch.
  Ready items MAY run at once, each in its own worktree, and MUST start in the plan's
  order. An item that touches a file a running item touches MUST wait for that item's
  merge (`delegate` §Delegation and worktrees). A plan with no `needs:` lines runs in the
  plan's order.
- A finding that blocks the task MUST NOT wait for the recorded-items quiz. It is
  `stuck:` (`delegate` §Re-spawn and retry).
- An out-of-scope finding on code this task built is a defect in built code. It MUST get
  its `TR` before the next brief (`plan` §Amendments), not at the quiz.

## 4. Review loop

- Reviewer MUST run on each coder or fix-flow debugger result: its diff, after the merge
  when the agent ran in a worktree.
- After a review, main session MUST have each Must fix item and each auto-fix finding
  fixed (`delegate` §Context), run the reviewer on the fix commits, and repeat until none
  remains.
- A fix (auto-fix or quiz answer) that changes the behavior a `TR` states MUST go through
  `plan` §Amendments before its fix brief.
- A commit that only deletes caveat or doc lines a finding's Fix part names, or writes
  caveat or doc text that a Fix part gives word for word, gets no re-review (a
  no-re-review commit). Main session MUST still run `lint` and `unit` after it, except
  where `delegate` §Delegation and worktrees lets a merge skip them.
- An auto-fix finding is one of a class that the project context `## Rules` line
  `auto-fix: <classes>` names: `should` (Should fix) and `nice` (Nice to have), or
  `none`. A missing line MUST mean `none`.
- A finding or a caveat with an `Unverified:` part (`review` §Output, `research` §When to
  research) MUST be checked before a fix brief, the recorded-items quiz or a `## Caveats`
  write: by main session with one targeted command, by a coder whose brief says "check
  the claim first; change nothing if it is false", or, when a web source can settle the
  claim, by a researcher (`research` §When to research). A false finding or caveat MUST
  be dropped; the task report MUST name it, with the disproving command or source, in its
  skipped line (§Task end, step 6). A claim the check does not settle MUST keep its
  `Unverified:` part.
- Loop bound: when a loop needs a third round, main session MUST ask user first.
- Final review MUST cover only commits since the last review, or since `<base>` when none
  ran. It MUST add these whole-task checks on `<base>..HEAD`: each requirement met, `req:`
  markers, stray files, gates.

## 5. Task end

- Before the task report: every `on` gate MUST pass, or report MUST name the failing gate.
- Recorded-items quiz MUST offer these options per kind:
  - scope addition: keep or revert;
  - model-row bypass (`delegate` §Models): accept, or re-run it on its row;
  - other SHOULD bypass made during the work: accept, or undo if possible;
  - out-of-scope finding or design misfit: fix as an amendment, make it a follow-up, or
    ignore;
  - Should fix or Nice to have finding: fix now, make it a follow-up, or ignore; an
    auto-fix finding (§Review loop) MUST skip the quiz.
- A follow-up MUST be a new open tracker item; the quiz answer is the yes to that create.
  With no tracker bound, it MUST be a line in the task report.
- Main session MUST take these steps in this order:
  1. MUST run the final review and its fix loop (§Review loop).
  2. MUST run the recorded-items quiz, then apply the answers. Done when each recorded
     item has its applied answer.
  3. After any commit since the last review: MUST run the reviewer on each such commit
     that is not a pure revert or a no-re-review commit (§Review loop), and `lint` and
     `unit` again, except where `delegate` §Delegation and worktrees lets a merge skip
     them.
  4. Quiz loop: MUST repeat steps 2 and 3 while a re-review in step 3 adds a new
     recorded item. The loop bound (§Review loop) applies.
  5. Stray-task check: MUST check each task in the scope of `core` §Tools and background
     tasks. One that still runs with no valid reason is a stray task: MUST stop it,
     report it as a finding, and write a caveat on its cause (§Caveats). After that
     caveat commit, MUST run `lint` and `unit`; it gets no re-review. Done when no stray
     task runs.
  6. Report MUST hold, in this order: a one-line outcome; the met requirements in one
     line by id range (`TR-1..TR-7 met`), then each unmet one with its id and status; the
     gate results, one line per gate; what was skipped or not checked; each recorded
     item with only its applied answer; any risk the user must know.
  7. Acceptance: MUST ask user which items they want to try by hand, with the exact
     commands or clicks for each. Done when user has answered.
  8. Cleanup: MUST run the caveat cleanup (§Caveats), then ask user whether to keep the
     plan file and the design docs the task added to the repo. Default: keep them. It
     MUST also ask, for each `debug-<id>` branch, whether to delete or keep it. After a
     cleanup commit, MUST run `lint` and `unit`; it gets no re-review. Done when user has
     answered.
  9. Done write: when the task has a milestone, MUST make one more commit, the last on
     the task branch. It MUST mark the task done in the milestone doc. When the task was
     the milestone's last open one, the same commit MUST also mark the milestone done in
     `<docs>/DESIGN.md` (`plan` §Levels). It MUST change only status lines, so the
     re-review of step 3 does not apply. It MUST NOT be committed directly on `<base>`.
     A task with no milestone MUST skip this step. With a tracker bound, step 11 MUST
     replace this step.
  10. Finish: §Finish.
  11. Tracker done write, with a tracker bound: after the finish answer, MUST comment on
      the task item with the branch and, when they exist, the kept plan file path, PR link
      and merge commit (the merged HEAD commit on a fast-forward). It MUST make no repo
      commit for status. "The items" MUST mean the task item, and the milestone item too
      when the task was its last open one. Per finish answer:
      - merge into `<base>`: MUST set the items done after the push of §Finish, or
        after the merge with no remote; on a no to that push, MUST leave the items open
        and tell user;
      - PR, with a closing reference form in `closes by PR merge:`: the run MUST leave
        the status to the PR merge;
      - PR, with `closes by PR merge: no`: MUST set the items done only when the run
        merges the PR itself after user's yes; else the report MUST say the items stay
        open;
      - push only or stop: MUST comment only; the task item MUST keep its claim.

## 6. Finish

- MUST ask user whether to push, open a PR, merge into `<base>`, or stop. §Branch and
  plan file guards each push and merge. Recommended option MUST be a PR when the repo
  has a remote, else a merge into `<base>`.
- A merge into `<base>` MUST merge into the local default branch. With a remote, main
  session MUST then ask a separate question whether to push that branch.
- After a push to a branch with an open PR, main session MUST compare the PR body with
  the plan (`TR` range, design lines) and the latest gate results, and MUST update each
  stale line in the same step. The push yes covers that edit.
- A PR body MUST take the sections, order and format lines of `templates/pr.md`,
  relative to this skill.
- With a tracker bound and a closing reference form in `closes by PR merge:`, the PR body
  MUST end with one closing line per item of §Task end, step 11: that form with the
  item's id filled in. Else it MUST hold no closing line.
