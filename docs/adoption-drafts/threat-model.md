# threat-model (new skill)

Sources:
- https://github.com/wshobson/agents `plugins/security-scanning/skills/stride-analysis-patterns`, `security-requirement-extraction`, `threat-mitigation-mapping`, `attack-tree-construction` (each `SKILL.md`) @9c61ab2 (MIT)
- https://github.com/gsd-build/get-shit-done `agents/gsd-planner.md` (threat_model), `agents/gsd-plan-checker.md`, `agents/gsd-security-auditor.md`, `agents/gsd-verifier.md` @bdcaab2 (MIT)

Status: draft, not adopted

All text is paraphrase; no source text is copied. Attack trees are left out (YAGNI for a
per-task model).

## What it does
At plan time, maps the data flows a task adds across a trust boundary, asks the six STRIDE
questions per flow element, and writes each credible threat as a Risks line with a
disposition. At review time, gives each planned threat a verdict.

## What it brings to armory
Armory checks security only after the code exists: `review` §Look for (class Risk), `audit`
and the `owasp` gate. Nothing covers it at design time. This skill feeds `plan` Risks lines
and `TR` items, and gives `review` a per-threat check. `plan` §Quizzes and §The plan, and
`review` §The diff is the truth would point to it.

Evidence needed: a session where a security hole reached review or later that a design-time
STRIDE pass on the task's trust boundary would have named.

## Cons
- Heavy for small tasks; the trigger list below keeps it to trust-boundary changes.
- Adds lines to `plan`, already the longest skill (374 lines); the draft keeps them in this
  skill and adds only pointers to `plan`.
- Partial overlap with `review` class Risk and the `owasp` gate; this skill works before the
  code, they work after.

## Fit
- Invocation: model-loaded. `plan` loads it when a task touches a trust boundary; the user
  may also ask for a threat model.
- Hooks into:
  - `plan` §Quizzes, tech quiz: "risks" gains "threat model when `threat-model` §Trigger
    holds".
  - `plan` §The plan, Risks bullet: a threat line follows `threat-model` §Register.
  - `review` §The diff is the truth: add "When the plan holds threat lines, MUST apply
    `threat-model` §Verdict."
- Size: 58 lines.

## Draft SKILL.md

````markdown
---
name: threat-model
description: >
  Design-time threat model of a task that crosses a trust boundary: data-flow map, STRIDE
  questions per element, a threat register in the plan's Risks lines, and a per-threat
  verdict at review. Use for "threat model", "STRIDE", "is this design secure", and from
  `plan` and `review` when a task touches a trust boundary.
max-lines: 58
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` first when its rules are not in your context.

# threat-model

Main session runs §Trigger to §Register during `plan`; reviewer runs §Verdict.

## 1. Trigger

- A task MUST get a threat model when it adds or changes any of: authentication or
  authorization, input from users or other systems, stored data writes, secrets, calls to an
  outside service, or file or process access built from input.
- Other tasks MUST skip this skill.

## 2. Map

- MUST list each element the task adds or changes on a path across a trust boundary: entry
  point, process, data store, outbound call.
- Done when each element names the boundary it crosses and the data it carries.

## 3. STRIDE

- For each element, MUST ask the six questions: can a caller pretend to be someone else
  (spoofing); change data in transit or at rest (tampering); deny an action (repudiation);
  read data it should not (information disclosure); stop service (denial of service); gain
  rights it should not have (elevation of privilege).
- Each credible threat MUST become a register line (§Register). A question with no credible
  threat needs no line.
- Done when each element has its six answers.

## 4. Register

- Each threat MUST be one Risks line in the plan: `T-n <class> <element>: <threat>`, then its
  disposition:
  - mitigate: the `TR` that builds the control and tests it;
  - accept: the quiz answer that accepts it;
  - transfer: the system or party that handles it.
- A mitigation `TR` MUST have a `tests:` case that tries the threat and fails without the
  control.
- Done when each threat line has its disposition.

## 5. Verdict

- Reviewer MUST give each threat line one verdict: mitigated (the `path:line` of the check,
  at every entry point), accepted, transferred, or open.
- An open threat MUST be a Must fix finding.
- New attack surface in the diff with no threat line MUST be a finding.
- Done when each threat line has its verdict.
````
