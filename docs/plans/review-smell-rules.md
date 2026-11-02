# Plan: review-smell-rules

Parent: `docs/milestones/adopt-mp-rules.md` section Tasks, line `review-smell-rules`.

## Goal

The `review` skill gets the deletion test and the one-adapter rule (A6) and six Fowler
smells (A7) from mattpocock/skills. Quiz on 2026-11-02: the smells form a new class 7,
Shape, between Lean and Readability, so the Lean line count stays clean. `audit` takes
the classes and the order from `review`, so it gets them too. This is the last task of
the milestone.

## Requirements

Format: `TR-<n> (<milestone>/BR-<m>, ...): MUST <behavior>`, then an indented `tests:`
line that names the tests, or `tests: none, <why>`.

All items: `tests: none, prose rule in a skill; the project context gives skills no test
level, so lint and the review check them`.

- TR-1 (adopt-mp-rules/BR-10): the `yagni` sub-bullet of class 6 Lean in `review`
  section Look for MUST read: `- yagni: an abstraction with one implementation, a
  factory with one product, a wrapper that only passes calls through, config nobody
  sets. Deletion test: delete the module in thought; complexity that vanishes marks a
  pass-through, complexity that returns in every caller marks a module that earns its
  place. A seam with one adapter is hypothetical; a second adapter makes it real.`
  tests: none (see above)
- TR-2 (replaced by TR-5, TR-6) (adopt-mp-rules/BR-11): `review` section Look for
  MUST hold a new class after Lean, and Readability MUST become class 8:
  `7. Shape: code in the wrong place or form. Each smell is a judgement call. A
  \`## Rules\` line in the project context that allows the pattern MUST remove the
  finding.` with six sub-bullets:
  `- Feature Envy: a function uses another unit's data more than its own. Fix: move it
  to that data.`
  `- Data Clumps: the same fields or parameters travel together. Fix: one type for
  them.`
  `- Primitive Obsession: a primitive or a string stands for a domain concept. Fix: a
  small type of its own.`
  `- Shotgun Surgery: one change edits many scattered places. Fix: gather what changes
  together into one module.`
  `- Message Chains: a caller walks \`a.b().c().d()\`. Fix: one method on the first
  object hides the walk.`
  `- Repeated Switches: the same switch on one type in several places. Fix: one shared
  map, or polymorphism.`
  tests: none (see above)
- TR-3 (adopt-mp-rules/BR-11): in `review`, the order line in section Look for MUST
  read `correct, safe, holds under load, tested, fast, lean, well shaped, readable`, and
  the Should fix group in section Output MUST name a smell: "code that should not exist
  or is hard to read" becomes "code that should not exist, a smell (class Shape), code
  that is hard to read".
  tests: none (see above)
- TR-4 (adopt-mp-rules/BR-12, adopt-mp-rules/BR-13): `lint` and `unit` MUST pass on
  every commit. The commit that takes `review` over its `max-lines` (134) MUST raise it
  to the new line count plus 5. No section is renamed; the classes keep their names; no
  file names the Readability class by its number (checked).
  tests: none (see above)
- TR-5 (adopt-mp-rules/BR-11): the Message Chains sub-bullet of class 7 MUST read:
  `- Message Chains: a caller reaches through objects it does not own, as in
  \`order.customer().address().city()\`. Fix: one method on the first object hides the
  walk.` Review finding 1: the old example read as a ban on the chaining that
  `implement` section Readability asks for.
  tests: none (see above)
- TR-6 (adopt-mp-rules/BR-11): in class 7, the Primitive Obsession sub-bullet MUST add
  `and lets an illegal value in (\`implement\` section Domain, boundaries and state)`
  after "stands for a domain concept", and the class head MUST add `, unless the code
  also breaks an \`implement\` MUST` before the period of "MUST remove the finding".
  Review finding 2: plain strings are allowed by `implement`, and a `## Rules` line
  cannot cancel an `implement` MUST.
  tests: none (see above)
- TR-7 (adopt-mp-rules/BR-13): the description of the reviewer agent card MUST read
  "well shaped, readable" where it now reads "lean, readable", in
  `skills/setup/templates/agents/reviewer.md` and in the rendered
  `.claude/agents/reviewer.md`. Review finding 3: both copy the order line.
  tests: none (see above)

Format each class and sub-bullet as the section does: three-space indent under a class,
wrap at about 88 characters. One commit per TR; TR-4 holds no commit of its own.

## Test scope

Format: `<test case> : <break | rework | remove> : <reason>`.

None: no test under `scripts/` reads `skills/review/SKILL.md`.

## Risks

- `review` grows by about 17 lines; the reviewer and auditor load sets grow with it
  (`DESIGN.md` section 4).
- Shape findings are judgement calls; section Check before you report still demands a
  concrete case for each, which keeps them from turning into style taste.

## Stack choices

None.

## Out of scope

- The other Fowler smells: Mysterious Name (class Readability covers it), Duplicated
  Code (`merge`), Divergent Change (`split`), Speculative Generality and Middle Man
  (`yagni`), Refused Bequest.
- `implement`: no new rule.
- The two-axis review in separate subagents (dropped on 2026-11-02).

## Accepted tech debt

None.

## Overrides

Format: `<design rule> : <reason>`.

- `code` section Branch and plan file, cut from `<base>` : the user keeps local
  `master` four commits ahead of `origin/master` (no push), so the branch cuts from
  local `master` (`7b83673`); not a design rule, recorded for the user's approval.

## Caveats

None.
