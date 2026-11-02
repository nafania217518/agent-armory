# Plan: remove-browse

Parent: none (no milestone)

## Goal

No live file names the `browse` skill or the agent-browser plugin. Web search and page
reading use the host's own web tools, under the `research` rules.

## Requirements

- BR-1: MUST name the `browse` skill or the agent-browser plugin in no live file:
  `skills/`, `.claude/agents/`, `README.md`, `AGENTS.md`, and `docs/DESIGN.md` outside
  section Decisions.
- BR-2: `core` MUST NOT ban the built-in web search. Web search and page reading MUST
  follow `research` section When to research.
- BR-3: `lint` and `unit` MUST pass on every commit.

- TR-1 (BR-1, BR-2): MUST replace the web bullet of `core` section Tools and background
  tasks with: "- Web search and page reading MUST follow `research` section When to
  research."
  tests: none, prose; checked by reading and by `lint`.
- TR-2 (BR-1): in `research` section When to research, MUST replace the two bullets
  that name `browse` and `agent-browser` with: "- The agent MUST return only the result
  of section Result. A subagent MUST do the web work itself (`delegate` section What
  each agent returns)."
  tests: none, prose; checked by reading and by `lint`.
- TR-3 (BR-1): in `delegate`, MUST drop the missing-command return: section What each
  agent returns ends the researcher's returns at `sources disagree`; section Re-spawn
  and retry drops the clause "or a missing-command report (`browse` of the agent-browser
  plugin, section When the command is missing)" and keeps "whose section sets the
  re-spawn" for the `sources disagree` report.
  tests: none, prose; checked by reading and by `lint`.
- TR-4 (BR-1): the researcher card, template and rendered copy, MUST load `core`, then
  `research`, with no `browse` skill.
  tests: none, prose; checked by reading and by `lint`.
- TR-5 (BR-1): MUST delete the agent-browser paragraph of `README.md`, and MUST drop
  `browse` from the researcher row of `docs/DESIGN.md` section Where each rule lives.
  tests: none, prose; checked by reading and by `lint`.
- TR-6 (BR-1): MUST delete the `browse` caveat line of `AGENTS.md` `## Caveats`.
  tests: none, prose; checked by reading.

## Test scope

None: the change is prose; `lint` checks the skills.

## Risks

- The `browse` skill also cut the page output. The host web tools have no such rule, so
  only "raw page text MUST NOT enter the main context" in `research` guards the context.

## Stack choices

## Out of scope

- History: the 2026-10-31 decision line in `docs/DESIGN.md` section Decisions, old
  `docs/plans/*.md`, `docs/archive/RULES.md`.
- "headless browser" in `test` and `debug`: a test level, not the skill.
- The local `.claude/settings.local.json` and the user's global context file.

## Accepted tech debt

## Overrides

## Caveats
