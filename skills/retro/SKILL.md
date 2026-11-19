---
name: retro
description: >
  Retrospective on the current session: ranked findings on what to change, split
  into armory, project and user, so that later sessions go better. Changes no file.
  Use for "/retro", "run a retro".
disable-model-invocation: true
metadata:
  type: user-only
  extends: [core]
  max-lines: 90
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` before your first step when its rules are not in your context.

# retro

Main session looks back on current session when user starts it. It lists what to change in
project or in armory so later sessions go better.

## 1. Scope

- MUST change no file: MUST NOT edit, commit or spawn a coder. MUST list each change as a
  finding instead (§3).
- MUST read session, and MUST have an agent read and report each touched file a finding's
  evidence needs.
- Done when session's steps are read, and each file a finding's evidence needs is
  reported.

## 2. Finding classes

- MUST check session against each class below. A class applies in its "use when" case.
  - Navigation and information access. Use when session took long to find a fact, or could
    not reach it. The change: a pointer in project context or a doc, or read access (logs,
    a tool).
  - Checks and review rules. Use when a mistake was made, or got past a gate or reviewer.
    A mechanical miss (a fixed pattern, a banned call, a file place) MUST get a check: a
    lint rule, a gate or a hook. A judgement miss MUST get a rule where it happened (a
    skill, agent card or project context `## Rules`), or in the review skill.
  - Context size and no-op lines. Use when a line of project context, user's global
    context file or a skill changed no behavior, or belongs in a check or review rule.
  - Tool economy. Use when a cheaper call, model row or tool could replace a costly tool
    call or spawn.
- Before class Checks and review rules, SHOULD read project context `## Gates`. A gate
  that is off or broken is then the finding.
- Done when each class was checked against the session.

## 3. Findings

- Each finding MUST name these fields:
  - source: `armory`, `project` or `user` (below);
  - class: one of §2;
  - severity: High, Medium or Low (below);
  - file: file to change, and its section for a skill;
  - change: what to change in that file;
  - evidence: step of this session where miss cost something.
- Source MUST follow the file:
  - `armory`: a file of the armory plugin: a skill, agent card template, plan template,
    hook or script; a project agent card rendered from an armory template counts here,
    with its template `skills/setup/templates/agents/<agent>.md` as file;
  - `user`: user's global context file;
  - `project`: any other file.
- Severity MUST follow miss's cost. High: miss gave a wrong result, or would give one
  again. Medium: it cost a round, retry or re-review. Low: it cost only tokens or time.
- List MUST come in three groups: `armory`, then `project`, then `user`. Each group MUST
  be ranked High first, then Medium, then Low.
- Done when each finding has every field.

## 4. After the list

- No finding: MUST say so and skip every round.
- Main session MUST run one question round per group, in list order: `armory`, `project`,
  `user`. Each round MUST ask, through question tool and multi-select, which findings of
  that group to act on. It MUST skip a group with no finding.
- One finding in a group: MUST ask yes or no, single-select. More than four: MUST split
  them across several questions.
- Chosen `armory` findings: in a session on the armory repo, MUST name them as one task to
  plan. In any other repo, MUST write one prompt for an armory session instead.
- Armory prompt MUST hold, per finding: severity, file and section, problem seen with its
  evidence, change as draft text, and a check. It MUST end with a done condition, and MUST
  come in one block user can copy.
- Chosen `project` findings: MUST name them as one task to plan.
- Chosen `user` findings: MUST propose one separate session that edits user's global
  context file. Its brief MUST hold findings and these steps, one finding at a time: show
  a preview (current lines and new text), ask user for a yes, and edit only after that
  yes. A finding with no yes MUST stay unedited.
- MUST NOT start a task or session. MUST name the task, or propose the session, instead.
- Done when each round is answered, and each chosen group has its task, prompt or proposed
  session; or when no finding exists.
