# skill-authoring (new skill)

Sources: https://github.com/obra/superpowers `skills/writing-skills/SKILL.md`, `skills/writing-skills/references/bulletproofing.md`, `skills/writing-skills/references/testing-skills-with-subagents.md` @22f0b46 (MIT)
Sources: https://github.com/anthropics/skills `skills/skill-creator/SKILL.md`, `skills/skill-creator/agents/analyzer.md` @e4bb5d9 (Apache-2.0)
Sources: https://github.com/NeoLabHQ/context-engineering-kit `plugins/customaize-agent/skills/test-skill/`, `test-prompt/`, `create-rule/` @23e2428 (GPL-3.0: ideas only, no text taken)
Status: draft, not adopted

## What it does

It treats a new or changed skill rule as test-first work. The author shows the failure
without the rule, writes the smallest rule in the form that fits that failure, re-runs,
and closes each new loophole.

## What it brings to armory

- AGENTS.md says a new or tightened rule MUST cite an observed failure or a measured
  gain. No skill says how to get either. This skill gives the steps; `skill-eval` gives
  the measure.
- It adds the "form by failure type" choice. Armory already has one part of it: a
  `MUST NOT` names what to do instead (AGENTS.md `## Rules`).
- Would point to it: AGENTS.md `## Rules` (the evidence rule), `retro` §After the list
  (an armory finding becomes a skill edit), `plan` for a task that edits a skill.
- Evidence needed: one armory skill edit that a later session or retro shows did not
  change behavior, or a measured case where a rule written by these steps beat one
  written without them.

## Cons

- Overlaps `docs/tightening.md` (shrink passes) and `docs/research/skills-best-practices.md`
  §5 items 20, 21 and 23. The draft points to them and adds only steps.
- Baseline runs cost tokens: about 3 runs per arm per case.
- The installed Anthropic skill-creator triggers on the same requests; user-only
  invocation avoids a clash.
- superpowers wants a pressure test before every edit. That is too costly here; the draft
  accepts an observed failure from a session or retro as the baseline.
- NeoLab source is GPL-3.0; only the wrong/right example idea is used.

## Fit

- Invocation: user-only (`disable-model-invocation`). Skill edits happen only in the
  armory repo, and a brief names the skill by repo path (AGENTS.md `## Rules`), so an
  always-on trigger buys nothing.
- Hooks into: AGENTS.md `## Rules` evidence line gains "; `skills/skill-authoring/SKILL.md`
  says how to get it"; `retro` §After the list, armory prompt: "a change to rule text
  follows `skill-authoring`"; `plan` brief for a skill task names this skill.
- Size: about 70 lines.

## Draft SKILL.md

```markdown
---
name: skill-authoring
description: >
  Write or change a rule in a skill, agent card or project context test-first: show the
  failure, pick the rule form, write the smallest rule, re-run, close loopholes. Use for
  "/skill-authoring".
disable-model-invocation: true
max-lines: 70
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` first when its rules are not in your context.

# skill-authoring

Actor writes or changes rule text. Each step gives the evidence that project context
`## Rules` asks for. `skill-eval` holds the runs and the verdict.

## 1. Show the failure

- MUST name the failure before writing: a session step, a retro finding or an eval case,
  each with what the agent did and what it should have done.
- With no observed failure, MUST run a baseline arm (`skill-eval` §Arms) on a task that
  tempts the failure. A baseline that does not fail MUST stop the edit: nothing to fix.
- A failure that a script can detect (fixed pattern, banned call, file place) MUST go to
  a check (`retro` §Finding classes), not to rule text.
- Done when the failure is written down with its source, or the edit is stopped.

## 2. Pick the form

- MUST pick the rule form by failure type:
  - agent knows the rule and skips it under pressure: a prohibition with its do-instead,
    plus each rationalization seen, named as not allowed;
  - output has the wrong shape: a recipe of the output's parts, in order;
  - output misses one element: a required slot in the template the agent fills;
  - behavior should depend on a condition: a rule keyed to a condition the agent can
    observe.
- MUST NOT add a nuance or exemption clause ("unless it matters", "this does not apply
  to"). MUST write a real exception as its own rule with its own observable condition.
- A rule whose wrong reading is likely MAY hold one wrong and one right example of the
  same case.
- Done when the failure type and the chosen form are named.

## 3. Write the smallest rule

- MUST write only text that answers the failures of §Show the failure. A case nobody saw
  fail MUST stay out (`core` §Design principles, YAGNI).
- MUST place the rule where the failure happened (`retro` §Finding classes).
- A shrink of existing text MUST follow `docs/tightening.md`.
- Done when the diff holds only rules that each map to one named failure.

## 4. Re-run and close loopholes

- MUST run the candidate arm on the same cases as the baseline (`skill-eval` §Arms).
- Each new rationalization or wrong reading in the runs MUST get its own named line, or
  a form change (§Pick the form). MUST re-run after each change.
- Results spread across runs (each run reads the rule another way) MUST lead to a form
  change, not to added words.
- MUST stop after 3 rounds with no gain, and report the rule as not binding.
- Done when `skill-eval` §Verdict says improve, or the rule is reported as not binding.

## 5. Description

- A description MUST hold triggers only, no workflow summary, each case once (project
  context `## Rules`).
- A new or changed description SHOULD pass a trigger eval (`skill-eval` §Cases).
- Done when the description holds only triggers, and the trigger eval passed or its skip
  is recorded.

## 6. Report

- MUST report: the failure with its source, the form, each round's verdict, and the
  evidence line for the commit body.
- Done when the report holds each item.
```
