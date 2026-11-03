# Plan: triage skill

Parent: none (no milestone)

## Goal

Add a user-only `triage` skill. It sorts inbound tracker items (issues that other
people open outside an armory run) before a `plan` task run picks them up. It works only
with a bound tracker from the project context `## Tracker`, which `setup` writes.
Reference: mattpocock/skills `skills/engineering/triage` at 4ae2317 (MIT). This task
reverses the 2026-11-02 Decisions line that dropped `triage`, and the `tracker`
milestone's Scope Out item "a triage flow and its labels".

Kept from the reference: the attention list, one item at a time, recommend then wait,
the prior-rejection check, the needs-info notes and the resume, the user's quick
override, categories `bug` and `enhancement`, role-to-label mapping. Changed: three
states, not five; the output is a `BR` section, not an Agent Brief; code reading, not
reproduction; rejections stay in the tracker, not in `.out-of-scope/` files.

## Requirements

Format: `BR-<n>: MUST <behavior>`.

- BR-1: MUST be a user-only skill `triage`: `disable-model-invocation: true`, and a
  description that says the model must not load it on its own.
- BR-2: MUST run only with a bound tracker. With the docs fallback, MUST stop and tell
  the user to bind a tracker with `setup`.
- BR-3: MUST use five triage roles, each mapped to a tracker label in `## Tracker`:
  states `needs-triage`, `needs-info`, `accepted`; categories `bug`, `enhancement`.
  A triaged open item MUST carry exactly one state role and one category role.
- BR-4 (replaced by BR-17): With no item named, MUST show the attention list, oldest first, with a count
  and a one-line summary per item, in three buckets: open items with no state role whose
  body does not start with the armory AI marker; `needs-triage` items; `needs-info`
  items with a comment after triage's last marked comment.
- BR-5: For one item, MUST read its body and comments, run the prior-rejection check
  against the dropped items, check a bug claim by reading the code (it names the code
  path or the gap), and recommend a category and an outcome with the reasons. It MUST
  wait for the user's choice before any write.
- BR-6: For a feature item with an open point, MUST quiz the user with the `plan`
  business-quiz topics before `accepted`.
- BR-7: The outcomes MUST write:
  - `accepted`: the role labels, and a `## Requirements` section of `BR-n: MUST`
    lines (the `plan` milestone template format) added below the item's text.
  - `needs-info`: the role labels, and a `## Triage notes` comment: what is
    established, what the reporter still needs to give.
  - `needs-triage`: the role labels only.
  - rejected: a reason comment, then the status `dropped`; the state role removed.
- BR-8: With the user's outcome named in the request (quick override), MUST skip the
  recommendation and the quiz, list the writes and ask the yes.
- BR-9: On a `needs-info` item, MUST read the earlier triage notes and MUST NOT ask
  again a point that the reporter already answered.
- BR-10: Every write MUST follow the `core` tracker rules (AI marker, yes before an
  unlisted write, keep the item's text). A missing label MUST be created only after the
  user's yes.
- BR-11: Triage MUST write no repo file.
- BR-12 (replaced by BR-16): The `tracker` term MUST gain the optional verbs list items (by status and
  label), set labels (add or remove) and create label, and the `## Tracker` lines
  `label <role>: <label>`. `setup` MUST propose them when the tracker has the verbs.
- BR-13: Every skill list (`scripts/doc-checks.mjs` LISTS) and `docs/DESIGN.md`
  (sections 1, 3, 4, Decisions) MUST name `triage`.
- BR-14: `lint` and `unit` MUST pass on every commit.
- BR-15: A dry run on `nafania217518/armory-tracker-dryrun` MUST prove BR-3..BR-10.
- BR-16: The `tracker` term MUST gain the optional verbs list items (by status and
  label), list labels, set labels (add or remove) and create label, and the
  `## Tracker` lines `label <role>: <label>`. `setup` MUST propose them when the tracker
  has the verbs. A label line MUST default to an existing label of the same name or the
  same meaning, else to the role name, and the user MUST confirm it in the setup round.
- BR-17: With no item named, MUST show the attention list, oldest first, with a count
  and a one-line summary per item that triage writes, in three buckets: open items with
  no state role whose body does not start with the armory AI marker; `needs-triage`
  items; `needs-info` items with a comment after triage's last marked comment, or with
  no marked comment.

TR items (execution order):

- TR-1 (BR-12): `core` section Host terms, term `tracker`: add the three optional
  verbs and name the `label <role>: <label>` lines among what `## Tracker` binds. Raise
  `core` `max-lines` to its new size.
  tests: none, a prose rule; checked by reading, by `lint` and by the dry run.
- TR-2 (BR-12): `setup` section Project context: the probe proposes the three verbs
  only when the tracker has them, and then the five label lines (default: the role
  name, or an existing label that the probe finds). `templates/AGENTS.md` `## Tracker`
  format line names the label lines. `DESIGN.md` section 3 `## Tracker` line likewise.
  Raise `setup` `max-lines`.
  tests: none, a prose rule; checked by reading, by `lint` and by the dry run.
- TR-3 (BR-1, BR-2, BR-3, BR-4, BR-5, BR-6, BR-7, BR-8, BR-9, BR-10, BR-11): new
  `skills/triage/SKILL.md` with `max-lines`, written to the project rules (each case of
  the description once; each step with a checkable done condition; no line the model
  follows by default; each new `MUST NOT` names the behavior to do instead). Sections:
  start (binding check, missing labels), attention list, triage one item, outcomes and
  their writes, quick override, resume.
  tests: none, a prose rule; checked by reading, by `lint` and by the dry run.
- TR-4 (BR-13): add `triage` to every list in LISTS of `scripts/doc-checks.mjs`
  (plugin.json, marketplace.json twice, README skill table, `AGENTS.md` What this is,
  `DESIGN.md` section 1, and the rest the script names); `DESIGN.md` section 1 count
  "thirteen", section 4 home row and the main-session load line, and a 2026-11-03
  Decisions line that reverses the drop, with its dropped alternatives.
  tests: `lint` (`doc-checks.mjs` fails on a missing name).
- TR-5 (BR-15): dry run in one subagent that plays the main session of a scratch clone
  of `armory-tracker-dryrun` in the session scratchpad. It binds the label verbs and
  lines in the clone's `## Tracker` (not pushed), opens three issues on the live repo
  (a real bug in `slug.js`, a vague feature, a request close to one the run then
  drops), and runs triage from the repo path `skills/triage/SKILL.md`: missing labels
  created, the attention list, `accepted` with a `BR` section, `needs-info` with notes,
  a reply comment and the resume, a rejection to `dropped`, the prior-rejection check
  that finds it, a quick override. Plus a docs-fallback check: triage stops. The run
  reports each write with its link.
  tests: the dry run itself; the report lists each BR with pass or fail.

BR-14 is a gate on every commit.

Amendment 1 (review of daaa161..8a2796b, defects in built work, the user chose fix now):

- TR-6 (BR-13, BR-14): the `doc-checks.mjs` end markers `. The skills use` in
  `AGENTS.md` and `. The skills other` in `DESIGN.md` section 1 MUST each sit on one line.
  tests: `lint`; a break check: with `triage` removed from each list, `doc-checks.mjs`
  MUST fail.
- TR-7 (BR-3, BR-8): in the quick override, the category MUST come from the request;
  with none, step 6 MUST name the proposed category among the listed writes.
  tests: none, a prose rule; checked by reading and by the dry run.
- TR-8 (BR-5): in the prior-rejection check, confirm MUST go to step 6 with the
  rejection writes; the other answer (reconsider or distinct, one answer) MUST continue
  at step 3.
  tests: none, a prose rule; checked by reading and by the dry run.
- TR-9 (BR-10): when the user says no to a missing label, triage MUST stop and name the
  missing label.
  tests: none, a prose rule; checked by reading.
- TR-10 (BR-13): the 2026-11-03 triage Decisions line MUST also name the 2026-11-03
  tracker decision's drop of a triage flow, and MUST say "three of mattpocock's five
  states".
  tests: none, a prose rule; checked by reading.


Amendment 2 (TR-5 dry run and the re-review; the user chose fix now and approved BR-16
and BR-17):

- TR-11 (BR-16): `core` term `tracker` adds the optional verb list labels. The `setup`
  probe binds it with the other label verbs, and proposes each label line by the
  default of BR-16 for the user to confirm. `triage` section Start checks each role
  label with list labels and stops when it is unbound.
  tests: none, a prose rule; checked by reading, by `lint` and by TR-17.
- TR-12 (BR-17): `triage` section Attention list: bucket 3 also takes `needs-info`
  items with no marked comment; triage writes each one-line summary.
  tests: none, a prose rule; checked by reading.
- TR-13 (replaced by TR-22) (BR-5, BR-8): one ask per item: the recommendation question MUST show each
  outcome with its writes, the recommended one first; the user's choice is the yes to
  its writes. The quick override MUST still list the writes and ask the yes.
  tests: none, a prose rule; checked by reading and by TR-17.
- TR-14 (BR-3, BR-5): on a confirm in the prior-rejection check, the listed rejection
  writes MUST name the proposed category, as in the quick override.
  tests: none, a prose rule; checked by reading.
- TR-15 (BR-7): for a rejection whose reason the user does not give, triage MUST draft
  the reason and show it among the listed writes.
  tests: none, a prose rule; checked by reading.
- TR-16 (BR-7): the `## Requirements` section added on `accepted` MUST hold the `BR`
  lines without the template's `Format:` line.
  tests: none, a prose rule; checked by reading and by TR-17.
- TR-17 (BR-6, BR-15): a second dry run on the same repo: one feature item with an open
  point goes through the `plan` business-quiz topics to `accepted`, through the one ask
  of TR-13, with the label check of TR-11 and the section format of TR-16.
  tests: the dry run itself; the report lists BR-6, TR-11, TR-13 and TR-16 with pass or
  fail.

Amendment 3 (review of 663252d..740f77b and the TR-17 dry run; third fix round on the
user's yes; TR-22 text approved by the user):

- TR-18 (BR-6, BR-7): `triage` step 4 MUST be done when each open point is answered or
  the user leaves it to the reporter; a point left open MUST rule out `accepted` in
  step 5.
  tests: none, a prose rule; checked by reading.
- TR-19 (BR-5, BR-8): a confirm in `triage` step 2 MUST end the item; the quick
  override MUST list its writes only when step 2 did not end the item.
  tests: none, a prose rule; checked by reading.
- TR-20 (BR-16): `setup` MUST NOT repeat the confirm-round rule in the probe paragraph;
  the live-read sentence MUST name the probe as its actor.
  tests: none, a prose rule; checked by reading.
- TR-21 (BR-5): `triage` step 3 MUST be done when the code path or the gap is named, or
  when the item makes no bug claim.
  tests: none, a prose rule; checked by reading.
- TR-22 (replaced by TR-24) (BR-3, BR-5, BR-8): the one ask MUST be one call with two questions, the
  category first, then the outcome. The options MUST name the writes in short; the `BR`
  lines of `accepted` MUST go in the message text before the call. The choice is the
  yes to the writes. The quick override MUST still list the writes and ask the yes.
  tests: none, a prose rule; checked by reading.
- TR-23 (BR-16): the `setup` label-line default MUST try an existing label of the same
  name first, then one of the same meaning, else the role name.
  tests: none, a prose rule; checked by reading.

Amendment 4 (final review of 740f77b..842bb16; fourth fix round on the user's yes;
TR-24 and TR-25 text approved by the user):

- TR-24 (BR-3, BR-5, BR-7, BR-8): as TR-22, and the message text before the call MUST
  also hold the drafted reason when a rejection is an option.
  tests: none, a prose rule; checked by reading.
- TR-25 (BR-3, BR-7): the Rejected outcome MUST also write the category label.
  tests: none, a prose rule; checked by reading.
## Test scope

None: no test in `scripts/` breaks; `doc-checks.mjs` reads the skill names from
`skills/`, so its tests need no change.

## Risks

- The dry run writes to the live private repo: three issues, three labels, comments,
  one close. The user deletes the repo or the items after.
- The dry-run agent cannot ask the user; a question outside the script takes the
  recommended option and is recorded.
- The inbound filter trusts the AI marker: an armory item whose body lost the marker
  shows as inbound.

## Stack choices

Prose skill, like `retro`. The GitHub binding of the new verbs: `gh issue list
--state --label`, `gh issue edit --add-label/--remove-label`, `gh label create`.

## Out of scope

- PRs as a request surface.
- Priority, size, duplicates of open items, a `wontfix` label.
- Linking an accepted item to a milestone item.
- Reproduction of a bug, a debug branch, any repo write (glossary, out-of-scope files).
- A change to `plan`: a task run already starts from an item and reads its `BR` list.

## Accepted tech debt

## Overrides

- `core` section Host terms, tracker rule "a subagent MUST NOT write": the dry-run
  agent plays the main session of the scratch project, with the user's approval given
  in this plan.

## Caveats

- Triage finds inbound items by the absence of the armory AI marker at the body start :
  skills/triage/SKILL.md
