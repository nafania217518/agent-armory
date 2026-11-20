# implement ← karpathy (improvement)

Sources:
- https://github.com/multica-ai/andrej-karpathy-skills `skills/karpathy-guidelines/SKILL.md` §3 Surgical Changes, `EXAMPLES.md` §3 @2c60614 (MIT, stated in SKILL.md and plugin.json; no LICENSE file)
- https://x.com/karpathy/status/2015883857489522876 (2026-01-26, the post the source rests on)

Status: draft, not adopted

## What it brings

The coder deletes code that its own change leaves unused, in the same change. Today
`implement` §1 makes the coder finish every caller the change breaks, but names no rule
for code the change orphans. Review §3 Lean `delete` finds the orphan only after the
coder reports, at the cost of a fix round.

## Cons

- Models and linters often remove unused imports by default; AGENTS.md says to delete a
  line the model already follows. The gain is mainly functions, types and files left with
  no caller across modules, which most linters miss.
- `implement` is at its `max-lines` cap (119 of 119); the change adds one line, so
  `max-lines` must rise to 120 or another line goes.
- Dropped: Think Before Coding (state assumptions, show interpretations, ask, push back).
  `plan` §2 quizzes until no open point remains, an assumption included, and pushes back;
  the coder card bans guessing and asks for `stuck:`.
- Dropped: Simplicity First. `implement` §1 ladder and `review` §3 Lean (`delete`,
  `yagni`, deletion test) are checkable; the source's "would a senior engineer say this
  is overcomplicated" test is not. "No error handling for impossible scenarios" is
  `craft` §2 parse-once and the `implement-wshobson-improvement` draft.
- Dropped: the rest of Surgical Changes. `implement` §1 bans unrequested changes and keeps
  conventions; `review` §3 Lean `unrequested` reverts them. "Mention pre-existing dead
  code": `implement` §1 already bans its deletion, and `audit` finds dead code repo-wide.
- Dropped: Goal-Driven Execution. `craft` §3 TDD, plan `TR` `tests:` lines and the
  AGENTS.md done-condition rule cover it.
- Dropped: "use judgment for trivial tasks". It breaks `core-main` §4; `core` §1 already
  allows a recorded SHOULD bypass.
- Dropped: instruction-only form. The source post says such CLAUDE.md lines did not fix
  these failures; armory backs its rules with a reviewer and gates.

## Proposed changes

### 1. Delete your own orphans

- Target: `implement` §1 The smallest complete change (change the bullet "MUST ship the
  smallest complete change")
- Text:
  ```
  - MUST ship the smallest complete change, once you know everything it must touch. MUST
    finish every caller and fixture the change breaks, and MUST delete each import,
    variable, function or file that the change leaves unused. One-liner that needs
    decoding MUST NOT count as small.
  ```
- Why: the source post names "they don't clean up dead code after themselves" as a common
  model failure. The coder rules cover broken callers but not orphans, so the reviewer
  finds them one round late.
- Evidence needed: an armory review `delete` finding on code that the same task's coder
  left unused, or a merged task diff that left an orphan on `<base>`.
