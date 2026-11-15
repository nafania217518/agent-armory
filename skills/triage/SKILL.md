---
name: triage
description: >
  Triage of inbound tracker items on a bound tracker: the attention
  list, one item at a time, a recommended category and outcome, then the writes the user
  approves. Changes no repo file. Use for "/triage", "triage the tracker".
disable-model-invocation: true
max-lines: 107
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# triage

Main session sorts tracker items that people open outside an armory run, before a `plan`
run picks them up. It works only on the tracker (`core` §Host terms, term `tracker`),
with no branch and no plan mode. It MUST write no repo file.

## 1. Start

- MUST stop and name `setup` when project context has no `## Tracker`, or a label verb
  (`core` §Host terms, term `tracker`) or one of the five label lines is unbound.
- Roles: states `needs-triage`, `needs-info`, `accepted`; categories `bug`, `enhancement`.
  Each maps to its `label <role>: <label>` line. A triaged open item MUST carry exactly
  one state role and one category role.
- On user's no to a missing role label, MUST stop and name it.
- Done when every label verb and label line is bound, and every role label exists.

## 2. Attention list

- With no item named in request, MUST list open items in three buckets:
  1. No state role, and the body does not start with the `core` AI marker line.
  2. `needs-triage`.
  3. `needs-info`, with a comment after the last comment of triage (one that starts
     with the AI marker), or with no such comment. When the list-items verb gives an
     updated time, this bucket MUST instead hold each `needs-info` item with that
     time, and triage MUST read comments only of the item user picks. When the picked
     item has a triage comment and no comment after the last one, triage MUST say it
     still waits for the reporter and end the item.
- Each bucket MUST show its count, then one line per item, oldest first: title and a
  one-line summary.
- Done when list is shown and user picks an item, or names none.

## 3. Triage one item

A bug is a reported incorrect behavior: output on a named input differs from what the
project fixes (an `accepted` item's `BR` lines, a done milestone, docs or tests). Any
other item, a mixed one included, is an enhancement.

1. Duplicate check: MUST compare the item in full with open items outside bucket 1, an
   item with `BR` lines by those lines only. MUST find `dropped` items with the
   list-items verb plus a keyword match on titles, and read only the hits. On a match,
   MUST ask once: duplicate of a match (up to three, best first) or distinct. A
   duplicate MUST be rejected with a reason that links the match, and ends the item.
   Done when no item matches or user chose.
2. For a bug, MUST have an agent read the code, not reproduce the bug, and name the code
   path or the gap that leaves it unproven. MUST skip this read when the reject is
   clear. Done when path or gap is named, the read is skipped, or the item reports no
   bug.
3. MUST ask only open points, each under its `plan` business-quiz topic (`plan`
   §Quizzes): facts the `BR` lines need that the item, code, done milestones, docs and
   tests do not settle. A request for a different output on an input that the project
   fixes is an open point; triage MUST recommend the fixed output. MUST NOT write to
   another item; MUST leave its change to a `plan` amendment. Done when each point is
   answered or left to the reporter.
4. MUST ask one call with two questions, category then outcome, each option with its
   writes in short. Message text MUST hold the reasons, related items, `BR` lines when
   `accepted` is an option, and the drafted rejection reason. Rejected MUST be
   recommended when the project already gives the item or open items with `BR` lines
   cover it. With a point left to the reporter, MUST NOT offer `accepted`; MUST offer the
   other outcomes. Done when user chose and its writes are made.

## 4. Outcomes

- `accepted`: state and category labels, and a `## Requirements` section below the item's
  text, with `BR` lines in the format of `plan` `templates/milestone.md` §Requirements,
  without its `Format:` line. The `BR` lines MUST hold only what no open item with `BR`
  lines already fixes; the section MUST link each such item and name each conflict user
  settled. A later `plan` milestone or task run starts from the item.
- `needs-info`: state and category labels, and a comment `## Triage notes`: what is
  established, and what reporter still needs to give.
- `needs-triage`: state and category labels only.
- Rejected: category label, a comment with the reason, status `dropped`, and state label
  removed. Triage MUST draft the reason; user MAY give another.
- A choice in §Triage one item is the yes to its writes. Done when each write is made.

## 5. Quick override

- When request names the outcome, MUST skip steps 3 and 4 of §Triage one item. MUST list
  the writes, with the request's category or else the one step 4 would recommend. For
  `needs-triage`, MUST make the writes with no yes; for any other outcome, MUST ask
  user's yes first.
- Done when step 1 ended the item, the `needs-triage` writes are made, or user said yes
  or no.

## 6. Resume

- A `needs-info` item with a reply MUST go through §Triage one item again. MUST NOT ask
  again a point the reporter answered in reply to the earlier `## Triage notes`; MUST
  list it as established instead.
- An item whose body starts with the `core` AI marker line, or that holds its own
  `## Requirements`, MUST skip steps 1 and 4 of §Triage one item. Once each point is
  answered, it MUST ask user one yes or no question that lists the write, and on a yes
  set `accepted` again.
- Done when each point of earlier notes is marked answered or still open, and, for such
  an item, user has answered and, on a yes, its state label is set back.
