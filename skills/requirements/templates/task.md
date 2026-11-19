# Plan: {{TITLE}}

Parent: `{{DOCS}}/milestones/{{MILESTONE}}.md` §Tasks, line `{{BRANCH}}`.
A task with no milestone writes `Parent: none (no milestone)`.
With a tracker bound, the parent line is
`Parent: [<task title>](<link>), child of [<milestone title>](<link>).`, and for a task
with no milestone `Parent: [<task title>](<link>) (no milestone).`

## Goal

{{GOAL}}

## Design

Format: one line per decision the `TR` items share (data shape, API, check order, lock
order, texts) or per `TR` reason. A line names a function, not a line number, and no
dropped alternative.

## Requirements

Format: `- TR-<n> (<milestone>/BR-<m>, ...): MUST <behavior>`, a list item, then
indented list items under it: a `- tests:` line that names the tests and each gate by
name, or `- tests: none, <why>`; a `- needs:` line: the `TR` ids it needs, or `none`; on
a data-growth path, a `- load:` line: its load `TR` id, or `- load: none, <why>`. An
exact text block the `TR` prescribes is indented under the item.

A task with no milestone and no tracker bound lists its own `BR` items first, in the
format of armory `requirements` `templates/milestone.md` §Requirements.

## Test scope

Format: `<test case> : <break | rework | remove> : <reason>`, or `None.`.

## Risks

Format: `<risk> : <check>`; `<check>` is the `TR` that checks or limits it, or the quiz
answer that accepts it.

## Accepted tech debt

Format: `<file>:<function> : <tech-debt: marker text>`.

## Overrides

Format: `<design rule> : <reason>`.
