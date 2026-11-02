# Plan: plan-quiz-rules

Parent: `docs/milestones/adopt-mp-rules.md` section Tasks, line `plan-quiz-rules`.

## Goal

The `plan` skill gets four rules from mattpocock/skills: quiz rounds ordered by
prerequisites with facts looked up (A1), glossary checks and glossary writes (A2), a
test for decision lines (A3), and vertical slices (A5). The glossary format line gets an
optional `Avoid:` field and a domain-only rule. Quiz on 2026-11-02: one glossary home,
the project context; no template gets a glossary section (BR-14 replaces BR-4).

## Requirements

Format: `TR-<n> (<milestone>/BR-<m>, ...): MUST <behavior>`, then an indented `tests:`
line that names the tests, or `tests: none, <why>`.

All items: `tests: none, prose rule in a skill or template; the project context gives
these surfaces no test level, so lint and the review check them`.

- TR-1 (adopt-mp-rules/BR-5, adopt-mp-rules/BR-13): the glossary format line MUST read
  as below, in `skills/setup/templates/AGENTS.md` and in this repo's `AGENTS.md`
  `## Glossary`:
  `Format: \`Term : one-line meaning\`, plus \`. Avoid: <synonyms>\` when a synonym was
  rejected. A line MUST hold only a term of the project's domain, with no
  implementation detail.`
  `docs/DESIGN.md` section 3 MUST read: `- \`## Glossary\`: \`Term : one-line
  meaning\`, with an optional \`. Avoid: <synonyms>\`; domain terms only.`
  tests: none (see above)
- TR-2 (adopt-mp-rules/BR-1): `plan` section Quizzes MUST hold, after the "Each topic"
  bullet: `- A round MUST ask only the questions whose prerequisite answers are in. A
  question that depends on another open question of the round MUST wait for a later
  round.`
  tests: none (see above)
- TR-3 (adopt-mp-rules/BR-2): `plan` section Quizzes MUST replace the bullet "A quiz
  MUST NOT ask a fact the parent doc settles." with: `- A quiz MUST NOT ask a fact that
  the parent doc, the repo, a tool or an agent can settle: the main session MUST find
  it. A running lookup MUST hold back only the questions that depend on it.`
  tests: none (see above)
- TR-4 (adopt-mp-rules/BR-3): `plan` section Quizzes MUST hold, after the TR-3 bullet:
  `- During a quiz, the main session MUST name a term that conflicts with the project
  context \`## Glossary\`, MUST propose a precise term for a vague or overloaded one,
  and MUST check each claim the user makes about the code against the code, naming any
  contradiction.`
  tests: none (see above)
- TR-5 (replaced by TR-9) (adopt-mp-rules/BR-14): `plan` section Plan file MUST hold,
  after the caveat bullet: `- In the same step, the main session MUST write each term
  the quiz settled into the project context \`## Glossary\`, in its format line. No
  template holds a glossary section.`
  tests: none (see above)
- TR-6 (adopt-mp-rules/BR-6): `plan` section Levels MUST hold, after the bullet "A
  strategic run MUST have no testable item…": `- A strategic run SHOULD add a decision
  line only when the decision is hard to reverse, surprising without context and the
  result of a real trade-off.`
  tests: none (see above)
- TR-7 (adopt-mp-rules/BR-7): `plan` section The plan MUST hold, after the execution
  order bullet: `- Each milestone task and each \`TR\` SHOULD be a vertical slice: a
  thin path through every layer it needs, checkable on its own. A preparatory refactor
  SHOULD come first. A change that breaks callers across the codebase SHOULD use
  expand–contract: add the new form, move the callers in batches, remove the old
  form.`
  tests: none (see above)
- TR-8 (adopt-mp-rules/BR-12, adopt-mp-rules/BR-13): `plan` `max-lines` MUST be the new
  line count plus 5; `lint` and `unit` MUST pass; no section is renamed.
  tests: none (see above)
- TR-9 (adopt-mp-rules/BR-14): the TR-5 bullet in `plan` section Plan file MUST end
  with `A plan template MUST NOT hold a glossary section.` in place of `No template
  holds a glossary section.` Review finding 2: the setup template holds `## Glossary`.
  tests: none (see above)
- TR-10 (adopt-mp-rules/BR-13): `docs/archive/RULES.md` line "The glossary format MUST
  be `Term : one-line meaning`." MUST state the TR-1 format, with its `Avoid:` field
  and the domain-only rule; its tags `[A] [Q]` stay.
  tests: none (see above)

Wrap each new bullet at about 88 characters, two-space continuation, as the skill does.
One commit per TR. TR-8 went into the first commit that touches `plan` (review
finding 1: the plan first put it last, and three commits failed `lint`).

## Test scope

Format: `<test case> : <break | rework | remove> : <reason>`.

None: no test under `scripts/` reads the changed files.

## Risks

- `plan` grows by about 16 lines; the main session and planner load sets grow with it.
- TR-3 widens a MUST NOT: a quiz that asks a fact the repo holds now breaks a rule.

## Stack choices

None.

## Out of scope

- `implement` section Domain, boundaries and state: its glossary report rule stays.
- Existing glossary lines: valid without `Avoid:`.
- `DESIGN.md` section Open, item Glossary.

## Accepted tech debt

None.

## Overrides

Format: `<design rule> : <reason>`.

- `code` section Branch and plan file, cut from `<base>` : the user keeps local
  `master` two commits ahead of `origin/master` (no push), so the branch cuts from local
  `master` (`2ecaffc`); not a design rule, recorded here for the user's approval.

## Caveats

None.
