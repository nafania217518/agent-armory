# audit ← mattpocock (improvement)

Sources: https://github.com/mattpocock/skills `skills/engineering/improve-codebase-architecture/SKILL.md` @5863806 (MIT)
Status: draft, not adopted

## What it brings

A Shape smell for shallow modules, which the Lean class misses because it only deletes
pass-throughs: one concept spread over many small modules, or an interface almost as big as
its body. Also a rule that an audit does not reopen a recorded design decision without
cause.

## Cons

- `review` §Look for already holds the deletion test and the one-adapter seam rule from the
  same author; a draft from this source must not copy them again.
- The smell is a judgment call and can clash with class Lean, item split. The Fix text
  points the other way (merge), so the reviewer must weigh both.
- Dropped: the HTML report, the user grilling loop and glossary edits. `audit` writes
  nothing and asks no questions.
- Dropped: hot-spot scoping. `audit` §Map first already reads first the files `git log`
  shows changing most often.
- The new smell sits in `review` §Look for, so it also applies to every review, not only to
  audits.
- Size: `review` (161 of 161) and `audit` (77 of 77) are at their `max-lines`; adopting adds
  about 2 and 3 lines, so `max-lines` must rise or other lines go.

## Proposed changes

### 1. Shallow Module smell

- Target: `review` §Look for, class 7 Shape (add item after Fat Interface)
- Text: `- Shallow Module: an interface nearly as large as the code behind it, or one concept
  a reader must follow across many small modules. Fix: merge them into one module with a
  smaller interface.`
- Why: Lean's yagni item catches a wrapper that only passes calls through, not a cluster of
  thin modules that each do a little.
- Evidence needed: an audit of a repo with such a cluster that reported nothing on it, or an
  eval case.

### 2. Recorded decisions stay closed

- Target: `audit` §Audit-only checks (add bullet)
- Text: A Lean or Shape finding that a decision in `<docs>/DESIGN.md` rules out MUST NOT be
  reported, unless the code shows that decision's cost. Such a finding MUST then name the
  decision and its cost.
- Why: `review` §Check before you report skips findings a plan's Overrides names, but an
  audit has no plan, so it may re-propose what the design already rejected.
- Evidence needed: an audit that proposed a change `<docs>/DESIGN.md` had already rejected.
