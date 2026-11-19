# Plan: orchestrators

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `orchestrators`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-27): MUST, in `skills/core-main/SKILL.md`, append the block after line 58, after one blank line, then rebuild both payloads with `node scripts/skill-graph.mjs --build` and commit `hooks/main-payload.md` in the same commit.

      ## 4. Task flow (main session only)

      - A coding task MUST start at the code skill. With no approved plan, main session MUST
        first run the plan skill up to approval. After a task plan's approval, main session
        MUST run the code skill.

  - tests: lint (skill-graph summary holds `payload 0` and no line for `core-main`; `hooks/main-payload.md` holds "A coding task MUST start at the code skill" and is 8576 characters in the probe, under the 9,000 warning; at c4a66d6: 8358 characters and no such line), unit
  - needs: none
- TR-2 (skill-architecture-redesign/BR-27): MUST, in `skills/delegate/SKILL.md`: make line 6 read `  "delegate", "which model", "write a brief", "/delegate".`; set `extends: [core, research, workflow]`; insert block A after line 14; make line 29 read "  non-fast-forward merge."; on line 34 replace "`code` §Task end, step 8" with "the task-end cleanup"; delete " (`plan` §Requirements)" from line 44 and " (`craft` §1)" from line 52; make line 56 read "  hold the audit target that user names instead of range and task's requirements."; make line 74 read "  the review of its fix commits ends."; delete line 95; on line 100 replace "(`code` §Review loop)" with "(below)"; insert block B after line 104; replace lines 142-144 with block C and lines 218-221 with block D; set `max-lines` to the line count.

      Load `workflow` before your first brief when its rules are not in your context.
      Load `research` before a researcher brief when its rules are not in your context.

      - A no-re-review commit only deletes caveat or doc lines a finding's Fix part names, or
        writes caveat or doc text that a Fix part gives word for word.

        fix the bug. On a yes, the fix is a coding task; on a no, its output closes. A fix
        after a diagnose-only run SHOULD go to that debugger, in the fix flow, as a follow-up
        message (§2). A fresh spawn for it MUST be the coder, with the cause, loop command,

      - A spawn fails when it returns no report or a `stuck:` report. These MUST NOT count as a
        fail: a failing gate, which the agent's own gate rules handle; a `sources disagree`
        report (`research` §2), whose section sets where disputed questions go.

  - tests: lint (`delegate: section 15`, no `cite`, `pointer` or `cycle` report on `delegate`; at c4a66d6: `delegate: cycle 1, pointer 1, section 26`; `git grep -n -F -e '`code`' -e '`plan`' -- skills/delegate/SKILL.md` finds none), unit
  - needs: TR-1
- TR-3 (skill-architecture-redesign/BR-27): MUST, in `skills/code/SKILL.md`: replace lines 6-7 with `  search or edit of any coding task: "/code", "implement", "fix", "refactor".`; replace lines 10-11 with `  extends: [core-main, delegate, output-budget, research, workflow]`; replace lines 16-17 with block A; delete lines 21-25; replace lines 28-30 with block B and lines 32-34 with block C; replace lines 62-64 with "- A no-re-review commit (`delegate` §2) gets no re-review."; replace lines 68-74 with block D; make line 88 read "  - tech-debt misfit (a shortcut with no Accepted tech debt line): fix as an amendment,"; replace lines 113-114 with block E; set `max-lines` to the line count.

      Load `core-main` before your first step when its rules are not in your context.
      Load `workflow` before your first step when its rules are not in your context.
      Load `delegate` before your first brief when its rules are not in your context.
      Load `research` before you check an `Unverified:` part when its rules are not in your
      context.

      Merge of a worktree branch into the task branch is in `delegate` §1. Branch rules are in
      `workflow` §2, the claim and its re-read before the cut in `workflow` §6.

      - When the task branch already exists with its committed plan file, the run MUST switch
        to it and skip the cut and the plan skill; it starts at the behind-`<base>` check
        (`workflow` §9).

      - A finding or a caveat with an `Unverified:` part (`research` §1) MUST be checked before
        a fix brief, the recorded-items quiz or a caveat-base write: as `workflow` §3 sets for a
        code claim, by a researcher (`research` §1) when a web source can settle it, or by a
        coder whose brief says "check the claim first; change nothing if it is false". A false
        finding or caveat MUST be dropped; task report MUST name it, with the disproving command
        or source, in its skipped line (§4, step 6). A claim the check does not settle MUST keep
        its `Unverified:` part.
      - A finding that its fixer reports false MUST get the check of the bullet above.

           id and status; the gate results, one line per gate; each measured result; what was
           skipped or not checked; each recorded item with only its applied

  - tests: lint (`code: section 10`, no `cite`, `pointer` or `cycle` report on `code`; at c4a66d6: `code: cycle 1, pointer 1, section 19`; `git grep -n -F -e '`plan`' -e '`implement`' -- skills/code/SKILL.md` finds none), unit
  - needs: TR-1, TR-2
- TR-4 (skill-architecture-redesign/BR-27): MUST, in `skills/plan/SKILL.md`: replace lines 6-8 with block A; replace lines 11-12 with `  extends: [core-main, delegate, requirements, research, workflow]`; replace lines 17-20 with block B; delete " (`triage` §Outcomes)" from line 63; delete line 73; replace lines 115-116 with "- Measured results MUST go to the task report and the PR body, never to the plan file."; on line 136 replace "its `code` run" with "its coding run"; set `max-lines` to the line count.

        with quizzes and the user's approval in plan mode. Use for "plan this",
        "plan a milestone", "design doc", a changed requirement, "/plan".

      Load `core-main` before your first step when its rules are not in your context.
      Load `workflow` before your first step when its rules are not in your context.
      Load `requirements` before you write or check a `BR`, a `TR` or a plan doc when its rules
      are not in your context.
      Load `research` before your first quiz round when its rules are not in your context.
      Load `delegate` before your first spawn when its rules are not in your context.

  - tests: lint (`plan: section 8`, no `cite`, `pointer` or `cycle` report on `plan`; at c4a66d6: `plan: cycle 1, pointer 1, section 10`; the skill-graph line reads `cycle: setup, triage`; `git grep -n -F -e '`code`' -e '`triage`' -- skills/plan/SKILL.md` finds none), unit
  - needs: TR-1, TR-2, TR-3
- TR-5 (skill-architecture-redesign/BR-27): MUST, in `docs/DESIGN.md`: replace line 51 with the block; in §4 append "; the hand-off between `plan` and `code`: none (new)" to the RULES cell of the `core-main` row (line 146); append "; main session, through the pointers of `plan`, `code` and `delegate`" to the Loaded-by cell of the `research` row (line 160); append ", `research`" to the Loads cell of the rows "main session, full task" (line 169) and "main session, dnd" (line 171).

        `audit` extends `review`; `dnd` extends `plan` and `code`. `code` and `plan` extend
        `delegate` and not each other; `core-main` holds the hand-off between them.

  - tests: lint (width of the §1 lines; no check reads the table rows), unit
  - needs: TR-2, TR-3, TR-4

- 2026-11-19: review fixes (auto-fix): TR-1's bullet reads "- A coding task MUST start at the code skill. With no approved plan, main session MUST first run the plan skill through its plan-file commit. After that commit, main session MUST run the code skill, unless user asked for the plan only."; the payload is rebuilt with it.

- 2026-11-19: review fix 4 (auto-fix): TR-1's bullet reads "- A coding task MUST start at the code skill. With no approved plan, main session MUST first run the plan skill to its end. After that, main session MUST run the code skill, unless user asked for the plan only.", in place of the note above; the payload is rebuilt with it.
