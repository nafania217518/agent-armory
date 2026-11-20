# core ← wshobson (improvement)

Sources: https://github.com/wshobson/agents `plugins/skill-forge-essentials/skills/session-guard/SKILL.md` @9c61ab2 (MIT)
Status: draft, not adopted

## What it brings

Re-anchoring inside one session: after the host compacts context during a code run, the
main session re-loads its run's skill and re-reads the plan file before the next step.
Pause and resume across sessions belong to the `handoff` draft.

## Cons

- The target is `code`, not `core`, despite the file name. `core` is at 9,850
  characters, and the host drops hook context over 10,000 characters
  (`docs/caveats/core-and-cards.md`). A `core` rule would push subagent injection over
  that limit.
- Re-loading a skill injects its full text again (`docs/caveats/core-and-cards.md`), so
  the rule fires only after a compaction, never each turn.
- SessionStart fires again after auto and manual compaction, with `source: "compact"`
  (host hooks reference, read 2026-11-18, Claude Code 2.1.274). `hooks/hooks.json` sets no
  matcher, so the hook runs on every source and `core` comes back by the hook. The run's
  own skill and plan are not re-injected, so the rule below targets only those two.
  PreCompact stdout only steers the summary and PostCompact cannot inject context, so
  only SessionStart (compact) can bring `core` back.
- Open item: confirm that SessionStart (compact) output survives in context. A live probe
  could not run, because child `claude -p` sessions here are not logged in. Manual probe
  for the user:
  1. Make a temp git repo with a no-matcher SessionStart hook that prints
     `PROBE-TOKEN-7731 source=<source>` and appends the same line to a log file.
  2. Run `claude -p "say hi" --output-format json </dev/null`.
  3. Run interactive `claude --resume <id>`, then `/compact`.
  4. Ask the model to quote any PROBE-TOKEN line. Check that the log shows
     `source=compact`.
- The source's claims about what survives a compaction cite no source and are not used.
- Not taken: tool-call thresholds (40, 60) for a split. They cite no measure, and a split
  into a new session is `handoff`'s.
- Not taken: a re-anchor rule for `plan` runs and for subagents. No failure is known
  there yet.

## Proposed changes

### 1. Re-anchor after compaction in a code run
- Target: `code` §3 Running the plan (add bullet at end)
- Text:
  ```
  - After host compacts context during a run, main session MUST re-load `code` and
    re-read plan file before its next step. A decision it recalls only from before the
    compaction MUST be found in plan file, owning doc or task list before it acts on it;
    when none holds it, main session MUST ask user. Done when the turn's step n of m
    (`core` §Writing and questions) matches plan file.
  ```
- Why: a compaction summary can drop skill rules and plan details; the main session then
  acts on a lossy memory. Naming the read here also makes it a read case that `core`
  §Tools and background tasks allows.
- Evidence needed: a code run where the main session skipped, repeated or misordered a
  plan step, or broke a `code` rule, after a compaction.
