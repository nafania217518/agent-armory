# Plan: triage fixes from dry run 3

Parent: none (no milestone)

## Goal

Fix the one defect and the five unclear wordings that dry run 3 found in the `triage`
skill (master 7f0c40f, issues #9 to #11 on `nafania217518/armory-tracker-dryrun`).
Branch `triage-fixes`, cut from `master` (= `origin/HEAD` at 7f0c40f).

## Requirements

Format: `BR-<n>: MUST <behavior>`.

- BR-1: The `core` tracker verb read an item MUST cover the body, the comments and the
  labels.
- BR-2 (replaced by BR-15): `triage` step 3 MUST define a bug claim as a claim that a
  named input gives a wrong output; an item with no bug claim MUST skip the code check.
- BR-3: `triage` step 4 MUST define an open point as a fact that the `BR` lines need
  and that neither the item nor the answers settle. A point that depends on a point
  left to the reporter MUST also stay with the reporter.
- BR-4: Whenever a rejection is an option (step 2 confirm, step 5, quick override),
  triage MUST draft the reason and show it in the message text before the ask. The
  user MAY give another reason through the free-text answer.
- BR-5: When steps 4 and 5 do not run (step 2 confirm, quick override) and the request
  names no category, triage MUST propose the category and name it among the listed
  writes.
- BR-6: `lint` and `unit` MUST pass on every commit.
- BR-7: Dry run 4 on `nafania217518/armory-tracker-dryrun` MUST prove BR-1..BR-5.
- BR-8: `triage` step 4 MUST quiz any item with an open point, a bug or a feature, with
  the `plan` business-quiz topics.
- BR-9 (replaced by BR-10): The prior check in `triage` step 2 MUST also compare the
  item with the open `accepted` items, by concept. On a match, the user MUST choose
  duplicate (rejected: the reason comment links the matched item, close as not planned)
  or distinct (continue at step 3; the step 5 message text names the related item).
- BR-10: The prior check in `triage` step 2 MUST compare the item with the `dropped`
  items and the open `accepted` items. A match MUST mean the same concept. On an
  `accepted` match, the user MUST choose duplicate (rejected; the reason comment links
  the matched item) or distinct (continue at step 3). An open `accepted` item that is
  related but not the same concept MUST get no ask in step 2; the step 5 message text
  MUST name it, as for a distinct match.
- BR-11: A conflict between the item's `BR` lines and the `BR` lines of an open
  `accepted` item MUST count as an open point in `triage` step 4.
- BR-12: A quick override MUST show in the message text before its yes each related
  open `accepted` item and each conflict with an `accepted` item's `BR` lines.
- BR-13: A request for a different output on an input that an open `accepted` item's
  `BR` lines already fix MUST count as a conflict in step 4, not as a step-2 match.
- BR-14: An item that the `BR` lines of an open `accepted` item already cover in full
  MUST be offered in step 5 as rejected; the reason comment MUST link the covering
  item.
- BR-15 (replaced by BR-18): A bug claim MUST name an input and an output that differs
  from the behavior the project fixes (an accepted `BR`, the docs or the tests). A
  wished output that nothing fixes MUST count as a feature request. An item with no bug
  claim MUST skip the code check.
- BR-16: Step 4 MUST ask only the open points, each under the business-quiz topic it
  belongs to.
- BR-17: A conflict that step 4 finds between two other open `accepted` items MUST be
  named in the step 5 message text. Triage MUST NOT write to those items; it MUST
  leave the fix to a `plan` amendment.
- BR-18: A bug claim MUST ask for the behavior that the project fixes (an accepted
  `BR`, the docs or the tests) on a named input whose output today differs from it.
  Step 5 MUST recommend `bug` for a bug claim and `enhancement` for any other item: a
  wished output that nothing fixes, or a change to an output that is already fixed. An
  item with no bug claim MUST skip the code check.
- BR-19: In step 2, an item whose behavior the `BR` lines of an open `accepted` item
  cover, in full or as a strict part, MUST count as a match of that item (duplicate or
  distinct). Step 5 (BR-14) MUST handle only a cover that the step 4 answers reveal.
- BR-20: The check for a conflict between two other open `accepted` items (BR-17) MUST
  run only on the `accepted` items that are related to the item or match it.
- BR-21 (replaced by BR-22): The category MUST be `bug` for a bug claim of step 3 and
  `enhancement` for any other item, on every path. Step 5 recommends it; when step 5
  does not run and the request names no category, triage proposes it.
- BR-22: Step 5 MUST recommend `bug` for a bug claim of step 3, else `enhancement`.
  When step 5 does not run, the category MUST come from the request. With none named,
  triage MUST propose the category of that rule and name it in the listed writes.

TR items (execution order):

- TR-1 (BR-1): `core` section Host terms, term `tracker`: the read verb reads
  "read an item (body, comments and labels)". `max-lines` set to the new size.
  tests: none, a prose rule; checked by reading, by `lint` and by TR-6.
- TR-2 (BR-2): `triage` step 3 holds the bug-claim definition and the skip.
  tests: none, a prose rule; checked by reading and by TR-6.
- TR-3 (BR-3): `triage` step 4 holds the open-point definition and the dependent-point
  rule.
  tests: none, a prose rule; checked by reading and by TR-6.
- TR-4 (BR-4): the drafted-reason rule lives once, in `triage` section Outcomes,
  Rejected; step 2, step 5 and section Quick override point to it. The clause "when
  the user gives no reason" goes.
  tests: none, a prose rule; checked by reading and by TR-6.
- TR-5 (BR-5): the category proposal lives once in `triage` section Quick override;
  step 2 confirm points to it (it already does: check and keep).
  tests: none, a prose rule; checked by reading and by TR-6.
- TR-6 (BR-7): dry run 4 in one subagent, in the scratch clone `triage-dryrun`. New
  inbound issues: a borderline bug claim (named input, wrong output) and one with no
  claim; a step 2 confirm that shows the drafted reason in the message text; a quick
  override without a category; step 1 reads the labels through the read verb.
  tests: the dry run itself; the report lists BR-1..BR-5 with pass or fail.

BR-6 is a gate on every commit.

Amendment 1 (final review and dry run 4; the user chose fix now and approved BR-8 and
BR-9):

- TR-7 (BR-4): the step 2 confirm option lists the category and the other rejection
  writes; the drafted reason follows section Outcomes, Rejected, by a pointer of its
  own; lines 54-58 reflowed.
  tests: none, a prose rule; checked by reading.
- TR-8 (BR-3): a point left to the reporter MUST mean step 5 does not offer `accepted`.
  tests: none, a prose rule; checked by reading.
- TR-9 (BR-5): section Quick override: steps 1 to 3 still run unless step 2 ends the
  item.
  tests: none, a prose rule; checked by reading.
- TR-10 (BR-5): the step 2 confirm names the proposed category itself, without a
  pointer to section Quick override.
  tests: none, a prose rule; checked by reading.
- TR-11 (BR-8): step 4 covers any item with an open point, a bug or a feature.
  tests: none, a prose rule; checked by reading and by TR-13.
- TR-12 (BR-9): step 2 compares with the dropped and the open `accepted` items; the
  answers per match kind as in BR-9.
  tests: none, a prose rule; checked by reading and by TR-13.
- TR-13 (BR-8, BR-9): dry run 5 on the same repo: a bug item with an open point, and
  an item with the same concept as an open accepted item (duplicate), plus one that is
  related but distinct.
  tests: the dry run itself; the report lists BR-8 and BR-9 with pass or fail.

Amendment 2 (re-review of 0f97855..9170279 and dry run 5; third fix round on the
user's yes; BR-10 and BR-11 approved by the user):

- TR-14 (BR-4, BR-10): step 2 names the duplicate without a host status ("drop this
  item"); the rejection writes stay only in section Outcomes.
  tests: none, a prose rule; checked by reading.
- TR-15 (BR-6): the ragged lines of step 4 and section Quick override are joined; the
  repeated "only when step 2 did not end the item" condition in Quick override goes.
  tests: `lint`; checked by reading.
- TR-16 (BR-10): step 2 defines a match as the same concept; a related open `accepted`
  item gets no ask and is named in the step 5 message text.
  tests: none, a prose rule; checked by reading and by TR-20.
- TR-17 (BR-11): step 4 counts a conflict with an open `accepted` item's `BR` lines as
  an open point.
  tests: none, a prose rule; checked by reading and by TR-20.
- TR-18 (BR-5): step 2 proposes the category itself when the request names none.
  tests: none, a prose rule; checked by reading.
- TR-19 (BR-2): step 3 says that the code check does not set the category; step 5
  does.
  tests: none, a prose rule; checked by reading.
- TR-20 (BR-10, BR-11): dry run 6 on the same repo: a related but not same-concept
  item (no step 2 ask, named in step 5), and an item whose `BR` would conflict with an
  open accepted item (quizzed in step 4).
  tests: the dry run itself; the report lists BR-10 and BR-11 with pass or fail.

Amendment 3 (final review of 9170279..006178e and dry run 6; fourth fix round on the
user's yes; BR-12..BR-17 approved by the user):

- TR-21 (BR-4, BR-5, BR-10, BR-15): every rule sentence of `triage` carries an RFC 2119
  word (`core` section Rule words); definitions stay plain.
  tests: none, a prose rule; checked by reading.
- TR-22 (BR-5): the category rule for a run where step 5 does not run lives once, in
  section Triage one item; step 2 and section Quick override use it without restating.
  Step 2 is reflowed, with no "there".
  tests: none, a prose rule; checked by reading.
- TR-23 (BR-15): step 3 holds the BR-15 bug-claim definition; the code check MUST NOT
  set the category, which step 5 or section Quick override sets.
  tests: none, a prose rule; checked by reading and by TR-27.
- TR-24 (BR-13, BR-16, BR-17): step 4 counts a different output on a fixed input as a
  conflict, asks only the open points under their topics, and names a conflict between
  two other accepted items in step 5 with no write to them.
  tests: none, a prose rule; checked by reading and by TR-27.
- TR-25 (BR-14): step 5 offers rejected for an item fully covered by an open accepted
  item's `BR` lines; the reason comment links it.
  tests: none, a prose rule; checked by reading and by TR-27.
- TR-26 (BR-12): section Quick override shows each related open accepted item and each
  `BR` conflict in the message text before its yes.
  tests: none, a prose rule; checked by reading and by TR-27.
- TR-27 (BR-12..BR-16): dry run 7 on the same repo: a wished output that nothing fixes
  (feature, not bug), a different output on a fixed input (conflict, not match), an
  item fully covered by an accepted item, and a quick override on an item related to
  and conflicting with an accepted item.
  tests: the dry run itself; the report lists BR-12..BR-16 with pass or fail.

Amendment 4 (final review of 006178e..8a11f35 and dry run 7; fifth fix round on the
user's yes; BR-18..BR-20 approved by the user):

- TR-28 (BR-13, BR-19): step 2 holds the match definition with both exceptions: a
  different output on a fixed input is no match (step 4 counts it as a conflict), and
  a cover in full or as a strict part is a match; step 4 keeps only the conflict
  definition.
  tests: none, a prose rule; checked by reading and by TR-33.
- TR-29 (BR-12): section Quick override points to the related items of step 2 and the
  conflicts that step 4 defines, without restating them.
  tests: none, a prose rule; checked by reading.
- TR-30 (BR-17, BR-20): the step 4 sentence on a conflict between two other accepted
  items is split, with "triage" as the subject, and runs only on the related or
  matched accepted items.
  tests: none, a prose rule; checked by reading and by TR-33.
- TR-31 (BR-18): step 3 holds the BR-18 bug-claim definition ("output today"); step 5
  recommends `bug` only for a bug claim.
  tests: none, a prose rule; checked by reading and by TR-33.
- TR-32 (BR-14, BR-19): step 5 keeps the cover rule only for a cover that the step 4
  answers reveal.
  tests: none, a prose rule; checked by reading.
- TR-33 (BR-18..BR-20): dry run 8 on the same repo: a change to a fixed output
  (`enhancement`), a strict part of an accepted item (step-2 match), and a related item
  where the #5/#17 conflict is or is not named by BR-20.
  tests: the dry run itself; the report lists BR-18..BR-20 with pass or fail.

Amendment 5 (final review of 8a11f35..7c6f127 and dry run 8; sixth fix round on the
user's yes; BR-21 approved by the user's choice of its option):

- TR-34 (BR-20): step 2 makes a different output on a fixed input "no match but a
  related item", so BR-20 covers that accepted item.
  tests: none, a prose rule; checked by reading and by TR-37.
- TR-35 (BR-12): section Quick override shows "each conflict that its step 4 defines".
  tests: none, a prose rule; checked by reading and by TR-37.
- TR-36 (BR-21): the category rule lives once, in the shared bullet of section Triage
  one item; step 5 points to it.
  tests: none, a prose rule; checked by reading and by TR-37.
- TR-37 (BR-12, BR-20, BR-21): dry run 9 on the same repo: a quick override with no
  category on a bug claim and on a change request, a quick override on an item that
  conflicts with an open accepted item, and a same-concept conflict with #5 or #17.
  tests: the dry run itself; the report lists BR-12, BR-20 and BR-21 with pass or fail.

Amendment 6 (re-review of 7c6f127..ae36142 and dry run 9; seventh fix round on the
user's yes; BR-22 approved by the user):

- TR-38 (BR-22): the shared category bullet of section Triage one item sets the
  recommended or proposed category, not the final label, in sentences of one rule
  each.
  tests: none, a prose rule; checked by reading and by TR-40.
- TR-39 (BR-22): step 3 points to that bullet for who sets the category.
  tests: none, a prose rule; checked by reading.
- TR-40 (BR-22): dry run 10 on the same repo: a quick override whose request names a
  category other than the rule's, and one with none named. In the same run, with the
  user's yes, one body edit through the API restores the reporter's text of #27 and
  keeps its `## Requirements` section.
  tests: the dry run itself; the report lists BR-22 with pass or fail and the #27 diff.

## Test scope

None: no test in `scripts/` reads the skill text.

## Risks

- A project whose read binding predates TR-1 may not return labels; `setup` binds each
  verb on its next run.
- The dry run writes to the live private repo: up to three issues, labels, comments,
  closes. The user deletes them later.
- The dry-run agent cannot ask the user; an unscripted question takes the recommended
  option and is recorded.

## Stack choices

## Out of scope

- Any change to the triage states, outcomes or the label verbs.
- The two-asks case of a prior match plus reconsider (already a caveat).

## Accepted tech debt

## Overrides

- `core` section Host terms, tracker rule "a subagent MUST NOT write": the dry-run
  agent plays the main session of the scratch project, with the user's approval given
  in this plan.

## Caveats

- A tracker read binding made before triage-fixes may return an item without its
  labels : skills/core/SKILL.md
