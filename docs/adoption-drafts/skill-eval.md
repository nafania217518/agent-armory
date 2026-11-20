# skill-eval (new skill)

Sources: https://github.com/wshobson/agents `plugins/llm-finetuning/skills/eval-harness-first/SKILL.md`, `plugins/plugin-eval/skills/evaluation-methodology/SKILL.md`, `evals/README.md` @9c61ab2 (MIT)
Sources: https://github.com/affaan-m/everything-claude-code `skills/skill-comply/SKILL.md` @3f14a10 (MIT)
Sources: https://github.com/alirezarezvani/claude-skills `engineering/skills/agent-regression-evals/SKILL.md` @f8593c4 (MIT)
Sources: https://github.com/anthropics/skills `skills/skill-creator/SKILL.md`, `skills/skill-creator/agents/analyzer.md` @e4bb5d9 (Apache-2.0)
Sources: https://github.com/obra/superpowers `skills/writing-skills/SKILL.md` (wording micro-tests) @22f0b46 (MIT)
Sources: https://github.com/NeoLabHQ/context-engineering-kit `plugins/customaize-agent/skills/agent-evaluation/SKILL.md` @23e2428 (GPL-3.0: ideas only, no text taken)
Status: draft, not adopted

## What it does

It measures whether a skill, agent card, prompt or rule changes agent behavior. It builds
cases from observed failures, runs a baseline arm and a candidate arm several times,
grades by script first, and gives a verdict that a commit can cite.

## What it brings to armory

- `evals/` tests only whether a skill loads or is skipped. This adds behavior and
  compliance evals.
- AGENTS.md asks for "a measured gain", but nothing says how to measure one or when a
  result is noise. This skill gives trial counts, grading and a verdict rule.
- It also holds the grader, judge and trial rules that `ai-evals` reuses (SSOT).
- Would point to it: `skill-authoring` §Show the failure and §Re-run, `retro` (a finding
  whose fix is rule text), AGENTS.md `## Rules` evidence line, `ai-evals`.
- Evidence needed: none for the gap (the armory rule asks for a measured gain and
  `evals/` holds only load and skip cases, confirmed by listing `evals/`). Each numeric
  default needs one measured run on armory cases. From sources: 3 trials (rezvani),
  5 reps (superpowers), 20 trigger requests and 40% held out (skill-creator). Set by this
  draft, lower than the sources for armory's small suites: 10 traces before bucketing and
  20 judge labels (wshobson asks 100 for both), 10 cases for the small-sample note
  (rezvani's suite starts at 20 to 50 cases).

## Cons

- Runs cost tokens: cases × arms × trials sessions.
- Labeling traces by hand takes time; the wshobson source marks its own judge and Monte
  Carlo layers as not validated.
- A judge from another model family, as wshobson asks, is not possible with only Claude
  models; the draft asks for another tier and calibration instead.
- A paired test (paired CI, McNemar) needs a script that armory does not have; the draft
  makes it optional.
- Couples to `ai-evals`: that skill points here for §Graders, §Judges and §Trials.
- Dropped from the sources: the wshobson score snapshot keyed by file hash (armory has
  no static scorer; `max-lines` lint covers size), and the ECC automatic spec generation
  (a runner script, not a rule).

## Fit

- Invocation: model-loaded. `skill-authoring` and `ai-evals` point to its sections, and
  an agent briefed on an eval must load it.
- Hooks into: AGENTS.md `## Commands` needs an `evals:` line that names the eval command;
  AGENTS.md `## Caveats` evals pointer also covers this skill; `skill-authoring`
  §Show the failure, §Re-run, §Description; `ai-evals` §Measures; `retro` §After the list
  armory prompt ("a check" may be an eval case per `skill-eval`).
- Size: about 85 lines.

## Draft SKILL.md

```markdown
---
name: skill-eval
description: >
  Measure whether a skill, agent card, prompt or rule changes agent behavior: cases from
  observed failures, baseline and candidate arms, script graders, calibrated judges,
  repeated trials, a verdict. Use for "eval this skill", "did this rule change help",
  "build an eval case", "/skill-eval".
max-lines: 85
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` first when its rules are not in your context.

# skill-eval

Target: the skill, agent card, prompt or rule text under test. An eval runs the target
in fresh sessions through the eval command of project context `## Commands`.

## 1. Cases

- Cases MUST start from observed failures: session traces, retro findings, past eval
  fails.
- With 10 or more traces, actor MUST tag each failure in its own words first, then group
  the tags into failure buckets. Each bucket MUST get at least one case.
- A behavior suite MUST hold cases where the target should act and cases where it should
  not, in about equal number.
- A trigger suite SHOULD hold about 20 requests, half that should load the target and
  half that should not. Most should-not requests SHOULD be near misses: same words, other
  need.
- When a run tunes a description, it SHOULD hold out about 40% of trigger cases and
  report the held-out score only.
- Cases MUST live in the repo, versioned like code.
- Done when each bucket has a case and each case states its expected behavior.

## 2. Arms

- Each eval MUST run a baseline arm (no target, or the target before the change) and a
  candidate arm, with the same cases, model and effort.
- A baseline that shows no failure MUST end the eval: nothing to fix.
- Done when both arms have run every case for §Trials.

## 3. Graders

- Each bucket MUST get its own grader; one blended score MUST NOT be reported. MUST report
  one score per bucket instead.
- A grader MUST be a script check when one can express the criterion: output pattern,
  schema, tool called, tool order in the trace.
- A grader MUST give pass or fail, not a scale.
- Actor MUST read each flagged hit by hand before counting it: quoted examples and
  template echoes look like hits.
- A grader that passes, or fails, in both arms on every trial tells nothing. Actor MUST
  fix the case or drop it, and report the drop.
- Done when each bucket has a grader and each hit is read.

## 4. Judges

- A model judge MAY grade only a criterion no script can express.
- Before its verdict counts, a judge MUST be checked against human labels on at least 20
  items, reporting true-positive and true-negative rates, not one accuracy number.
- A judge below the agreed rates MUST stay advisory: it flags items for a human and
  decides nothing.
- A judge SHOULD run on another tier than the target's model.
- A pairwise judge MUST run each pair twice with the order swapped; a verdict that flips
  counts as a tie.
- Done when each judge has its rates, or is marked advisory.

## 5. Trials

- Each case MUST run at least 3 trials per arm. A wording check MAY use 5 or more single
  samples per variant.
- Actor MUST average trials within a case first, then compare cases between arms.
- Report MUST give pass@k (passed at least once in k trials) and pass^k (passed all k).
- A case missing from the candidate run MUST count as a fail.
- A critical case that passed every baseline trial MUST block the change on any
  candidate fail.
- Results that spread across trials MUST be reported as "wording not binding", not as a
  gain.
- A paired test (paired confidence interval or McNemar) MAY decide the verdict when the
  project has a script for it.
- Done when each case has its trial count, pass@k and pass^k per arm.

## 6. Verdict

- Verdict MUST be one of: improve, no change, regress.
- With fewer than 10 cases, the verdict MUST carry a note that the sample is small. It
  MUST NOT say "no drop"; it MUST say "no drop seen in <n> cases" instead.
- Report MUST give: target, cases, trials, per-bucket pass^k per arm, verdict, cost in
  sessions, and one evidence line for the commit body.
- Done when the report holds each item.
```
