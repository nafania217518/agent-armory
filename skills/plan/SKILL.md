---
name: plan
description: >
  Pre-work for a task. The agent measures the impact and proposes a level (none, min,
  full); the user confirms. Business and tech requirement quizzes (BR-n, TR-n), a plan
  with a model tag per item, approval through plan mode, and at full the plan review and
  the requirements and plan files. Runs on Fable. Use for a new task, "plan this", "make
  a plan", "design this change", "/plan", and from the code skill when no plan exists.
argument-hint: "[none|min|full]"
---

# plan

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.

## 1. Level

MUST load the `code` skill (`/code`, or `/armory:code` in the plugin install). Read the
task and the code it touches (its section 2, Understand first). Then propose one line:
"Level <none|min|full>: <reason>". The user confirms or names another level.
`$ARGUMENTS` sets the level and skips the question.

| Level | Impact | Flow |
|---|---|---|
| `none` | No behavior change: pinned refactor, docs, typo, test-only | back to `code` |
| `min` | Every other behavior change | 2 to 8; short business quiz; writes nothing |
| `full` | List below | 2 to 8; wide quiz; checklist; scope, gates, risks, debt; docs |

Sections 2 to 9 apply to `min` and `full`. A line that names one level applies to that
level only. Section 3 runs on demand at both levels. The level is `full` when any of
these hold:

- a new surface or data shape;
- an unknown about a library, API or domain;
- stored data changes shape or can be lost;
- the change reaches the code of more than one module, or callers the task did not name.
  Doc updates do not count.

MUST compare the session model with the first row of `## Models` (pre-work, Fable). When
it differs, say so in one line. Then ask the user to run `/model`, or delegate the
pre-work to the `researcher` agent with that row's model. A `min` task MAY run on Opus.

## 2. Plan mode

MUST enter plan mode (the planning tool) for sections 3 to 7. Repo files are written
only in section 8.

## 3. Research

Research runs on demand, at both levels, when an unknown appears. An unknown about a
library, API, model or domain goes to the `researcher` agent or follows the `research`
skill. The finding becomes a `## Caveats` line in the plan.

## 4. Business quiz

- Ask in rounds until no open question or assumption remains.
- `min`: ask the goal, who is affected and the done criteria.
- `full`: add users, features, business rules, out of scope and constraints.
- Every answer becomes `BR-n`: MUST \<behavior\>. A goal that no test can prove becomes a
  `BR` with the `TR`s that prove it.

## 5. Tech quiz

- Ask stack, data, interfaces, constraints, test levels, risks and acceptance.
- Every answer becomes `TR-n` (`BR-m`): MUST \<behavior\>. Each `TR` MUST trace to a `BR`.

## 6. The plan

List the `TR` items in execution order. The format of one item:

`TR-<n>` [`<model>`] (`<br-1>`, ..., `<br-n>`): \<descr\>

- Under the item, an indented why: line when the model is not `opus`.
- Under the item, an indented tests: line with the test names. The `test` skill rules
  apply: level, edge cases, failure paths.
- Every item MUST carry one model from the `## Models` rows.
- A `fable` item MUST have a why: line that names the reason from the first row.
  "Just in case" is not a reason.
- `full`: after the items, add the test-scope list, the gates that apply, the risks and
  the accepted tech debt.

## 7. Review and propose

- `full`: MUST check the plan before proposing. Every `BR` has a `TR`. Every `TR` has
  tests with edge cases and failure paths. Design issues under `code` sections 2 and 8
  are fixed. An open question goes to one more quiz round.
- `min` and `full`: the plan-mode exit is the approval gate.
- Reject: the user says what is wrong. Fix that part. Propose again.

## 8. Save and stop

- `full`: MUST write `<docs>/requirements/<task-branch>.md` (`## Business`,
  `## Technical`) and `<docs>/plans/<task-branch>.md`. The docs folder comes from
  `AGENTS.md` `## Rules`. MUST write the caveat lines into `AGENTS.md`.
- `min`: write nothing. The approved plan in the conversation is the task. The `code`
  skill writes the plan's caveat lines into `AGENTS.md`.
- MUST NOT write code, tests or config.
- Report: the level, the paths written (or "plan-mode file only"), the item count per
  model, and the line: "On 'implement', run the `code` skill on Opus."

## 9. Amendments

A new or changed requirement during work gets a new `BR-n` or `TR-n` and re-enters at
section 7. The work continues after approval. A defect in built code gets a new `TR-n`
with its tests. It needs no new approval. At `full`, append it to the requirements file.
The task report lists it at both levels. An old id MUST NOT be rewritten or
renumbered; mark it `(replaced by TR-m)`.
