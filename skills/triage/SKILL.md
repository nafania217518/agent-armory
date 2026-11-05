---
name: triage
description: >
  Triage of inbound tracker items on a bound tracker: the attention
  list, one item at a time, a recommended category and outcome, then the writes the user
  approves. Changes no repo file. Use for "/triage", "triage the tracker".
disable-model-invocation: true
max-lines: 97
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# triage

The main session sorts tracker items that people open outside an armory run, before a
`plan` task run picks them up. It works only on the tracker (`core` section Host terms,
term `tracker`), with no branch and no plan mode. It MUST write no repo file.

## 1. Start

- MUST stop and name `setup` when the project context has no `## Tracker`, or a label
  verb (`core` section Host terms, term `tracker`) or one of the five label lines is
  unbound.
- Roles: states `needs-triage`, `needs-info`, `accepted`; categories `bug`,
  `enhancement`. Each maps to its `label <role>: <label>` line. A triaged open item
  MUST carry exactly one state role and one category role.
- On the user's no to a missing role label, MUST stop and name it.
- Done when every verb and label line is bound, and every role label exists.

## 2. Attention list

- With no item named in the request, MUST list the open items in three buckets:
  1. No state role, and the body does not start with the `core` AI marker line.
  2. `needs-triage`.
  3. `needs-info`, with a comment after the last comment of triage (one that starts
     with the AI marker), or with no such comment.
- Each bucket MUST show its count, then one line per item, oldest first: its title and a
  one-line summary.
- Done when the list is shown and the user picks an item, or names none.

## 3. Triage one item

A bug is a reported incorrect behavior: the output on a named input differs from what
the project fixes (an `accepted` item's `BR` lines, a done milestone, the docs or the
tests). Any other item, a mixed one included, is an enhancement.

1. Duplicate check: MUST compare the item with the `dropped` items and the open items
   with a state role, an `accepted` item by its `BR` lines only. On a match, MUST ask
   once: duplicate of a match (up to three, the best first) or distinct. A duplicate
   MUST be rejected with a reason that links the match, and ends the item. Done when no
   item matches or the user chose.
2. For a bug, MUST read the code, not reproduce the bug, and name the code path or the
   gap that leaves it unproven. Done when the path or the gap is named, or the item
   reports no bug.
3. MUST ask only the open points, each under its `plan` business-quiz topic (`plan`
   section Quizzes): facts the `BR` lines need that the item, the code, the done
   milestones, the docs and the tests do not settle. A request for a different output on
   an input that the project fixes is an open point; triage MUST recommend the fixed
   output. MUST NOT write to another item; MUST leave its change to a `plan` amendment.
   Done when each point is answered or left to the reporter.
4. MUST ask one call with two questions, the category and then the outcome, each option
   with its writes in short. The message text MUST hold the reasons, the related items,
   the `BR` lines when `accepted` is an option, and the drafted rejection reason.
   Rejected MUST be recommended when the project already gives the item or open
   `accepted` items cover it. With a point left to the reporter, MUST NOT offer
   `accepted`; MUST offer the other outcomes. Done when the user chose and its writes
   are made.

## 4. Outcomes

- `accepted`: the state and category labels, and a `## Requirements` section below the
  item's text, with `BR` lines in the format of `plan` `templates/milestone.md` section
  Requirements, without its `Format:` line. The `BR` lines MUST hold only what no open
  `accepted` item already fixes; the section MUST link each such item and name each
  conflict the user settled. A later `plan` task run starts from the item.
- `needs-info`: the state and category labels, and a comment `## Triage notes`: what is
  established, and what the reporter still needs to give.
- `needs-triage`: the state and category labels only.
- Rejected: the category label, a comment with the reason, the status `dropped`, and
  the state label removed. Triage MUST draft the reason; the user MAY give another.
- A choice in section Triage one item is the yes to its writes. Done when each write is
  made.

## 5. Quick override

- When the request names the outcome, MUST skip steps 3 and 4 of section Triage one
  item. MUST list the writes, with the category of the request or else the one step 4
  would recommend, and ask the user's yes.
- Done when step 1 ended the item, or the user said yes or no.

## 6. Resume

- A `needs-info` item with a reply MUST go through section Triage one item again. MUST
  NOT ask again a point that the reporter answered in reply to the earlier
  `## Triage notes`; MUST list it as established instead.
- Done when each point of the earlier notes is marked answered or still open.
