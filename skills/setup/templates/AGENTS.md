# {{NAME}}

## What this is

{{WHAT}}

## Gates

Format: `<gate>: <command>`, or `<gate>: off <reason>`; a gate with no line is off. A gate
MAY list parts instead, one indented `- <folder>: <command>` line each, run inside that
folder (`.` is the repo root).

- lint: {{LINT}}
- owasp: {{OWASP}}
- unit: {{UNIT}}
- integration: {{INTEGRATION}}
- coverage: {{COVERAGE}}
- contract: {{CONTRACT}}
- functional: {{FUNCTIONAL}}
- e2e: {{E2E}}

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

Project-only rules.

- Documentation lives in {{DOCS}}
- auto-fix: none
{{PROJECT_RULES}}

## Glossary

Format: `Term : one-line meaning`, plus `. Avoid: <synonyms>` when a synonym was rejected.
A line MUST hold only a term of the project's domain, with no implementation detail.

## Caveats

Format: `- <short description> : <file or —>`, or a topic pointer line
`- <topic>: <when to read it> : <docs>/caveats/<topic>.md`.
