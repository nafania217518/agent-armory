# retro ← claude-code-tips (improvement)

Sources: https://github.com/ykdojo/claude-code-tips `skills/review-claudemd/SKILL.md` @577ac89 (no licence found, all rights reserved: ideas only, no text taken); https://github.com/mhattingpete/claude-skills-marketplace `productivity-skills-plugin/skills/conversation-analyzer/SKILL.md` @b5b34bc (Apache-2.0); https://github.com/ComposioHQ/awesome-claude-skills `developer-growth-analysis/SKILL.md` @be2a406 (Apache-2.0)
Status: draft, not adopted

## What it brings

A batch form of the past-session mode: the last N sessions of a project, cut to user and
agent text, read in batches by readers that also hold the context files. It adds two
finding kinds that only show across sessions: a repeated manual task, and a context line
no session used.

The past-session mode itself lives in `retro-superpowers-improvement`; this file adds
only the batch form and its finding kinds.

## Cons

- Read cost grows with N; 15 sessions of a busy project can be large.
- Transcripts of many sessions hold more secrets and personal data than one.
- "A context line no session used" is hard to prove: absence of use in N sessions is weak
  evidence.
- Not taken: vague user requests (a retro finding must name a file to change), time-of-day
  and project-share statistics, and the learning-resource and chat-delivery steps.
- `retro` is at `max-lines: 86`; these changes add about 10 lines.

## Proposed changes

### 1. Last-N batch form
- Target: `retro` §1 Scope (add bullets after the past-session mode bullets of
  `retro-superpowers-improvement` change 2)
- Text:
  ```
  - Past-session mode MAY take the last N sessions of the project instead of named ones.
    N SHOULD default to 15 and MUST leave out the current session.
  - Each reader MUST first copy only user and agent text of its transcripts into its own
    temp folder (`core` §Tools and background tasks), and read only that copy.
  - Readers MUST get batches of about equal total size. Each reader MUST also get project
    context and user's global context file.
  ```
- Why: a miss that recurs across sessions is invisible to a one-session retro.
- Evidence needed: a miss seen in two or more sessions that no single retro reported.

### 2. Repeated manual task
- Target: `retro` §2 Finding classes, class "Tool economy" (replace its "Use when"
  sentence)
- Text:
  ```
  - Tool economy. Use when a cheaper call, model row or tool could replace a costly tool
    call or spawn, or when user asks for the same manual task in two or more sessions.
    The change for a repeated task: a skill, script or project command.
  ```
- Why: a task the user types by hand each session costs a round each time; only a
  multi-session read shows it.
- Evidence needed: one manual task the user asked for in two or more sessions.

### 3. Rule that exists but was not followed
- Target: `retro` §2 Finding classes, class "Checks and review rules" (add sentence at end)
- Text:
  ```
    A miss against a rule that already exists MUST get a rewording of that rule or a
    check, not a second copy of the rule.
  ```
- Why: across sessions the most common correction is a broken existing rule; a new copy
  breaks SSOT (`core` §Design principles).
- Evidence needed: a retro finding that proposed a rule the target file already held.

### 4. Context line no session used
- Target: `retro` §2 Finding classes, class "Context size and no-op lines" (add sentence
  at end)
- Text:
  ```
    In a batch of sessions, a line of project context or user's global context file that
    no session step relied on MAY be a Low finding.
  ```
- Why: dead context lines cost tokens in every session.
- Evidence needed: a context line that a batch read shows unused, and that the user
  agrees to delete.
