# plan ← gsd (improvement)

Sources:
- https://github.com/gsd-build/get-shit-done `agents/gsd-plan-checker.md` (Dimension 4, Dimension 7b) @bdcaab2 (MIT)
- https://github.com/gsd-build/get-shit-done `get-shit-done/references/spidr-splitting.md` @bdcaab2 (MIT; it credits Mike Cohn's SPIDR article)

Status: draft, not adopted

## What it brings

Two task-check lines: a `TR` must not quietly deliver less than its `BR`, and each new
part must be wired to its caller. A split method (SPIDR) beside vertical slices, for a
task or `TR` that holds more than one capability.

## Cons

- `plan` is the longest skill and is at its `max-lines` cap (374).
- The wiring line overlaps the wired check that `review-gsd-improvement` proposes for
  review; plan catches it before code, review after.
- The scope-cut word list is a hint, not a test; a cut in other words passes it.
- The threat register of this source is not here; the `threat-model` draft takes it.

## Proposed changes

### 1. No quiet scope cut

- Target: `plan-draft` §Task check (add line)
- Text:
  ```
    - No `TR` delivers less than the `BR` it traces to. Words such as "v1", "for now",
      "placeholder", "stub", "simplified", "later" or "too complex" mark a candidate. A
      cut `BR` is delivered in full, or goes to user as a split into a further task.
  ```
- Why: the task check asks that every `BR` has a `TR`, not that the `TR` meets the whole
  `BR`.
- Evidence needed: an armory plan whose `TR` met only part of its `BR` and passed
  self-review. The source cites one such incident in its own runs (a cost display planned
  as "static labels v1"), which is not armory evidence.

### 2. Each new part has a caller

- Target: `plan-draft` §Task check (add line)
- Text:
  ```
    - Each new part a `TR` adds that a caller must reach (route, command, handler,
      module, model) has a `TR` that connects it to that caller, or names the existing
      caller that reaches it.
  ```
- Why: the task check proves that named files exist and have an effect, not that new
  parts are reached.
- Evidence needed: a merged task with a part that no caller reached, found in review or
  later.

### 3. SPIDR split

- Target: `plan` §The plan (add bullet, after the vertical-slice bullet)
- Text:
  ```
  - A milestone task or `TR` that joins two capabilities with "and", serves more than one
    actor, or names a capability with no action SHOULD be split along one axis: spike (an
    unknown first), paths (happy path first), interfaces (one surface first), data scope
    (smallest first) or rules (simplest first). One split MUST use one axis. A split MUST
    NOT follow layers; each part MUST stay a vertical slice instead.
  ```
- Why: §The plan asks for vertical slices but gives no way to cut a slice that is too big.
- Evidence needed: a task that took several review rounds or a re-plan because it held
  two capabilities.
