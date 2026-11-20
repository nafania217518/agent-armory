---
name: plan-draft
description: >
  The planner's drafting rules: the `TR` items, their `tests:` lines and the test scope
  of a task plan draft, and the task check and walks it runs on the draft before its
  report. Loaded by the planner card; "/plan-draft". Not for a planning request from the
  user.
metadata:
  type: regular
  extends: [core, craft, requirements]
  max-lines: 61
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` before your first step when its rules are not in your context.
Load `requirements` before you write or check a `TR` when its rules are not in your
context.
Load `craft` before you write or check a `TR` when its rules are not in your context.

# plan-draft

How the planner drafts the task part of a plan and checks its draft.

## 1. Task check

- Before its report, planner MUST check its draft: each line below holds; else the draft
  is fixed first.
  - Every `BR` of the task, except a gate-type `BR`, has a `TR`. Every `TR` meets
    `requirements` §1 and §2 and has a `tests:` case for each edge case and each failure
    path it names, or a `tests: none` line.
  - The design issues under `core` §4 and `craft` §1 and §2 are fixed.
  - Each claim in any section with "every", "each", "all", "always", "never" or "only",
    and each claim on the form of existing data a `TR` reads, holds on each path and
    file the `TR` touches, queue and retry paths included, by a search; else it is
    narrowed or dropped. Each file, symbol or step a `TR` prescribes exists and has an
    effect in the code it names.
  - Each claim on how a tool, library or platform behaves (a wait, a return value, a
    call used as a check) rests on a probe run during planning or a cited source; else
    it goes to a probe or research before the proposal.
  - Each `TR` that calls an outside part (fs, process, git, network, an engine API)
    names each failure of that call and its outcome. One that waits, locks or retries
    names each loop exit: success, timeout, a step that always fails, a half-written
    state after a crash.
  - Each bound a `TR` sets (count, length, range) is walked, largest value included,
    against the domain rules of its data. Each input it reads is walked for missing,
    empty and malformed values.
  - Each pair of `TR` items that act in one run states their order or shared state in
    the later `TR`.
- Check MUST also run the flow walk of `requirements` §3 on the draft.
- Check MUST also walk each new `tests:` case, with its expected value, through its
  `TR` and the existing rules of its component, in the plan and code. A case one of them
  makes impossible MUST be dropped or rewritten. A case whose expected value still holds
  without its `TR`'s code, a swappable test value included, MUST be rewritten.

## 2. Drafting

- Draft MUST take the formats of `requirements` §1 and §2.
- Draft SHOULD look for complexity to remove before adding; deletion SHOULD beat
  addition. It MAY include that simplification.
- A `TR` for a defect in built code (`requirements` §1) MUST name its fault class and
  each call site of that class, found by a grep.
