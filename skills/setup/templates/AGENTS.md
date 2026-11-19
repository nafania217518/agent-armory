# {{NAME}}

## What this is

{{WHAT}}

## Commands

Format: `<check>: <command>`; `implement` §4 says how to run them.

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

Only what this project adds to or changes in armory `test` §2.

Unit style: {{UNIT_STYLE}}

{{LEVEL_CHANGES}}

## Tracker

Format: `<verb>: <binding>`, one line per bound verb of armory `tracking` §1, then
`target: <the project's own tracker>`, then
`closes by PR merge: <no | the closing reference form, e.g. Closes #<id>>`, then,
with the label verbs bound, `label <role>: <label>`, one per role of armory
`tracking` §3.

{{TRACKER}}

## Rules

Project-only rules. The armory skills hold the rest. The `auto-fix:` values are in
armory `code` §3.

- Documentation lives in {{DOCS}}
- auto-fix: none
{{PROJECT_RULES}}

## Glossary

Format: `Term : one-line meaning`, plus `. Avoid: <synonyms>` when a synonym was rejected.
A line MUST hold only a term of the project's domain, with no implementation detail.

## Caveats

Format: the caveat line of armory `core` §6, or a topic pointer line of
armory `workflow` §3
