# Milestone: retro-fixes

Parent: `docs/DESIGN.md` section Milestones, line `retro-fixes`. Branch:
`milestone-retro-fixes`.

## Goal

The five follow-ups the user chose from the simulated retro of 2026-11-02 (task
`retro-skill`) land. Planning walks each new flow end to end, so a gap like the
red-loop or the worktree checkout of `debug-skill` shows up before the review. Two
`lint` checks catch the mechanical misses of that session: a prose line that is too
wide, and a skill or agent missing from a list. A caveat names the plugin lag, and the
agent cards report gates per commit. Quiz on 2026-11-02: one milestone; a hard width
limit of 90 on skills, cards, DESIGN and milestone docs; the list check covers skills
and agents; one new lint script; the flow walk at the milestone and the task level.

## Scope

In:

- `plan` section Self-review and approval (the milestone and task checks).
- This repo's `AGENTS.md`: `## Caveats` and the `lint` line of `## Commands`.
- `skills/setup/templates/agents/coder.md` and `debugger.md`, and their rendered copies
  in `.claude/agents/`.
- `scripts/doc-checks.mjs` and `scripts/doc-checks.test.mjs` (new).

Out:

- Old plan files, `docs/archive/` and the one-line formats of `AGENTS.md` (commands,
  glossary, caveats): the width check skips them.
- Finding 6 of the retro (cheaper re-reviews): the user did not choose it.
- A width or list check for other projects: the script serves this repo only.

## Requirements

Each `BR` is checked by reading the files, by `lint`, by `unit`, or by a grep.

- BR-1: the milestone check and the task check of `plan` section Self-review and
  approval MUST make the main session walk each new or changed flow path by path, end
  to end, against the branch, worktree and gate rules, before it proposes the doc.
- BR-2: this repo's `AGENTS.md` `## Caveats` MUST hold a caveat that the installed
  armory plugin can lag the repo, so a brief in this repo names the repo path of each
  skill it loads and, for an agent card, the template path.
- BR-3: the coder and debugger cards, the templates and the rendered copies, MUST ask
  for gate results per commit: one line per gate for each commit SHA.
- BR-4: `lint` MUST fail on a line longer than 90 characters in `skills/**/*.md`,
  `.claude/agents/*.md`, `docs/DESIGN.md` and `docs/milestones/*.md`. A table row (a
  line that starts with `|`) and a line inside a fenced code block are exempt. The
  failure MUST name the file, the line number and the length.
- BR-5: `lint` MUST fail when a skill under `skills/`, or an agent card under
  `skills/setup/templates/agents/`, is missing from a list that names the skills or the
  agents: the three `description` strings of the plugin manifests, the `README.md`
  Skills and Agents tables, `docs/DESIGN.md` section 1, this repo's `AGENTS.md` section
  What this is, and `delegate` section What each agent returns. The failure MUST name
  the list and the missing name.
- BR-6: one new script, `scripts/doc-checks.mjs`, MUST run the BR-4 and BR-5 checks,
  with fixture tests in `scripts/doc-checks.test.mjs`, and MUST join the `lint`
  command in `AGENTS.md` `## Commands`.
- BR-7: `lint` and `unit` MUST pass on every commit. A skill MAY raise its `max-lines`.
- BR-8: a changed fact, a new check or a changed list MUST have every reference and
  restatement updated in the same commit.

## Tasks

Format: `<branch> : <what> : <BR list> : <status>`. In execution order; the status
values are in the armory `plan` skill, section Levels.

- retro-rules : the flow walk, the plugin-lag caveat, gates per commit in the cards :
  BR-1, BR-2, BR-3, BR-7, BR-8 : open
- doc-checks : the width check and the list check in one lint script : BR-4, BR-5,
  BR-6, BR-7, BR-8 : open

## Risks

- The list check reads prose lists; a reworded list sentence can break it. The task
  run picks how each list is found and records a caveat for it.
- The width check passes today only because no checked line passes 90; a line at 89 or
  90 stays legal, so the wrap target of about 88 stays a writing rule.
- `plan` sits at 189/194 `max-lines`; BR-1 adds lines to it.

## Done criteria

- Each `BR` is met, checked by reading, by `lint`, by `unit` or by a grep.
- Both tasks are done, and the done write marks the milestone done in `docs/DESIGN.md`
  (`code` section Task end).
