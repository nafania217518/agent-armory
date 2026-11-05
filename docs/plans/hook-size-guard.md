# Plan: Core hook size guard and trim

Parent: none (no milestone)

## Goal

The `core` hook output stays under the host cap with room for later rules.

Claude Code caps a hook's plain stdout and each JSON string field at 10,000
characters. Over the cap, the model gets a file path and a 2,000-character preview
(code.claude.com/docs/en/hooks). `scripts/core-context.sh` prints `core` for
SessionStart and SubagentStart. The installed plugin 0.2.1 is over the cap, so every
session and subagent sees only a 2 KB preview of `core`. Current `master` prints 9,998
characters, 2 under the cap. Step 1 (the guard) is done on branch `hook-size-guard`
(881f0d4). This plan covers the trim. No version bump (user's choice).

## Requirements

Format: `TR-<n> (<milestone>/BR-<m>, ...): MUST <behavior>`, then an indented `tests:`
line that names the tests, or `tests: none, <why>`.

- BR-1: The `core` hook output MUST stay at or under 10,000 characters for SessionStart
  and SubagentStart, and a gate MUST fail when it does not.
- BR-2: After one tightening pass with garbage removal, the `core` hook output MUST be
  at or under 9,000 characters. No rule moves out of `core`; every kept rule keeps its
  meaning and its RFC 2119 word.

- TR-1 (BR-1): MUST fail `unit` when either hook form is over 10,000 characters.
  tests: scripts/core-context.test.mjs (done, 881f0d4; fails on a padded `core`).
- TR-2 (BR-2): MUST apply the cut list below to `skills/core/SKILL.md`, set
  `max-lines` to the new count, and keep lines at or under 90 characters.
  tests: none, a one-time target; the review measures both forms with node (string
  length), not `wc -m`.
- TR-3 (BR-2): MUST make `docs/DESIGN.md` section 1 (lines 15-18, the preview
  statement) and the `AGENTS.md` 2 KB caveat match the new state; add one dated
  Decisions line.
  tests: none, prose; `lint` checks width and lists.

### Cut list (planner draft, Opus xhigh, all approved)

Class: a = the model does it by default; b = restates another home; c = stale;
d = filler; tighten = same rule, fewer words.

| Row | Class | Change | Saved |
|---|---|---|---|
| core:14-16 | d | delete the intro paragraph and its blank line | 112 |
| core:19-20 | d | drop ", a MUST rule included, because the user approved it" | 54 |
| core:22 | b | delete "The plan's Overrides section names each override (...)" (home: `plan` section The plan) | 76 |
| core:23 | b | "The agent MAY bypass a SHOULD rule for one task only, ..." (RFC 2119) | 21 |
| core:24-25 | d | delete "Section Reports records each bypass, ..." (core:110-111 holds it) | 93 |
| core:26 | b | delete "MAY is the agent's choice." | 27 |
| core:36 | d | drop "Before sending, " | 20 |
| core:47 | d | drop ", for a reader new to the code" | 30 |
| core:52 | d | drop "(a name, a description, a command)" | 35 |
| core:53-54 | d | "A subagent MUST report `stuck: <question>` instead." | 28 |
| core:56 | a | drop "; more questions MUST go in more calls" | 38 |
| core:63 | d | drop ", by stop tool, timer or any other means" | 40 |
| core:64 | b | delete "`code` section Task end checks only these kinds." | 51 |
| core:77 | d | drop "as simple as the task allows, " | 30 |
| core:86-87 | d | delete "Subagent models: `delegate` section Models." | 46 |
| core:93-95 | d | drop the caveat examples ": a changed default, ..., a limit" | 72 |
| core:115 | d | delete "A subagent MUST put each recorded item in its report." | 56 |
| core:130-131 | b | hook fallback: "Fallback: the pointer (`setup` section Install)." | 70 |
| core:134-135 | b | drop ", which Claude Code below 2.1.277 needs to load it" (home: README) | 52 |
| core:137-138 | d | drop the first "(`plan` section Levels)" | 24 |
| core:144-145 | b | "The project context `## Tracker` binds each verb." (home: template format line) | 95 |
| core:151-153 | d | drop ", such as a fork's upstream or another organization" | 55 |
| core:158-159 | b | "The PR closing line (`code` section Finish) is exempt." | 45 |

Projected: 9,998 − 1,170 = about 8,828 characters in both forms.
Kept on purpose: section names and numbers, the caveat line format, the slot labels,
the AI marker, every Host terms name, the 2–4 / 1–4 question limits (retro:66-68
points to them).

## Test scope

Format: `<test case> : <break | rework | remove> : <reason>`.

- scripts/core-context.test.mjs : rework : none needed; it must still pass.

## Risks

- A reworded line can drop a meaning other files point to. The review checks each
  "`core` section" reference in skills, templates, README, DESIGN and AGENTS.md.

## Stack choices

## Out of scope

- Moving rules out of `core`; a version bump; edits to other skills.

## Accepted tech debt

## Overrides

Format: `<design rule> : <reason>`.

## Caveats

Format: the caveat line of the armory `core` skill, section Reports.

- `wc -m` counts bytes in the C locale, so it reports 10,004 for a 9,998-character
  `core` : scripts/core-context.sh
- Claude Code caps hook output at 10,000 characters and passes only a 2,000-character
  preview above it : scripts/core-context.test.mjs (replaces the current 2 KB caveat)
