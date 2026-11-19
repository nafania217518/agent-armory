---
name: code
description: >
  Runs a coding task from the approved plan to the merge or PR: task branch, coder briefs,
  review and fix loop, task report, finish question. Load it before the first code
  search or edit of any coding task: "/code", "implement", "fix", "refactor".
metadata:
  type: regular
  extends: [core-main, delegate, research, workflow]
  max-lines: 125
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core-main` before your first step when its rules are not in your context.
Load `workflow` before your first step when its rules are not in your context.
Load `delegate` before your first brief when its rules are not in your context.
Load `research` before you check an `Unverified:` part when its rules are not in your
context.

# code

## 1. Branch and plan file

Merge of a worktree branch into the task branch is in `delegate` §1. Branch rules are in
`workflow` §2, the claim and its re-read before the cut in `workflow` §1.

- When the task branch already exists with its committed plan file, the run MUST switch
  to it and skip the cut and the plan skill; it starts at the behind-`<base>` check
  (`tracking` §4).

## 2. Running the plan

Brief each item as `delegate` §2 sets. A requirement change during the work follows
`tracking` §4.

- MUST start each plan item once every item it needs is merged into the task branch. Ready
  items MAY run at once, each in its own worktree, and MUST start in the plan's order. An
  item or a fix round that touches a file a running item touches MUST wait for that item's
  merge (`delegate` §1). A plan with no `needs:` lines runs in the
  plan's order.
- A finding that blocks the task MUST NOT wait for the recorded-items quiz. It is
  `stuck:` (`delegate` §6).
- An out-of-scope finding that is a defect in built code (`tracking` §4) MUST get
  its `TR` before the next brief or follow-up message, not at the quiz.
- Before the first brief, MUST run the behind-`<base>` check of `tracking` §4.

## 3. Review loop

- Reviewer MUST run on each coder or fix-flow debugger result: its diff, after the merge
  when the agent ran in a worktree.
- After a review, main session MUST have each Must fix item and each auto-fix finding
  fixed (`core-main` §3), run the reviewer on the fix commits
  (`delegate` §2 sets the follow-up message), and repeat until none remains.
- A fix that changes the behavior a `TR` states MUST go through
  `tracking` §4 before its fix brief or message.
- A no-re-review commit (`delegate` §2) gets no re-review.
- An auto-fix finding is one of a class that the project context `## Rules` line
  `auto-fix: <classes>` names: `should` (Should fix) and `nice` (Nice to have), or
  `none`. A missing line MUST mean `none`.
- A finding or a caveat with an `Unverified:` part (`research` §1) MUST be checked before
  a fix brief, the recorded-items quiz or a caveat-base write: as `workflow` §3 sets for a
  code claim, by a researcher (`research` §1) when a web source can settle it, or by a
  coder whose brief says "check the claim first; change nothing if it is false". A false
  finding or caveat MUST be dropped; task report MUST name it, with the disproving command
  or source, in its skipped line (§4, step 6). A claim the check does not settle MUST keep
  its `Unverified:` part.
- A finding that its fixer reports false MUST get the check of the bullet above.
- Loop bound: when a loop needs a third round, main session MUST ask user first.
  Rounds before a switch to another agent MUST count.
- Final review MUST be a fresh reviewer spawn. It MUST cover only commits since the last
  review, or since `<base>` when none ran. It MUST add these whole-task checks on
  `<base>..HEAD`: each requirement met, `req:` markers, stray files, gates.

## 4. Task end

- Recorded-items quiz MUST offer these options per kind:
  - scope addition: keep or revert;
  - other SHOULD bypass made during the work: accept, or undo if possible;
  - out-of-scope finding or other design misfit: fix as an amendment, make it a
    follow-up item, or ignore;
  - tech-debt misfit (a shortcut with no Accepted tech debt line): fix as an amendment,
    make it a follow-up item, or accept it into Accepted tech debt;
  - Should fix or Nice to have finding: fix now, make it a follow-up item, or ignore; an
    auto-fix finding (§3) MUST skip the quiz.
- A model-row bypass (`delegate` §4) MUST skip the quiz; task report MUST name it.
- A follow-up item MUST be a new open tracker item; the quiz answer is the yes to that
  create. With no tracker bound, it MUST be a line in the task report. Its text MUST mark
  with `Unverified:` each cause that no probe on a clean state confirmed.
- Main session MUST take these steps in this order:
  1. MUST run the final review and its fix loop (§3).
  2. MUST run the recorded-items quiz, then apply the answers. Done when each recorded
     item has its applied answer.
  3. After any commit since the last review: MUST run the reviewer on each such commit
     that is not a pure revert or a no-re-review commit (§3). Done when each
     such commit has its review.
  4. Late items: each item that step 3 records, other than an auto-fix finding
     (§3), MUST skip the quiz and become a follow-up line of the task report.
     Done when each such item has its follow-up line.
  5. Stray-task check: MUST check each task in the scope of `core` §3.
     One that still runs with no valid reason is a stray task: MUST stop it,
     report it as a finding, and have a caveat on its cause written (`workflow` §3). That
     caveat commit gets no re-review. Done when no stray task runs.
  6. Before the report, MUST have `lint` and `unit` results at the tip; a review run at
     the tip counts. Report MUST hold, in this order: a one-line outcome; the met
     requirements in one line by id range (`TR-1..TR-7 met`), then each unmet one with its
     id and status; the gate results, one line per gate; each measured result; what was
     skipped or not checked; each recorded item with only its applied
     answer; each follow-up line of step 4; each held caveat (`workflow` §3) whose `TR`
     has not merged; any risk the user must know. Done when `lint` and `unit` results at
     the tip exist and the report holds each listed item.
  7. Acceptance: MUST ask user which items they want to try by hand, with the exact
     commands or clicks for each. Done when user has answered.
  8. Cleanup: MUST run caveat cleanup (`workflow` §3), then ask user what to keep of plan
     file and design docs the task added to the repo. Recommended option MUST be: keep
     design docs, and of plan file only its Requirements section, which `req:` markers
     point into. It MUST also ask, for each kept diagnose-only branch, whether to keep or
     delete it. A cleanup commit gets no re-review. Done when user has answered.
  9. Done write, with no tracker bound: MUST make the docs done write of `workflow` §5.
     Done when its status commit is on task branch, or task has no milestone.
  10. Finish: when the tip moved after the `lint` and `unit` results of step 6, MUST run
      them again, then MUST follow `workflow` §4. Done when that run is made or the tip
      did not move.
  11. Tracker done write, with a tracker bound: after the finish answer, MUST make the
      tracker done write of `workflow` §5. Done when each comment and status write of its
      finish answer is made.
