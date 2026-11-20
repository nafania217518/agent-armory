# delegate ← ecc (improvement)

Sources: https://github.com/affaan-m/everything-claude-code `skills/loop-design-check/SKILL.md` @3f14a10 (MIT)
Status: draft, not adopted

## What it brings

A boundary beside each check-based done condition: the brief names what the agent must
not change to meet it. This blocks the case where an agent makes a check pass by changing
the check.

## Cons

- Most of the source already exists in armory: a judge that is never the builder
  (`delegate` §Briefs), a round cap and user ask (`code` §Review loop), quizzes before the
  run (`plan` §Before the plan), the test-scope list (`implement` §Tests while coding).
- Overlaps the gate-integrity rule of `implement-rezvani-improvement.md` for coders; if
  that one is adopted, this rule covers the other briefs and points to it.
- Left out: the loop type and skeleton choice, and the "reconcile against an outside fact"
  rule, which fits a data-migration draft (`migrate`) better than `delegate`.
- `delegate` is at its `max-lines` (225); the change adds about 4 lines.

## Proposed changes

### 1. Boundary beside a check-based done condition

- Target: `delegate` §Briefs (add bullet, after "Each brief MUST name the §Models row")
- Text:
  - A brief whose done condition is a check the agent runs (a gate, a loop command, a
    script, a count) MUST also name what the agent must not change to meet it: the check,
    its config and its fixed inputs. The test-scope list (`implement` §Tests while coding)
    is that boundary for test cases.
- Why: a done condition with no boundary lets an agent pass by editing the check, such as
  a debugger that weakens its loop command.
- Evidence needed: an armory result that met its check by changing the check, its config
  or its inputs.
