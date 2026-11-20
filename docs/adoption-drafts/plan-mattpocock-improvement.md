# plan ← mattpocock (improvement)

Sources:
- https://github.com/mattpocock/skills `skills/engineering/codebase-design/DESIGN-IT-TWICE.md` @5863806 (MIT)
- https://github.com/mattpocock/skills `skills/engineering/codebase-design/DEEPENING.md` @5863806 (MIT)
- https://github.com/mattpocock/skills `skills/engineering/wayfinder/SKILL.md` @5863806 (MIT)
- https://github.com/obra/superpowers `skills/brainstorming/SKILL.md` ("Lay out the approaches") @22f0b46 (MIT; merged from `plan-superpowers-improvement`)

Status: draft, not adopted

## What it brings

For a new module interface, three planners design it in parallel under different goals,
and main session compares them. This gives the design choice real options in place of
one draft. A strategic open-points list keeps in-scope questions that are not yet sharp
enough to be a milestone.

## Cons

- Change 1 costs three spawns; it fits only a new interface that later work builds on.
- The source's "most flexible" designer is dropped: it works against `core` YAGNI.
- Wayfinder's tracker mechanics (claim first, ready task, second-pass edges, names over
  ids) are already in `plan` §Levels and `core` tracker rules; only the open-points idea
  is new.
- `plan` is at its `max-lines` cap (374).

## Proposed changes

### 1. Design the interface three ways

- Target: `plan-draft` §Drafting (add bullet)
- Text:
  ```
  - When a task adds a module interface that other items or callers build on, main
    session SHOULD spawn three planners at once before the draft (`delegate` §Models row
    6). Each brief MUST hold the same constraints and the dependency kind: in-process,
    local stand-in, owned remote (port and adapter) or third party (mock adapter). Each
    MUST add one design goal: smallest interface, most common caller first, or ports and
    adapters at the seam.
  - Each planner MUST return the interface with its error modes, one caller example, what
    it hides, and its trade-offs. Main session MUST compare them by depth, locality and
    seam place, and put the choice to user with 2–3 options. Done when user chose a design
    or a hybrid.
  ```
- Why: the planner drafts one design, so the tech quiz rarely sees a real alternative
  interface.
- Evidence needed: an interface that a later task had to rework, where a second design
  was findable at plan time; or an eval where three designs beat one draft on review
  findings.

### 2. Strategic open points

- Target: `plan` §Levels (add bullet, after "Strategic run MUST have no testable item")
- Text:
  ```
  - A strategic run SHOULD keep, under `<docs>/DESIGN.md` §Open, each in-scope question
    not yet sharp enough to become a milestone. Each later strategic run MUST turn each
    open point it can state as a goal into a milestone, and delete it from §Open. Done
    when no open point can yet be stated as a goal.
  ```
- Target: `requirements` `templates/strategic.md` (add section after Milestones)
- Text:
  ```
  ## Open

  Format: `- <question> : <what it waits on>`, or `No open item.`
  ```
- Why: armory's own `docs/DESIGN.md` keeps a §Open section, but the template and the
  skill do not, so other projects lose questions that are not yet milestones.
- Evidence needed: a strategic run that dropped a known but vague question, which a later
  run had to find again.
