# plan ← wshobson (improvement)

Sources:
- https://github.com/wshobson/agents `plugins/before-you-build/skills/before-you-build/SKILL.md` @9c61ab2 (MIT)
- https://github.com/wshobson/agents `plugins/documentation-generation/skills/architecture-decision-records/SKILL.md` @9c61ab2 (MIT)

Status: draft, not adopted

## What it brings

A short pre-mortem in a strategic run: it names the assumption most likely to sink new
work, the smallest evidence that tests it, and what to delay. The evidence milestone then
comes first.

## Cons

- The source targets product risk (demand, payment, retention). Most armory strategic
  runs plan tools and code, where this adds little.
- Overlaps `plan` §Before the plan ("push back on any part of the request the need does
  not justify") and `core` YAGNI.
- `plan` is at its `max-lines` cap (374).
- The ADR rule of this source (an accepted decision is never edited; a new one supersedes
  it) is proposed once, in `plan-ecc-improvement` change 3.

## Proposed changes

### 1. Pre-mortem in a strategic run

- Target: `plan` §Quizzes (add bullet, after the business-quiz bullet)
- Text:
  ```
  - A strategic run that adds a milestone for new user-facing work MUST, in its business
    quiz, propose three items: the assumption most likely to make the work useless, the
    smallest evidence that tests it, and what to delay until that evidence is in. A
    milestone that gathers that evidence SHOULD come first in the milestone list. Done
    when user accepted or changed the three items.
  ```
- Why: no rule asks a strategic run to name its riskiest assumption before it fixes the
  milestone order.
- Evidence needed: a milestone built and later dropped because an untested assumption
  failed; or a retro finding that an earlier evidence milestone would have saved the work.
