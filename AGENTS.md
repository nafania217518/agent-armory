# agent-armory

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY in this file and in the armory
skills follow RFC 2119. MUST has no exception. A SHOULD rule is on by default; `## Gates`
turns it off for this project, with a reason. MAY is the agent's choice.

## What this is

Personal Claude Code skills and tools, packaged as the `armory` plugin. Phase 1 is the
skills under `skills/`: `plan`, `code`, `review`, `audit`, `test`, `research` and `init-project`.
Phase 2 is the tools under `tools/`: `agent-browser`, with the `browse` skill that wraps
it. The repo also holds the skill templates and the plugin manifest. The design is in
`docs/DESIGN.md`.

## Commands

One line per check. A gate in `## Gates` has the command of the same name here; a gate
with no command is `off` there. `run` is not a gate. `worktree-per-agent` and `delegate`
have no command.

- lint: claude plugin validate . && npm --prefix tools/agent-browser run lint
- owasp: npm --prefix tools/agent-browser audit --audit-level=high
- unit: npm --prefix tools/agent-browser run test:unit
- integration: docker compose -f tools/agent-browser/compose.yaml run --rm --build test npm run test:integration
- coverage: docker compose -f tools/agent-browser/compose.yaml run --rm --build test npm run coverage
- run: node tools/agent-browser/dist/cli.js

The `coverage` command MUST fail below the threshold set in the build tools (default 90%
per core module).

## Test levels

What each level covers in this project. The armory `test` skill holds the rules.

- unit: one unit (a function, a class, or a small cluster), fast, runs on every change.
  Frontend unit tests with the backend stubbed are `unit`.
- integration: narrow, one integration point at a time (a real database, the file
  system, one separate service or its double), at the boundary of the service.
- contract: consumer-driven contract tests for each interface with a separate service.
- functional: acceptance from the user's view, black box, given/when/then, through the
  API or the UI, externals doubled.
- e2e: the deployed stack through its UI or API, the main user journeys only.

Unit style: sociable (`sociable`: real collaborators, doubles only for remote,
non-deterministic, slow or side-effecting ones; `solitary`: every collaborator doubled).

Surface rule: each surface MUST have at least one test level. Frontend: `unit` or `e2e`
(browser). Backend: `unit` or `integration`. CLI and library: `unit`.

## Gates

`on`, or `off <reason>`. `contract`, `functional` and `e2e` are the flexible levels: off
until the project turns them on. Besides these gates, any SHOULD rule of a skill is off
when a line names it: `<skill> section <n>: off <reason>`.

- worktree-per-agent: on
- delegate: on
- lint: on
- owasp: on
- unit: on
- integration: on
- contract: off (not chosen)
- functional: off (not chosen)
- e2e: off (not chosen)
- coverage: on

## Models

| Task kind | Model | Effort | Agent | Why |
|---|---|---|---|---|
| Pre-work: research, requirement quizzes, the plan; tasks Opus cannot carry: architecture, data risk, non-trivial root-cause analysis, core conflicts | fable | high | researcher, tag [`fable`] | heavy reasoning only; a `min` task MAY run pre-work on opus |
| Coding (TDD implementation) | opus | low | coder | follows a brief |
| Deep research | opus | medium | researcher | sources and judgement |
| Code review, audit | opus | medium | reviewer | needs judgement, no writing |
| Mechanics: docs, test runs, i18n strings, formatting, routine edits per a ready spec or ready tests | sonnet | low | writer; coder, tag [`sonnet`] or [`haiku`] | no reasoning needed |
| Routine lookup, grep, file reads | sonnet | low | none (built-in Explore) | no reasoning needed |

Fable MUST be used only for the first row: the plan, and the items the plan tags
[`fable`]. The table binds the session model as well as the agents. A plan tag
([`opus`], [`fable`], [`sonnet`], [`haiku`]) names the model for one item; on a spawn
it overrides the model in the agent file. Agent files hold the model of their untagged
row.

## Rules

Workflows live in the armory skills. This section holds the
base rules when the global `~/.claude/CLAUDE.md` does not, then project-only rules.

1. YAGNI: MUST NOT design or implement anything that was not requested.
2. DRY + SSOT: each fact, rule or piece of logic MUST live in exactly one place.
   Everywhere else references it.
3. Big design up front: the design MUST be complete and refined before implementation
   starts.
4. MUST NOT optimize without a measured problem.
5. Occam's razor: SHOULD prefer the solution built from the smallest set of elements.

Project rules:

- Documentation MUST live in `docs/`. Only the README stays at the root. Requirements
  live in `docs/requirements/<task-branch>.md`, plans in `docs/plans/<task-branch>.md`.

## Glossary

Format: `Term : one-line meaning`

daemon : the background process of agent-browser that owns the browser; it sleeps after the idle period
profile : the Chrome user-data directory of agent-browser; logins persist in it
state file : `daemon.json` in the home dir; it names the pid and port of the running daemon
channel : which browser the daemon launches: `chrome` (installed Google Chrome) or `chromium` (Playwright's bundled browser)

## Caveats

Format: `SHORT_DESCRIPTION : file_reference.md`

playwright 1.64.1 + playwright-extra 4.3.6 + puppeteer-extra-plugin-stealth 2.11.2 install together; the Docker tag v1.64.1-noble MUST match : tools/agent-browser/package.json

Playwright `launchPersistentContext`: pages MUST come from `context.newPage()`; `context.browser().newPage()` opens a fresh context and bypasses the profile : tools/agent-browser/src/browser.ts
