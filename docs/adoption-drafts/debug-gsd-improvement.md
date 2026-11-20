# debug ← get-shit-done (improvement)

Sources: https://github.com/gsd-build/get-shit-done `get-shit-done/templates/DEBUG.md`, `get-shit-done/references/common-bug-patterns.md`, `agents/gsd-debug-session-manager.md` @bdcaab2 (MIT)
Status: draft, not adopted

## What it brings
A re-spawned debugger learns which hypotheses an earlier run refuted, and how, so it does not test them again.

## Cons
- Not proposed: the source's session file (symptoms, current focus, eliminated list, evidence log, resolution). An armory debugger report already lists hypotheses with verdicts (debugger card, report item 3). A context reset inside one run is the scope of the planned `handoff` skill.
- Merged: the bug-pattern scan goes into `debug-wshobson-improvement` change 1. Its six categories cover the source's classes (null, off-by-one, async, shared state, import, coercion, env and config, data shape, regex, swallowed errors) without their JS slant.
- Change 1 edits an agent card template; `docs/caveats/core-and-cards.md` applies before that edit.
- `debug` is at its `max-lines` cap (102); each added line needs a raise.

## Proposed changes
### 1. Refuted hypotheses carry their disproof
- Target: `debug` §Probes (replace bullet "MUST test your own ranking and record a verdict"), and report item 3 of the debugger card `skills/setup/templates/agents/debugger.md`
- Text (debug): `- MUST test your own ranking and record a verdict for each hypothesis: confirmed, refuted or untested. A refuted hypothesis MUST name the probe and the result that refuted it. Done when one hypothesis is confirmed. When all are refuted, MUST go back to §Hypotheses.`
- Text (card item 3): `3. Hypotheses in rank order, each with its verdict; each refuted one with the probe and result that refuted it.`
- Why: a bare "refuted" cannot be checked, and a later debugger cannot tell whether the probe was sound.
- Evidence needed: a re-spawned or second debugger that re-tested a hypothesis an earlier report had refuted.
- Note: when `debug-wshobson-improvement` change 2 (inconclusive verdict) is also adopted, merge both into one bullet.

### 2. Skip refuted hypotheses on a re-spawn
- Target: `debug` §Hypotheses (add bullet)
- Text: `- When the brief lists hypotheses an earlier debugger refuted, MUST NOT rank them again unless new evidence contradicts the named disproof; MUST name that evidence instead. Done when each re-ranked hypothesis cites its new evidence.`
- Why: a fresh debugger starts cold and re-runs the cheapest probes, which the earlier run already ran.
- Evidence needed: same as change 1.
- Note: the brief must carry the earlier report's hypotheses for this to work. That needs a matching bullet in `delegate` §Re-spawn and retry, outside this draft.
