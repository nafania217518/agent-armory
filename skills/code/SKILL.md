---
name: code
description: >
  Runs a coding task from the approved plan to the merge or PR: task branch, coder briefs,
  review and fix loop, task report, finish question; also outside PR feedback and the
  undo of a merged item or task. Load it before the first code search or edit of any
  coding task: "/code", "implement", "fix", "refactor", "address PR comments", "undo a
  task".
metadata:
  type: regular
  extends: [core-main, delegate, research, workflow]
  max-lines: 210
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
  merge (`delegate` §1). A plan with no `needs:` lines runs in the plan's order.
- A finding that blocks the task MUST NOT wait for the recorded-items quiz. It is
  `stuck:` (`delegate` §6).
- An out-of-scope finding that is a defect in built code (`tracking` §4) MUST get its
  `TR` before the next brief or follow-up message, not at the quiz.
- Before the first brief, MUST run the behind-`<base>` check of `tracking` §4.
- After host compacts context during a run, main session MUST load this skill again and
  re-read plan file before its next step. A decision it recalls only from before the
  compaction MUST be found in plan file, owning doc or task list before it acts on it;
  when none holds it, main session MUST ask user. Done when the turn's step n of m
  (`core-main` §2) matches plan file.
- To undo a plan item merged into task branch, or a task merged into `<base>`, main
  session MUST have an agent list its commits: by the item's merge commit, else by the
  `Refs:` line that coders add to commit bodies, else by the range its coder reported. A
  `Refs:` search MUST run only for a plan item, on the task's own commits, by whole id:
  `git log -E --grep='^Refs:.*<id>([^0-9]|$)' <base>..<task branch>`.
  Main session MUST show user that list with the files it changes, and MUST revert only on
  user's yes, with one `git revert` per commit, newest commit first. It MUST NOT reset,
  rebase or force-push; it MUST revert instead. A task merged into `<base>` MUST be
  reverted on a new branch `revert-<task branch>` cut from `<base>`, which then takes the
  finish of `workflow` §4. Its task status MUST go back to open, and so MUST its
  milestone's status when the done write (`workflow` §5) set it done: with a tracker
  bound, by status writes in the same question, else, for a task with a milestone, by
  status-line edits on that branch, the task's in the milestone doc and the milestone's
  in `<docs>/DESIGN.md`. A dropped requirement MUST also go through `tracking` §4, in the
  same question. Done when each listed commit has its revert commit, or user said no.
- A revert that conflicts MUST stop the flow: main session MUST run `git revert --abort`,
  MUST NOT resolve the conflict itself, and MUST ask user instead, naming the reverts
  already made and the conflicted files. Done when user has answered.

## 3. Review loop

- Reviewer MUST run on each coder or fix-flow debugger result: its diff, after the merge
  when the agent ran in a worktree.
- For a result that builds a `TR` with the line `review: dual`, main session MUST spawn
  two reviewers at once, each with the same brief, which names no other reviewer. Main
  session MUST merge the two reports: findings on the same lines with the same problem
  become one, in the higher group. Each finding of either report MUST count. The fix
  round's re-review MUST go to both. The final review MUST stay one fresh reviewer. Done
  when both reviewers report no Must fix.
- After a review, main session MUST have each Must fix item and each auto-fix finding
  fixed (`core-main` §3), run the reviewer on the fix commits (`delegate` §2 sets the
  follow-up message), and repeat until none remains.
- A fix that changes the behavior a `TR` states MUST go through `tracking` §4 before its
  fix brief or message.
- A no-re-review commit (`delegate` §2) gets no re-review.
- An auto-fix finding is one of a class that project context `## Rules` line
  `auto-fix: <classes>` names: `should` (Should fix) and `nice` (Nice to have), or
  `none`. A missing line MUST mean `none`.
- A finding or a caveat with an `Unverified:` part (`research` §1) MUST be checked before
  a fix brief, the recorded-items quiz or a caveat-base write: as `workflow` §3 sets for a
  code claim, by a researcher (`research` §1) when a web source can settle it, or by a
  coder whose brief says "check the claim first; change nothing if it is false". A false
  finding or caveat MUST be dropped; task report MUST name it, with the disproving command
  or source, in its skipped line (§4, step 6). A claim the check does not settle MUST keep
  its `Unverified:` part.
- A finding that its fixer reports false, or that main session thinks false, MUST get the
  check of the bullet above.
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
     that is not a pure revert or a no-re-review commit (§3). Done when each such commit
     has its review.
  4. Late items: each item that step 3 records, other than an auto-fix finding (§3), MUST
     skip the quiz and become a follow-up line of the task report. Done when each such
     item has its follow-up line.
  5. Stray-task check: MUST check each task in the scope of `core` §3. One that still
     runs with no valid reason is a stray task: MUST stop it, report it as a finding, and
     write a caveat on its cause (`workflow` §3). That caveat commit gets no re-review.
     Done when no stray task runs.
  6. Before the report, MUST have `lint` and `unit` results at the tip, each when `on`,
     with every part run; a review run at the tip counts. Report MUST hold, in this
     order: a one-line outcome; the met requirements in one line by id range
     (`TR-1..TR-7 met`), then each unmet one with its id and status; the gate results,
     one line per gate; each measured result; for each dual review, one line: findings
     both reviewers found and findings only one found, per group; what was skipped or
     not checked; each recorded item with only its applied answer; each follow-up line of
     step 4; each held caveat (`workflow` §3) whose `TR` has not merged; any risk the
     user must know. Done when `lint` and `unit` results at the tip, each when `on`,
     with every part run, exist and the report holds each listed item.
  7. Acceptance: MUST ask user which items they want to try by hand. When the task
     changes startup code, migrations, seed data or config, the list MUST start with a
     cold-start item: stop the app, clear its caches and temporary state, start it fresh,
     and run one main read. Then MUST ask one question per picked item, with its exact
     commands or clicks and its expected result, and the options pass, skip and "Other"
     for what happened. A skip MUST join the not-checked line of the addendum below. An
     "Other" answer MUST become a finding, with no question on its group: Must fix when
     it reports a crash, an error, lost data or a requirement not met, else Should fix. A
     Must fix or auto-fix finding (§3) MUST be fixed through §3, after a debugger run
     (`delegate` §3) when its cause is unknown; then MUST ask that item's question again.
     The item's tries MUST count as one loop of the §3 loop bound, each try a round. Any
     other finding, or one the bound leaves open, MUST become a follow-up line of that
     addendum. The step MUST end with one message, an addendum to the step 6 report, that
     holds the step's not-checked and follow-up lines, when it has any. Done when each
     picked item ends on a pass, a skip or a follow-up line, and any addendum is sent.
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

## 5. Outside review

Outside feedback is a review comment on an open PR of a task branch, from user or another
reviewer, human or bot, or review notes user pastes. A run that starts for it MUST switch
to the task branch and start at step 1.

1. Load: main session MUST list the PR's open review threads with the forge verbs of
   `tracking` §1, and add the pasted items; with those verbs unbound, it MUST take only
   the pasted items. Done when each open item has a number, its author (of a thread's
   first comment; user for a pasted item; `unknown` when the list gives none), its
   requests, and its thread id and `file:line` when it has them (an outdated thread
   takes the nearest line the list gives).
2. Rewrite: main session MUST turn each item into one change request in its own words,
   and MUST merge items that ask the same change at the same lines. Done when each
   request names the item numbers it covers.
3. Check: main session MUST have an agent check each request against the code at the
   task-branch tip (`delegate` §4, code claim check) and return one verdict per request:
   valid; false, with the command or line that proves it; unclear; against a plan
   decision, with its section or `TR`; or no caller. A request to complete or harden a
   feature MUST get a search for its callers first; a feature with none gets no caller.
   Done when each request has a verdict.
4. Ask: main session MUST put every unclear, against-plan and no-caller request, and
   each request with no item whose author is user, to user in one question round before
   any fix brief, since requests may depend on each other. A no-caller request MUST
   offer to delete the feature (`core` §4, YAGNI). For a false request, a reply in the
   thread of each of its items that has one MUST join that round as a tracker write,
   not as a new top-level PR comment. Done when user has answered each.
5. Fix: a request that changes a `TR`'s behavior MUST go through `tracking` §4. The rest
   MUST go as fix briefs through §3; when the task-end cleanup removed the Design, each
   fix brief MUST name the commit before that cleanup to read it from. Then main session
   MUST run §4 steps 1–6 and 10 again. Done when each request to fix has a reviewed fix
   commit and step 10 is done.
6. Resolve: after the push (`workflow` §2 guards it), main session MUST have an agent
   re-check each fixed thread at the pushed tip. A thread MAY be resolved only when the
   current code meets every request in it; a partial fix, an intent or a doubt MUST keep
   it open. Main session MUST ask user once, listing the threads to resolve and each
   thread kept open with its reason. Done when each approved resolve is made and user
   has the list of open threads.
