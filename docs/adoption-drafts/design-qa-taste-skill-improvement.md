# design-qa ← taste-skill (improvement)

Sources:
- https://github.com/Leonxlnx/taste-skill `skills/taste-skill/SKILL.md` (§5 Checklist, §6 Never) @f6b7657 (MIT)
- https://github.com/Leonxlnx/taste-skill `skills/taste-skill/references/gate.md` (checker-gaming), `references/system.md` (Access), `references/copy.md` (What may be assumed), `references/motion.md` (Reduced motion) @f6b7657 (MIT)
- https://www.w3.org/TR/WCAG22/ (W3C Recommendation, 2024-12-12): 2.2.2, 2.5.5, 2.5.8, 3.3.1

Status: draft, not adopted

All text is paraphrase; no source text or script is copied.

## What it brings

The source checks built pages with over 100 browser checks. Six catch faults that the
`design-qa` draft misses:
- a success message with no real send behind it;
- invented proof that looks real (quotes, ratings, figures);
- page code that hides faults from a headless checker;
- content that stays hidden when motion is off;
- auto-moving content with no pause;
- elements that overlap at a narrow width.

## Cons

- `design-qa` is itself a draft, not adopted; this draft waits on it.
- Adds 8 lines; the `design-qa` cap goes from 64 to 72.
- The source's 44 px tap target is WCAG 2.5.5, Level AAA. This draft keeps the AA
  floor of 24 px (2.5.8) that `design-qa` §4 already sets.
- Dropped: business-kind routing, dealt palettes and heroes, effects, photo and icon
  scripts, and the section-per-screen and equal-edge rules. They are taste for
  marketing sites; the host's frontend design skill and `ui-design` §1 hold direction.
- Dropped: the Stop-hook finish gate with rounds and waivers. `code` §3 already asks
  the user before a third round. The 2026-11-02 DESIGN decision dropped a guard hook
  because the prose rule held. A skill's Stop hook also fires on each later stop in
  the session.

## Proposed changes

### 1. Faults that look done

- Target: `design-qa` §2 Finish checks (add bullet after the first bullet)
- Text:
  ```
  - Each of these MUST also be a Must fix finding: a success message shown before or
    without a real send; on a shipped page, a review, quote, rating, customer name or
    figure that no brief, plan or named fixture gives; page code that tests for an
    automated browser (a webdriver flag, a headless user agent) and changes what renders.
  ```
- Why: the inert-control bullet catches a handler that does nothing. It misses a
  handler that shows success with no send, text that looks real but is invented, and
  code that renders one way for the checker and another for users.
- Evidence needed: a UI change that passed review with a fake confirmation, an invented
  figure or quote, or a branch on an automated-browser flag.

### 2. Rendered checks for motion, overlap and errors

- Target: `design-qa` §4 Rendered checks (change one list item, add three)
- Text, change:
  ```
    - content reflows at 320 px with no horizontal scroll and no element over another;
  ```
- Text, add after "color is never the only signal":
  ```
    - content that an entrance or scroll animation hides shows at once with reduced
      motion set;
    - content that moves on its own for more than 5 seconds beside other content has a
      pause, stop or hide control (WCAG 2.2.2);
    - an input error names its field and the fault in text (WCAG 3.3.1).
  ```
- Target: `design-qa` frontmatter and §Fit: `max-lines: 64` → `max-lines: 72`;
  `Size: 64 lines` → `Size: 72 lines`.
- Why: a reveal-on-scroll section that never runs leaves content blank. The source
  found faults in 8 of its own hero demos where rows lay over the next section on a
  phone (`CHANGELOG.md` 2.5.1). WCAG 2.2.2 and 3.3.1 are Level A, under the AA bar
  that `design-qa` already sets.
- Evidence needed: a UI change that passed review with content hidden under reduced
  motion, overlapping elements at 320 px, or an error with no field named.
