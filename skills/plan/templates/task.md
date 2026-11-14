# Plan: {{TITLE}}

Parent: `{{DOCS}}/milestones/{{MILESTONE}}.md` §Tasks, line `{{BRANCH}}`.
A task with no milestone writes `Parent: none (no milestone)`.
With a tracker bound, the parent line is
`Parent: [<task title>](<link>), child of [<milestone title>](<link>).`, and for a task
with no milestone `Parent: [<task title>](<link>) (no milestone).`

## Goal

{{GOAL}}

## Requirements

Format: `TR-<n> (<milestone>/BR-<m>, ...): MUST <behavior>`, then an indented `tests:`
line that names the tests, or `tests: none, <why>`, and an indented `needs:` line: the
`TR` ids it needs, or `none`.

A task with no milestone lists its own `BR` items first, in the format of armory `plan`'s
`templates/milestone.md` §Requirements. With a tracker bound, they go in its own task
item body instead, and this section holds only the `TR` list.

## Test scope

Format: `<test case> : <break | rework | remove> : <reason>`.

## Risks

## Stack choices

## Out of scope

## Accepted tech debt

## Overrides

Format: `<design rule> : <reason>`.

## Caveats

Format: the caveat line of armory `core` §Reports.
