# code ← cek (improvement)

Sources: https://github.com/NeoLabHQ/context-engineering-kit `plugins/git/skills/load-pr-comments/`, `plugins/git/skills/resolve-fixed-pr-comments/`, `plugins/fpf/skills/decay/` @23e2428 (GPL-3.0: ideas only, no text taken)
Sources: https://github.com/mhattingpete/claude-skills-marketplace `engineering-workflow-plugin/skills/review-implementing/` @b5b34bc (Apache-2.0)
Status: draft, not adopted

## What it brings

A loop for outside review feedback on an open PR: load open threads, check each against
the code, fix, and resolve only threads the code now meets. Also a freshness check for
caveats about library or platform behavior. This file holds the shared PR feedback flow;
`code-superpowers-improvement.md` adds its distinct bullets to the same new section.

## Cons

- Needs new host-term verbs and a `setup` binding; GitHub is the only forge checked.
- `code` is at its `max-lines` (219); the new section adds about 25 lines. It MAY move to
  its own skill if the limit holds.
- More forge writes, each under the tracker write rules (user's yes, AI marker).
- Change 5 extends the caveat format; `doc-checks.mjs` does not parse indented lines today,
  so no lint change is needed, but the cleanup rule grows.

## Proposed changes

### 1. Forge verbs as host terms

- Target: `core` §Host terms (add bullet, after `tracker`)
- Text:
  - forge: system that holds the repo's PRs. Optional verbs: list open review threads of a
    PR (unresolved only, each with its id, file, line and comments), reply in a thread,
    resolve a thread. Project context `## Tracker` binds each verb. The tracker rules
    above on subagent writes, write approval and the AI marker line MUST also hold for
    each forge write.
- Why: armory skills may not name a host's own tool, and no host term covers PR threads.
- Evidence needed: a run where outside PR feedback came in and the session had no rule to
  load, check or resolve it.

### 2. Setup probes the forge verbs

- Target: `setup` §Project context, Questions (add bullet, after the tracker probe bullet)
- Text:
  - The probe MUST also propose a binding for each forge verb of `core` §Host terms that
    host's connections offer, proved by one live list of open threads on a PR, with no
    write. An unbound forge verb MUST leave §Outside review to pasted feedback only.
- Why: the flow needs a bound list verb; the resolved flag exists only on some API paths
  (see Caveats in the writer report).
- Evidence needed: same as change 1.

### 3. Outside review flow

- Target: `code` (new section `## 7. Outside review`, after §Finish)
- Text:

  ```
  ## 7. Outside review

  Outside feedback is a review comment on an open PR of a task branch, from user or
  another reviewer, human or bot, or review notes user pastes.

  1. Load: main session MUST list the PR's open review threads (`core` §Host terms,
     forge) and add the pasted items. Done when each open item has a number, its thread
     id, its `file:line` (an outdated thread takes the nearest line the forge gives) and
     its requests.
  2. Rewrite: main session MUST turn each item into one change request in its own
     words, and MUST merge items that ask the same change at the same lines. Done when
     each request names the item numbers it covers.
  3. Check: main session MUST have an agent check each request against the code at the
     task-branch tip (`delegate` §Models row 9) and return one verdict per request:
     valid, false (with the command or line that proves it), unclear, or against a
     plan decision (with the section or `TR`). Done when each request has a verdict.
  4. Ask: main session MUST put every unclear and every against-plan request to user in
     one question round before any fix brief, since items may depend on each other. A
     reply in a thread for a false request MUST join that round as a forge write. Done
     when user has answered each.
  5. Fix: a request that changes a `TR`'s behavior MUST go through `plan` §Amendments.
     The rest MUST go as fix briefs and through §Review loop. Done when each valid
     request has a reviewed fix commit, or user dropped it.
  6. Resolve: after the push (§Branch and plan file guards it), main session MUST have
     an agent re-check each fixed thread at the pushed tip. A thread MAY be resolved
     only when the current code meets every request in it; a partial fix, an intent or
     a doubt MUST keep it open. Main session MUST ask user once, listing the threads to
     resolve and each thread kept open with its reason. Done when each approved resolve
     is made and the report names each open thread.
  ```

- Why: `code` §Review loop covers only armory reviewer findings; outside feedback after
  §Finish has no flow, and a thread resolved on intent hides an unfixed request.
- Evidence needed: an armory PR whose outside comments were fixed partly, missed, or
  resolved without a fix.

### 4. Description trigger

- Target: `code` frontmatter `description` (add trigger)
- Text: add `"address PR comments"` to the quoted trigger list.
- Why: without it, a request to act on PR comments may not load `code`.
- Evidence needed: an eval case in `evals/` where that request did not load `code`.

### 5. Caveat freshness check

- Target: `code` §Caveats (replace bullet "A topic entry MAY carry one indented line")
- Text:
  - A topic entry MAY carry one indented line: its cause, its workaround or a doc link. An
    entry about a library, tool or platform behavior SHOULD end that line, or make one,
    with `checked: <name>@<version>`, the version its claim was checked on.
- Target: `code` §Caveats (replace bullet "Cleanup: for each caveat-base entry")
- Text:
  - Cleanup: for each caveat-base entry whose file the task changed, moved or deleted
    (`git diff --name-status <base>...HEAD`), and each entry whose `checked:` name has a
    new version in the task's manifest or lock-file diff, main session MUST re-check the
    entry's claim as the "Before that write" bullet sets. It MUST then have the entry kept
    with its new `checked:` version, its path fixed, or it dropped, by bullets above. A
    claim the check does not settle MUST keep the entry with an `Unverified:` part.
- Why: a caveat about a library behavior goes stale after an upgrade, and no rule
  re-checks it today.
- Evidence needed: a caveat-base entry that was false after a dependency upgrade.
