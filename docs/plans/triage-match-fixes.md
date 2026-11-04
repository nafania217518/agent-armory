# Plan: triage match fixes from the big dry run

Parent: none (no milestone)

## Goal

Fix the three outcome gaps that the big dry run (master c5ce9ea, issues #23 to #38 on
`nafania217518/armory-tracker-dryrun`) found in `triage` step 2, and remove the one
stale caveat. Branch `triage-match-fixes`, cut from `origin/HEAD` (master c5ce9ea).

## Requirements

Format: `BR-<n>: MUST <behavior>`.

- BR-1 (replaced by BR-6): When step 2 finds more than one match, triage MUST ask once,
  with one option per match (confirm for a `dropped` match, duplicate for an open match)
  plus distinct. The reason comment MUST link only the chosen match.
- BR-2 (replaced by BR-14): Before the step-2 ask, the message text MUST name each
  conflict between a matched `accepted` item and another open `accepted` item.
- BR-3 (replaced by Amendment 12): Step 2 MUST compare the item with the `dropped` items
  and with every open item that carries a state role (`needs-triage`, `needs-info`,
  `accepted`). A match with an open item MUST offer duplicate (rejected; the reason
  comment links the open item) or distinct.
- BR-4: `lint` and `unit` MUST pass on every commit.
- BR-5 (replaced by Amendment 12): Dry runs on `nafania217518/armory-tracker-dryrun`
  MUST prove BR-1..BR-3. Fix rounds and dry runs MUST repeat until a dry run finds no
  gap that changes an outcome.
- BR-6 (amended by BR-10, BR-12; replaced by Amendment 12): Several step-2 matches MUST
  get one ask, with one option per match plus distinct. With more than three matches,
  the options MUST be the three closest matches plus distinct, and the message text MUST
  name the rest. The reason comment MUST link the chosen match and no other match.
- BR-7 (replaced by BR-9): Each step-2 rejection option MUST list the category for its
  own match: `bug` when the item is a bug claim against that match's `BR` lines, else
  `enhancement`.
- BR-8 (replaced by BR-10): The reason comment of a duplicate of an `accepted` item MUST
  name each conflict that the step-2 message text names for that item.
- BR-9 (amended by BR-15; replaced by Amendment 12): Each step-2 rejection option MUST
  list `bug` when the item is a step-3 bug claim, unless the match is an `accepted` item
  whose `BR` lines the claim is not against. Else it MUST list `enhancement`.
- BR-10 (replaced by Amendment 12): The reason comment of a duplicate of an `accepted`
  item MUST name each conflict that the step-2 message text names, also when the other
  item of the conflict is a match.
- BR-11 (replaced by BR-12): Step 2 MUST rank the matches: open `accepted` items first
  (a cover in full before a strict part), then the other open items, then `dropped`
  items, newest first. The first ranked match MUST be the recommended option; the
  options MUST be the first three.
- BR-12 (replaced by Amendment 12): Step 2 MUST rank the matches: open `accepted` items
  first, then the other open items, then `dropped` items; newest first within each
  group. The first ranked match MUST be the recommended option; the options MUST be the
  first three.
- BR-13 (amended by BR-19; replaced by Amendment 12): An open `accepted` item MUST be a
  match only when its `BR` lines cover all of the item's behavior. An item that asks for
  more than those lines cover MUST be a related item, which step 5 names.
- BR-14 (replaced by Amendment 12): Before the step-2 ask, the message text MUST name
  each conflict between a matched `accepted` item and any other open `accepted` item,
  related or not.
- BR-15 (replaced by Amendment 12): Step 5 MUST recommend `enhancement` when the item
  proposes any behavior that nothing fixes, also when it holds a step 3 bug claim.
- BR-16 (amended by BR-17; replaced by Amendment 12): When related open `accepted` items
  fix part of the item, the `accepted` outcome's `BR` lines MUST hold only the rest, and
  its `## Requirements` section MUST link each such item. When those items together
  cover the item in full, step 5 MUST recommend rejected, with a reason that links each.
- BR-17 (amended by BR-24; replaced by Amendment 12): The `accepted` outcome's `##
  Requirements` section MUST link each related open `accepted` item, and MUST name each
  step 4 conflict with it that the user settled for this item.
- BR-18 (amended by BR-19; replaced by Amendment 12): An item MUST NOT be a match of
  another open or `dropped` item that asks for, or fixes, a different output on the same
  input. Step 2 MUST count that item as related instead.
- BR-19 (replaced by Amendment 12): Step 2 MUST count a listed item as a match only when
  it asks for or fixes each behavior of this item, with the same inputs and outputs. A
  listed item that leaves an input or an output of this item open MUST be related, not a
  match.
- BR-20 (amended by BR-22; replaced by Amendment 12): A fact that the code, the docs or
  the tests settle is no open point; triage MUST read it there instead of asking.
- BR-21 (replaced by BR-23): When the project already gives every behavior of the item
  (the code, a done milestone, the docs or the tests), step 5 MUST recommend rejected,
  with a reason that names where.
- BR-22 (replaced by Amendment 12): Step 4 MUST also count as a conflict a request for a
  different output on an input that a done milestone, the docs or the tests fix.
- BR-23 (replaced by Amendment 12): When the code already gives every behavior of the
  item and step 3 names no code path against it, step 5 MUST recommend rejected, with a
  reason that names where (the code, a done milestone, the docs or the tests).
- BR-24 (replaced by Amendment 12): The `accepted` outcome's `## Requirements` section
  MUST also name each step 4 conflict with a done milestone, the docs or the tests that
  the user settled for this item.
- BR-25 (replaced by Amendment 12): For a step 4 conflict, triage MUST recommend the
  output that the project already fixes.
- BR-26 (replaced by Amendment 12): A fixed rule whose wording leaves open whether it
  covers an input of the item MUST count as a step 4 open point; triage MUST ask whether
  it covers that input.
- BR-27: `skills/triage/SKILL.md` MUST have 100 lines or fewer and hold no rule the
  model follows by default.
- BR-28: The category MUST be `bug` only for a reported incorrect behavior: an output on
  a named input that differs from what an `accepted` item's `BR` lines, a done
  milestone, the docs or the tests fix. Any other item, a mixed one included, MUST be
  `enhancement`.
- BR-29: Triage MUST compare the item with the `dropped` items and the open items with a
  state role, an `accepted` item by its `BR` lines only. On a match it MUST ask once:
  duplicate of a match (up to three, best first) or distinct. A duplicate MUST be
  rejected with a reason that links the match.
- BR-30: For a bug, triage MUST read the code and name the code path or the gap, and
  MUST NOT reproduce it.
- BR-31: A request for a different output on an input that the project fixes MUST go to
  the user as an open point, with the fixed output recommended. Triage MUST NOT write to
  another item.
- BR-32: Step 5 MUST recommend rejected when the project already gives the item or open
  `accepted` items cover it. With a point left to the reporter, it MUST NOT offer
  `accepted`.
- BR-33: The `accepted` `BR` lines MUST hold only what no open `accepted` item already
  fixes; the section MUST link each such item and name each conflict the user settled.
- BR-34: A reviewer MUST read the short skill first. Then one dry run (dry run 23) on
  the case set of Amendment 12 MUST give each case its expected outcome; judgment notes
  are no gap.

TR items (execution order):

- TR-1 (BR-3): `triage` step 2 lists the `dropped` items and every open item with a
  state role; a match with an open item offers duplicate or distinct.
  tests: none, a prose rule; checked by reading and by TR-4.
- TR-2 (BR-1): step 2 with several matches asks once, one option per match plus
  distinct; the reason comment links only the chosen match.
  tests: none, a prose rule; checked by reading and by TR-4.
- TR-3 (BR-2): the step-2 message text names each conflict between a matched
  `accepted` item and another open `accepted` item, with the BR-20 scope of
  `triage-fixes`.
  tests: none, a prose rule; checked by reading and by TR-4.
- TR-4 (BR-5): dry run 11 on the same repo: an item with a `dropped` match and an
  `accepted` match that point to opposite outputs; a duplicate of an `accepted` item
  that conflicts with another accepted item; a duplicate of an open `needs-info` item.
  tests: the dry run itself; the report lists BR-1..BR-3 with pass or fail.

BR-4 is a gate on every commit.

Amendment 1 (final review of c5ce9ea..d5d066c and dry run 11; second fix round;
BR-6..BR-8 approved by the user):

- TR-5 (BR-6): step 2 caps the one ask at three matches plus distinct and names the rest
  in the message text; the reason links the chosen match and no other.
  tests: none, a prose rule; checked by reading and by TR-8.
- TR-6 (BR-7): each step-2 rejection option lists the category for its own match; the
  shared category bullet stays the rule for every other path.
  tests: none, a prose rule; checked by reading and by TR-8.
- TR-7 (BR-8): the reason comment of a duplicate of an `accepted` item names each
  conflict that the step-2 message text names.
  tests: none, a prose rule; checked by reading and by TR-8.
- TR-8 (BR-5): dry run 12 on the same repo: four or more matches; conflicting matches
  with a bug claim against one of them (category per option); a duplicate of an
  `accepted` item with a conflict (named in the reason).
  tests: the dry run itself; the report lists BR-6..BR-8 with pass or fail.

Amendment 2 (re-review of d5d066c..a835bbc and dry run 12; third fix round on the
user's yes; BR-9..BR-11 approved by the user):

- TR-9 (BR-9): the step-2 option category follows BR-9; step 2 applies the step-3
  bug-claim definition by pointer.
  tests: none, a prose rule; checked by reading and by TR-12.
- TR-10 (BR-10): the BR-8 sentence also covers a conflict whose other item is a match,
  as the exception to "no other match".
  tests: none, a prose rule; checked by reading and by TR-12.
- TR-11 (BR-11, BR-4): step 2 ranks the matches and recommends the first; the
  two-RFC-word sentence on the cap is split.
  tests: none, a prose rule; checked by reading and by TR-12.
- TR-12 (BR-5): dry run 13 on the same repo: a repeated bug report that matches an open
  `needs-triage` or dropped bug item (`bug`); conflicting `accepted` matches where the
  user picks one (the reason names the other); four or more mixed matches (ranking and
  recommendation).
  tests: the dry run itself; the report lists BR-9..BR-11 with pass or fail.

Amendment 3 (re-review of a835bbc..0cdbf4b and dry run 13; fourth fix round on the
user's yes; BR-12..BR-14 approved by the user):

- TR-13 (BR-13): step 2 counts an open `accepted` item as a match only on a full cover;
  an item that asks for more is related and step 5 names it; the "cover in full before
  a strict part" rank goes.
  tests: none, a prose rule; checked by reading and by TR-16.
- TR-14 (BR-12): step 2 sorts newest first within each rank group.
  tests: none, a prose rule; checked by reading and by TR-16.
- TR-15 (BR-14): the step-2 message text names each conflict of a matched `accepted`
  item with any other open `accepted` item; the step 4 scope rule allows it.
  tests: none, a prose rule; checked by reading and by TR-16.
- TR-16 (BR-5): dry run 14 on the same repo: an item that asks for more than an
  `accepted` item covers (related, no match); a match of an `accepted` item that
  conflicts with an unrelated `accepted` item (named, and in the reason); two open
  non-`accepted` matches (newest first recommended).
  tests: the dry run itself; the report lists BR-12..BR-14 with pass or fail.

Amendment 4 (re-review of 0cdbf4b..73bea8c and dry run 14; fifth fix round on the
user's yes; BR-15 and BR-16 approved by the user; they change the `accepted` outcome
and the category rule, against the first Out of scope line, on the user's yes):

- TR-17 (BR-15): the category rule recommends `enhancement` for an item that proposes
  any behavior that nothing fixes, also with a bug claim; step 2 and step 5 share one
  definition of the item that gets `bug`.
  tests: none, a prose rule; checked by reading and by TR-20.
- TR-18 (BR-16): section Outcomes `accepted` and step 5: the `BR` lines hold only what
  no related open `accepted` item fixes, the section links each such item, and a full
  cover by several such items recommends rejected with a reason that links each.
  tests: none, a prose rule; checked by reading and by TR-20.
- TR-19 (BR-13): step 2 says "A related item MUST get no ask." in place of the
  "related but not the same concept" sentence (re-review Nice 3).
  tests: none, a prose rule; checked by reading and by TR-20.
- TR-20 (BR-5): dry run 15 on the same repo: a mixed item (`enhancement` recommended;
  the accepted lines hold only the new part and link the related items); an item that
  several accepted items cover together (rejected recommended, the reason links each);
  a plain bug report against the docs or the tests (`bug`).
  tests: the dry run itself; the report lists BR-15 and BR-16 with pass or fail.

Amendment 5 (re-review of 73bea8c..9a5fc35; sixth fix round on the user's yes; defects
in built code, so no new BR):

- TR-21 (BR-16): step 5 recommends rejected when, after the step 4 answers, the `BR`
  lines of related open `accepted` items together cover the item in full.
  tests: none, a prose rule; checked by reading and by TR-24.
- TR-22 (BR-16): the `accepted` `BR` lines hold only what no related open `accepted`
  item fixes the same way, so an output the user chose at step 4 stays.
  tests: none, a prose rule; checked by reading and by TR-24.
- TR-23 (BR-9, BR-15): the step-2 category sentence states its rule with no loop to the
  last bullet; "each ask of the item" becomes "each request of the item".
  tests: none, a prose rule; checked by reading and by TR-24.
- TR-24 (BR-5): dry run 16 on the same repo: a conflict with an accepted item that the
  user settles for the accepted item (rejected recommended); one that the user settles
  for the new output (the accepted lines keep it).
  tests: the dry run itself; the report lists BR-15 and BR-16 with pass or fail.

Amendment 6 (re-review of 9a5fc35..caff4e9 and dry run 16; seventh fix round on the
user's yes; BR-17 and the TR-26 wording fixes approved by the user):

- TR-25 (BR-17): section Outcomes `accepted` links each related open `accepted` item
  and names each step 4 conflict with it that the user settled for this item.
  tests: none, a prose rule; checked by reading and by TR-27.
- TR-26 (BR-9, BR-13, BR-16): step 2 says "the item's step 3 bug claim"; step 5 offers
  no `accepted` when its `BR` lines would be empty; step 2 points to step 4 for the
  conflict definition.
  tests: none, a prose rule; checked by reading and by TR-27.
- TR-27 (BR-5): dry run 17 on the same repo: a conflict settled for the new output (the
  section links the related item and names the conflict); a conflict settled for the
  accepted item (no `accepted` option).
  tests: the dry run itself; the report lists BR-16 and BR-17 with pass or fail.

Amendment 7 (re-review of caff4e9..68e0c59 and dry run 17; eighth fix round on the
user's yes; BR-18 approved by the user):

- TR-28 (BR-18): step 2 counts an item that asks for a different output on an input
  than another open or `dropped` item as related, not as a match of it; for an open
  `accepted` item, step 4 still counts it as a conflict.
  tests: none, a prose rule; checked by reading and by TR-30.
- TR-29 (BR-4, BR-16): `max-lines` loses its extra spaces; step 5 says "the `accepted`
  outcome's `BR` lines"; one step 5 sentence holds both triggers for "no `accepted`"
  and the step 4 copy goes.
  tests: none, a prose rule; checked by reading and by TR-30.
- TR-30 (BR-5): dry run 18 on the same repo: an item that asks for the opposite output
  of an open `needs-triage` item (related, no step 2 ask); a point left to the reporter
  (no `accepted` option); a conflict settled for the accepted item (no `accepted`
  option).
  tests: the dry run itself; the report lists BR-16 and BR-18 with pass or fail.

Amendment 8 (re-review of 68e0c59..6bdea7f, dry run 18 and the recorded-items quiz;
ninth fix round on the user's yes; BR-19 and BR-20 approved by the user):

- TR-31 (BR-19, BR-13, BR-18, BR-4): step 2 tests a match by BR-19 in place of "the
  same concept"; the sentences of BR-13 and BR-18 stay only for what BR-19 does not
  say; step 2 names the compared item "listed item".
  tests: none, a prose rule; checked by reading and by TR-33.
- TR-32 (BR-20): step 4 says that a fact the code, the docs or the tests settle is no
  open point, and triage reads it there instead of asking.
  tests: none, a prose rule; checked by reading and by TR-33.
- TR-33 (BR-5): dry run 19 on the same repo: a specific item against a vaguer open item
  that leaves its inputs open (related, no step 2 ask); a restated open request (still a
  match); an item with a fact that the code settles (no step 4 question on it).
  tests: the dry run itself; the report lists BR-19 and BR-20 with pass or fail.

Amendment 9 (re-review of 6bdea7f..2078785 and dry run 19; tenth fix round on the
user's yes; TR-34 and TR-35 repair built code; BR-21 and BR-22 approved by the user):

- TR-34 (BR-13, BR-18, BR-19): step 2 makes a listed item related when it is no match
  but asks for or fixes any output on an input of this item, also when it leaves that
  input or output open; an unrelated item stays out.
  tests: none, a prose rule; checked by reading and by TR-38.
- TR-35 (BR-13): the step 2 match test counts only the `BR` lines of an open `accepted`
  listed item, not its body.
  tests: none, a prose rule; checked by reading and by TR-38.
- TR-36 (BR-21): step 5 recommends rejected when the project already gives every
  behavior of the item, with a reason that names where.
  tests: none, a prose rule; checked by reading and by TR-38.
- TR-37 (BR-22): step 4 counts a request for a different output on an input that a done
  milestone, the docs or the tests fix as a conflict.
  tests: none, a prose rule; checked by reading and by TR-38.
- TR-38 (BR-5): dry run 20 on the same repo: an opposite request against an open
  `needs-triage` item (related, named); an `accepted` item whose body and `BR` lines
  differ (no match by its body); an already-met request (rejected recommended); a
  request against a done milestone output (a step 4 conflict).
  tests: the dry run itself; the report lists BR-13, BR-18, BR-21 and BR-22.

Amendment 10 (re-review of 2078785..27e3d02 and dry run 20; eleventh fix round on the
user's yes; BR-23..BR-25 approved by the user):

- TR-39 (BR-23): the step 5 already-given rule needs the code to give each behavior and
  step 3 to name no code path against it; a docs- or tests-backed bug claim is not
  rejected by it.
  tests: none, a prose rule; checked by reading and by TR-43.
- TR-40 (BR-24): section Outcomes `accepted` also names each step 4 conflict with a done
  milestone, the docs or the tests that the user settled for this item.
  tests: none, a prose rule; checked by reading and by TR-43.
- TR-41 (BR-25): step 4 recommends the output that the project already fixes for each
  conflict.
  tests: none, a prose rule; checked by reading and by TR-43.
- TR-42 (BR-13, BR-20, BR-22, BR-23): step 4 reads the done milestones, the docs and
  the tests on the item's inputs; the step 2 related test, like the match test, reads
  only the `BR` lines of an open `accepted` item; the step 4 "fact settled" rule says
  "unless it is a conflict".
  tests: none, a prose rule; checked by reading and by TR-43.
- TR-43 (BR-5): dry run 21 on the same repo: a docs- or tests-backed bug report (`bug`,
  not rejected); an already-met request (rejected); a conflict with a done fix settled
  for the new output (named in `## Requirements`); an unscripted conflict (the fixed
  output recommended).
  tests: the dry run itself; the report lists BR-23..BR-25 with pass or fail.

Amendment 11 (re-review of 27e3d02..eb29dd4 and dry run 21; twelfth fix round on the
user's yes; BR-26 and the TR-45 and TR-46 texts approved by the user):

- TR-44 (BR-26): step 4 counts a fixed rule whose wording leaves open whether it covers
  an input of the item as an open point, and asks whether it covers that input.
  tests: none, a prose rule; checked by reading and by TR-47.
- TR-45 (BR-20, BR-23): one step 4 sentence: triage reads the code, the done
  milestones, the docs and the tests on the inputs of the item, instead of asking a
  fact they settle.
  tests: none, a prose rule; checked by reading and by TR-47.
- TR-46 (BR-9, BR-15): step 3 lists a done milestone among the sources of a bug claim.
  tests: none, a prose rule; checked by reading and by TR-47.
- TR-47 (BR-5): dry run 22 on the same repo: an item on an input whose coverage by a
  fixed rule is open (a step 4 question, each answer); a regression against a done
  milestone with no docs or test behind it (`bug`); a feature the code already gives
  with no docs or test (rejected).
  tests: the dry run itself; the report lists BR-23 and BR-26 with pass or fail.

Amendment 11 caveats: after TR-44, remove "Triage reads the scope of a fixed rule with
open wording … by judgment".

Amendment 10 caveats: after TR-40 and TR-42, remove the caveats on the unnamed done-fix
conflict and on the step 4 docs-or-tests conflict.

Amendment 9 caveats: after TR-37, remove "A step 4 conflict exists only against an open
`accepted` item…".

Amendment 12 (redesign after dry runs 11-22; the user chose a short `triage` with no
extra guidance, about 90 lines, keeping the duplicate check, the conflict with accepted
items, the quick override and resume; BR-27..BR-34 approved by the user; BR-1..BR-3 and
BR-5..BR-26 replaced; the stop rule of BR-5 is replaced by BR-34):

- TR-48 (BR-4): Amendment 12 into this plan file.
  tests: none, a plan edit.
- TR-49 (BR-27..BR-33, BR-4): replace `skills/triage/SKILL.md` with the approved short
  draft; set `max-lines`.
  tests: none, a prose rule; checked by TR-50 and TR-51.
- TR-50 (BR-34): prune the triage caveats that the short text makes stale; a reviewer
  reads c5ce9ea..HEAD for the triage text, the caveats and BR-27..BR-33.
  tests: the review itself.
- TR-51 (BR-34): dry run 23 on the case set below, new issues after #77 only. tests: the
  dry run; each case passes or fails.

Case set for dry run 23 (from dry runs 11-22):

1. A restated open `needs-triage` request: duplicate ask; duplicate gives rejected,
   link.
2. An opposite output of an open `needs-triage` item: no duplicate ask.
3. A partial cover by an `accepted` item plus a new part: `enhancement`, `accepted`;
   `BR` lines hold only the new part; the section links the item.
4. A request that two `accepted` items cover together: rejected recommended, links both.
5. A conflict with an `accepted` `BR`, settled for it: the fixed output recommended;
   rejected recommended; `accepted` not offered or has no `BR` lines.
6. A conflict with a done milestone, settled for the new output: `accepted`; the section
   names the conflict.
7. A bug against a done `BR`: `bug`; the code path named; not rejected.
8. A request the code already gives: rejected recommended; the reason names where.

Amendment 13 (review of 2bb67a2..8753564; defects in built code, so no new BR; the
user's stop rule: re-review until no finding, then dry run 23):

- TR-52 (BR-27): delete the two sentences that restate `core` (writes follow the tracker
  rules; a missing role label needs the user's yes, kept as the stop on a no); merge
  the double "read the code" in step 2; drop "its title with the link inside" and "each
  with the recommended option first".
  tests: none, a prose rule; checked by the re-review and TR-51.
- TR-53 (BR-29, BR-27): "The choice is the yes to its writes" moves to section Outcomes
  and covers every choice in section Triage one item, the duplicate ask included.
  tests: none, a prose rule; checked by the re-review and TR-51.
- BR-32 says "Step 5"; in the short skill that rule is step 4, the outcome ask.

## Test scope

None: no test in `scripts/` reads the skill text.

## Risks

- The dry runs write to the live private repo: new issues, labels, comments, closes.
  The user deletes them later.
- The dry-run agent cannot ask the user; an unscripted question takes the recommended
  option and is recorded.

## Stack choices

## Out of scope

- Any change to the outcomes, the label verbs or the attention list.
- Reading-review findings that change no outcome: they become a follow-up.

## Accepted tech debt

## Overrides

- `core` section Host terms, tracker rule "a subagent MUST NOT write": the dry-run
  agent plays the main session of the scratch project, with the user's approval given
  in this plan.

## Caveats

None new. The plan-file commit removes the stale caveat "With a step-4 conflict kept
in favor of the accepted item, the step-5 recommended outcome is unspecified": step 5
now recommends rejected for a cover that the step 4 answers reveal.

Amendment 3 caveats: remove the stale dropped-`bug` caveat (BR-9 fixed it); drop
"strict-part" from the ranking caveat; widen the two-accepted conflict caveat to a
matched item; add "An open item left distinct at step 2 stays open when a later
`accepted` item covers it in full; its next triage offers duplicate".

Amendment 4 caveats: narrow the "left distinct" caveat to the items that meet triage
again; narrow the step-2 bug-claim caveat to an item that asks for nothing more; after
TR-17 and TR-18, remove the mixed-category and repeated-`BR` caveats.
