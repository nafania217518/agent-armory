# Plan: test-tdd-rules

Parent: `docs/milestones/adopt-mp-rules.md` section Tasks, line `test-tdd-rules`.

## Goal

The `test` skill gets two rules from mattpocock/skills (A4): one test at a time in the
TDD loop, and expected values from a source independent of the code. Zero quiz rounds:
the milestone doc settles both rules, and no glossary term came up.

## Requirements

Format: `TR-<n> (<milestone>/BR-<m>, ...): MUST <behavior>`, then an indented `tests:`
line that names the tests, or `tests: none, <why>`.

All items: `tests: none, prose rule in a skill; the project context gives skills no test
level, so lint and the review check them`.

- TR-1 (replaced by TR-4) (adopt-mp-rules/BR-8): `test` section TDD MUST replace its
  first bullet ("You MUST write the failing test for every requirement before the
  code…") with: `- You MUST write the failing test for every requirement before the
  code, except one with \`tests: none\`. You MUST work one test at a time: write it,
  see it fail for the expected reason, make the smallest change that passes it, and
  only then write the next test.`
  tests: none (see above)
- TR-2 (adopt-mp-rules/BR-9): `test` section TDD MUST hold, after the bullet "A test
  that still passes when every function returns nothing MUST be thrown out.": `- An
  expected value MUST come from a source independent of the code: a literal, a worked
  example, the spec. A test MUST NOT compute its expected value the way the code
  does.` Section Review checks already makes each breach a finding.
  tests: none (see above)
- TR-3 (adopt-mp-rules/BR-12, adopt-mp-rules/BR-13): `lint` and `unit` MUST pass on
  every commit. When a commit takes `test` over its `max-lines` (124), that same commit
  MUST raise it to the new line count plus 5. No section is renamed; no other file
  restates the two changed rules (checked: the coder card says only "failing test
  first").
  tests: none (see above)
- TR-4 (adopt-mp-rules/BR-8): the TR-1 bullet MUST end with this sentence after "and
  only then write the next test.": `A test that passes on its first run MUST fail once
  you break the code it covers; you MUST then undo the break.` Review finding 1: a
  later test can pass at once, so "see it fail" cannot always happen.
  tests: none (see above)

Wrap each bullet at about 88 characters, two-space continuation. One commit per TR;
TR-3 holds no commit of its own unless a raise is needed.

## Test scope

Format: `<test case> : <break | rework | remove> : <reason>`.

None: no test under `scripts/` reads `skills/test/SKILL.md`.

## Risks

- TR-1 tightens the loop: a coder that writes all tests of a `TR` first now breaks a
  MUST.

## Stack choices

None.

## Out of scope

- "Refactoring is not part of the loop" and the seam rules of mattpocock `tdd`.
- `implement` section Tests while coding.

## Accepted tech debt

None.

## Overrides

Format: `<design rule> : <reason>`.

- `code` section Branch and plan file, cut from `<base>` : the user keeps local
  `master` three commits ahead of `origin/master` (no push), so the branch cuts from
  local `master` (`ccc5dd7`); not a design rule, recorded for the user's approval.

## Caveats

None.
