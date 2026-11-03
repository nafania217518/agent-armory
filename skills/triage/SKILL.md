---
name: triage
description: >
  User-only: the model MUST NOT load this skill on its own; it MUST ask the user to
  start it instead. Triage of inbound tracker items on a bound tracker: the attention
  list, one item at a time, a recommended category and outcome, then the writes the user
  approves. Changes no repo file. Use for "/triage", "triage the tracker".
disable-model-invocation: true
max-lines: 132
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
2. Prior check: MUST list the `dropped` items and the open `accepted` items, and compare
   each with this item. A match is the same concept, not the same wording. An item whose
   behavior the `BR` lines of an open `accepted` item cover, in full or as a strict
   part, is a match of that item. A request for a different output on an input that
   those `BR` lines fix is no match but a related item; step 4 counts it as a conflict.
   On a match, MUST ask the user. A `dropped` match: confirm (drop this item too), or
   reconsider/distinct (one answer). An `accepted` match: duplicate (drop this item), or
   distinct. A confirm or a duplicate MUST reject the item, with a reason comment that
   links the matched item. That option MUST list the category and the other rejection
   writes; its choice is the yes to them. The drafted reason MUST follow section
   Outcomes, Rejected. A confirm or a duplicate MUST end the item. The other answer MUST
   continue at step 3. An open `accepted` item that is related but not the same concept
   MUST get no ask. The step 5 message text MUST name each related item and each
   distinct `accepted` match. Done when no item matches, or the user chose and the
   writes of a confirm or a duplicate are made.
3. A bug claim asks for the behavior that the project fixes (an accepted `BR`, the docs
   or the tests) on a named input whose output today differs from it. A wished output
   that nothing fixes, or a change to an output that is already fixed, is no bug claim.
   For a bug claim, MUST read the code and name the code path that causes it, or the gap
   that leaves it unproven. MUST NOT reproduce the bug; MUST read the code instead. An
   item with no bug claim MUST skip this code check. The code check MUST NOT set the
   category; the last bullet of this section sets it. Done when the path or the gap is
   named, or the item makes no bug claim.
4. An open point is a fact that the `BR` lines need and that neither the item nor the
   answers settle. A conflict is also an open point: the item asks for a different
   output on an input that the `BR` lines of an open `accepted` item fix. For a bug or a
   feature, triage MUST ask only the open points, each under its `plan` business-quiz
   topic (`plan` section Quizzes), before step 5. A point that depends on a point left
   to the reporter MUST also stay with the reporter. With any point left to the
   reporter, step 5 MUST NOT offer `accepted`; it MUST offer the other outcomes. Triage
   MUST check for a conflict between two other open `accepted` items only among the
   related and matched items of step 2. The step 5 message text MUST name each such
   conflict. Triage MUST NOT write to those items; it MUST leave the fix to a `plan`
   amendment. Done when each open point is answered or left to the reporter.
5. MUST ask one call with two questions: the category first (`bug`, `enhancement`), then
   the outcome (section Outcomes), each with the recommended option first. The category
   recommendation MUST follow the rule below. Each outcome option MUST name its writes
   in short. The message text before the call MUST hold the reasons of each
   recommendation, the `BR` lines when `accepted` is an option, and the drafted reason
   of section Outcomes, Rejected. The user's choice is the yes to its writes. When the
   step 4 answers reveal that the `BR` lines of an open `accepted` item cover this item
   in full, rejected MUST be the recommended outcome, with a reason comment that links
   the covering item. Done when the user chose and its writes are made.

- Every write MUST follow the `core` tracker rules.
- Step 5 MUST recommend `bug` for a bug claim of step 3, else `enhancement`. When step 5
  does not run, the category MUST come from the request. With none named, triage MUST
  propose the category that step 5 would recommend and name it in the listed writes.

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
  and the state label removed. Whenever a rejection is an option, triage MUST draft
  the reason and show it in the message text before the ask. The user MAY give another
  reason through the free-text answer.
- Done when each write of the outcome is made and the item carries the labels above.

## 5. Quick override

- When the request names the outcome for an item, MUST skip the quiz and the
  recommendation (section Triage one item, steps 4 and 5). Steps 1 to 3 MUST still
  run, unless step 2 ends the item.
- MUST then list the writes of the named outcome, with the category of section Triage
  one item, and ask the user's yes. A named rejection MUST come with the drafted reason
  of section Outcomes, Rejected. The message text before the yes MUST show the related
  items of section Triage one item, step 2, and each conflict that its step 4 defines.
- Done when step 2 ended the item, or the user said yes or no to the listed writes.

## 6. Resume

- A `needs-info` item with a reply MUST go through section Triage one item again.
- MUST read the earlier `## Triage notes` and the replies after them. MUST NOT ask
  again a point that the reporter answered; MUST list it as established instead.
- Done when each point of the earlier notes is marked answered or still open.
