# ui-design (new skill)

Sources:
- https://github.com/gsd-build/get-shit-done `commands/gsd/ui-phase.md`, `agents/gsd-ui-researcher.md`, `agents/gsd-ui-checker.md`, `get-shit-done/templates/UI-SPEC.md` @bdcaab2 (MIT)
- https://github.com/affaan-m/everything-claude-code `skills/frontend-design-direction`, `skills/design-system`, `skills/accessibility` @3f14a10 (MIT)
- https://github.com/rampstackco/claude-skills `skills/design-standards/` @9d281db (MIT)
- https://github.com/uxKero/anydesign `SKILL.md` @d81bd89 (MIT)
- https://github.com/wholiver/swiftui-design-skill `SKILL.md` @2c82638 (MIT)
- https://github.com/anthropics/skills `skills/frontend-design/SKILL.md` @e4bb5d9 (Apache-2.0)

Status: draft, not adopted

All text is paraphrase; no source text is copied.

## What it does
Sets the design direction and writes a UI contract before any frontend code: tokens, type roles,
color roles, contrast floor, the states of each surface and its key copy. A check gives each
contract field PASS, FLAG or BLOCK before the plan goes to approval.

## What it brings to armory
Armory has no UI design rules; `implement` §The smallest complete change names accessibility only
as a never-cut item. This skill gives `plan` a contract to write `TR` items from, and gives
`design-qa` a standard to check the built UI against. `plan` §Before the plan and §Quizzes would
point to it.

Split with `design-qa`: `ui-design` runs before the code and writes the contract; it renders and
checks nothing. `design-qa` runs after the code and checks the rendered UI against that contract.

Evidence needed: a session where a UI task shipped with missing states, ad-hoc colors or spacing,
or a contrast failure that a contract would have named.

## Cons
- Overlaps the host's own frontend design plugin skill on taste and on triggering. This draft
  keeps taste out and holds only the checkable contract.
- Frontend projects only. Dead weight elsewhere, unless the description keeps it from loading.
- GSD's checks are Tailwind and shadcn greps; this draft keeps only stack-neutral rules.
- A project-wide contract file is a new docs file; it must stay the one source of tokens (SSOT).

## Fit
- Invocation: model-loaded. `plan` loads it when a task adds or reshapes a visible surface; the
  user may also ask for a UI spec directly.
- Hooks into:
  - `plan` §Before the plan: add "A task that adds or reshapes a visible UI surface MUST load
    `ui-design` before the tech quiz."
  - `plan` §Quizzes: tech quiz topics gain "UI contract" when `ui-design` applies.
  - `design-qa` §Contract reads the contract this skill writes.
- Size: 61 lines.

## Draft SKILL.md

````markdown
---
name: ui-design
description: >
  UI design contract before frontend code: direction, design tokens, type and color roles,
  contrast floor, states and key copy of each surface, and a contract check. Use for "design
  the UI", "UI spec", "design tokens", and from `plan` when a task adds or reshapes a visible
  surface.
max-lines: 61
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` first when its rules are not in your context.

# ui-design

Main session runs it during `plan`, before the tech quiz. It writes the contract; it builds and
renders nothing. `design-qa` checks the built UI against this contract.

## 1. Direction

- When the repo already has a design system or a styled surface, MUST have an agent extract it
  (tokens, components, layout rules) into the contract, and MUST NOT invent new tokens. Done
  when each extracted value names the file it came from.
- With no existing design, the business quiz MUST ask: purpose of the surface, audience, tone,
  one detail users should remember, and constraints (brand, platform, stack).
- Then main session SHOULD offer 2–3 distinct directions, each with a one-line visual anchor,
  and let user pick before the contract. Done when user has picked one.

## 2. Contract

- Contract MUST live in `<docs>/ui-contract.md`, one per project. A plan MUST name its fields
  by section, never copy values.
- Contract MUST hold these fields:
  - design system: component library and icon set, or `none`;
  - spacing: one base unit and its scale, such as multiples of 4;
  - type: 3–4 roles (body, label, heading, display), each with size, weight and line height;
    at most 2 weights;
  - color: dominant, secondary, accent and destructive roles; accent MUST name the exact
    elements that use it;
  - contrast floor: WCAG AA, 4.5:1 for body text, 3:1 for large text and UI parts;
  - states: per surface kind, the states it MUST build (below);
  - copy: text for the primary action, empty state, error state and destructive confirm.
- Required states per surface kind:
  - data view: loading, empty, error, partial, success;
  - form: idle, busy, invalid, submitted, error;
  - action: enabled, disabled, busy, destructive confirm;
  - any surface behind a permission: denied.
- Copy MUST say the action as verb and noun. Generic labels ("Submit", "OK") MUST NOT be used;
  name what the action does instead.
- A hard-coded value outside the contract MUST be a `tech-debt:` marker (`implement` §The
  smallest complete change) or a contract change.
- Done when each field holds a value, or `none` with its reason.

## 3. Contract check

- Before the plan proposal, main session MUST give each field of §Contract one verdict: PASS,
  FLAG (a gap user may accept) or BLOCK (missing or self-contradicting).
- A BLOCK MUST go to one more quiz round. A FLAG MUST go to the proposal with user's answer.
- Each testable contract item a task builds (a state, a copy text, a contrast pair) MUST
  become a `TR` (`plan` §Requirements), checked by `design-qa`.
- Done when no field has BLOCK and each built state has its `TR`.
````
