# plan ← superpowers (improvement)

Sources:
- https://github.com/obra/superpowers `skills/brainstorming/SKILL.md`, `skills/brainstorming/builder-check-prompt.md` @22f0b46 (MIT)
- https://github.com/obra/superpowers `skills/writing-plans/SKILL.md` §Self-Review @22f0b46 (MIT)
- https://github.com/anthropics/skills `skills/doc-coauthoring/SKILL.md` §Stage 3 @e4bb5d9 (no licence file in that skill folder: ideas only)

Status: draft, not adopted

## What it brings

A fresh agent that sees only the draft lists the questions it would still need answered
to build from it. This tests the plan on a reader with no quiz context. Two extra
self-review lines catch names that drift between items and lines that decide nothing.

## Cons

- One more spawn per milestone or task plan.
- `plan` is at its `max-lines` cap (374); each line needs a cut or a raised cap.
- The cold reader may repeat points the quiz already settled; the sort step must absorb
  them.
- doc-coauthoring has no licence file; only its idea (reader test by a fresh agent) is used.
- The approaches step of brainstorming is not proposed here; see
  `plan-mattpocock-improvement` change 1, which covers it with parallel designers.

## Proposed changes

### 1. Cold-reader check before the proposal

- Target: `plan` §Self-review and approval (add bullet)
- Text:
  ```
  - At milestone and task level, once the checks above pass, main session MUST spawn a
    fresh planner (`delegate` §Models row 7) as a cold reader. Its brief MUST hold only
    the draft's template sections and its role: the coder of a task, or the planner of a
    milestone's tasks. It MUST return, ranked, only questions where a wrong guess would
    change what gets built, or `none`.
  - Main session MUST sort each question: answered by the run (write the answer into the
    draft), minor (main session decides and names it as its own call in the proposal),
    or user's (one quiz round, most important first). Done when each question is sorted
    and each answer is in the draft.
  ```
- Why: the planner's task check (`plan-draft` §1) and main session's §Self-review both
  hold the quiz context; nothing tests the doc on a reader without it.
- Evidence needed: a coder `stuck:` report or a review finding that a cold reader of the
  approved plan would have raised; or an eval where the check finds a gap the task check
  missed.

### 2. One name per symbol across items

- Target: `plan-draft` §Task check (add line)
- Text:
  ```
    - Each symbol, file or field that two `TR` or Design lines name carries the same name
      in each of them.
  ```
- Why: the task check verifies names against existing code, not against each other.
- Evidence needed: a plan whose `TR` items named one new symbol two ways, and a coder
  report or review finding that followed from it.

### 3. No line that leaves its decision open

- Target: `plan-draft` §Task check (add line)
- Text:
  ```
    - No `TR` or Design line leaves its decision to the coder: no "TBD", "as needed",
      "handle edge cases" or a line of that kind, unless it names the rule the coder
      applies.
  ```
- Why: such a line passes the "testable" check by its shape but decides nothing.
- Evidence needed: an approved `TR` with such a phrase, and the coder `stuck:` report or
  rework it caused.
