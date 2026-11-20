# plan ← ecc (improvement)

Sources:
- https://github.com/affaan-m/everything-claude-code `skills/change-impact/SKILL.md` @3f14a10 (MIT)
- https://github.com/affaan-m/everything-claude-code `skills/council/SKILL.md` @3f14a10 (MIT)
- https://github.com/affaan-m/everything-claude-code `skills/architecture-decision-records/SKILL.md` @3f14a10 (MIT)
- https://github.com/affaan-m/everything-claude-code `skills/context-and-decisions/SKILL.md` @3f14a10 (MIT, own licence file by Matt Pocock)
- https://github.com/wshobson/agents `plugins/documentation-generation/skills/architecture-decision-records/SKILL.md` @9c61ab2 (MIT; change 3 only, merged from `plan-wshobson-improvement`)

Status: draft, not adopted

## What it brings

Release items for a risky task: rollback, compatibility window, deploy order and effects
that cannot be undone, as Risks lines that block the proposal when missing. An optional
dissent step for a hard-to-reverse intent point. A rule that an old decision line stays
and a new one supersedes it.

## Cons

- Change 1 partly overlaps `implement` §1 scope list and the expand–contract bullet of
  `plan` §The plan.
- Change 2 costs up to three spawns. Its lenses are no basis on the `research` ladder; they
  only shape the options and message text.
- Full ADR files are not proposed: they would split one fact between `<docs>/DESIGN.md`
  §Decisions and an ADR folder (`core` SSOT).
- The post-code check of change-impact (diff against declared scope, leftover compat code)
  is not proposed: `review` already reports a `TR` with no `BR` as scope creep, and
  expand–contract already ends with a remove step.
- `plan` is at its `max-lines` cap (374).

## Proposed changes

### 1. Release items for a risky task

- Target: `plan` §The plan (add bullet, after the expand–contract bullet)
- Text:
  ```
  - A task that changes a stored data shape, a public interface, auth or a deploy step
    MUST hold four Risks lines: its rollback step, its compatibility window, its deploy
    order, and each effect that a rollback cannot undo. Each line MUST name its `TR` or
    the quiz answer that accepts it. A missing line MUST block the proposal.
  ```
- Target: `plan-draft` §Task check (add line)
- Text:
  ```
    - A task that §The plan's release bullet names holds its four Risks lines.
  ```
- Why: Risks lines today hold only the risks the run happens to find; nothing asks for
  rollback or a compatibility window on a migration or interface change.
- Evidence needed: a merged task with a data or interface change whose rollback or deploy
  order was unplanned, and the rework it caused.

### 2. Dissent before a hard-to-reverse intent point

- Target: `plan` §Quizzes (add bullet, after the research bullet)
- Text:
  ```
  - For an intent point with no basis 1 or 2 (`research` §When to research) and an
    outcome that is hard to reverse, main session MAY spawn three planners at once
    (`delegate` §Models row 7). Each brief MUST hold only the question, its constraints
    and one lens: skeptic (challenge the premise), pragmatist (least work), critic (how it
    fails).
  - Before it reads their reports, main session MUST write its own recommendation and its
    main risk. The question's message text MUST then show the strongest dissent, and say
    when a lens changed the recommendation. The basis of the recommendation stays as
    `research` sets it.
  ```
- Why: main session drafts the options after a long quiz, so its first view anchors the
  question; nothing forces a dissent into view.
- Evidence needed: a hard-to-reverse choice that user later reversed, where a dissent was
  findable at quiz time.

### 3. A later decision supersedes; it never edits

- Target: `plan` §Levels (add bullet, after "Strategic run SHOULD add a decision line
  only")
- Text:
  ```
  - A decision that reverses or narrows an earlier decision line MUST get its own new
    dated line, which names the old line by its date and first words. The old line MUST
    keep its text, with the mark `(superseded <new date>)` at its end. Done when both
    lines carry the cross-reference.
  ```
- Target: `requirements` `templates/strategic.md` §Decisions (replace the format line)
- Text:
  ```
  Format: `- <YYYY-MM-DD>: <decision>. Dropped: <alternatives>.`, plus
  ` Supersedes <date> "<first words>".` when it reverses a line; a reversed line ends
  `(superseded <date>)`.
  ```
- Why: no rule says whether a changed decision edits its line or adds one, so the reason
  for the old choice can be lost.
- Evidence needed: a decision line in a `DESIGN.md` that was edited in place and lost its
  earlier reasoning; or a retro finding that a reader could not tell when a decision
  changed.
