---
name: triage
description: >
  User-only: the model MUST NOT load this skill on its own; it MUST ask the user to
  start it instead. Triage of inbound tracker items on a bound tracker: the attention
  list, one item at a time, a recommended category and outcome, then the writes the user
  approves. Changes no repo file. Use for "/triage", "triage the tracker".
disable-model-invocation: true
max-lines: 103
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# triage

The main session sorts tracker items that people open outside an armory run, before a
`plan` task run picks them up. It works only on the tracker (`core` section Host terms,
term `tracker`), with no branch and no plan mode.

- MUST write no repo file.

## 1. Start

- MUST stop when the project context has no `## Tracker`, and tell the user to bind a
  tracker with `setup`.
- MUST stop and name `setup` when a label verb (`core` section Host terms, term
  `tracker`) or one of the five label lines is unbound.
- Roles: states `needs-triage`, `needs-info`, `accepted`; categories `bug`,
  `enhancement`. Each maps to its `label <role>: <label>` line. A triaged open item
  MUST carry exactly one state role and one category role.
- MUST check each role label with list labels. A role label missing in the tracker
  MUST be created only after the user's yes. On the user's no, MUST stop and name the
  missing label.
- Done when every verb and label line is bound, and every role label exists.

## 2. Attention list

- With no item named in the request, MUST list the open items in three buckets:
  1. No state role, and the body does not start with the `core` AI marker line.
  2. `needs-triage`.
  3. `needs-info`, with a comment after the last comment of triage (one that starts
     with the AI marker), or with no such comment.
- Each bucket MUST show its count, then one line per item, oldest first: its title with
  the link inside and a one-line summary that triage writes from the item.
- Done when the list is shown and the user picks an item, or names none.

## 3. Triage one item

1. MUST read the body, the comments and the labels. Done when each is read.
2. Prior-rejection check: MUST list the `dropped` items and compare each with this item
   by concept, not by wording. On a match, MUST ask the user: confirm (drop this item
   too, the reason comment links the earlier one), or reconsider/distinct (one
   answer). The confirm option MUST list the rejection writes, with the proposed
   category as in section Quick override; its choice is the yes to them. A confirm
   MUST end the item. The other answer MUST continue at step 3. Done when no item
   matches, or the user chose and the writes of a confirm are made.
3. A bug claim: MUST read the code and name the code path that causes it, or the gap
   that leaves it unproven. MUST NOT reproduce the bug; MUST read the code instead.
   Done when the path or the gap is named, or when the item makes no bug claim.
4. A feature item with an open point MUST go through the `plan` business-quiz topics
   (`plan` section Quizzes) before step 5. A point the user leaves to the reporter
   MUST rule out `accepted` in step 5. Done when each open point is answered or left
   to the reporter.
5. MUST ask one call with two questions: the category first (`bug`, `enhancement`),
   then the outcome (section Outcomes), each with the recommended option first. Each
   outcome option MUST name its writes in short. The message text before the call MUST
   hold the reasons of each recommendation, the `BR` lines when `accepted` is an
   option, and the drafted reason when a rejection is an option. The user's choice is
   the yes to its writes. Done when the user chose and its writes are made.

- Every write MUST follow the `core` tracker rules.

## 4. Outcomes

- `accepted`: the state and category labels, and a `## Requirements` section added
  below the item's text. It MUST hold the `BR` lines in the format of `plan`
  `templates/milestone.md` section Requirements, without its `Format:` line.
  A later `plan` task run starts from the item (`plan` section Levels).
- `needs-info`: the state and category labels, and a comment `## Triage notes` with two
  parts, each point specific: what is established, and what the reporter still needs
  to give.
- `needs-triage`: the state and category labels only.
- Rejected: the category label, a comment with the reason, then the status `dropped`,
  and the state label removed. When the user gives no reason, triage MUST draft it and
  show it among the listed writes.
- Done when each write of the outcome is made and the item carries the labels above.

## 5. Quick override

- When the request names the outcome for an item, MUST skip the quiz and the
  recommendation (section Triage one item, steps 4 and 5). Steps 1, 2 and 3 still run.
- Only when step 2 did not end the item, MUST then list the writes of the named
  outcome and ask the user's yes. The category MUST come from the request. With none
  named, the listed writes MUST name the proposed category.
- Done when step 2 ended the item, or the user said yes or no to the listed writes.

## 6. Resume

- A `needs-info` item with a reply MUST go through section Triage one item again.
- MUST read the earlier `## Triage notes` and the replies after them. MUST NOT ask
  again a point that the reporter answered; MUST list it as established instead.
- Done when each point of the earlier notes is marked answered or still open.
