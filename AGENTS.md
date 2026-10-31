# agent-armory

## What this is

Personal Claude Code skills, packaged as the `armory` plugin. The skills under `skills/`
hold the rules for every armory actor: `core`, `plan`, `delegate`, `code`, `implement`,
`test`, `review`, `audit`, `research` and `init-project`. The plugin also ships the
templates and the hooks. The design is in `docs/DESIGN.md`.

## Commands

Format: `<check>: <command>`. The armory `init-project` skill, section Write, holds the
rules; `implement` section Gates per commit says how to run them.

- lint: claude plugin validate . && claude plugin validate .claude-plugin/plugin.json && node scripts/skill-sizes.mjs
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

Format: `Term : one-line meaning`

## Caveats

Format: `SHORT_DESCRIPTION : <file>`, or `SHORT_DESCRIPTION : —` when no file exists yet

A `SKILL.md` with CRLF line ends, or a leading `---` with trailing spaces, counts as missing `max-lines` : scripts/skill-sizes.mjs
`core-context.sh` escapes only backslash, quote, tab, CR and LF; any other control character in `skills/core/SKILL.md` breaks the SubagentStart JSON : scripts/core-context.sh
Skill frontmatter carries the non-standard key `max-lines`; `claude plugin validate` accepts it : skills/core/SKILL.md
The `browse` skill lives in the agent-browser plugin; `research` loads it as `/agent-browser:browse`, so a session needs both plugins : skills/research/SKILL.md
`claude plugin validate .` warns that `CLAUDE.md` at the plugin root is not loaded as plugin context; validation still passes : CLAUDE.md

## Rules

Project-only rules. The armory skills hold the rest.

- Documentation lives in docs/
