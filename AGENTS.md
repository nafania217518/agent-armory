# agent-armory

## What this is

Personal agent skills, packaged as the `armory` plugin. The skills under `skills/` hold
the rules for every armory actor: `core`, `core-main`, `workflow`, `tracking`,
`requirements`, `plan`, `plan-draft`, `delegate`, `code`, `implement`, `test`,
`craft`, `debug`, `review`, `audit`, `research`, `retro`, `triage`,
`dnd` and `setup`. The skills use host terms (`core` section Host terms) and run on
Claude Code. The plugin also ships the templates and the hooks. The design is in
`docs/DESIGN.md`.

## Commands

Format: `<check>: <command>`; `implement` section Gates per commit says how to run
them.

- lint: claude plugin validate . && claude plugin validate .claude-plugin/plugin.json && node scripts/skill-sizes.mjs && node scripts/doc-checks.mjs && node scripts/skill-graph.mjs
- unit: node --test scripts/

## Gates

Format: `<gate>: on`, or `<gate>: off <reason>`.

- lint: on
- owasp: off (no dependencies)
- unit: on
- integration: off (no integration point)
- coverage: off (no coverage tool for the scripts)
- contract: off (not chosen)
- functional: off (not chosen)
- e2e: off (not chosen)

## Test levels

Only what this project adds to or changes in the armory `test` skill, section Levels.

Surfaces: The plugin skills and templates: no test level; `lint` checks them. The
scripts in `scripts/`: `unit`.

## Rules

Project-only rules. The armory skills hold the rest. The `auto-fix:` values are in the
armory `code` skill, section Review loop.

- Documentation lives in docs/
- auto-fix: should
- A skill description MUST name each distinct case once; synonyms of one case MUST
  become one trigger.
- A skill line that the model already follows by default MUST be deleted, as a whole
  sentence.
- Each step in a skill MUST name a done condition that an agent can check.
- A new or edited `MUST NOT` rule MUST also name the behavior to do instead.
- A tightening pass on a skill MUST follow docs/tightening.md.
- A brief MUST name each skill it loads by its repo path, and each agent card by its
  template path in `skills/setup/templates/agents/`, because the installed plugin can
  lag this repo.
- Outside `core` section Host terms, a skill MUST NOT name a host's own tool or file; it
  uses those host terms and skill names instead.

## Glossary

Format: `Term : one-line meaning`, plus `. Avoid: <synonyms>` when a synonym was rejected.
A line MUST hold only a term of the project's domain, with no implementation detail.

Actor : the main session or a subagent.

Main session : the session the user talks to; only it asks the user and spawns subagents.

Subagent : an agent that the main session spawns; it reports back and cannot reach the user.

Reusable agent : a writer, researcher or planner; new work may go to an idle one by message.

User-only skill : a skill that only the user starts; the model does not load it on its own.

Tracker : the system of the `core` host term `tracker`. Avoid: issue tracker, ticket tracker

Tracker item : one milestone, task or item opened outside an armory run, as a record in the tracker. Avoid: ticket, issue

Ready task : an open task whose blockers are all done and that has no assignee. Avoid: frontier

Inbound item : an open tracker item opened outside an armory run and not yet `accepted` or dropped.

Caveat base : the project's knowledge base of caveats: root caveats plus topic files.

Basis : the ground a recommended option rests on.

Intent point : an open point whose options turn on the user's goal, scope, priority or taste.

Triage role : a state (`needs-triage`, `needs-info`, `accepted`) or a category (`bug`, `enhancement`) that triage sets on an item through a mapped label.

Abstract skill : a skill that holds rules other skills share; only a skill that extends it loads it. Avoid: level

Hook payload : the text a plugin hook injects at session or subagent start.

Marker line : the line that shows that core or core-main is in context.

## Caveats

Format: the caveat line of the armory `core` skill, section Reports, or a topic pointer
line of the armory `workflow` skill, section Caveats

- lint: before editing scripts/skill-sizes.mjs, scripts/doc-checks.mjs, scripts/skill-graph.mjs, scripts/frontmatter.mjs or their tests, a skill's frontmatter, or a list text that doc-checks.mjs reads : docs/caveats/lint.md
- evals: before adding, editing or running a case in evals/ : docs/caveats/evals.md
- core-and-cards: before editing skills/core/SKILL.md, skills/core-main/SKILL.md, hooks/hooks.json, the payload build in scripts/skill-graph.mjs or an agent card template in skills/setup/templates/agents/ : docs/caveats/core-and-cards.md
- setup: before editing skills/setup/SKILL.md or a tracker binding, or a format line of a `requirements` template : docs/caveats/setup.md
- triage: before editing skills/triage/SKILL.md or the plan rule for a run from an accepted item : docs/caveats/triage.md
- code-and-plan: before editing the milestone-status rules of skills/tracking/SKILL.md or skills/workflow/SKILL.md, the Finish rules of skills/workflow/SKILL.md, the Task end steps of skills/code/SKILL.md, or before a merge into <base> : docs/caveats/code-and-plan.md
- skill-refs: before renaming, renumbering or reordering a skill section, a `code` §Task end step, a cited bullet or a `delegate` §Models row : docs/caveats/skill-refs.md
