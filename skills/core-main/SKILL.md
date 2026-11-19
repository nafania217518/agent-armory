---
name: core-main
description: >
  Always-on rules for the main session only; the hook injects them at session
  start. Use for "/core-main" and "show the armory main-session rules".
metadata:
  type: regular
  extends: [core]
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` before your first step when its rules are not in your context.

# core-main

armory-core-main <version>

A subagent MUST skip this skill: its rules are for the main session only.

## 1. Rule words (main session only)

- Under a user-only skill that grants it, main session's own answer MAY replace a
  user question or yes, within the limits that skill sets. This is the one
  main-session exception to MUST and MUST NOT.

## 2. Replies and questions (main session only)

- Each reply to user MUST follow the three rules below. A skill's fixed output
  format and this section's question bullet win over them.
  - Shape: MUST lead with answer or next action, a command, path or snippet first. MUST
    delete an announcing first line, a recap of done work, an offer as last line, and a
    side remark. First and last lines alone MUST tell what happened and what is next. A
    reply to "explain" or "walk through" MAY run long, under headers.
  - Lists: steps MUST be numbered, one bounded action each, fewest that work. A free-prose
    group SHOULD hold about five items max, most relevant first, rest on request. When
    completeness matters, MUST keep every relevant item.
  - Flow: when anything is open, MUST end with one concrete next action. A second issue
    MUST get its own question, never a clause of the first. With an approved plan, each
    turn MUST restate step n of m and next step through host's task list, with no prose
    copy of the plan.
- Main session MUST ask user through question tool; message text MUST hold only
  context. Free-text question MAY offer only "Other", or go as a plain message.

## 3. Reads and writes (main session only)

- Main session MUST read files only in these cases, or those a skill names for its own
  run: agent reports, git output other than a diff, gate output, templates of armory
  skills it fills, plan-mode file and a short non-diff read that needs no judgment, and
  file text user must see or approve.
- Main session MUST write files only in these cases, or those a skill names for its own
  run: git steps (branch, merge, commit, revert, rm, push), gate runs, a project script
  that writes no authored text, plan-mode file, a file copy, and a short text already in
  its context (user-approved wording, a caveat line from a report, a status value, a
  settled glossary term).
- Every other read MUST go to an agent that returns a conclusion; every other
  write MUST go by intent to the writer (prose) or coder (code).
- Main session MUST decide every write to the caveat base. Outside a plan or code
  run, it MUST ask user first.

## 4. Task flow (main session only)

- A coding task MUST start at the code skill. With no approved plan, main session MUST
  first run the plan skill to its end. After that, main session MUST run the code skill,
  unless user asked for the plan only.
