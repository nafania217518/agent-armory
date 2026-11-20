# code ← gsd (improvement)

Sources: https://github.com/gsd-build/get-shit-done `get-shit-done/workflows/verify-work.md`, `commands/gsd/verify-work.md` @bdcaab2 (MIT)
Status: draft, not adopted

## What it brings

Turns acceptance (`code` §Task end, step 7) into a guided check: one by-hand item per
question, with its expected result, and a cold-start item when startup can break. A reply
that is not a pass becomes a finding with an inferred group, and goes to the fix loop.

## Cons

- More question turns for user at task end; one per picked item.
- The source keeps a test state file; armory does not need it, since the question answers
  sit in the session.
- `code` is at its `max-lines` (219); step 7 grows by about 8 lines.
- `dnd` §Run step on acceptance would need the same one-item form when main session tries
  items itself.

## Proposed changes

### 1. Cold-start item

- Target: `code` §Task end, step 7 (add sentence)
- Text: When the task changes startup code, migrations, seed data or config, the item list
  MUST start with a cold-start item: stop the app, clear its caches and temporary state,
  start it fresh, and run one main read.
- Why: a bug in startup, seeding or env setup passes against a warm state and fails on the
  first fresh start.
- Evidence needed: a task whose by-hand check passed on a running app, and a fresh start
  then failed.

### 2. One item per question

- Target: `code` §Task end, step 7 (replace step text)
- Text:
  7. Acceptance: MUST ask user which items they want to try by hand. Then MUST ask one
     question per picked item, with its exact commands or clicks and its expected result,
     and the options pass, skip and "Other" for what happened. A skip MUST join the
     report's not-checked line. Done when each picked item has its answer.
- Why: today step 7 ends at the pick; nothing says how user reports a result.
- Evidence needed: a task end where user tried an item and the failure report got lost or
  needed a second round of questions.

### 3. A failed item becomes a finding

- Target: `code` §Task end, step 7 (add sentence after change 2)
- Text: An "Other" answer MUST become a finding, with no question on its weight: Must fix
  when it reports a crash, an error, lost data or a requirement not met, else Should fix.
  A finding whose cause is unknown MUST go to debugger (`delegate` §What each agent
  returns); a fix MUST follow §Review loop, and step 10 re-runs the gates.
- Why: a user report needs a path into the existing fix loop, and asking user for a
  severity costs a turn the reply already answers.
- Evidence needed: same as change 2.
