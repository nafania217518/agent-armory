# prototype (new skill)

Sources:
- https://github.com/mattpocock/skills `skills/engineering/prototype/` (`SKILL.md`, `LOGIC.md`, `UI.md`) @5863806 (MIT)
- https://github.com/gsd-build/get-shit-done `get-shit-done/workflows/spike.md`, `get-shit-done/workflows/sketch.md`, `spike-wrap-up.md` @bdcaab2 (MIT)

Status: draft, not adopted

All text is paraphrase; no source text is copied.

## What it does
Builds throwaway code that answers one design or feasibility question before the plan: a
logic or state demo, two or three UI variants, or a feasibility spike. Only the verdict
reaches the plan; the code stays on a branch that never merges.

## What it brings to armory
`plan` §Before the plan forbids code before approval, and armory has no sanctioned way to
settle "does this work" or "does this feel right" first. This skill turns that answer into a
basis (`core` §Writing and questions) for a recommended option. `plan` §Before the plan and
`research` §When to research would point to it.

Split with `debug`: a debug harness probes a known bug in existing code; a prototype answers
a design question before the code exists.

Evidence needed: a plan that was approved on a feasibility or UX guess and then reworked
after coding showed the guess wrong.

## Cons
- YAGNI risk: a prototype can grow into the feature. The throwaway rules below must hold
  strictly.
- Needs a stated exception to `plan` "Planning MUST NOT write code"; that is a rule change in
  `plan`.
- Costs a coder spawn and a worktree during planning.

## Fit
- Invocation: model-loaded, but each run needs user's yes, since it writes code before
  approval.
- Hooks into:
  - `plan` §Before the plan: change "Planning MUST NOT write code, tests or config" to add
    "except a prototype user approved (`prototype`), on its own throwaway branch".
  - `research` §When to research: a prototype verdict MAY serve as basis.
  - `code` §Task end, step 8: ask keep or delete for each prototype branch, as for
    diagnose-only branches.
- Size: 48 lines.

## Draft SKILL.md

````markdown
---
name: prototype
description: >
  Throwaway code that answers one design or feasibility question before the plan: a logic or
  state demo, UI variants behind one switch, or a feasibility spike, with a verdict for the
  plan. Use for "prototype this", "spike", "will this work", "try a few UI options", and from
  `plan` when an open point needs a working answer.
max-lines: 48
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` first when its rules are not in your context.

# prototype

Main session runs it during `plan`, after user's yes; a coder builds it in its worktree.

## 1. Question

- MUST state the one question, and its kind: logic or state, UI look, or feasibility.
- MUST write each check as Given, When, Then, with a result user can observe.
- With several checks, the riskiest MUST run first.
- Done when user has said yes to the question and its checks.

## 2. Build

- Code MUST live on its own branch named `proto/<slug>`, cut from `<base>`. It MUST NOT merge;
  the plan's code starts fresh.
- File names MUST mark the code as throwaway.
- It MUST run with one command, or open as one file.
- State MUST stay in memory, unless storage is the question.
- It MUST NOT have tests, polish or abstractions; it MUST hold only the code the checks need.
- It MUST show the full state after each action.
- Logic or state: one page with buttons per action and the state shown after each.
- UI look: 2–3 clearly different variants, switched by one control on one page.
- Done when the one command runs and each check can be tried.

## 3. Verdict

- Each check MUST get one verdict: validated, partial or invalidated, with what was tried.
- Validated MUST NOT rest on the happy path alone; an edge or failure case MUST be tried too.
- Only the question, the verdicts and the branch name MUST go to the plan proposal or the
  tracker item. No prototype code goes there.
- Done when each check has its verdict.

## 4. Cleanup

- Main session MUST ask user to keep or delete the branch. Done when user has answered.
````
