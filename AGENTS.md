# agent-armory

## What this is

Personal agent skills, packaged as the `armory` plugin. The skills under `skills/`
hold the rules for every armory actor: `core`, `plan`, `delegate`, `code`, `implement`,
`test`, `debug`, `review`, `audit`, `research`, `retro` and `setup`. The skills use host
terms (`core` section Host terms) and run on any host that reads a `SKILL.md`. The
plugin also ships the templates and the hooks. The design is in `docs/DESIGN.md`.

## Commands

Format: `<check>: <command>`; `implement` section Gates per commit says how to run
them.

- lint: claude plugin validate . && claude plugin validate .claude-plugin/plugin.json && node scripts/skill-sizes.mjs && node scripts/doc-checks.mjs
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

Unit style: sociable

Surfaces: The plugin skills and templates: no test level; `lint` checks them. The
scripts in `scripts/`: `unit`.

## Glossary

Format: `Term : one-line meaning`, plus `. Avoid: <synonyms>` when a synonym was rejected.
A line MUST hold only a term of the project's domain, with no implementation detail.

User-only skill : a skill that only the user starts; the model does not load it on its own.

Tracker : the external system that holds the milestones, the tasks and their status. Avoid: issue tracker, ticket tracker

Tracker item : one milestone or task as a record in the tracker. Avoid: ticket, issue

Ready task : an open task whose blockers are all done and that no one has claimed. Avoid: frontier

## Caveats

Format: the caveat line of the armory `core` skill, section Reports

- A `SKILL.md` with CRLF line ends counts as missing `max-lines` : scripts/skill-sizes.mjs
- A `SKILL.md` whose leading `---` has trailing spaces counts as missing `max-lines` : scripts/skill-sizes.mjs
- A control character in `skills/core/SKILL.md` other than tab, CR and LF breaks the SubagentStart JSON of `core-context.sh` : scripts/core-context.sh
- `claude plugin validate` accepts the non-standard skill frontmatter key `max-lines` : skills/core/SKILL.md
- `claude plugin validate .` passes with a warning that the root `CLAUDE.md` is not plugin context : CLAUDE.md
- Moving the armory clone breaks the skills symlinked into a host's skill location : skills/setup/SKILL.md
- References to `setup` section Write, Flow or Answer checks resolve to subsections of `setup` section Project context : skills/setup/SKILL.md
- `core-context.sh` prints the plain `core` body when its input names no SubagentStart event : scripts/core-context.sh
- `lint` checks only the width of the skill templates, not their size : scripts/doc-checks.mjs
- A match of a template heading by section name must ignore the number that this repo's `DESIGN.md` adds : docs/DESIGN.md
- Shape findings (`review` class 7) do not count toward the `Lean: -<N>` end line of a review or an audit : skills/review/SKILL.md
- On Claude Code, only the user's `/armory:setup` or `/armory:retro` loads `setup` or `retro` : skills/setup/SKILL.md
- A new skill or agent must update every list in `LISTS` of `doc-checks.mjs`, not only the plugin manifests : scripts/doc-checks.mjs
- A subagent in a linked worktree cannot check out the task branch while another worktree holds it : skills/debug/SKILL.md
- The installed armory plugin can lag this repo : .claude-plugin/plugin.json
- `doc-checks.mjs` finds each list by fixed marker text : scripts/doc-checks.mjs
- A reworded start marker makes `doc-checks.mjs` report `<list>: not found` : scripts/doc-checks.mjs
- A reworded end marker, or one split across two lines, makes `doc-checks.mjs` run the list region to the end of its text : scripts/doc-checks.mjs
- An unreadable list file reports `<list>: not found`, not `cannot read` : scripts/doc-checks.mjs
- A dangling `docs/DESIGN.md` symlink skips its width check without a failure line : scripts/doc-checks.mjs
- `doc-checks.mjs` skips the width check for lines inside a code fence : scripts/doc-checks.mjs
- `## Tracker` is optional, so the required-sections list of `setup` section Write does not name it : skills/setup/SKILL.md
- An optional tracker verb the tracker lacks stays unbound with no `setup` question : skills/setup/SKILL.md

## Rules

Project-only rules. The armory skills hold the rest.

- Documentation lives in docs/
- A skill description MUST name each distinct case once; synonyms of one case MUST
  become one trigger.
- A skill line that the model already follows by default MUST be deleted, as a whole
  sentence.
- Each step in a skill MUST name a done condition that an agent can check.
- A new or edited `MUST NOT` rule MUST also name the behavior to do instead.
- A brief MUST name each skill it loads by its repo path, and each agent card by its
  template path in `skills/setup/templates/agents/`, because the installed plugin can
  lag this repo.
