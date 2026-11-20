# retro ← ecc (improvement)

Sources: https://github.com/affaan-m/everything-claude-code `agents/conversation-analyzer.md`, `skills/rules-distill/SKILL.md`, `skills/delivery-gate/SKILL.md`, `skills/delivery-gate/hooks/quality-gate.py` @3f14a10 (MIT)
Status: draft, not adopted

## What it brings

Three signals of a user correction that the stumble list lacks, plus a signal for
excuses that defer a failing check. It also adds a finding class for one rule stated in
two files.

## Cons

- The correction signals overlap the stumble list of `retro-superpowers-improvement`
  change 4. Only the three new signals are drafted here.
- Excuse phrases match by wording, so false hits are likely; the signal only points a
  reader at a step.
- Not taken: the Stop hook that warns on excuse phrases. It needs hook code, armory hooks
  only inject `core`, and change 1 covers the retro use.
- Not taken: the repo-wide skill scan of rules-distill. A scan of every skill fits
  `audit` or a skill-authoring pass, not a session retro.
- `retro` is at `max-lines: 86`; these changes add about 9 lines.

## Proposed changes

### 1. Correction and excuse signals
- Target: `retro` §2 Finding classes (add bullet before "Before class Checks and review
  rules"). When `retro-superpowers-improvement` change 4 lands, merge these items into
  its stumble list instead, so the list lives in one place.
- Text:
  ```
  - Before class Checks and review rules, MUST scan the session for these signals: user
    reverts an agent edit, user edits agent output by hand, agent repeats a mistake after
    user corrected it, and agent text defers a failing check ("pre-existing bug", tests
    skipped "for now"). Each hit MUST be checked as a miss of that class.
  ```
- Why: today the class starts from "a mistake was made" with no list of where to look.
  A hand fix or a deferred failing check leaves no error result in the session.
- Evidence needed: a session where the user fixed agent output by hand, or an agent
  deferred a failing gate, and the retro did not report it.

### 2. Duplicate-rule class
- Target: `retro` §2 Finding classes (add class after "Context size and no-op lines")
- Text:
  ```
    - Duplicate rules. Use when the session loaded two skills, cards or context files that
      state one rule, in the same or other words. The change: keep the rule in the file
      that owns it (`core` for a rule of every actor), and a pointer in each other file.
      A rule stated in one file only MUST stay there.
  ```
- Why: `core` §Design principles requires SSOT, but no `retro` class catches a breach;
  each copy costs tokens and the copies drift apart.
- Evidence needed: a session where two loaded files stated one rule, and the copies cost
  tokens or disagreed.
