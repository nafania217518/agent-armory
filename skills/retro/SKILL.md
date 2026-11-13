---
name: retro
description: >
  Retrospective on the current session: ranked findings on what to change, split
  into armory, project and user, so that later sessions go better. Changes no file.
  Use for "/retro", "run a retro".
disable-model-invocation: true
max-lines: 91
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
  - Checks and review rules. Use when a mistake was made, or got past a gate or the
    reviewer. A mechanical miss (a fixed pattern, a banned call, a file place) MUST get
    a check: a lint rule, a gate or a hook. A judgement miss MUST get a rule where it
    happened (a skill, an agent card or the project context `## Rules`), or in `review`.
  - Context size and no-op lines. Use when a line of the project context, the user's
    global context file or a skill changed no behavior, or belongs in a check or a
    review rule.
  - Tool economy. Use when a cheaper call, model row or tool could replace a costly
    tool call or spawn.
- Before the class Checks and review rules, SHOULD read the project context `## Gates`
  and `## Commands`. An existing check that is off or broken is then the finding.
- Done when each class was checked against the session.

## 3. Findings

- Each finding MUST name these fields:
  - source: `armory`, `project` or `user` (below);
  - class: one of section Finding classes;
  - severity: High, Medium or Low (below);
  - file: the file to change, and its section for a skill;
  - change: what to change in that file;
  - evidence: the step of this session where the miss cost something.
- The source MUST follow the file:
  - `armory`: a file of the armory plugin: a skill, an agent card template, a plan
    template, a hook or a script;
  - `user`: the user's global context file;
  - `project`: any other file.
- Severity MUST follow the cost of the miss. High: the miss gave a wrong result, or
  would give one again. Medium: it cost a round, a retry or a re-review. Low: it cost
  only tokens or time.
- The list MUST come in three groups: `armory`, then `project`, then `user`. Each group
  MUST be ranked High first, then Medium, then Low.
- Done when each finding has every field.

## 4. After the list

- No finding at all: MUST say so and skip every round.
- The main session MUST run one question round per group, in list order: `armory`,
  `project`, `user`. Each round MUST ask, through the question tool and multi-select,
  which findings of that group to act on. It MUST skip a group with no finding.
- One finding in a group: MUST ask yes or no, single-select. More than four: MUST split
  them into questions of 2–4 options, up to four questions per call (`core` section
  Writing and questions).
- Chosen `armory` findings: in a session on the armory repo, MUST name them as one task
  to plan. In any other repo, MUST write one prompt for an armory session instead.
- The armory prompt MUST hold, per finding: the severity, the file and section, the
  problem seen with its evidence, the change as draft text, and a check. It MUST end
  with a done condition, and MUST come in one block the user can copy.
- Chosen `project` findings: MUST name them as one task to plan.
- Chosen `user` findings: MUST propose one separate session that edits the user's
  global context file. Its brief MUST hold the findings and these steps, one finding at
  a time: show a preview (the current lines and the new text), ask the user for a yes,
  and edit only after that yes. A finding with no yes MUST stay unedited.
- MUST NOT start a task or a session. MUST name the task, or propose the session,
  instead.
- Done when each round is answered, and each chosen group has its task, prompt or
  proposed session; or when no finding exists.
