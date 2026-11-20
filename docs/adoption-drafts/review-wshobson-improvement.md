# review ← wshobson (improvement)

Sources: https://github.com/wshobson/agents `plugins/skill-forge-essentials/skills/ai-debt-detector/SKILL.md` @9c61ab2 (MIT); https://github.com/wshobson/agents `plugins/agent-teams/skills/multi-reviewer-patterns/SKILL.md` @9c61ab2 (MIT)
Status: draft, not adopted

## What it brings

Two checks for debt that AI-written code often hides: an import or API call that does not
exist in the installed version, and a resource that is opened but not closed on every path.

## Cons

- The resource check overlaps class Scale ("memory or lists that only grow") in part.
- The dependency check needs the installed package or lockfile; a repo with no lockfile
  gives only the manifest.
- Dropped from the source: the finding-merge rules and severity floors. Armory spawns one
  reviewer per review, so there is nothing to merge (YAGNI). `review` §Output already makes a
  security hole and a missing test on risky code Must fix.
- Dropped from the source: "each external call needs a named failure path". The
  `review-ecc-improvement` draft, change 2, holds that case (timeouts, hidden fallbacks).
- Size: `review` is at its `max-lines` (161 of 161); adopting adds about 3 lines, so
  `max-lines` must rise or other lines go.

## Proposed changes

### 1. Imports and APIs that do not exist

- Target: `review` §Look for, class 1 Bug (add case at end of item 1, before the period)
- Text: `, an import no declared dependency provides, a function or method the installed
  version lacks (check lockfile or installed source)`
- Note: the class list holds cases, not rules; §Look for "Review and audit MUST cover each
  class" carries the RFC word.
- Why: §Look for has no check that an import or method is real; a made-up API compiles in
  dynamic languages and fails only at run time.
- Evidence needed: a review in an armory run that passed code calling a method absent from
  the installed version, or an eval case where the reviewer misses one.

### 2. Every open has a close

- Target: `review` §Look for, class 2 Risk (add case at end of item 2, before the period)
- Text: `, resource leaks (a file, connection, listener, interval, subscription or temp file
  opened with no close on some path, failure paths included)`
- Why: class Scale catches growth only at load; a leak on the error path goes unseen in a
  review of the happy path.
- Evidence needed: an armory review that passed a leak on a failure path, or an eval case
  that seeds one.
