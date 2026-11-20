# debug ← wshobson (improvement)

Sources: https://github.com/wshobson/agents `plugins/agent-teams/skills/parallel-debugging/SKILL.md` @9c61ab2 (MIT); https://github.com/wshobson/agents `plugins/developer-essentials/skills/debugging-strategies/SKILL.md` @9c61ab2 (MIT)
Status: draft, not adopted

## What it brings
Six fixed failure categories seed the hypothesis list, so the debugger does not anchor on its first idea. Two more probe outcomes: inconclusive, and a compound cause of two confirmed hypotheses.

## Cons
- Parallel debuggers (one per hypothesis) cost one spawn each; armory runs one debugger per bug today.
- The source's evidence grades (direct, correlational, testimonial, absence) are not proposed: an armory verdict comes from a probe run, which is direct evidence by design.
- `debug` is at its `max-lines` cap (102); each added line needs a raise.
- This file holds the category scan for three drafts: `debug-gsd-improvement` (bug-pattern classes) and `debug-rezvani-improvement` (config and env vars as a cause) point here.

## Proposed changes
### 1. Hypotheses from failure categories
- Target: `debug` §Hypotheses (add bullet after "MUST write 3–5 ranked hypotheses")
- Text: `- Before ranking, SHOULD check each failure category for a candidate: logic (wrong condition, off-by-one, missed case), data (null, wrong type or shape, encoding, overflow), state (race, stale cache, shared mutation, bad initial value), integration (contract mismatch, version skew, config or env var), resource (leak, exhausted pool or quota) and environment (missing dependency, platform, permission, time zone or locale). Done when the hypothesis list names the categories it checked.`
- Why: §Hypotheses says how many and in what form, but not where candidates come from; the first plausible idea wins.
- Evidence needed: a debug run whose first 3–5 hypotheses all sat in one category while the confirmed cause sat in another.

### 2. Inconclusive verdict
- Target: `debug` §Probes (replace bullet "MUST test your own ranking and record a verdict")
- Text: `- MUST test your own ranking and record a verdict for each hypothesis: confirmed, refuted, inconclusive or untested. Inconclusive means a probe ran but did not tell the prediction apart; MUST sharpen that probe and run it again before you move to a lower hypothesis. Done when one hypothesis is confirmed. When all are refuted, MUST go back to §Hypotheses and draw new ones from what the probes showed.`
- Why: today a probe that neither confirms nor refutes has no label, so it gets reported as refuted or untested.
- Evidence needed: a debugger report that marked a hypothesis refuted on a probe whose output did not contradict its prediction.

### 3. Compound cause
- Target: `debug` §Probes (add bullet after the verdict bullet)
- Text: `- When two hypotheses are confirmed and each changes the symptom alone, MUST report both as one compound cause; the fix MUST cover both. Done when the report names each part and the probe that confirmed it.`
- Why: "Done when one hypothesis is confirmed" stops the run at the first part of a two-part cause, and the fix then leaves part of the symptom.
- Evidence needed: a fix-flow run where the loop stayed red, or went flaky, after the fix of the first confirmed hypothesis.

### 4. One debugger per hypothesis (optional)
- Target: `delegate` §Briefs (add bullet)
- Text: `- For a bug whose top hypotheses each need a long probe, main session MAY spawn one diagnose-only debugger per hypothesis on the same loop commit. Each brief MUST name its one hypothesis. Main session MUST compare the verdicts before it starts a fix flow.`
- Why: probes that each take minutes run one after another today.
- Evidence needed: a measured debug run where probe time, not reasoning, took most of the wall time. Without it, YAGNI says drop this change.
