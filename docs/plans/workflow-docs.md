# Plan: workflow-docs

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `workflow-docs`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-25): MUST amend `docs/DESIGN.md`: in the `workflow` row (line 147), replace "parts of 6 (amendments, business quiz topics)" with "parts of 6 (docs and status homes, amendments, business quiz topics)" and "the done write and the `triage` roles: none (new)" with "the done write and the `triage` roles and label lines: none (new)"; in lines 454-455, replace "the status values are in `plan`\nsection Levels. The milestone doc is `docs/milestones/<name>.md`." with "the status values are in `workflow`\n§5.".
  - tests: lint (`git grep -c -F 'parts of 6 (docs and status homes, amendments' docs/DESIGN.md` gives 1; `git grep -n -F 'The milestone doc is' docs/DESIGN.md` finds nothing), unit
  - needs: none
- TR-2 (skill-architecture-redesign/BR-25): MUST, in `skills/workflow/SKILL.md`, replace description lines 4-6 with the first block and lines 114-115 with the second; append the third block after line 115, after one blank line; set `max-lines` to its line count. In `README.md` line 13, MUST replace "now the tracker verbs and write rules, branches, finish and caveat-base writes. | `code`, `plan` and `setup`, through their pointers |" with "now the tracker verbs and write rules, branches, finish, caveat-base writes, docs and status homes, the claim, the done write and the triage roles. | `code`, `plan`, `setup` and `triage`, through their pointers |".

        Abstract: load only through a skill that extends it. The tracker verbs, the docs
        fallback, the tracker write rules, branches, finish, caveat-base writes, docs and status
        homes, the claim, the done write and the triage roles that the main-session skills
        share.

        MUST end with one closing line per item of the tracker done write (§7): that form with
        the item's id filled in. Else it MUST hold no closing line.

      ## 5. Docs and status

      - Each planning level MUST keep its doc, its branch and the facts its doc holds as this
        table sets. The table and the bullets above the tracker variant are the docs fallback
        (§1).

      | Level | Doc | Branch | Holds |
      |---|---|---|---|
      | strategic | `<docs>/DESIGN.md`, edited in place | `design-<topic>` | architecture, dated decisions, the milestone list and milestone status |
      | milestone | `<docs>/milestones/<name>.md` | `milestone-<name>` | out of scope, the `BR` list, the tasks and their status, risks |
      | task | `<docs>/plans/<branch>.md` | the task branch | design, the `TR` list, test scope, risks, overrides, accepted tech debt |

      - A `BR` MUST live in the milestone doc. A task with no milestone MUST keep its own `BR`
        list in the plan file.
      - With no tracker bound, a task with no milestone MUST take its title slug as its branch.
      - Each title slug MUST be ASCII: a non-Latin title transliterated, lower case, words
        joined by `-`.
      - Milestone status MUST live only in `<docs>/DESIGN.md`. Task status MUST live only in the
        milestone doc. Status values MUST be open, done and dropped.
      - With a tracker bound (§1), this tracker variant MUST replace only the docs-fallback
        rules it names:
        - `<docs>/DESIGN.md` keeps its architecture and decisions and MUST hold no milestone
          list. Each new milestone MUST become a top-level tracker item, and each of its tasks
          a child item of it.
        - A task with no milestone MUST keep its own `BR` list in its own task item body. Plan
          file MUST hold no `BR` text, only `BR` ids.
        - Status MUST live only in the tracker.
        - Task's branch MUST be the tracker's branch name for its item when the binding has
          that verb, else `<item id>-<title slug>`. Plan file path MUST be the branch with each
          `/` replaced by `-`.

      ## 6. Claim

      These rules hold with a tracker bound.

      - Task run MUST claim its task item right after it reads the item, before any quiz round
        or spawn. User's start request is the yes for this write. When the item is closed or
        has any assignee, user included, run MUST stop and ask user: pick another ready task
        (recommended), take it over, or stop. A task item the run creates after approval MUST
        be claimed right after its create.
      - Just before a run cuts the task branch, it MUST read its task item again. When the item
        is closed or has an assignee other than user, the run MUST NOT cut the branch. It MUST
        stop and ask user instead: pick another task (recommended), take it over, or stop.
      - On a resume of an existing task branch, a task item claimed by user MUST count as the
        run's claim.

      ## 7. Done write

      - Docs done write, with no tracker bound: when task has a milestone, main session MUST
        itself mark task done in milestone doc and, when task was milestone's last open one,
        milestone done in `<docs>/DESIGN.md` (§5). It MUST then commit both marks in one
        commit, the last on task branch. That commit MUST change only status lines. It MUST NOT
        be committed directly on `<base>`. A task with no milestone MUST skip it.
      - Tracker done write, with a tracker bound: after the finish answer, main session MUST
        comment on the task item with the branch and, when they exist, the kept plan file path,
        PR link and merge commit (the merged HEAD commit on a fast-forward). It MUST make no
        repo commit for status. "The items" MUST mean the task item, and the milestone item too
        when the task was its last open one. Per finish answer:
        - merge into `<base>`: MUST set the items done after the push of §4, or after the merge
          with no remote; on a no to that push, MUST leave the items open and tell user;
        - PR, with a closing reference form in `closes by PR merge:`: the run MUST leave the
          status to the PR merge;
        - PR, with `closes by PR merge: no`: MUST set the items done only when run merges PR
          itself after user's yes; else report MUST say the items stay open;
        - push only or stop: MUST comment only; the task item MUST keep its claim.
      - A task-level planning run that adds no task to a milestone and reads that all its tasks
        are done MUST ask user whether to mark the milestone done. On a yes, it MUST cut a
        `design-<topic>` branch, make the status-line edit in `<docs>/DESIGN.md` itself, and
        commit it as that branch's first commit, with the finish question of §4, or, with a
        tracker bound, a status write under the tracker write rules of §1. That ask MUST NOT
        replace the done write of a code run.

      ## 8. Triage roles

      - Roles: states `needs-triage`, `needs-info`, `accepted`; categories `bug`, `enhancement`.
        A triaged inbound item MUST carry exactly one state role and one category role.
      - Each role MUST map to its label through its `label <role>: <label>` line in project
        context `## Tracker`, one of the five label lines.
      - With the label lines bound, each tracker item a run creates MUST carry one category
        label and no `accepted`: `bug` for a fix, else `enhancement`. A missing role label MUST
        be created first.

  - tests: lint (skill-sizes gives `workflow: 198/198`; `node scripts/skill-graph.mjs --verbose 2>&1 | grep '^skills/workflow/'` prints nothing; red case: with "task-level `plan` run" in place of "task-level planning run" in the §7 bullet, it prints "cite: `plan` is not an ancestor of workflow"), unit
  - needs: none
- TR-3 (skill-architecture-redesign/BR-25): MUST delete the moved text and re-point its cites in one commit, then set `max-lines` of each edited skill to its line count.
  - `skills/plan/SKILL.md`:
    - replace lines 30-38 with the first block;
    - delete lines 48-50 and 57-64;
    - replace lines 65-75 with the second block;
    - delete lines 87-94, 137-139 and 196-198;
    - on line 167, replace "(`code` §Task end, step 11)" with "(`workflow` §7)";
    - in lines 175-176, replace "the level's branch (§Levels, column Branch) from\n  `<base>` under" with "the level's branch (`workflow` §5, column Branch)\n  from `<base>` under";
    - on line 216, replace "(§Levels)" with "(`workflow` §5)".
  - `skills/code/SKILL.md`:
    - replace line 30 with "`workflow` §2, the claim and its re-read before the cut in `workflow` §6.";
    - delete lines 32-35;
    - replace line 38 with "  §Amendments).";
    - replace lines 129-134 with the third block and lines 138-152 with the fourth.
  - `skills/triage/SKILL.md`:
    - replace line 10 with "  extends: [core, plan, setup, workflow]";
    - put "Load `workflow` before your first step when its rules are not in your context." after line 15;
    - replace lines 25-29 with the fifth block.
  - `skills/setup/SKILL.md:111`: replace "`label <role>: <label>` lines of `triage`." with "label lines of `workflow` §8.".
  - `skills/setup/templates/AGENTS.md:47-48`: replace "one per role of armory\n`triage`." with "one per role of armory\n`workflow` §8.".
  - `skills/requirements/templates/strategic.md:10`: replace "`plan` §Levels. The milestone doc is `{{DOCS}}/milestones/<name>.md`." with "`workflow` §5.".
  - `skills/requirements/templates/milestone.md:21`: replace "`plan` §Levels." with "`workflow` §5.".

      - Each level MUST use the doc and branch of `workflow` §5 and this template; template
        paths in this skill are relative to the `requirements` skill: strategic
        `templates/strategic.md`, other sections free; milestone `templates/milestone.md`,
        fixed; task `templates/task.md`, fixed.

      - With a tracker bound in project context `## Tracker` (`workflow` §1), each level
        MUST follow this tracker variant. The variant replaces only the docs-fallback rules it
        names; the rules above MUST stay the docs fallback.
        - strategic: a run that creates `DESIGN.md` from `templates/strategic.md` MUST drop
          its Milestones section.
        - milestone: milestone item body MUST take the sections of `templates/milestone.md`
          except the title line, parent line, Goal and Tasks. Each task item body MUST hold the
          `<what> : <BR list>` of the Tasks format line. Blocked-by edges MUST hold the task's
          needs (`requirements` §2).

        9. Done write, with no tracker bound: MUST make the docs done write of `workflow` §7.
           Done when its status commit is on task branch, or task has no milestone.

        11. Tracker done write, with a tracker bound: after the finish answer, MUST make the
            tracker done write of `workflow` §7. Done when each comment and status write of its
            finish answer is made.

      - MUST stop and name `setup` when project context has no `## Tracker`, or a label verb
        (`workflow` §1) or one of the five label lines (`workflow` §8) is unbound.

  - tests: lint (skill-graph summary reads `extends 0, cycle 1, cite 0, pointer 7, type 0, card-load 0, section 157, payload 0`, against `section 164` at 585e57d; the triage pointer report reads "missing plan, setup"; red case: without the triage `Load workflow` line it reads "missing plan, setup, workflow"; `grep -rlF` over `skills .claude` finds only `skills/workflow/SKILL.md` for each of "Milestone status MUST live only in", "Each title slug MUST be ASCII", "MUST claim its task item right after", "has an assignee other than user", "claimed by user", "comment on the task item with the branch", "MUST ask user whether to mark the milestone done", "states `needs-triage`", "and no `accepted`", "A `BR` MUST live in the milestone doc" and "Plan file path MUST be the branch", and nothing for "`plan` §Levels", "§Task end, step 9", "§Task end, step 11", "Each task MUST become a child item" and "lines of `triage`"; skill-sizes passes), unit
  - needs: TR-2

- 2026-11-19: review fix (auto-fix): in TR-2's §5 tracker variant, the milestone bullet reads "Each new milestone MUST become a top-level tracker item. Each task of a milestone MUST become a child item of the milestone item."
