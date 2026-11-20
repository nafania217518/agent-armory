# implement ← ecc (improvement)

Sources: https://github.com/affaan-m/everything-claude-code `hooks/hooks.metadata.json` (`pre:config-protection`) and `scripts/hooks/config-protection.js` @3f14a10 (MIT); https://github.com/affaan-m/everything-claude-code `skills/gateguard/SKILL.md` and `scripts/hooks/gateguard-fact-force.js` @3f14a10 (MIT); https://github.com/affaan-m/everything-claude-code `skills/search-first/SKILL.md` @3f14a10 (MIT); https://github.com/ChiefGyk3D/department-of-internal-arguments `fragments/never-weaken.md` and `policies/quality-gates.md` line 6 @a9d4347 (Apache-2.0, with NOTICE; change 1 only)
Status: draft, not adopted

## What it brings

A rule that a coder fixes the code, not the gate's config, when a gate fails. This rule is
the single home of gate integrity; `implement-rezvani-improvement` points here. Also a
checkable done condition for the scope list, and a search for existing code by behavior
before new code.

## Cons

- The source enforces change 1 with a hook that blocks writes to a fixed list of config
  files. A hook adds install work and a list that goes stale; the draft keeps the rule only.
  A hook stays an option once a failure is seen.
- Change 2's source denies the first edit of every file until the agent states facts. The
  draft keeps the facts as a done condition and drops the denial, so it costs no extra turn.
  The source's +2.25 quality gain is the author's own test on two tasks (weak proof).
- Change 2 drops the source's questions for instruction files (which loader reads it, what
  behavior changes, which rule already covers it). The coder does not edit skill text; they
  fit the `skill-authoring` draft.
- Change 3 is weak: the ladder in §The smallest complete change already asks "Already in
  this codebase?". Dropped: the source's package-registry and GitHub search, since a new
  dependency is a plan decision, not a coder one.
- Size: `implement` is at its `max-lines` (155 of 155); adopting adds about 5 lines, so
  `max-lines` must rise or other lines go.

## Proposed changes

### 1. Do not weaken a gate (shared gate-integrity rule)

- Target: `implement` §Gates per commit (add bullet after the `lint` and `unit` bullet)
- Text: MUST NOT weaken a gate to make it pass: its `on` value or command in project context,
  its config or ignore file (lint, formatter, type checker, test runner), a threshold, or an
  inline suppression the change adds. MUST fix the code instead. A change to a gate MUST be
  one that the plan item names.
- Why: `implement` §Domain, boundaries and state bans silencing the compiler, but nothing
  stops an agent from editing the linter config or an ignore list, or from lowering a
  threshold. The source's hook comment calls this a frequent agent move.
- Second source: DoIA `fragments/never-weaken.md` lists checks an agent must never weaken
  to get green (skip markers, inline ignores, `|| true` on a gate, a narrower lint or scan
  scope, a loosened test); `policies/quality-gates.md:6` states the rule. It records no
  observed failure.
- Evidence needed: an armory run where a coder edited a gate config, an ignore file or a
  threshold to pass a gate. The source's claim is not measured.

### 2. Scope list done condition

- Target: `implement` §Before you write (replace bullet "MUST list every place the change must
  reach: callers, fixtures, config, exports. That is scope. Extra features are not.")
- Text: MUST list every place the change must reach: callers, fixtures, config, exports. That
  is scope. Extra features are not. The list is done when, for each file the change edits, it
  names the files that import it (from a search), the public names the change touches, and
  the data format the file reads or writes, if any.
- Why: "list every place" has no check; a list made from memory, not from a search, misses
  importers.
- Evidence needed: an armory coder result that broke an importer it never listed, or the
  source's A/B repeated on armory eval cases.

### 3. Search by behavior before new code

- Target: `implement` §The smallest complete change, ladder step 2 (replace "Already in this
  codebase? Use it as surrounding code does.")
- Text: Already in this codebase? Search by what the code must do, not only by a name you
  expect. Use what you find as surrounding code does.
- Why: a name search misses a helper with another name; `review` §Look for (Lean, reuse)
  catches the copy only after it is written.
- Evidence needed: an armory review with a Lean reuse finding on code the coder had just
  written.
