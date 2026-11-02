---
name: retro
description: >
  User-only: the model MUST NOT load this skill on its own; it MUST ask the user to
  start it instead. Retrospective on the current session: ranked findings on what to
  change in the project or in armory so that later sessions go better. Changes no file.
  Use for "/retro", "run a retro".
disable-model-invocation: true
max-lines: 72
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# retro

The main session looks back on the current session when the user starts it. It lists
what to change in the project or in armory so that later sessions go better.

## 1. Scope

- The main session MUST run it on the current session only.
- MUST change no file: MUST NOT edit, commit or spawn a coder. MUST list each change as
  a finding instead (section Findings).
- MUST read the session, and each touched file that a finding's evidence needs.
- Done when the steps of the session are read, and each file a finding's evidence
  needs.

## 2. Finding classes

- MUST check the session against each class below. A class applies in its "use when"
  case.
  - Navigation and information access. Use when the session took long to find a fact,
    or could not reach it. The change: a pointer in the project context or a doc, or
    read access (logs, a tool).
  - Checks and review rules. Use when a mistake got past a gate or the reviewer. A
    mechanical miss (a fixed pattern, a banned call, a file place) MUST get a check: a
    lint rule, a gate or a hook. A judgement miss MUST get a review rule (`review`, or
    the project context `## Rules`).
  - Context size and no-op lines. Use when a line of the project context, the global
    context or a skill changed no behavior, or belongs in a check or a review rule.
  - Tool economy. Use when a cheaper call, model row or tool could replace a costly
    tool call or spawn.
- Before the class Checks and review rules, SHOULD read the project context `## Gates`
  and `## Commands`. An existing check that is off or broken is then the finding.
- Done when each class was checked against the session.

## 3. Findings

- Each finding MUST name these fields:
  - class: one of section Finding classes;
  - severity: High, Medium or Low (below);
  - target: the project or armory;
  - file: the file to change; for armory, the skill file and its section;
  - change: what to change in that file;
  - evidence: the step of this session where the miss cost something.
- Severity MUST follow the cost of the miss. High: the miss gave a wrong result, or
  would give one again. Medium: it cost a round, a retry or a re-review. Low: it cost
  only tokens or time.
- The list MUST be ranked High first, then Medium, then Low.
- Done when each finding has every field.

## 4. After the list

- The main session MUST ask the user, through the question tool, which findings to turn
  into a task. The question MUST be multi-select.
- No finding: MUST say so and skip the question. One finding: MUST ask yes or no,
  single-select. More than four: MUST split them into questions of 2–4 options, up to
  four questions per call (`core` section Writing and questions).
- MUST NOT start the task. MUST name each chosen finding as a task to plan instead.
- Done when the user answered, or no finding exists.
