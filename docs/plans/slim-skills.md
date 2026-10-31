# Plan: slim the `setup` skill

Branch: `slim-skills`, cut from `setup-skill` (the app's worktree branch
`claude/happy-sammet-005804` renamed). Plan file after approval:
`docs/plans/slim-skills.md`. Markers: `req: slim-skills/TR-n` (none expected: prose only).

## Context

The setup-skill task grew `skills/setup/SKILL.md` to 230 lines (limit 235) and recorded
the slimming as a follow-up. Its final reviewer named about 24 lines to cut first. The
acceptance run also showed that the project question set of `setup` section Project
context took four question-tool rounds for an empty project. The quiz of 2026-10-31
decided: the question set becomes detect-then-confirm; only the named cuts and that
change go into `setup`; `core`, `delegate` and `review` get no text change, and their
`max-lines` stay (127/130, 144/149, 130/130: "size plus 5" would raise, not lower them).

## Goal

`setup` says the same rules in fewer lines, and a project setup asks the user one
confirm round instead of four question rounds. Every sentence with an RFC 2119 word
keeps its meaning; the reviewer checks that bullet by bullet. Every pointer from
another file to `setup` section Write, Flow, Answer checks or Project context still
resolves (`implement` section Gates per commit, `test` section Levels, `plan` section
Plan file, `research` section Caveats, `code` section Caveats, `AGENTS.md`,
`docs/DESIGN.md`, `templates/AGENTS.md`).

## Design, as decided

1. **Report as prose** (section Report, lines 220–230): one bullet lists the items in
   a sentence, the project-scope `off` gates included.
2. **Self-report squeezed** (section Self-report, lines 36–44): the seven items stay
   numbered inline in one bullet, because "item 2" is referenced twice in the skill.
3. **`git init` inline** (section Flow, lines 148–154): the two commands go into the
   bullet; the code block goes.
4. **The templates rule once.** Section Install, part (c), holds the whole card rule:
   render the five cards of `templates/agents/` (next to this file) into the host's
   agent format at its agent location, else the agent-card fallback; fields name,
   description, model, effort, isolation; `{{MODEL}}` is the id of section Model
   mapping for the card's default row (`delegate` section Models), `{{EFFORT}}` its
   effort; drop a placeholder line left empty. Section Write keeps only "Fill
   `templates/AGENTS.md` (next to this file) from the answers; drop a command line with
   no command and any placeholder line left empty". Section Model mapping keeps "the
   skills and the templates MUST keep the tier names" and drops the card sentence.
   The "MUST NOT overwrite an existing project context or agent card" rule stays.
5. **Commands and Gates by reference.** Section Write says: `## Commands`, `## Gates`,
   `## Glossary` and `## Caveats` MUST take the format lines of `templates/AGENTS.md`
   (one line per check; one line per gate, `on` or `off <reason>`; the glossary and
   caveat formats). The rules that are not in the template stay: a gate's command
   carries the gate's name; `run` is not a gate; the eight gates with their defaults
   (`implement` section Gates per commit points here for the gate list); the section
   list and order (`## What this is` first, one paragraph); `## Glossary` and
   `## Caveats` start empty.
6. **Detect, then confirm** (section Questions). Before the questions, `setup` MUST
   read the repo and prefill each item: the name from the folder; the paragraph from the
   README; the docs folder when one exists; the surfaces from the layout; the commands
   from the build tool's script list (`package.json` scripts, a `Makefile`, a
   `pyproject.toml` or the like); the other items take their defaults. One round MUST
   show the prefilled set, item by item, and ask the user to confirm or edit it; as a
   free-text question it goes as a plain message (`core` section Writing and
   questions). A further round MUST come only from section Answer checks. The seven
   items keep their content and defaults; "a missing answer takes the default, and
   `setup` says so" stays.
7. **Size gate.** `max-lines` of `setup` becomes the new size plus 5 in the same commit.

## Requirements

- BR-1: Every rule of `skills/setup/SKILL.md` (each sentence with an RFC 2119 word)
  MUST keep its meaning after the slimming; a reviewer MUST confirm it bullet by bullet.
- BR-2: `skills/setup/SKILL.md` MUST lose at least the lines the final reviewer named
  (design points 1–5), and its `max-lines` MUST become the new size plus 5.
- BR-3: The project question set MUST run as detect-then-confirm (design point 6): one
  confirm round, a further round only for an answer check.
- BR-4: `lint` and `unit` MUST pass at every commit; every pointer to a `setup`
  section from another file MUST still resolve.

## Plan items, in execution order

- TR-1 (BR-2, BR-1): section Report as one prose bullet (design point 1).
  tests: none, prose; the reviewer's bullet-by-bullet check
- TR-2 (BR-2, BR-1): section Self-report, items 1–7 inline and numbered (design point 2).
  tests: none, prose; the reviewer's bullet-by-bullet check
- TR-3 (BR-2, BR-1): section Flow, `git init` and the empty commit inline (design
  point 3).
  tests: none, prose; the reviewer's bullet-by-bullet check
- TR-4 (BR-2, BR-1): the card rule once, in section Install part (c); section Write
  keeps the `templates/AGENTS.md` fill rule; section Model mapping drops the card
  sentence (design point 4).
  tests: none, prose; the reviewer's bullet-by-bullet check
- TR-5 (BR-2, BR-1, BR-4): section Write points at `templates/AGENTS.md` for the
  Commands, Gates, Glossary and Caveats formats and keeps the rules the template lacks
  (design point 5).
  tests: none, prose; `git grep -n '`setup` section' -- . ':!docs/plans'` names only
  sections that exist
- TR-6 (BR-3): section Questions becomes detect-then-confirm (design point 6).
  tests: none, prose
- TR-7 (BR-2, BR-4): `max-lines: <size + 5>` in the `setup` frontmatter.
  tests: none; `node scripts/skill-sizes.mjs` prints `setup: <n>/<n+5>` and `lint` passes

TR-1 to TR-7 go to one writer in one brief, one commit for all seven (one file, one
change); the writer edits in this checkout and leaves the commit to the main session.

## Test scope

No existing test case changes. No new test: the task changes skill text only.

## Execution

- Rename the branch to `slim-skills`; plan-file commit; no caveat to write.
- Wave 1: one writer (Opus, effort high: rewording rules without a shift in meaning)
  with TR-1 to TR-7, the full text of the design points, and the pointer list of the
  Goal. The main session runs `lint` and `unit`, commits.
- Review: one reviewer (Opus high) on that commit, with the bullet-by-bullet check:
  every RFC 2119 sentence of the old `setup` mapped to its new place and meaning, or
  named as dropped. Fix loop per `code` section Review loop.
- Task end per `code` section Task end: final review on `setup-skill..HEAD`, the
  recorded-items quiz, the report, acceptance, the finish question. The branch stays
  local until the user says otherwise.

## Risks

- A reworded rule shifts its meaning; the reviewer's mapping is the only check.
- Detection reads the wrong file (a README of a subproject, a script that is not a
  check); the confirm round is the guard.
- A pointer from another skill to a sentence that moved inside `setup`; the grep in
  TR-5 and the Goal list cover the section names, the reviewer reads the pointers.

## Stack choices

Skill text only; no script change; no dependency.

## Out of scope

Text changes to `core`, `delegate`, `review` and the other skills; their `max-lines`;
`templates/AGENTS.md` and the agent templates; `docs/DESIGN.md`; `README.md`; a push
or a merge.

## Accepted tech debt

- `core` (127/130), `delegate` (144/149) and `review` (130/130) keep their limits with
  little or no headroom; the next change to one of them raises its value.

## Overrides

None.

## Recorded during planning

- SHOULD bypass: the main session drafted the plan items itself, not the planner
  (`plan` section The plan): the four skills, the plan of the setup-skill task and the
  reviewer's list were already in context; a planner would have re-read them.

## Caveats

None.

## Gates

lint, unit: on (the only gates of this repo).

## Verification

- `lint` and `node --test scripts/` pass at the plan-file commit and the slimming commit.
- `node scripts/skill-sizes.mjs` prints `setup: <n>/<n+5>` with `n` below 230.
- The reviewer's report maps every RFC 2119 sentence of `setup` at `setup-skill` to its
  place in the new text, with no sentence dropped.
- `git grep -n '`setup` section' -- . ':!docs/plans'` names only Project context,
  Flow, Questions, Answer checks, Write and sections that exist.
- Acceptance, by the user: `/setup project` on a scratch directory with a README and a
  `package.json`: one prefilled confirm round, then the answer checks only when needed.

## Amendment 1 (2026-10-31, during wave 1)

Approved by the user through the question tool. The setup-skill session handed over the
two open wording items of `docs/plans/setup-skill.md`, last paragraph.

- TR-8 (BR-1): in `setup` section Self-report, the activation probe MUST check each
  start event that item 2 of the self-report claims: a session for session start, a
  spawned agent for subagent start; the sentence MUST name it "this activation probe",
  so it cannot be read as item 2's own probe, which is a config file read or a command.
  tests: none, prose; the reviewer walks a fresh host and a host with a stale plugin
  through sections Self-report, Host profile and Install

## Amendment 2 (2026-10-31, after the final review)

Approved by the user through the question tool. The final review of 7ded9a2 (no Must
fix, verdict "fix 1 and 3 first") left four Should fix findings and one out-of-scope
finding. Findings 1, 2 and 4 are fixed in this round: section Invocation and scope gets
back `Project-scope writes MUST run at the Flow step "the files".`; section Write keeps
only the reference to `templates/AGENTS.md` for the four formats. The other two become:

- TR-9 (BR-3): in `setup` section Questions, the missing-answer rule MUST read
  `A missing answer MUST take the prefilled value (a detected value or the default).
  MUST say so.`, so a confirm round that edits one item keeps the detected values.
  tests: none, prose
- TR-10 (BR-4): `docs/DESIGN.md` MUST say that the project context `## Rules` always
  holds the line `Documentation lives in <folder>`, as `setup` section Write and
  `templates/AGENTS.md` do; the "only when the folder is not `docs/`" condition goes.
  tests: none, prose

## Amendment 3 (2026-10-31, after the re-review)

Approved by the user through the question tool. The re-review of 81ac78b (verdict Ship)
recorded one out-of-scope finding: the caveat line format lives in both `core` section
Reports and `skills/setup/templates/AGENTS.md`.

- TR-11 (BR-4): the `## Caveats` format line of `skills/setup/templates/AGENTS.md` MUST
  point to `core` section Reports instead of restating the format, so the format lives
  in one place. This repo's `AGENTS.md` keeps its rendered line.
  tests: none, prose

## Amendment 4 (2026-10-31, after the TR-11 re-review)

Approved by the user through the question tool, as the third quiz round. The re-review
of 38987de (verdict Ship) recorded that `docs/DESIGN.md` still writes the caveat format
out in full.

- TR-12 (BR-4): the `## Caveats` bullet of `docs/DESIGN.md` MUST point to `core`
  section Reports instead of restating the format.
  tests: none, prose
