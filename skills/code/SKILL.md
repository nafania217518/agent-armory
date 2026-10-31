---
name: code
description: >
  Main-session coding lifecycle from the approved plan to the finish question: task
  branch, caveat writes, plan run, review and fix loop, task end, push and merge guard.
  Use on every coding task: "/code", "implement", "fix", "refactor", "add a feature".
max-lines: 115
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context (`/core`, or
`/armory:core` in the plugin).

# code

The main session follows this skill after `plan` section Self-review and approval.
Spawns follow `delegate` (`/delegate`, or `/armory:delegate` in the plugin). The coding
rules are in `implement` and `test`, not here.

- No approved plan: MUST run `plan` first (`/plan`, or `/armory:plan` in the plugin).
- When the main session codes itself, it MUST load `implement` (`/implement`, or
  `/armory:implement`) and `test` (`/test`, or `/armory:test`).

## 1. Branch and plan file

The plan file and its first commit follow `plan` section Plan file. The merge of a
worktree branch into the task branch is in `delegate` section Delegation and worktrees.

- MUST work on one branch per task.
- `<base>` MUST mean the same branch in every armory skill: with a remote, `origin/HEAD`
  (first command below); without one, the local default branch (`main` or `master`,
  whichever exists), else the current branch.
- The tech quiz MAY confirm `<base>` when it is unclear.
- MUST cut the task branch from `<base>`. With a remote, MUST run `git fetch origin`
  first.
- MUST NOT commit to `<base>`.
- MUST ask the user before any push, and before any merge into `<base>`, PR merges too.

```
git symbolic-ref --short refs/remotes/origin/HEAD
git fetch origin
git switch -c <task-branch> <base>
```

## 2. Caveats

Before the plan-file commit (`plan` section Plan file), a caveat goes into the plan
(`plan` section The plan). The caveat slot and the subagent ban are in `core` section
Reports. The caveat format is in `init-project` section Write.

- The main session MUST write each caveat received after the plan-file commit into
  `AGENTS.md` `## Caveats` when it receives it. In project setup, the task branch takes
  the place of that commit (`init-project` section Flow).

## 3. Running the plan

Brief each item as `delegate` section Briefs sets. A requirement change during the work
follows `plan` section Amendments.

The recorded items and their report slot are in `core` section Reports.

- MUST run the plan items in the plan's order, also when they go to different executors.
- A finding that blocks the task MUST NOT wait for the recorded-items quiz. It is
  `stuck:` (`delegate` section Re-spawn and retry).

## 4. Review loop

- The reviewer MUST run on each coder result: its diff, after the merge when the coder
  ran in a worktree (`delegate` section Delegation and worktrees).
- After a review, the main session MUST have each Must fix item fixed (`delegate`
  section Context), run the reviewer on the fix commits, and repeat
  until no Must fix remains.
- Loop bound: when a loop needs a third round, the main session MUST ask the user first.
  The bound covers this fix loop and the quiz loop (section Task end, step 5).
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
  - out-of-scope finding or design misfit: fix as an amendment (`plan` section
    Amendments), make it a follow-up, or ignore;
  - Should fix or Nice to have finding: fix now, make it a follow-up, or ignore.
- At task end, the main session MUST take these steps in this order:
  1. Stray-task check: MUST check each task in the scope of `core` section Tools and
     background tasks. One that still runs with no valid reason is a stray task: MUST
     stop it, report it as a finding, and write a caveat on its cause (section Caveats).
  2. MUST run the final review and its fix loop (section Review loop).
  3. MUST run the recorded-items quiz, then apply the answers.
  4. After any commit made since the last review: MUST run `lint` and `unit` again, and
     the reviewer on each such commit that is not a pure revert.
  5. Quiz loop: MUST repeat steps 3 and 4 while a re-review in step 4 adds a new
     recorded item. The loop bound (section Review loop) applies.
  6. The report MUST hold, in this order: the requirements with their ids and status;
     the gate results, one line per gate; what was skipped or not checked; the recorded
     items with the quiz answers; any risk the user must know.
  7. Acceptance: MUST ask the user which items they want to try by hand, with the exact
     commands or clicks for each.
  8. Cleanup: MUST ask the user whether to keep the plan file (`plan` section Plan file)
     and the design docs the task added to the repository. Default: keep them.
  9. Finish: section Finish.

## 6. Finish

- MUST ask the user whether to push, open a PR, merge into `<base>`, or stop. Section
  Branch and plan file guards each push and merge.
