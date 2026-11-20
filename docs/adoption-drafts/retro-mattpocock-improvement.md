# retro ← mattpocock (improvement)

Sources: https://github.com/mattpocock/skills `skills/engineering/retro/SKILL.md`, `skills/misc/setup-pre-commit/SKILL.md` @5863806 (MIT)
Status: draft, not adopted

## What it brings

A repo with no guardrail at all becomes a finding. Today `retro` flags only a check that
is off or broken, not one that exists nowhere.

## Cons

- Armory coders already run the gates per commit (`implement` §Gates per commit). A hook
  or CI job adds value for commits that skip that path, and costs a second run on agent
  commits.
- The rest of the source retro already matches `retro` §Finding classes; only this line
  is new.
- `retro` is at `max-lines: 86`; this change adds about 2 lines.

## Proposed changes

### 1. Missing guardrail is a finding
- Target: `retro` §2 Finding classes (replace bullet "Before class Checks and review
  rules, SHOULD read project context `## Gates` and `## Commands`.")
- Text:
  ```
  - Before class Checks and review rules, SHOULD read project context `## Gates` and
    `## Commands`. An existing check that is off or broken is then the finding. A repo
    where no pre-commit hook and no CI job runs the lint, type or test command is also a
    finding; its change is the cheapest guardrail for the stack.
  ```
- Why: a repo with no guardrail lets every mistake that a check could catch reach the
  base branch.
- Evidence needed: a project session where a mistake reached `<base>` that a pre-commit
  hook or CI job running an existing command would have caught.
