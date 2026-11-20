# retro ← wshobson (improvement)

Sources: https://github.com/wshobson/agents `plugins/agent-orchestration/commands/improve-agent.md` @9c61ab2 (MIT)
Status: draft, not adopted

## What it brings

A fixed cause field for each `retro` finding, so findings of many sessions can be
counted by cause. It also adds two signals: a clarification request and an abandoned
task.

The blameless postmortem part of this survey row goes to the `incident` draft.

## Cons

- Overlaps §Finding classes: a class says where the fix goes, a cause says why the miss
  happened. Two labels per finding cost reader effort.
- The cause field pays off mainly across many sessions, so it depends on the past-session
  mode of `retro-superpowers-improvement`.
- User corrections, the third signal of the source, are already in the stumble list of
  `retro-superpowers-improvement` change 4.
- `retro` is at `max-lines: 86`; these changes add about 6 lines.

## Proposed changes

### 1. Cause field
- Target: `retro` §3 Findings (add field after "class")
- Text:
  ```
    - cause: SHOULD be one of misread instruction, output format, context loss, tool
      misuse, rule breach or edge case;
  ```
- Why: today findings carry no cause, so a cause that recurs across sessions stays
  hidden.
- Evidence needed: a multi-session retro where one cause recurs and grouping by cause
  changes which fix is chosen.

### 2. Clarification and abandonment signals
- Target: `retro` §2 Finding classes (add bullet before "Done when")
- Text:
  ```
  - MUST scan the session for two more signals: a question to user whose answer a file
    already held, and a task user stopped or dropped mid-run. The first MUST go to class
    Navigation and information access. The second MUST be checked against each class.
  ```
- Why: both signals cost a user round, yet show no error result, so a retro that looks
  for mistakes misses them.
- Evidence needed: a session with a needless question or a dropped task that its retro
  did not report.
