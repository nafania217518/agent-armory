# delegate ← cek (improvement)

Sources: https://github.com/NeoLabHQ/context-engineering-kit `plugins/sadd/skills/do-and-judge/`, `plugins/sadd/skills/do-competitively/`, `plugins/sadd/skills/judge-with-debate/` @23e2428 (GPL-3.0: ideas only, no text taken)
Sources: https://github.com/mhattingpete/claude-skills-marketplace `engineering-workflow-plugin/skills/ensemble-solving/` @b5b34bc (Apache-2.0)
Status: draft, not adopted

## What it brings

Fixed criteria for checking work that no `TR` covers, a retry after a misread of the task,
and an opt-in run of competing design drafts compared by fixed criteria.

## Cons

- For coding, the plan already fixes the criteria before the work: `TR`s and their
  `tests:` lines come from planner before any code. Change 1 covers only other work.
- Change 3 costs 3 to 4 extra spawns per choice, and overlaps the "2–3 approaches before
  the draft" idea of `plan-superpowers-improvement.md`.
- The source's separate criteria agent, one tier above the producer, is left out: in
  armory main session writes the brief's checks, so no extra spawn is needed.
- The rule that main session reads only the judge's verdict header is left out: `core`
  §Reports already limits report items.
- GPL-3.0 sources: the text below is new wording, from ideas only.

## Proposed changes

### 1. Fixed checks for work no TR covers

- Target: `delegate` §Briefs (add bullet, after "Any other brief (research, reading,
  writing) MUST hold its questions")
- Text:
  - When another agent checks work that no `TR` covers (a writer draft, a research
    report), its brief MUST hold the checks the producer's brief named, word for word,
    and the same checks MUST hold for each later round.
- Why: a checker that makes up its own criteria after it sees the work grades toward the
  work, and criteria that move between rounds never converge.
- Evidence needed: a writer or research check in an armory run whose criteria differed
  from the producer's brief, or changed between rounds.

### 2. A misread counts as a failed spawn

- Target: `delegate` §Re-spawn and retry (replace bullet "A spawn fails when it returns no
  report or a `stuck:` report")
- Text:
  - A spawn fails when it returns no report, a `stuck:` report, or a result that answers
    another task than its brief: a misread, not a missed detail. These MUST NOT count as a
    fail: a failing gate (`implement` §Gates per commit and `review` §The diff is the truth
    handle it); a `sources disagree` report (`research` §Sources), whose section sets where
    disputed questions go.
- Why: a misread result today goes to a fix round on the same model, which repeats the
  misread; the retry on Opus high is the fitting path.
- Evidence needed: an armory fix round that followed a misread result and failed the same
  way.

### 3. Competing design drafts

- Target: `plan` §Before the plan (add bullet, after the quiz bullet)
- Text:
  - When the tech quiz leaves two or more designs open and no basis (`research` §When to
    research) decides between them, main session MAY offer user competing drafts: 2 or 3
    planners each draft one design, then one fresh reviewer compares them against the
    criteria of the quiz answers, fixed before the drafts. One clear winner MUST become
    the recommended option; a split MUST go to user with each draft's score; all drafts
    below the criteria MUST send the choice back to the quiz. Done when user has picked
    one design.
- Why: a design choice with no basis today rests on one draft; a side-by-side draft makes
  the trade-off visible before approval.
- Evidence needed: a plan whose chosen design was redone later, where the other design was
  known at quiz time.
