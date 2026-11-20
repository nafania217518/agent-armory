# review ← rezvani (improvement)

Sources: https://github.com/alirezarezvani/claude-skills `engineering-team/skills/adversarial-reviewer/SKILL.md` @f8593c4 (MIT); https://github.com/alirezarezvani/claude-skills `engineering-team/skills/named-persona-adversarial-review/SKILL.md` @f8593c4 (MIT); https://github.com/alirezarezvani/claude-skills `engineering/skills/pr-review-expert/SKILL.md` @f8593c4 (MIT); https://github.com/alirezarezvani/claude-skills `engineering/skills/api-design-reviewer/SKILL.md` @f8593c4 (MIT)
Status: draft, not adopted

## What it brings

A cost for an empty review, so "nothing found" must show its work. A contract-first read that
breaks the reviewer's agreement with the author. Checks for breaks in consumers that a grep
of the repo cannot reach: deployed clients, a live database, the production environment.

## Cons

- Dropped: the "each persona must find at least one issue" quota. It clashes with `review`
  §Check before you report (no vague worries); change 1 replaces it.
- Dropped: named personas; the source itself warns they can invent quotes.
- Dropped: severity promotion when two lenses find one issue. Armory has one reviewer and
  three groups, not lenses with levels.
- Dropped: "read bottom-up". It is a reading habit with no checkable result.
- Change 3 overlaps the `migrate` draft (schema changes); keep the review case here and the
  migration procedure there.
- Size: `review` is at its `max-lines` (161 of 161); adopting adds about 10 lines, so
  `max-lines` must rise or other lines go.

## Proposed changes

### 1. An empty review shows its work

- Target: `review` §Output (replace bullet "Nothing found: one line on what was checked MUST
  replace the groups; `Re-review:` stays.")
- Text: Nothing found: one line on what was checked MUST replace the groups. That line MUST
  name three §Look for classes the change was checked against, each with one `file:line`
  that shows it holds. `Re-review:` stays.
- Why: one free line lets a shallow review pass as clean.
- Evidence needed: an armory review that returned "nothing found" on a change that a later
  review or the user found a bug in.

### 2. Contract before body

- Target: `review` §Understand first (add bullet after "MUST read diff, then code it
  touches")
- Text: For each changed function, reviewer SHOULD write its contract (inputs, output, side
  effects) from its name, signature and callers before reading its body. A body that breaks
  that contract MUST be reported as Bug.
- Why: a reviewer who reads the body first takes the author's view of what the function
  should do.
- Evidence needed: an eval case where a body breaks its name's promise and a plain review
  misses it; measure catch rate with and without the bullet.

### 3. Consumers outside the repo

- Target: `review` §Understand first (add bullet after "When a signature, return value or
  behavior changes, MUST grep every caller.")
- Text: Reviewer MUST grep removed and changed lines for names that consumers outside the
  repo use: routes, exported types, CLI flags, environment variables and schema columns. Each
  one removed or changed with no migration path MUST be reported. A new required environment
  variable, a `DROP`, a `NOT NULL` column with no default, and a dropped index MUST each be
  reported unless the plan names it.
- Why: the caller grep sees only this repo; deployed clients, a live database and the
  production environment break silently.
- Evidence needed: an armory change that broke a deployed consumer or a production
  environment variable and passed review.
