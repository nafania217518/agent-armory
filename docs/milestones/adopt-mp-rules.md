# Milestone: adopt-mp-rules

Parent: `docs/DESIGN.md` section Milestones, line `adopt-mp-rules`; source and dropped
items in section Decisions, line 2026-11-02 on mattpocock/skills. Branch:
`milestone-adopt-mp-rules`.

## Goal

Seven rules from mattpocock/skills (<https://github.com/mattpocock/skills>, commit
4ae2317) become armory rules: sharper quiz rounds, glossary work while planning, a
test for decision lines, vertical slices, one test at a time, no tautological tests,
the deletion test and six code smells. Each rule lives in one skill, in the armory
rule style.

## Scope

In:

- `plan`: section Quizzes (A1 rounds and lookups, A2 glossary work), section Levels or
  Self-review and approval (A3 decision test), sections Levels and The plan (A5
  slices); section Plan file (the glossary write).
- The glossary format line: `skills/setup/templates/AGENTS.md`, its restatement in
  `docs/DESIGN.md` section 3, and this repo's project context `## Glossary` line.
- `test`: section TDD (A4).
- `review`: section Look for (A6, A7).

Out:

- The open point "Glossary" of `DESIGN.md` section Open.
- The items of groups B and C in `DESIGN.md` section Open.
- `implement`: no new rule; the deletion test lives in `review` only.
- Any skill not named above, beyond a reference that a renamed or moved section forces.
- Existing glossary lines: they stay valid without an `Avoid:` field.
- Template glossary sections (BR-14).

## Requirements

Each `BR` is checked by reading the skill, by `lint`, or by a dry run of a quiz.

- BR-1: a quiz round MUST ask only questions whose prerequisite answers are in. A
  question that depends on another open question of the same round MUST wait for a
  later round.
- BR-2: the main session MUST find each fact that the repo, the tools or an agent can
  find, and MUST NOT ask the user for it. A running lookup MUST hold back only the
  questions that depend on it.
- BR-3: during a quiz, the main session MUST name a term that conflicts with
  `## Glossary`, MUST propose a precise term for a vague or overloaded one, and MUST
  check each claim the user makes about the code against the code and name any
  contradiction.
- BR-4 (replaced by BR-14): each term settled in a quiz MUST go into the planning doc.
  The main session MUST write it into `## Glossary` right after the doc's first commit.
  No repo file is written before the approval.
- BR-5: the glossary format MUST be `Term : one-line meaning`, with an optional
  `. Avoid: <synonyms>` for rejected synonyms. A glossary line MUST hold only a term
  of the project's domain, with no implementation detail.
- BR-6: a strategic run SHOULD add a decision line only when the decision is hard to
  reverse, surprising without context and the result of a real trade-off.
- BR-7: each milestone task and each `TR` SHOULD be a vertical slice: a thin path
  through every layer it needs, checkable on its own. A preparatory refactor SHOULD
  come first. A change that breaks callers across the codebase SHOULD use
  expand–contract: add the new form, move the callers in batches, remove the old form.
- BR-8: the coder MUST write one failing test, then the code that passes it, before
  the next test.
- BR-9: an expected value in a test MUST come from a source independent of the code: a
  literal, a worked example, the spec. A test that computes its expected value the way
  the code does MUST be a finding.
- BR-10: `review` section Look for, class Lean, MUST hold the deletion test (delete the
  module in thought: complexity that vanishes marks a pass-through, complexity that
  returns in every caller marks a module that earns its place) and the rule that a
  seam with one adapter is hypothetical.
- BR-11: `review` section Look for MUST name six smells, each with its fix: Feature
  Envy, Data Clumps, Primitive Obsession, Shotgun Surgery, Message Chains, Repeated
  Switches. A smell finding MUST go to Should fix. A project-context rule that allows
  the pattern MUST remove the finding.
- BR-12: `lint` MUST pass. A skill MAY raise its `max-lines`.
- BR-13: a renamed section or a changed format line MUST have every reference and
  restatement updated in the same commit.
- BR-14: the main session MUST write each term settled in a quiz into the project
  context `## Glossary`, right after the doc's first commit, at every level. No
  template gets a glossary section. No repo file is written before the approval.

## Tasks

Format: `<branch> : <what> : <BR list> : <status>`. In execution order; the status
values are in the armory `plan` skill, section Levels.

- plan-quiz-rules : A1, A2, A3, A5 in `plan`; the glossary format line : BR-1, BR-2,
  BR-3, BR-5, BR-6, BR-7, BR-12, BR-13, BR-14 : done
- test-tdd-rules : A4 in `test` : BR-8, BR-9, BR-12, BR-13 : done
- review-smell-rules : A6, A7 in `review` : BR-10, BR-11, BR-12, BR-13 : open

`test-tdd-rules` and `review-smell-rules` edit different files; they MAY run at once.

## Risks

- `review` sits at 129 of 134 `max-lines`; A6 and A7 raise it and the reviewer and
  auditor load sets (`DESIGN.md` section 4).
- BR-8 refines `test` section TDD, first bullet; the two lines must not contradict.

## Done criteria

- Each `BR` is met in its skill, checked by reading or by `lint`.
- The three tasks are done, and the done write marks the milestone done in
  `docs/DESIGN.md` (`code` section Task end).
