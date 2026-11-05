---
name: code
description: >
  Main-session coding lifecycle from the approved plan to the finish question: task
  branch, caveat writes, plan run, review and fix loop, task end, push and merge guard.
  Use on every coding task: "/code", "implement", "fix", "refactor", "add a feature".
max-lines: 138
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# code

The main session follows this skill after `plan` section Self-review and approval.
Spawns follow `delegate`. The coding rules are in `implement` and `test`.

- No approved plan: MUST run `plan` first.
- When the main session codes itself, it MUST load `implement` and `test`; for a bug
  whose cause neither the plan nor a diagnose-only report names, also `debug`.

## 1. Branch and plan file

The plan file and its first commit follow `plan` section Plan file. The merge of a
worktree branch into the task branch is in `delegate` section Delegation and worktrees.

- MUST work on one branch per task.
- `<base>` MUST mean the same branch in every armory skill: with a remote, `origin/HEAD`
  (first command below; when it finds none, the fallback command, then the lookup
  again); without one, or when the fallback also fails (a remote with no commits), the
  local default branch (`main` or `master`, whichever exists), else the current branch.
- The tech quiz MAY confirm `<base>` when it is unclear.
- MUST cut the task branch from `<base>`. With a remote, MUST run `git fetch origin`
  first.
- With a tracker bound (`plan` section Levels, tracker variant), the run MUST claim its
  task item as its first tracker write, before it cuts the task branch. When the item
  is assigned to another person, the run MUST stop and ask the user: take it over, pick
  another ready task, or stop.
- MUST NOT commit to `<base>`.
- MUST ask the user before any push, and before any merge into `<base>`, PR merges too.

```
git symbolic-ref --short refs/remotes/origin/HEAD
git remote set-head origin -a    # fallback: no origin/HEAD
git fetch origin
git switch --no-track -c <task-branch> <base>
```

## 2. Caveats

Before the plan-file commit, a caveat goes into the plan (`plan` section The plan). The
caveat slot, the caveat format, the subagent ban and the recorded items are in `core`
section Reports.

- The main session MUST write each caveat it receives after the plan-file commit into
  the project context `## Caveats` immediately.

## 3. Running the plan

Brief each item as `delegate` section Briefs sets. A requirement change during the work
follows `plan` section Amendments.

- MUST run the plan items in the plan's order, also when they go to different executors.
- A finding that blocks the task MUST NOT wait for the recorded-items quiz. It is
  `stuck:` (`delegate` section Re-spawn and retry).

## 4. Review loop

- The reviewer MUST run on each coder or fix-flow debugger result: its diff, after the
  merge when the agent ran in a worktree.
- After a review, the main session MUST have each Must fix item fixed (`delegate`
  section Context), run the reviewer on the fix commits, and repeat until no Must fix
  remains.
- Loop bound: when a loop needs a third round, the main session MUST ask the user first.
- The final review MUST cover only the commits since the last review, or since `<base>`
  when none ran. It MUST add these whole-task checks on `<base>..HEAD`: each requirement
  met, the `req:` markers, the work summary against the diff, stray files, the gates.

## 5. Task end

- Before the task report: every `on` gate MUST pass, or the report MUST name the failing
  gate.
- The recorded-items quiz MUST offer these options per kind:
  - scope addition: keep or revert;
  - model-row bypass (`delegate` section Models): accept, or re-run it on its row;
  - other SHOULD bypass or override made during the work: accept, or undo if possible;
  - out-of-scope finding or design misfit: fix as an amendment, make it a follow-up, or
    ignore;
  - Should fix or Nice to have finding: fix now, make it a follow-up, or ignore.
- The main session MUST take these steps in this order:
  1. Stray-task check: MUST check each task in the scope of `core` section Tools and
     background tasks. One that still runs with no valid reason is a stray task: MUST
     stop it, report it as a finding, and write a caveat on its cause (section Caveats).
  2. MUST run the final review and its fix loop (section Review loop).
  3. MUST run the recorded-items quiz, then apply the answers.
  4. After any commit since the last review: MUST run `lint` and `unit` again, and the
     reviewer on each such commit that is not a pure revert.
  5. Quiz loop: MUST repeat steps 3 and 4 while a re-review in step 4 adds a new
     recorded item. The loop bound (section Review loop) applies.
  6. The report MUST hold, in this order: a one-line outcome; the met requirements in
     one line by id range (`TR-1..TR-7 met`), then each unmet one with its id and
     status; the gate results, one line per gate; what was skipped or not checked; each
     recorded item with only its applied answer; any risk the user must know.
  7. Acceptance: MUST ask the user which items they want to try by hand, with the exact
     commands or clicks for each.
  8. Cleanup: MUST ask the user whether to keep the plan file and the design docs the
     task added to the repository. Default: keep them. It MUST also ask, for each
     `debug-<id>` branch, whether to delete or keep it.
  9. Done write: when the task has a milestone, MUST make one more commit, the last on
     the task branch. It MUST mark the task done in the milestone doc. When the task was
     the milestone's last open one, the same commit MUST also mark the milestone done in
     `<docs>/DESIGN.md` (`plan` section Levels). It MUST change only status lines, so the
     re-review of step 4 does not apply. It MUST NOT be committed directly on `<base>`.
     A task with no milestone MUST skip this step. With a tracker bound, step 11
     MUST replace this step.
  10. Finish: section Finish.
  11. Tracker done write, with a tracker bound: after the Finish answer, MUST comment
      on the task item with the branch, the plan file path and, when they exist, the
      PR link and the merge commit (the merged HEAD commit on a fast-forward). It MUST
      make no repo commit for status. "The items" MUST mean the task item, and the
      milestone item too when the task was its last open one. Per Finish answer:
      - merge into `<base>`: MUST set the items done;
      - PR, with a closing reference form in `closes by PR merge:`: the run MUST
        leave the status to the PR merge;
      - PR, with `closes by PR merge: no`: MUST set the items done only when the run
        merges the PR itself after the user's yes; else the report MUST say that the
        items stay open;
      - push only or stop: MUST comment only; the task item MUST keep its claim.

## 6. Finish

- MUST ask the user whether to push, open a PR, merge into `<base>`, or stop. Section
  Branch and plan file guards each push and merge.
- A PR body MUST take the sections, order and format lines of `templates/pr.md`,
  relative to this skill.
- With a tracker bound and a closing reference form in `closes by PR merge:`, the PR
  body MUST end with one closing line per item of section Task end, step 11: that form
  with the item's id filled in. Else it MUST hold no closing line.
