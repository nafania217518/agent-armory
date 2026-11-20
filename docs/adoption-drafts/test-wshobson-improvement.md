# test ← wshobson (improvement)

Sources: https://github.com/wshobson/agents `plugins/developer-essentials/skills/e2e-testing-patterns/SKILL.md` @9c61ab2 (MIT); https://github.com/lackeyjb/playwright-skill `skills/playwright-skill/SKILL.md` @dd47a6a (MIT) (selector order only)
Status: draft, not adopted

## What it brings
A selector rule and a test-data rule for every test that drives a UI or a real data store. `test` §Determinism has neither.

## Cons
- Dropped: "only critical user journeys at e2e level". `test` §Levels already says "main user journeys only".
- The two sources disagree on selector order: wshobson puts `data-testid` first, playwright-skill puts role and accessible name first. The draft takes the role-first order, since a role query also checks what the user sees.
- `test` is at its `max-lines` cap (137); each added line needs a raise.

## Proposed changes
### 1. Stable UI selectors
- Target: `test` §Structure and naming (add bullet after "An end-to-end step whose expected UI state equals previous step's")
- Text: `- A test that drives a UI MUST find each element by role and accessible name, then by label, then by visible text, then by a test id. It MUST NOT use a CSS class, a DOM path or a child index; when none of the four fits, MUST add a test id to the element instead.`
- Why: a class or DOM-path selector breaks on a style change that does not change behavior.
- Evidence needed: a UI test that went red after a style-only change.

### 2. Each test owns its data
- Target: `test` §Determinism (add bullet after "A test MUST be deterministic")
- Text: `- A test against a real data store MUST create the records it needs and remove them after, or run in a store or transaction no other test sees.`
- Why: "no mutable state shared between tests" does not say how a test against a real database gets there.
- Evidence needed: an integration, functional or e2e test that failed only when run after another test.
