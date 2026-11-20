# triage ← solo-skills (improvement)

Sources:
- https://github.com/rockscy/solo-skills `skills/bug-from-user/SKILL.md` @80ec4cf (MIT)

Status: draft, not adopted

## What it brings

A confidence level on a bug, by how many assumptions triage made, so user sees how sure
the reading is before picking an outcome.

## Cons

- Small gain: step 2 already names the gap that leaves a bug unproven.
- `triage` is at its `max-lines` cap (103).
- The four bug fields of this source (trigger, expected, actual, surface) are proposed
  once, in `triage-ecc-improvement` change 2, which holds the fuller list.
- "It's slow" or "it's ugly" as a non-bug is not proposed: the bug definition of
  `triage` §Triage one item already makes an item with no fixed output an enhancement.

## Proposed changes

### 1. Confidence on a bug

- Target: `triage` §Triage one item, step 4 (add sentence after "Message text MUST hold
  reasons")
- Text:
  ```
     For a bug, message text MUST also give a confidence: high when the item alone lets a
     reader reproduce it, medium with one or two assumptions, low with more. It MUST name
     each assumption.
  ```
- Why: step 4 shows reasons but not how much of the reading is assumed.
- Evidence needed: an `accepted` bug whose `BR` lines rested on an unstated assumption
  that the reporter later contradicted.
