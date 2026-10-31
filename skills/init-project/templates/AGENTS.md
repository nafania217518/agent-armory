# {{NAME}}

## What this is

{{WHAT}}

## Commands

Format: `<check>: <command>`. The armory `init-project` skill, section Write, holds the
rules; `implement` section Gates per commit says how to run them.

- lint: {{LINT}}
- owasp: {{OWASP}}
- unit: {{UNIT}}
- integration: {{INTEGRATION}}
- contract: {{CONTRACT}}
- functional: {{FUNCTIONAL}}
- e2e: {{E2E}}
- coverage: {{COVERAGE}}
- run: {{RUN}}

## Gates

Format: `<gate>: on`, or `<gate>: off <reason>`.

- lint: {{LINT_GATE}}
- owasp: {{OWASP_GATE}}
- unit: {{UNIT_GATE}}
- integration: {{INTEGRATION_GATE}}
- coverage: {{COVERAGE_GATE}}
- contract: {{CONTRACT_GATE}}
- functional: {{FUNCTIONAL_GATE}}
- e2e: {{E2E_GATE}}

## Test levels

Only what this project adds to or changes in the armory `test` skill, section Levels.

Unit style: {{UNIT_STYLE}}

{{LEVEL_CHANGES}}

## Glossary

Format: `Term : one-line meaning`

## Caveats

Format: `SHORT_DESCRIPTION : <file>`, or `SHORT_DESCRIPTION : —` when no file exists yet

## Rules

Project-only rules. The armory skills hold the rest.

- Documentation lives in {{DOCS}}
{{PROJECT_RULES}}
