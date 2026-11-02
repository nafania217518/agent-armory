# Milestone: small-rules

Parent: `docs/DESIGN.md` section Milestones, line `small-rules`; the decisions in
section Decisions, the two lines of 2026-11-02 on groups B and C and on user-only
skills. Branch: `milestone-small-rules`.

## Goal

Four small rules from mattpocock/skills (<https://github.com/mattpocock/skills>, commit
4ae2317) become armory rules: a PR body template, churn-first reading in an audit,
rules for writing armory skills, and `setup` as a user-only skill. No model-loaded
actor needs `setup` while it works.

## Scope

In:

- `skills/code/templates/pr.md` (new) and `code` section Finish.
- `audit` section Map first.
- This repo's `AGENTS.md` `## Rules`.
- `setup`: its frontmatter and description; the facts other skills take from it.
- Each skill, agent card or template that points a model-loaded actor at a `setup`
  section: `implement`, `plan`, `test`, `skills/setup/templates/AGENTS.md`, this repo's
  `AGENTS.md`, and any other the task run finds.
- `docs/DESIGN.md`: each restatement the moves change.

Out:

- The guard hook (dropped on 2026-11-02).
- `debug` and `retro` (milestone `new-skills`).
- A new host term for user-only skills (dropped on 2026-11-02).
- Existing `MUST NOT` lines in the skills: the positive-target rule binds new and
  edited lines only.

## Requirements

Each `BR` is checked by reading the files, by `lint`, or by a grep for `setup`.

- BR-1: a PR body MUST take the sections of `skills/code/templates/pr.md`: Summary (the
  smallest visual that makes the change clear), Evidence (before and after), Merge
  danger (a one-way or two-way door, and the blast radius). `code` section Finish MUST
  point to the template.
- BR-2: in a big repo, an audit SHOULD read first the files that `git log` shows
  changing most often.
- BR-3: this repo's `AGENTS.md` `## Rules` MUST hold four rules for writing skills: a
  description names each distinct case once; a line the model already follows by
  default is deleted; each step names a checkable done condition; each new or edited
  `MUST NOT` names the behavior to do instead.
- BR-4: `setup` MUST be a user-only skill: the frontmatter key
  `disable-model-invocation: true`, and a description that says the model must not
  load it on its own.
- BR-5: no skill other than `setup`, and no agent card or template, MUST send a
  model-loaded actor to a `setup` section for a fact it needs at work. Each such fact
  MUST live in a skill the model can load, or in the project context.
- BR-6: `lint` MUST pass. A skill MAY raise its `max-lines`.
- BR-7: a moved fact, a renamed section or a changed pointer MUST have every reference
  and restatement updated in the same commit.

## Tasks

Format: `<branch> : <what> : <BR list> : <status>`. In execution order; the status
values are in the armory `plan` skill, section Levels.

- small-rules-edits : the four items and the `setup` fact moves : BR-1, BR-2, BR-3,
  BR-4, BR-5, BR-6, BR-7 : open

## Risks

- On Claude Code, `disable-model-invocation` also hides `setup` from subagents; BR-5
  removes their need for it, and the `core` skill-load fallback (read the file) stays.
- BR-5 moves facts between skills; a missed pointer leaves an actor without a fact.
  The task run greps every `setup` mention.
- The BR-3 rules bind this repo only; other projects do not get them.

## Done criteria

- Each `BR` is met, checked by reading, by `lint`, or by the `setup` grep.
- The task is done, and the done write marks the milestone done in `docs/DESIGN.md`
  (`code` section Task end).
