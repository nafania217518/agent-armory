# design-qa ← impeccable (improvement)

Sources:
- https://github.com/pbakaus/impeccable `skill/agents/impeccable-finish-reviewer.md` (check 0), `skill/agents/impeccable-motion-reviewer.md` (check 0, Verdict Pass) @b49177d (Apache-2.0)
- https://github.com/pbakaus/impeccable `skill/reference/critique.md` (Assessment B), `skill/reference/polish.md`, `skill/reference/audit.md` (Responsive Design), `skill/reference/harden.md` (Verify Hardening) @b49177d (Apache-2.0)
- https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html (SC 2.5.7, Level AA)

Status: draft, not adopted

All text is paraphrase; no source text or script is copied.

## What it brings

Evidence rules for the rendered checks of the `design-qa` draft. A blank or wrong capture,
or a scan that finds nothing, no longer counts as a pass. Drag controls get the WCAG 2.2
AA check that the draft's list lacks. A rendered fix shows on a new capture, not on the
coder's word.

## Cons

- Changes a draft, so it applies only once `design-qa` is adopted.
- Change 3 needs a browser tool that can synthesize touch; without one, the gesture check
  stays unverified.
- Adds about 16 lines to a 64-line draft.
- Dropped: the source's 0–4 dimension scores and 20-point health score, for the reason
  `design-qa` gives for the GSD pillar score.
- Dropped: the source's craft-floor ban list (eyebrows, gradient text, glass, card grids).
  It is taste; `design-qa` grades taste as Nice to have only.
- Dropped: the critique rule that the judgment review ends before detector output enters.
  `design-qa` checks are pass or fail, so anchoring has little to bend.
- Dropped: the source's 62-rule detector and post-edit hook. It is the source's own tool;
  a project MAY bind it as a `lint` gate part through `setup`.

## Proposed changes

### 1. Valid captures first

- Target: `design-qa` §Rendered checks (add bullet after the capture bullet)
- Text:
  ```
  - Before any rendered check, each capture MUST be valid: it shows the surface and state
    its file name claims, at the width it names, with no blank, black or half-loaded
    region. An invalid or missing capture MUST be taken again; a check on it counts as
    unverified (§Verdict).
  ```
- Why: a check on a blank or wrong capture reads as a pass and hides the defect.
- Evidence needed: a UI review that passed on a capture of the wrong state, a loading
  frame or a blank region.

### 2. A clean scan passes only what it covers

- Target: `design-qa` §Verdict (add bullet after the unverified bullet)
- Text:
  ```
  - An automated scan with no findings MUST count as pass only for the checks it can
    judge. The report MUST name what the scan covered: URLs, widths and states. Focus,
    keyboard, reflow and name quality MUST still get their own rendered check.
  ```
- Why: an accessibility scanner judges no layout or focus order, yet an empty result
  reads as "clean".
- Evidence needed: a UI review that took an empty scanner result as proof for a check the
  scanner does not run.

### 3. Drag and touch gestures

- Target: `design-qa` §Rendered checks (add item to the check list)
- Text:
  ```
    - each action done by dragging also works with a single tap or click (WCAG 2.2
      SC 2.5.7), unless dragging is essential;
  ```
- Target: `design-qa` §Rendered checks (add bullet after the check list)
- Text:
  ```
  - A custom drag, slider or swipe control MUST be run with synthesized touch, a cancelled
    gesture included. Its result MUST name the evidence source: emulated viewport,
    synthesized touch or device. A capture at phone width proves layout, not a gesture.
  ```
- Why: the draft checks keyboard use but not single-pointer use, which is an AA criterion
  of its own. A mouse-only drag handler passes every check the draft has today.
- Evidence needed: a UI change with a drag or slider control that broke under touch, or
  had no tap alternative, and passed review.

### 4. Fixed only on a new capture

- Target: `design-qa` §Verdict (add bullet)
- Text:
  ```
  - On a re-review, a rendered finding MUST count as `fixed` (`review` §Output) only on a
    capture taken at or after the fix commit. The coder's report of the fix is not
    evidence.
  ```
- Why: the `review` re-review checks fixes in code; a rendered defect needs a new render
  to show it gone.
- Evidence needed: a re-review that marked a rendered finding fixed from the diff while
  the page still showed it.
