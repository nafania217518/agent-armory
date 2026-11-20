# delegate ← superpowers (improvement)

Sources: https://github.com/obra/superpowers `skills/subagent-driven-development/SKILL.md`, `skills/subagent-driven-development/references/fix-loop.md`, `skills/subagent-driven-development/references/final-review.md` @22f0b46 (MIT)
Status: draft, not adopted

## What it brings

A ban on steering a reviewer in its brief, and one fixer for a batch of final-review
findings. The progress ledger of the same source goes to the `handoff` draft.

## Cons

- `delegate` is at its `max-lines` (225); changes add about 7 lines.
- The source's diff-as-file package is left out: in armory the reviewer reads the diff in
  its own context, and main session never holds it.
- The source's breaker (main session rules on findings after round 5) is left out: armory
  asks user before a third round (`code` §Review loop).

## Proposed changes

### 1. No steering in a review brief

- Target: `delegate` §Briefs (add bullet, after "A review brief MUST also hold commit
  range")
- Text:
  - A review or check brief MUST NOT tell the agent what not to flag, what group to give
    a finding, or that a choice is settled. It MUST name the plan sections and `TR`s that
    hold the choice instead (above). Main session MUST settle a finding it thinks false
    through the claim check of `code` §Review loop.
- Why: a brief that pre-judges a finding spares main session a fix round and hides the
  finding from review.
- Evidence needed: a review brief in an armory run that held "do not flag", "at most
  Should fix" or a like phrase.

### 2. One fixer for final-review findings

- Target: `delegate` §Briefs (add bullet, after "Follow-up work MUST go as a follow-up
  message")
- Text:
  - Final-review findings whose agents' outputs are closed SHOULD go to one fixer in one
    brief, split only by §Models row.
- Why: each fixer spawn re-reads the context and re-runs the gates; the source reports a
  session where per-finding fixers cost more than all its tasks together.
- Evidence needed: an armory final review whose findings went to several fixers, with the
  spawn count and token cost against one fixer.
