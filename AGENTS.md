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

## Caveats

Format: `SHORT_DESCRIPTION : <file>`, or `SHORT_DESCRIPTION : —` when no file exists yet

A `SKILL.md` with CRLF line ends, or a leading `---` with trailing spaces, counts as missing `max-lines` : scripts/skill-sizes.mjs
`core-context.sh` escapes only backslash, quote, tab, CR and LF; any other control character in `skills/core/SKILL.md` breaks the SubagentStart JSON : scripts/core-context.sh
Skill frontmatter carries the non-standard key `max-lines`; `claude plugin validate` accepts it : skills/core/SKILL.md
The `browse` skill lives in the agent-browser plugin; `research` loads it by name, so a session needs both plugins : skills/research/SKILL.md
`claude plugin validate .` warns that `CLAUDE.md` at the plugin root is not loaded as plugin context; validation still passes : CLAUDE.md
The profile and the project context live where the host put them; every actor reads their paths from the profile block, not from a fixed file name : skills/core/SKILL.md
Skills symlinked into a host's skill location point at the clone path; moving the clone breaks them : skills/setup/SKILL.md
`setup` section Project context keeps Flow, Questions, Answer checks and Write as subsections; references to `setup` section Write, Flow or Answer checks resolve to them : skills/setup/SKILL.md
`core-context.sh` prints the plain `core` body when its input names no SubagentStart event; a non-Claude host hook gets that plain form : scripts/core-context.sh
The `plan` templates get only the width check from `lint`; `skill-sizes.mjs` counts only `SKILL.md` : scripts/skill-sizes.mjs
The template headings carry no number, but this repo's `DESIGN.md` numbers its headings; a match by section name must ignore the number : docs/DESIGN.md
Shape findings (`review` class 7) do not count toward the `Lean: -<N>` end line of a review or an audit : skills/review/SKILL.md
On Claude Code, `disable-model-invocation: true` hides `setup` and `retro` from the model and from subagents; only the user's `/armory:setup` or `/armory:retro` loads them : skills/setup/SKILL.md
The plugin manifests list the skills and the agents in three `description` strings (one in `plugin.json`, two in `marketplace.json`); a new skill or agent must update all three : .claude-plugin/plugin.json
In a linked worktree, git refuses to check out a branch that another worktree holds, so a subagent can never be on the task branch itself : skills/debug/SKILL.md
The installed armory plugin can lag this repo; a brief here names the repo path of each skill it loads and, for an agent card, its template path : .claude-plugin/plugin.json
`doc-checks.mjs` finds each list by fixed marker text; a reworded start marker reports `not found`, a reworded end marker, or one split across two lines, runs the region to the end of its text : scripts/doc-checks.mjs
An unreadable list file reports `<list>: not found`, not `cannot read`; only the width check names an unreadable file : scripts/doc-checks.mjs
A dangling `docs/DESIGN.md` symlink skips its width check without a failure line; only the two DESIGN.md lists report `not found` : scripts/doc-checks.mjs

## Rules

Project-only rules. The armory skills hold the rest.

- Documentation lives in docs/
- A skill description MUST name each distinct case once; synonyms of one case MUST
  become one trigger.
- A skill line that the model already follows by default MUST be deleted, as a whole
  sentence.
- Each step in a skill MUST name a done condition that an agent can check.
- A new or edited `MUST NOT` rule MUST also name the behavior to do instead.
