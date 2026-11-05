# Plan: lean-replies (task, no milestone)

TL;DR: Subagent reports keep only the items the main session needs. Main-session replies to the user
get short-reply rules adapted from ayghri/i-have-adhd (MIT). The edits touch 10 files. One writer
makes them, a reviewer checks them, and then one dry run checks real reports.

## Goal

The main session's context stays small. The user reads short replies that start with the answer.
Quiz 2026-11-05: an item is needed when the main session uses it to spawn an agent, plan the next
work, or put a decision to the user. Mechanism: a need test in `core` plus format trims. The
term-explanation rule stays for all reports. Cuts: gates by range, 3-part findings, delegated-review
summary, the `Lean:` end line. ADHD groups: Shape, Lists, Flow.

## Requirements

- BR-1: MUST keep in every subagent report format and report only needed items (need = spawn an
  agent, plan or change the next work, or a decision for the user), and MUST keep every needed item.
- BR-2: MUST make each main-session reply to the user follow the Shape, Lists and Flow rules.
  Fixed skill output formats and question batching win over them.
- BR-3: MUST pass `lint` and `unit` on every commit; a skill MAY raise its `max-lines` in the same commit.
- BR-4: a changed rule MUST have every reference and restatement updated in the repo.

## TR list (execution order)

- TR-1 (BR-1, BR-3): MUST add the need test to `skills/core/SKILL.md` section 6 Reports, after
  the "holds only the items of its card's report format" bullet. Proposed wording: "A report item is needed when the main
  session uses it to spawn an agent, to plan or change the next work, or to put a decision to the
  user. A report format and a report MUST hold only needed items, and every needed item."
  - tests: none, prose; `lint`.
- TR-2 (BR-1): MUST add to `skills/implement/SKILL.md` section Gates per commit: one gate line
  per commit range when every commit gives the same result; a per-commit line only for a commit
  that differs.
  - tests: none, prose; `lint`.
- TR-3 (BR-1, BR-4): MUST edit the coder and debugger cards, both in
  `skills/setup/templates/agents/` and in the tracked copies `.claude/agents/`. Gate item →
  "Gate results (`implement` section Gates per commit)". Test-scope item → the list only, and
  each scope addition goes only in the recorded-items slot. "Uncovered lines" → only when
  `coverage` is `on`. "Any risk" → a risk that no recorded item covers. Debugger: the loop
  command always; its last output, redacted, only in the diagnose-only flow; hypotheses stay.
  - tests: none, prose; `lint`.
- TR-4 (BR-1): MUST change writer card item 1 to the commit SHA (template + `.claude/agents/`).
  - tests: none, prose; `lint`.
- TR-5 (BR-1, BR-4): MUST edit `skills/review/SKILL.md` section 5 Output: `(per <who> at
  <commit or range>)`; a finding has three parts: Problem, Fix, If we skip it ("What this is"
  goes). A reviewer subagent gives only the load assumed, with no `What this change does:`
  summary; a review in the main session keeps it. The `Lean:` end line goes.
  - tests: none, prose; `lint`.
- TR-6 (BR-1, BR-4): MUST delete the `Lean:` end line from `skills/audit/SKILL.md` section 4
  Output. `What this repo does:` stays.
  - tests: none, prose; `lint`.
- TR-7 (BR-2): MUST add the host term `task list` to `core` section 7 (the host's list of plan
  steps with status, shown to the user; fallback: one line `Step <n> of <m> done. Next: <step>.`).
  MUST add the term to the `setup` section 2 Self-report tools list.
  - tests: none, prose; `lint`.
- TR-8 (BR-2): MUST add main-session reply rules to `core` section 2, after the STE bullet. This
  repeats nothing the STE bullet already says:
  - Shape: lead with the answer or the next action (a command, path or snippet first); no
    preamble, no recap of done work, no closing pleasantry; pre-send check (delete an announcing
    first line, a recap or offer last line, a side remark, a hedge with no information; the
    first and last lines alone tell what happened and what is next). "Explain" or "walk
    through" MAY run long, under headers.
  - Lists: numbered steps, one bounded action each, the fewest that work; free-prose groups of
    about five items max, most relevant first, the rest on request; never drop a relevant item
    when completeness matters.
  - Flow: end with one concrete next action when anything is open; a second issue goes after
    the first as a separate question. With an approved plan, each turn restates step n of m
    and the next step through the task list, with no prose copy of the plan.
  - A skill's fixed output format (review, audit, triage, retro, quizzes) wins over these
    rules. Question batching (`core` section 2) stays.
  - tests: none, reply style; TR-11 run.
- TR-9 (BR-2): MUST change the task report in `skills/code/SKILL.md` section Task end step 6:
  a one-line outcome first; met requirements in one compressed line (`TR-1..TR-7 met`), unmet ones
  listed; recorded items show only the applied answer.
  - tests: none, prose; `lint`.
- TR-10 (BR-2): MUST add a dated `docs/DESIGN.md` section 6 Decisions line that credits
  ayghri/i-have-adhd (MIT) as the source of the reply rules.
  - tests: none, prose; `lint`.
- TR-11 (BR-1, BR-2): after a review with no findings, MUST do one dry run in a scratch repo in the
  session scratchpad: spawn a coder and then a reviewer on a small change. The briefs name the repo paths of
  `core`, `implement`, `test`, `review` and the card templates. Check each report line against the TR-1 test.
  - tests: the dry run. Pass = no line fails the test and no needed item is missing.

Amendment 1 (2026-11-05, from review round 1; TR-12 repairs built work, TR-13..TR-16 approved by the user):

- TR-12 (BR-1, BR-4): MUST make a review brief take the test-scope list from the plan, plus
  each scope addition and its reason from the coder or debugger recorded-items slot
  (`delegate` section Briefs). MUST delete the test-scope item from the coder and debugger
  cards (template + `.claude/agents/`).
  - tests: none, prose; `lint`.
- TR-13 (BR-2): MUST reword the `core` reply rules: a second issue gets its own question, never
  a clause of the first; the format list in parentheses goes; "below" becomes "the question
  bullets of this section".
  - tests: none, prose; `lint`.
- TR-14 (BR-4): MUST reword the two `plan` uses of "task list" (a milestone's tasks) to "the
  tasks and their status", so the term has one meaning.
  - tests: none, prose; `lint`.
- TR-15 (BR-1): MUST limit the no-summary rule in `review` section 5 to a reviewer subagent on
  a task's commit range; a review the user asks for keeps `What this change does:`.
  - tests: none, prose; `lint`.
- TR-16 (BR-2): MUST keep one form of the Shape rule and the pre-send check in `core`, with
  nothing that repeats the STE bullet.
  - tests: none, prose; `lint`.

Amendment 2 (2026-11-05, from review round 2; repairs built work):

- TR-17 (BR-2): MUST restore the ban on a recap of done work anywhere in a reply, which the
  TR-16 merge limited to the last line (`core` section 2 Shape).
  - tests: none, prose; `lint`.

Amendment 3 (2026-11-05, from the TR-11 dry run; approved by the user):

- TR-18 (BR-1): MUST add to `core` section 6 that each report item gives only its value and
  that an item whose condition does not hold is left out. MUST add to each of the six cards
  (template + `.claude/agents/`) one line after the report format: check each line against
  `core` section Reports before you report, and cut each line that fails.
  - tests: none, prose; `lint`. Then one more coder dry run; the task stops after it, pass or
    fail.
  - TR-18 covers only items with a `when` condition; empty slot values (`no caveat`,
    `no recorded item`) stay, as Out of scope says.

Test scope: none (no script changes; the script tests use their own fixtures).

## Execution

1. Cut branch `lean-replies` from `master`; commit this plan as `docs/plans/lean-replies.md`.
2. Main session commits `AGENTS.md` `## Caveats` alone: add the plan caveats; delete the caveat
   on the `Lean: -<N>` end line (the line is gone).
3. One writer (Opus, medium) makes TR-1..TR-10, one commit per TR, `lint` + `unit` per commit.
4. Reviewer (Opus, high) on the range, with a repo-wide BR-4 sweep in the first round.
5. TR-11 dry run, then the `code` task end (no push without your yes).

## Risks

- `core` grows by about 25 lines (159 to ~185). The hook injects it into every subagent, but only
  the main session uses the reply rules.
- The installed plugin lags the repo: the hook injects the old `core`, so the dry-run briefs name
  the repo paths.

## Out of scope

Research source lines; omitting empty items; time estimates, wins, error tone; reply rules for
reports or briefs; the term-explanation rule; a plugin version bump.

Accepted tech debt: none. Overrides: none.
Gates: `lint` on, `unit` on; the others are off per `AGENTS.md`.

## Caveats

- A host profile written before this task has no `task list` line, so its sessions use the
  fallback until `setup` reruns : skills/setup/SKILL.md
- This repo's `.claude/agents/` cards are tracked rendered copies, so a card template edit must
  also edit them : .claude/agents/coder.md
- The main-session reply rules in `core` section 2 reach every subagent through the hook :
  skills/core/SKILL.md
