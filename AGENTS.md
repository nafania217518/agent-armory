# agent-armory

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY in this file and in the armory
skills follow RFC 2119. MUST has no exception. A SHOULD rule is on by default; `## Gates`
turns it off for this project, with a reason. MAY is the agent's choice.

## What this is

Personal Claude Code skills, packaged as the `armory` plugin. Phase 1 is six skills:
`plan`, `code`, `review`, `audit`, `test` and `init-project`. The repo holds markdown
skill files, their templates and the plugin manifest; it holds no application code. The
design is in `docs/DESIGN.md`.

## Commands

One line per check. A gate in `## Gates` has the command of the same name here; a gate
with no command is `off` there. `run` is not a gate. `worktree-per-agent` and `delegate`
have no command.

- lint: claude plugin validate .

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
until the project turns them on.

- worktree-per-agent: on
- delegate: on
- lint: on
- owasp: off (markdown-only repo, no code)
- unit: off (markdown-only repo, no code)
- integration: off (markdown-only repo, no code)
- contract: off (not chosen)
- functional: off (not chosen)
- e2e: off (not chosen)
- coverage: off (markdown-only repo, no code)

## Models

| Task kind | Model | Effort | Agent | Why |
|---|---|---|---|---|
| Pre-work: research, requirement quizzes, the plan; tasks Opus cannot carry: architecture, data risk, non-trivial root-cause analysis, core conflicts | fable | high | researcher, tag `[fable]` | heavy reasoning only; a trivial task MAY run pre-work on opus |
| Coding (TDD implementation) | opus | low | coder | follows a brief |
| Deep research | opus | medium | researcher | sources and judgement |
| Code review, audit | opus | medium | reviewer | needs judgement, no writing |
| Mechanics: docs, test runs, i18n strings, formatting, routine edits per a ready spec or ready tests | sonnet or haiku | low | writer; coder, tag `[sonnet]` or `[haiku]` | no reasoning needed |
| Routine lookup, grep, file reads | sonnet | low | none (built-in Explore) | no reasoning needed |

Fable MUST be used only for the first row: the plan, and the items the plan tags
`[fable]`. The table binds the session model as well as the agents. A plan tag
(`[opus]`, `[fable]`, `[sonnet]`, `[haiku]`) names the model for one item; on a spawn
it overrides the model in the agent file. Agent files hold the model of their untagged
row.

## Rules

Workflows live in the armory skills (`code`, `review`, `audit`). This section holds the
base rules when the global `~/.claude/CLAUDE.md` does not, then project-only rules.

1. Questions to the user MUST go through the `AskUserQuestion` tool: at least 2 options,
   the recommended one first. The message text holds only the context, not the question.

Project rules:

- Documentation MUST live in `docs/`. Only the README stays at the root. Requirements
  live in `docs/requirements/<task-branch>.md`, plans in `docs/plans/<task-branch>.md`.

## Glossary

Format: `Term : one-line meaning`

## Caveats

Format: `SHORT_DESCRIPTION : file_reference.md`
