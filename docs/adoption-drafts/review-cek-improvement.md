# review ← cek (improvement)

Sources: https://github.com/NeoLabHQ/context-engineering-kit `plugins/review/skills/traiage-review/SKILL.md` and `plugins/review/agents/change-{story,impact,failure,expectation}-agent.md` @23e2428 (GPL-3.0: ideas only, no text taken)
Status: draft, not adopted

## What it brings

On a diff too big for the user to read in full, the review adds a short ranked list of files
the user should read first. Armory lists findings but does not tell the user where to spend
their own review time.

## Cons

- The source runs four agents per review; the draft gives the four lenses to the one
  reviewer instead, so cost stays at one spawn but each lens gets less depth.
- Overlaps the reviewer's own read of connected code (`review` §Understand first); the list
  reuses that read and adds no new reads.
- The size threshold (20 files) is a guess.
- GPL-3.0: the draft uses only the idea of lenses, a random sample and a separate list of
  contract files; no text or structure is copied.
- Size: `review` is at its `max-lines` (161 of 161); adopting adds about 7 lines, so
  `max-lines` must rise or other lines go.

## Proposed changes

### 1. Read-first list on a large diff

- Target: `review` §Output (add bullet before "Then MUST give `Answers:`")
- Text: When user asked for the review and the diff changes more than 20 files, reviewer
  SHOULD give `Read first:` after the findings: up to 10 changed files, ranked by blast
  radius (callers of changed code), failure cost (what breaks and what would detect it) and
  effect on users, one line each with its reason.
- Why: on a large PR the user cannot read every file, and findings alone do not say which
  unflagged files carry the most risk.
- Evidence needed: a user request for a large-PR review where the user asked which files to
  read, or a retro note that the user missed a risky file.

### 2. Contract files and a random check

- Target: `review` §Output (add bullet after change 1)
- Text: `Read first:` SHOULD list changed contract files apart (API schemas, data models,
  config, dependency manifests). It SHOULD also add three changed logic files, picked at
  random from those the ranking left out, each marked `random`.
- Why: contract files break consumers with little code change, so a risk ranking by code
  size misses them; the random files let the user check the ranking itself.
- Evidence needed: same as change 1; adopt change 2 only with change 1.
