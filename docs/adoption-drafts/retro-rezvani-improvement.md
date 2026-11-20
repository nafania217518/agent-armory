# retro ← rezvani (improvement)

Sources: https://github.com/alirezarezvani/claude-skills `engineering/skills/agent-run-forensics/SKILL.md`, `engineering/skill-retro/skills/skill-retro/SKILL.md` @f8593c4 (MIT)
Status: draft, not adopted

## What it brings

Evidence discipline for `retro` findings: each item is labeled recorded or inferred, and
an agent's report of its own work is a claim to check. It also adds a filing bar for a
finding that adds a rule.

The past-session and multi-session mode lives in `retro-superpowers-improvement`; this
file adds only what that file lacks.

## Cons

- The claim check needs exit codes and file writes in the record. A current-session
  retro sees them only when they stayed in context.
- Not taken: per-skill grades from scoring rubrics, the weighted overall score and the
  HTML report. Armory acts on findings, not on a grade, and the reads cost many tokens.
- Not taken: "zero suggestions is a valid result". `retro` §After the list already says
  "No finding: MUST say so".
- `retro` is at `max-lines: 86`; these changes add about 8 lines.

## Proposed changes

### 1. Recorded and inferred evidence
- Target: `retro` §3 Findings (add bullet after the field list)
- Text:
  ```
  - Each evidence item MUST be labeled `recorded`, when the session or transcript shows
    it, or `inferred`, when a named rule derives it (a read before a write, a retry after
    a failure). An agent's own stated reason MUST count as a claim, never as the cause.
  ```
- Why: today a finding may rest on an agent's own account of why it acted, which is not
  proof.
- Evidence needed: a retro finding whose cause was an agent's stated reason that the
  record contradicts.

### 2. Claim check before a finding rests on a report
- Target: `retro` §1 Scope (add bullet before "Done when")
- Text:
  ```
  - Before a finding rests on an agent's report that it ran, passed, edited or did not
    edit something, MUST check that claim against the session's record. A pass MUST
    count as stale when a file changed after the run. A pass MUST count as partial when
    its exit code came from the last command of a pipe or `;` chain.
  ```
- Why: an agent's summary can claim a pass that the record does not hold.
- Evidence: rezvani survey, local run, bash, 2026-11-18: `false | tail` exits 0, and
  with `pipefail` it exits 1. A gate piped through `tail` therefore reports a pass on a
  failure. The survey links this trap to `implement` §Gates per commit.

### 3. Filing bar for rule findings
- Target: `retro` §3 Findings (add bullet before "Done when")
- Text:
  ```
  - A finding that adds or tightens a rule MUST pass this bar: a competent agent with the
    current text would still fail this way. A finding that fails the bar MUST be
    dropped.
  ```
- Why: a rule for a one-off slip grows skills with no gain. AGENTS.md already requires an
  observed failure for each new rule; the bar tests that the failure is the text's fault.
- Evidence needed: a retro finding that proposed a rule for a slip the current text
  already prevents.
