# handoff (new skill)

Sources: https://github.com/mattpocock/skills `skills/productivity/handoff/SKILL.md`, `skills/in-progress/claude-handoff/SKILL.md` @5863806 (MIT)
Sources: https://github.com/gsd-build/get-shit-done `get-shit-done/workflows/pause-work.md`, `get-shit-done/templates/continue-here.md`, `get-shit-done/workflows/resume-project.md` @bdcaab2 (MIT)
Sources: https://github.com/alirezarezvani/claude-skills `engineering/handoff/skills/handoff/SKILL.md` @f8593c4 (MIT; derived from mattpocock)
Sources: https://github.com/wshobson/agents `plugins/skill-forge-essentials/skills/session-guard/SKILL.md` (compaction re-anchor part) @9c61ab2 (MIT)
Sources: https://github.com/obra/superpowers `skills/subagent-driven-development/SKILL.md` (progress ledger part) @22f0b46 (MIT)
Status: draft, not adopted

## What it does

Main session writes a short note of pointers so a fresh session can resume paused work,
and a resumed or compacted session re-anchors on files and git, not on memory.

## What it brings to armory

- Armory has no pause or resume path outside `triage` §Resume. A session that runs out
  of context loses run state that no file holds: plan step n of m, running agents,
  worktrees, decisions not yet in the plan, mistakes made.
- No rule says what to do after a compaction. superpowers reports that controllers that
  lost their place re-ran whole finished task sequences, its most costly failure seen
  (source evidence, not armory evidence).
- Would point to it: `core` (one re-anchor pointer line, since `core` is the text the hook
  re-injects after a compaction),
  `code` §Running the plan (ledger line), `dnd` (a handoff before a long unattended run
  MAY help).
- Evidence needed: an armory session that lost run state at a compaction or a context
  limit, or a retro finding of that kind. The ledger rule (§Progress ledger) needs its
  own: a code run of 3+ items that re-briefed a merged item.

## Cons

- Plan file, task reports, git and the tracker hold most of the state. The note MUST
  stay pointers only, or it becomes a second copy of the truth (SSOT).
- The re-anchor rule only works when an always-loaded text points to it; that needs one
  line in `core`, which is near its size cap (`docs/research/skills-best-practices.md`
  §5 item 5).
- The ledger adds one write per merged item.
- Dropped: mattpocock's "start a background session seeded with the note" (host-specific
  command; YAGNI); GSD's YAML frontmatter and blocking-constraint parsing (no consumer in
  armory); session-guard's tool-call-count zones (unsourced numbers).

## Fit

- Invocation: model-loaded. The `core` pointer must reach it after a compaction, and
  "resume from the handoff note" must trigger it in a fresh session.
- Hooks into: `core` §Tools and background tasks gains "After a context compaction, main
  session MUST follow `handoff` §Re-anchor before its next action."; `code` §Running the
  plan gains the §Progress ledger pointer.
- SessionStart fires again after auto and manual compaction, with `source: "compact"`
  (host hooks reference, read 2026-11-18, Claude Code 2.1.274). `hooks/hooks.json` sets no
  matcher, so the hook runs then and `core` comes back by the hook. Re-anchor therefore
  targets only what the hook does not restore: the run's skill and plan file. PreCompact
  stdout only steers the summary and PostCompact cannot inject context.
- Open item: confirm that SessionStart (compact) output survives in context. A live probe
  could not run, because child `claude -p` sessions here are not logged in. Manual probe
  for the user:
  1. Make a temp git repo with a no-matcher SessionStart hook that prints
     `PROBE-TOKEN-7731 source=<source>` and appends the same line to a log file.
  2. Run `claude -p "say hi" --output-format json </dev/null`.
  3. Run interactive `claude --resume <id>`, then `/compact`.
  4. Ask the model to quote any PROBE-TOKEN line. Check that the log shows
     `source=compact`.
- Size: about 75 lines.

## Draft SKILL.md

```markdown
---
name: handoff
description: >
  Pause and resume work across sessions: write a pointer note a fresh session resumes
  from, keep a progress ledger in long runs, and re-anchor after a context compaction.
  Use for "/handoff", "pause this", "hand off to a fresh session", "resume from the
  handoff note".
max-lines: 75
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` first when its rules are not in your context.

# handoff

Main session writes and reads the note itself, since it holds the run state; this is a
write this skill names (`core` §Tools and background tasks).

## 1. Note

- Note MUST live in a `mktemp -d` folder outside the repo. Main session MUST give user
  its path.
- Note MUST hold these parts, each only when it applies:
  - goal of the next session (from user's words, else from the plan);
  - state: plan file path, step n of m from host's task list, task branch and its last
    commit;
  - running work: each worktree, agent and tracked background task, with its state;
  - decisions this session made that no file holds yet, each with its reason;
  - blockers, each with what it waits on;
  - mistakes the next session must not repeat, each with the guard that prevents it (a
    check, a rule, a step), not only a warning;
  - skills to load, by name;
  - one exact next action.
- Note MUST point to plan file, commits, tracker items and reports by path, SHA or link.
  It MUST NOT copy their text; it MUST point to it instead.
- Note MUST hold no secret, key, token or personal data. It MUST name where the value
  lives instead.
- Done when the note holds each part that applies, and user has its path.

## 2. Resume

- Resuming session MUST load each skill the note names, then check the note against git
  and the tracker: branch exists, last commit matches, items have the noted status.
- Where note and git or tracker differ, git and tracker MUST win. Main session MUST tell
  user each difference.
- After resuming, main session MUST delete the note.
- Done when each noted fact is checked, each difference is told, and the note is gone.

## 3. Re-anchor

- After a context compaction, the hook restores `core` but not the run's skill or plan
  file. Main session MUST re-load the skill of its run, re-read plan file and run
  `git log --oneline <base>..<task-branch>` before its next action.
- It MUST restate step n of m (`core` §Writing and questions) from those two, and from
  the ledger when one exists. Memory of earlier turns MUST NOT override them; on a
  conflict, files and git win.
- An earlier decision it cannot find in a file MUST become a question to user, not a
  guess.
- Done when step n of m is restated from files and git.

## 4. Progress ledger

- In a code run of 3 or more plan items, main session SHOULD keep a ledger in the note's
  folder: one line per item with its id, commit range and status (`briefed`, `merged`,
  `done`).
- Main session SHOULD update the ledger at each merge into the task branch, before the
  next brief.
- Done when each merged item has its ledger line.
```
