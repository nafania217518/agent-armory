# Plan: aggressive reword of the ten skills

Branch: `reword-skills`, cut from `setup-skill` (9e4f9de, which holds the slim-skills
work). Plan file after approval: `docs/plans/reword-skills.md`. Markers:
`req: reword-skills/TR-n` (none expected: prose only).

## Context

The slim-skills task cut `setup` by the named lines only. The user now wants the
aggressive option the first quiz declined: every bullet of every skill in its shortest
form that keeps the meaning. The quiz of 2026-10-31 (second round) decided: all ten
skills; no numeric target, the shortest form is the goal and the reviewer's sentence
mapping is the pass mark; a new branch; the 80% STE floor stays (full sentences, active
voice, one idea each). The user instructed that the planning, the writing and the
reviewing run on Fable high; that instruction is the user's yes under `core` section
Models and the answer to the Fable question of `delegate`.

Sizes today (`node scripts/skill-sizes.mjs`): audit 71/75, code 109/115, core 127/130,
delegate 144/149, implement 149/155, plan 122/130, research 56/60, review 130/130,
setup 220/225, test 124/130.

## Goal

Each skill says the same rules in the fewest words that still read as plain sentences.
A reader new to the repo understands a bullet without the words that were cut. Every
pointer of the form `` `<skill>` section <Name> `` in the repo still resolves, because
no heading changes.

## Design, as decided

1. **What a writer does, per skill.** Reword every bullet and paragraph to its shortest
   form under the 80% STE floor: cut filler, doubled words, examples that do not define
   a format, and a pointer that the same skill already gave in an earlier bullet (the
   first occurrence stays). Merge two bullets only when they state one rule. Keep
   every RFC 2119 sentence with its meaning: a MUST stays a MUST, a SHOULD a SHOULD, an
   exception an exception, a list of cases complete.
2. **What stays fixed.** The frontmatter (`name`, `description`, trigger phrases); the
   RFC 2119 line and the `core` load line; every heading, its number and its name;
   tables that define a format or a mapping (`delegate` section Models, the host
   profile block of `setup`); the format strings (`req:` marker, caveat line, item
   format, report labels); the marker example in `test` section Markers. A pointer to
   another skill's section keeps the section name as written.
3. **Pointers.** Headings do not change, so a pointer from a skill in flight to another
   skill in flight stays valid. After the ten commits, one tree-wide check: every
   `` `<skill>` section <Name> `` in `skills/`, `.claude/agents/`,
   `skills/setup/templates/`, `AGENTS.md`, `README.md` and `docs/DESIGN.md` names a
   heading that exists in that skill.
4. **Size gate.** Each skill's `max-lines` becomes its new line count plus 5, in the
   same commit.
5. **Review.** One reviewer per skill maps every RFC 2119 sentence of the old file
   (`git show setup-skill:skills/<name>/SKILL.md`) to its new place and meaning. A
   shifted meaning is Must fix; a dropped exception or case is Must fix; a bullet that
   became hard to read is Should fix. The reviewer also reads every pointer into that
   skill from the other files and judges whether the target still says what the
   pointer promises.

## Requirements

- BR-1: Every rule of each of the ten skills (each sentence with an RFC 2119 word) MUST
  keep its meaning after the reword; a reviewer MUST confirm it bullet by bullet.
- BR-2: Each skill MUST be in its shortest form under design points 1 and 2: no bullet
  that a shorter sentence states with the same meaning, no pointer repeated inside one
  skill, the fixed items unchanged, `max-lines` the new size plus 5.
- BR-3: Every `` `<skill>` section <Name> `` pointer in the repo MUST resolve to a
  heading of that skill after the reword, and its target MUST still say what the
  pointer promises.
- BR-4: `lint` and `unit` MUST pass at every commit.

## Plan items, in execution order

One item per skill; the ten run in parallel, each writer on its own file, and the main
session commits them in the order they finish. TR-11 runs last.

- TR-1 (BR-1, BR-2): reword `skills/audit/SKILL.md`.
  tests: none, prose; the reviewer's sentence mapping
- TR-2 (BR-1, BR-2): reword `skills/code/SKILL.md`.
  tests: none, prose; the reviewer's sentence mapping
- TR-3 (BR-1, BR-2): reword `skills/core/SKILL.md`.
  tests: none, prose; the reviewer's sentence mapping
- TR-4 (BR-1, BR-2): reword `skills/delegate/SKILL.md`.
  tests: none, prose; the reviewer's sentence mapping
- TR-5 (BR-1, BR-2): reword `skills/implement/SKILL.md`.
  tests: none, prose; the reviewer's sentence mapping
- TR-6 (BR-1, BR-2): reword `skills/plan/SKILL.md`.
  tests: none, prose; the reviewer's sentence mapping
- TR-7 (BR-1, BR-2): reword `skills/research/SKILL.md`.
  tests: none, prose; the reviewer's sentence mapping
- TR-8 (BR-1, BR-2): reword `skills/review/SKILL.md`.
  tests: none, prose; the reviewer's sentence mapping
- TR-9 (BR-1, BR-2): reword `skills/setup/SKILL.md`.
  tests: none, prose; the reviewer's sentence mapping
- TR-10 (BR-1, BR-2): reword `skills/test/SKILL.md`.
  tests: none, prose; the reviewer's sentence mapping
- TR-11 (BR-3, BR-4): the tree-wide pointer check of design point 3 and the gates at
  the last commit.
  tests: none, the check prints no unresolved pointer; `lint` and `unit` pass

## Test scope

No existing test case changes. No new test: the task changes skill text only.

## Execution

- Cut `reword-skills` from `setup-skill`; plan-file commit; no caveat to write.
- Wave 1: ten writers at once, Fable high (the user's instruction), each with one TR,
  the design points, the fixed-items list, the pointer list into its skill, and the
  rule "edit only your file, no commit, no worktree". The main session runs `lint` and
  `unit` and commits each skill as its writer finishes, one commit per skill.
- Review: one reviewer per skill, Fable high, on that skill's commit, with the sentence
  mapping and the pointer reading (design point 5). Fix loop per `code` section Review
  loop; a fix goes back to a writer, one commit per fix round per skill.
- TR-11, then the final review on `setup-skill..HEAD` with the whole-task checks, the
  recorded-items quiz, the report, acceptance, cleanup and the finish question. The
  branch stays local until the user says otherwise.

## Risks

- Ten rewrites at once: a reworded rule shifts its meaning in a way one reviewer misses.
  The mapping per sentence and the Must fix grade for any shift are the guard.
- A writer merges two bullets and loses an exception; the mapping lists exceptions as
  their own entries.
- Readability drops below the STE floor; the reviewer grades it Should fix.
- Pointers into a skill from the agent cards and templates; the tree-wide check in
  TR-11 catches a renamed heading, the reviewer catches a target that no longer says
  what the pointer promises.

## Stack choices

Skill text only; no script change; no dependency.

## Out of scope

The agent cards, the templates, `README.md`, `docs/DESIGN.md` (read for pointers, not
changed); any rule change; a push or a merge.

## Accepted tech debt

None.

## Overrides

None.

## Recorded during planning

- SHOULD bypass: the main session drafted the plan items itself, not the planner
  (`plan` section The plan): the items are one per file and need no draft.

## Caveats

None.

## Gates

lint, unit: on (the only gates of this repo).

## Verification

- `lint` and `node --test scripts/` pass at every commit; `node scripts/skill-sizes.mjs`
  prints `<name>: <n>/<n+5>` for each skill.
- Each reviewer's report maps every RFC 2119 sentence of the old skill to its new place
  with no sentence dropped and no meaning shifted.
- The pointer check of TR-11 prints nothing.
- Acceptance, by the user: read one reworded skill end to end (`git diff
  setup-skill..reword-skills -- skills/core/SKILL.md`) and judge the reading.

## Amendment 1 (2026-10-31, after the ten reviews)

Approved by the user through the question tool. The ten reviews (Fable high, one per
skill) gave: `implement`, `research`, `test` clean; `plan` one Must fix (the merge of
"Each testable tech answer MUST become a `TR`" and "Each `TR` MUST trace to a `BR`"
narrowed the second rule; both sentences come back); twelve Should fix or Nice to have
findings in `audit`, `code`, `core`, `delegate`, `plan`, `review`, `setup`, all fixed in
this round, one commit per skill:

- Restores: `audit` section Output names `review` section Output for the `Gates:` block;
  `core` names `implement` section The smallest complete change for the `tech-debt:`
  marker and the three sections that define an out-of-scope finding; `delegate` says
  "since the agent card cuts a fresh one" and "which skills or skill sections the agent
  loads"; `plan` section Self-review keeps "`implement` section" before each section
  name.
- Dedupes: `audit` drops "MUST say which parts were not read" (the `Not checked:` end
  line keeps the rule); `code` drops the loop-bound sentence doubled by step 5; `review`
  drops "No case, no finding." and the gate-failure sentence doubled by the Must fix
  group; `setup` drops a second "(next to this file)"; `plan` joins the Drafting
  paragraph into its bullet.
- Design point 2 exception: the "What each agent returns" table of `delegate` stays as
  prose, in the reviewer's wording: "Each agent returns its card's report. The coder
  also returns `stuck: <why>`; the researcher, `sources disagree` or a missing command."
- The `research` Caveats pointer now names `core` section Reports, the format's single
  source, instead of `setup` section Write (a pointer-target correction, no rule change).
