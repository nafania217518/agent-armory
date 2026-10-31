# agent-armory

## What this is

Personal Claude Code skills and tools, packaged as the `armory` plugin. The skills under
`skills/` hold the rules for every armory actor: `core`, `plan`, `delegate`, `code`,
`implement`, `test`, `review`, `audit`, `research`, `browse` and `init-project`. The
tool under `tools/agent-browser/` reads web pages and searches the web for agents. The
design is in `docs/DESIGN.md`.

## Commands

Format: `<check>: <command>`. The armory `init-project` skill, section Write, holds the
rules; `implement` section Gates per commit says how to run them.

- lint: claude plugin validate . && claude plugin validate .claude-plugin/plugin.json && npm --prefix tools/agent-browser run lint && node scripts/skill-sizes.mjs
- owasp: npm --prefix tools/agent-browser audit --audit-level=high
- unit: npm --prefix tools/agent-browser run test:unit
- integration: docker compose -f tools/agent-browser/compose.yaml run --rm --build test npm run test:integration
- coverage: docker compose -f tools/agent-browser/compose.yaml run --rm --build test npm run coverage
- run: node tools/agent-browser/dist/cli.js

## Gates

Format: `<gate>: on`, or `<gate>: off <reason>`.

- lint: on
- owasp: on
- unit: on
- integration: on
- coverage: on
- contract: off (not chosen)
- functional: off (not chosen)
- e2e: off (not chosen)

## Test levels

Only what this project adds to or changes in the armory `test` skill, section Levels.

Unit style: sociable

Surfaces: CLI (`tools/agent-browser`): `unit`, `integration`. The plugin skills and
templates: no test level; `lint` checks them.

## Glossary

Format: `Term : one-line meaning`

daemon : the background process of agent-browser that owns the browser; it sleeps after the idle period
profile : the Chrome user-data directory of agent-browser; logins persist in it
state file : `daemon.json` in the home dir; it names the pid and port of the running daemon
channel : which browser the daemon launches: `chrome` (installed Google Chrome) or `chromium` (Playwright's bundled browser)

## Caveats

Format: `SHORT_DESCRIPTION : <file>`, or `SHORT_DESCRIPTION : —` when no file exists yet

playwright 1.64.1 + playwright-extra 4.3.6 + puppeteer-extra-plugin-stealth 2.11.2 install together; the Docker tag v1.64.1-noble MUST match : tools/agent-browser/package.json
Playwright `launchPersistentContext`: pages MUST come from `context.newPage()`; `context.browser().newPage()` opens a fresh context and bypasses the profile : tools/agent-browser/src/browser.ts
The daemon has no auth token; any local user who reaches 127.0.0.1 can drive the browser with the profile's logins : tools/agent-browser/src/server.ts
The next-page step uses `page.waitForNavigation`, which Playwright has deprecated : tools/agent-browser/src/search.ts
npm audit reports 5 moderate and 2 low findings through puppeteer-extra-plugin-stealth; the owasp gate fails only at `high` : tools/agent-browser/package.json
`core-context.sh` escapes only backslash, quote, tab, CR and LF; any other control character in `skills/core/SKILL.md` breaks the SubagentStart JSON : scripts/core-context.sh
Skill frontmatter carries the non-standard key `max-lines`; `claude plugin validate` accepts it : skills/core/SKILL.md
A `SKILL.md` with CRLF line ends, or a leading `---` with trailing spaces, counts as missing `max-lines` : scripts/skill-sizes.mjs
`skill-sizes.test.ts` and `bump-version.test.ts` cannot pass inside the Docker test image, which has no `scripts/` : tools/agent-browser/Dockerfile
`lint` type-checks `tools/agent-browser/src` only; test files and `scripts/*.mjs` get no type check : tools/agent-browser/tsconfig.json
`/stop` makes `/read` and `/search` answer 503 until the port closes : tools/agent-browser/src/server.ts
`URL.parse` (Node 20.18+ or 22.1+) parses the request target; on Node 20.0-20.17 or 22.0 every daemon request crashes the daemon : tools/agent-browser/src/server.ts
Search result URLs pass through `new URL().href`: hosts are lowercased, IDN hosts become punycode, and a bare origin gains a trailing `/` : tools/agent-browser/src/search.ts
`idleMinutes` above 35791 is rejected (the `setTimeout` limit, 2^31-1 ms) : tools/agent-browser/src/config.ts

## Rules

Project-only rules. The armory skills hold the rest.

- Documentation lives in docs/
