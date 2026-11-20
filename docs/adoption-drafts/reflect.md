# reflect (new skill)

Sources: https://github.com/alirezarezvani/claude-skills `productivity/reflect/skills/reflect/SKILL.md` @f8593c4 (MIT)
Status: draft, not adopted

## What it does

A mid-run step back that the user starts. Main session stops the work, re-reads the
session from the first goal, names drift, gaps and bias with turn evidence, and ends with
one verdict: continue, pivot or pause.

## What it brings to armory

- `retro` looks back at session end and lists changes to skills and project. Nothing
  checks direction in the middle of a run.
- The fixed verdict set gives a check the user can act on in one answer.
- Would point to it: `retro` §Scope (one line: mid-run direction check is `reflect`);
  nothing else needs it.
- Evidence needed: a session where the user had to stop a run that had drifted from its
  first goal, or a retro finding of that kind.

## Cons

- The source asks for flowing prose with no headers or lists; that clashes with `core`
  §Writing and questions (lead with the answer, numbered steps). The draft uses `core`
  reply shape: verdict first, evidence next.
- No measured need yet (survey rates it medium-low).
- Partly covered by `plan` §Amendments when the drift is a requirement change.
- Dropped from the source: the helper scripts (bias pattern scan, turn counter) and the
  "offer reflection on implicit signals" rule (user-only skill; YAGNI).

## Fit

- Invocation: user-only (`disable-model-invocation`). It interrupts the run, so only the
  user should start it.
- Hooks into: `retro` §Scope gains one pointer line; under `dnd` it cannot run (user-only),
  so `dnd` needs no edit.
- Size: about 50 lines.

## Draft SKILL.md

```markdown
---
name: reflect
description: >
  Mid-run step back: re-read the session from its first goal, name drift, gaps and bias
  with turn evidence, and end with continue, pivot or pause. Use for "/reflect", "step
  back", "are we on track".
disable-model-invocation: true
max-lines: 50
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` first when its rules are not in your context.

# reflect

Main session checks the direction of the current work when user starts it. `retro` is
the session-end look back; this skill is the mid-run one.

## 1. Stop

- MUST stop the current work: no new edit, spawn or brief until the verdict. Running
  agents MAY finish.
- Done when no new work started after the request.

## 2. Re-read

- MUST re-read the session from the first user goal, not only recent turns.
- MUST state the first goal and the current work, each with its turn.
- Done when both are stated with turn evidence.

## 3. Check

- MUST check each point below and report only those that hold, each with turn evidence:
  - drift: current work no longer serves the first goal;
  - gaps: an assumption not checked, a constraint skipped, an option dropped with no
    basis;
  - framing: a simpler path, or the work solves an easier nearby problem;
  - bias: only confirming evidence cited (confirmation); "we already built X" as the
    reason to go on (sunk cost); options judged only against the first one (anchoring);
    steps or guards added with no named need (complexity); old context ignored for the
    last few turns (recency).
- MUST NOT report a problem with no turn evidence. A sound path MUST be called sound,
  with its reasons.
- Done when each point is checked and each reported one has evidence.

## 4. Verdict

- Reply MUST lead with one verdict: `Continue`, `Pivot to <X>` or `Pause for <question>`,
  then the evidence of §Check.
- `Pivot` MUST name what to drop and its basis (`core` §Writing and questions).
- `Pivot` and `Pause` MUST end with one question through question tool: go ahead, or
  answer the paused question. A pivot that changes a requirement MUST follow `plan`
  §Amendments.
- Done when the verdict is given and, for `Pivot` or `Pause`, user has answered.
```
