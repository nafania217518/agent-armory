# ai-evals (new skill)

Sources: https://github.com/gsd-build/get-shit-done `commands/gsd/ai-integration-phase.md`, `commands/gsd/eval-review.md`, `agents/gsd-eval-planner.md`, `agents/gsd-eval-auditor.md`, `get-shit-done/references/ai-evals.md` @bdcaab2 (MIT)
Status: draft, not adopted

## What it does

It plans and audits evals for a feature built on a large language model (LLM): critical
failure modes, eval dimensions with pass/fail rubrics, a small reference dataset, a
measure per dimension, and a coverage audit of what was built.

## What it brings to armory

- `test` levels assume deterministic output (`test` §Determinism). Nothing covers a
  feature whose output varies from run to run.
- It reuses `skill-eval` §Graders, §Judges and §Trials, so the measuring rules live once.
- Would point to it: `plan` §Requirements (an LLM feature gets one requirement per eval
  dimension), `test` §Determinism (an eval is not a test), `review` and `audit` (coverage
  audit of an LLM feature).
- Evidence needed: an armory-run project that ships an LLM feature, and a defect in its
  model output that a test suite could not catch.

## Cons

- Only for projects that build LLM features.
- Depends on `skill-eval`; adopt both, or move §Graders, §Judges and §Trials here.
- The source's tool table (RAGAS, Langfuse, Promptfoo and others) dates fast; the draft
  sends tool choice to `research` instead.
- Dropped from the source: the weighted coverage and infra scores (invented weights)
  and the 1-to-5 rubric scale (`skill-eval` §Graders asks for pass/fail).

## Fit

- Invocation: model-loaded. A plan for an LLM feature must reach it without the user
  naming it.
- Hooks into: `plan` §Requirements gains "A requirement on LLM output follows `ai-evals`
  §Plan"; `test` §Determinism gains "An eval of model output (`ai-evals`) is not a test;
  this section does not apply to it"; `audit` §Map first MAY name `ai-evals` §Audit for a
  repo with LLM features.
- Size: about 65 lines.

## Draft SKILL.md

```markdown
---
name: ai-evals
description: >
  Plan or audit evals for a feature built on a large language model: failure modes,
  dimensions with rubrics, reference dataset, measures, guardrails, coverage. Use for
  "plan evals for this LLM feature", "audit eval coverage", "/ai-evals".
max-lines: 65
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` first when its rules are not in your context. Load `skill-eval` for
§Graders, §Judges and §Trials.

# ai-evals

Feature: the part of the product whose output a model produces. An eval checks that
output; it is not a test (`test` §Determinism).

## 1. Plan

- MUST list the 3 to 5 failure modes of the feature that cannot go wrong, each with its
  cost to the user.
- MUST name one eval dimension per failure mode (for example faithfulness to source,
  schema validity, tool choice, policy compliance).
- Each dimension MUST get a pass/fail rubric with one passing and one failing example
  from the feature's domain.
- A domain expert SHOULD confirm each rubric; with none, the plan MUST mark it
  unconfirmed.
- Each dimension MUST become one requirement of the plan (`plan` §Requirements).
- Done when each failure mode has its dimension, rubric and requirement.

## 2. Dataset

- Reference dataset SHOULD start at 10 to 20 cases: critical success cases, common
  flows, known edge cases, past failures.
- It MUST grow from failures seen in use, not from guessed coverage.
- Dataset MUST live in the repo, versioned like code.
- Done when each dimension has at least one passing and one failing case.

## 3. Measures

- Each dimension MUST get its measure by `skill-eval` §Graders: a code check first, a
  judge only under `skill-eval` §Judges, a human review for judge calibration.
- A failure mode whose miss is severe (harm, legal, money) MUST get a runtime guardrail
  that blocks or escalates the output. Others MAY run as offline batch evals.
- Tool choice MUST follow `research` §When to research.
- Eval runs MUST follow `skill-eval` §Trials.
- Done when each dimension has its measure and each severe mode its guardrail.

## 4. Audit

- Audit MUST mark each planned dimension `covered` (measure exists, follows its rubric,
  runs), `partial` (exists but misses rubric, automation or cases) or `missing`.
- A critical dimension that is `partial` MUST count as `missing`.
- Each `missing` dimension and each absent guardrail MUST be a blocking finding; each
  `partial` one a non-blocking finding with the step to reach `covered`.
- Findings MUST follow `review` §Output.
- Done when each dimension has its mark and each mark below `covered` has its finding.
```
