---
name: plan
description: >
  Pre-work for a task: workflow question, optional research, business and tech
  requirement quizzes (BR-n, TR-n), the plan with an executor tag per item ([opus],
  [fable], [sonnet], [haiku]), plan review, approval through plan mode, then the
  requirements and plan files. Runs on Fable. Use for a new task, "plan this", "make a
  plan", "design this change", "/plan", and from the code skill when no plan exists.
  Modes: none, min, full; no mode given means a quiz.
argument-hint: "[none|min|full]"
---

# plan

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119. The `## Models`
table in `AGENTS.md` names the models; this skill assigns them per item. Questions to the
user follow base rule 8 (`AskUserQuestion`).

## 1. Mode

- The mode is `$ARGUMENTS` when given. Without one, the first question of every task
  asks it. The answer holds for the task.
  - **none**: no plan, for a trivial task. Return to `code` at once; it writes tagged
    `TR-n` items itself.
  - **min**: plan mode as Claude Code runs it. Tech quiz and plan; the plan lives in the
    plan-mode file outside the repo and is approved at the exit. After approval, one
    question: save it to `<docs>/plans/<task-branch>.md`? No file otherwise.
  - **full**: research, both quizzes, plan review, approval, then the requirements and
    plan files in the docs folder.
- MUST compare the session model with the first row of `## Models` (pre-work, Fable).
  When it differs and the task is not trivial: say so in one line, then ask the user to
  switch with `/model`, or delegate the pre-work to the `researcher` agent with that
  row's model. A trivial task MAY run the pre-work on Opus.
- MUST read `AGENTS.md`: `## Commands`, `## Gates`, `## Test levels`, `## Models`,
  `## Rules`, `## Glossary`, `## Caveats`.

## 2. Plan mode

MUST enter plan mode (the planning tool) for sections 3 to 8. The plan text goes into
the plan-mode file; in `min` that file is the plan. Repo files are written only after
approval (section 9). MUST load the `code` skill (`/code`, or `/armory:code` in the
plugin install); its section 2, Understand first, applies: read the code the task
touches, list every place the change reaches, check what it could break for users.

## 3. Research (full only, optional)

Unknowns about a library, API, model or domain go to the `researcher` agent or follow
`code` section 10. Findings become `## Caveats` lines, written at section 9.

## 4. Business quiz (full only)

- Gather as much as the user can give: goal, users, features, business rules, out of
  scope, constraints, done criteria. Several rounds, until no open question remains.
- Every answer becomes a statement `BR-n: MUST <behavior>` in RFC 2119 form. A goal that
  no test can prove becomes a `BR` with the `TR`s that prove it.

## 5. Tech quiz

- Stack, data, interfaces, constraints, test levels, risks, acceptance per feature.
- Every answer becomes `TR-n (BR-m): MUST <behavior>`. Each `TR` MUST trace to a `BR`.
  In `min`, the task text stands in for the `BR`s.

## 6. The plan

The `TR`s in execution order:

```
TR-<n> [tag] (BR-<m>): MUST <behavior>
  why: <one line, only when the tag is not [opus]>
  tests: <test names, each starts with the id>
```

- Every item MUST carry one tag: `[opus]` (default), `[sonnet]` or `[haiku]` for
  mechanics (docs, test runs, i18n strings, formatting, routine edits per a ready spec
  or ready tests), `[fable]` for what Opus cannot carry: architecture, data risk,
  non-trivial root-cause analysis, core conflicts.
- `[fable]` MUST have a `why:` line that names the reason from that list. "Just in
  case" is not a reason.
- Each item MUST name its tests, at least one (`test` skill rules apply: level, edge
  cases, failure paths).
- After the items: the test-scope list (existing tests that will break or change, with
  the reason), the gates that apply, the risks the user must know, and the tech debt the
  plan accepts on purpose.

## 7. Review the plan

Before proposing, MUST check:

- every `BR` has at least one `TR`; every `TR` has tests with its edge cases and failure
  paths;
- design issues under `code` sections 2 and 8: data shape, boundaries, idempotence, one
  writer, a requirement bolted onto the old design;
- every item has a tag; an untagged item means the plan is not ready;
- open questions.

Any question goes to the user as a quiz. Adjust the requirements and the plan. Loop
until nothing is open.

## 8. Propose

- The plan goes through the planning tool's exit; that is the approval gate.
- Reject opens a quiz: rework the plan (section 6), revisit tech requirements
  (section 5), revisit business requirements (section 4), or cancel. Drop back to the
  chosen section.

## 9. Save and stop

- `full`, on approval: MUST write `<docs>/requirements/<task-branch>.md`
  (`## Business`, `## Technical`) and `<docs>/plans/<task-branch>.md` (the docs folder
  from `AGENTS.md` `## Rules`). Add the Caveats from section 3.
- `min`, on approval: ask once whether to save the plan to `<docs>/plans/<task-branch>.md`.
  The `TR`s stay inside the plan; there is no requirements document.
- MUST NOT write code, tests or config.
- Report: the paths written (or "plan-mode file only"), the item count per tag, and the
  line: "On 'implement', run the `code` skill on Opus."

## 10. Amendments

A new or changed requirement during work gets a new `BR-n` or `TR-n` (old ids are never
rewritten or renumbered) and re-enters at section 7. The work continues after approval.
