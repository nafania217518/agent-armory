# Plan: workflow-branches

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `workflow-branches`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-40): MUST amend `docs/DESIGN.md` §4: in the `code` row (line 151), replace "`code` + template `pr.md`" with "`code`" and delete "17 (push and merge guard), "; in the `workflow` row (line 147), replace "| `workflow` |" with "| `workflow` + template `pr.md` |" and "17 (branch, plan-file commit, finish)" with "17 (branch, push and merge guard, plan-file commit, finish)".
  - tests: lint (no gate reads the §4 rows; `git grep -c -F '| `workflow` + template `pr.md` |' docs/DESIGN.md` gives 1, and `git grep -F '17 (push and merge guard)' docs/DESIGN.md` finds nothing)
  - needs: none
- TR-2 (skill-architecture-redesign/BR-40): MUST append the first block to `skills/workflow/SKILL.md`, after one blank line, where `<skills/code/SKILL.md:74-89>` stands for those lines verbatim; replace its description lines 4-5 with the second block; set `max-lines` to its line count. MUST run `mkdir -p skills/workflow/templates` and `git mv skills/code/templates/pr.md skills/workflow/templates/pr.md`, and in that file replace "(armory `code` §Finish)" with "(armory `workflow` §4)". In the `README.md` `workflow` row (line 13), MUST replace "now the tracker verbs and write rules. | none yet; later the main-session skills, through their pointers |" with "now the tracker verbs and write rules, branches, finish and caveat-base writes. | `code`, `plan` and `setup`, through their pointers |".

      ## 2. Branches

      - MUST work on one branch per task.
      - `<base>` MUST mean the same branch in every armory skill: with a remote, `origin/HEAD`
        (first command below; when it finds none, the fallback command, then the lookup again);
        without one, or when the fallback also fails (a remote with no commits), the local
        default branch (`main` or `master`, whichever exists), else the current branch.
      - Tech quiz MAY confirm `<base>` when it is unclear.
      - MUST cut task branch from `<base>`. With a remote, MUST run `git fetch origin` first.
      - MUST NOT commit to `<base>` or the local default branch, except the merge of §4 and the
        first commit of a new repo. MUST commit on a branch cut from `<base>` instead.
      - MUST ask user before any push, and before any merge into `<base>`, PR merges too.

      ```
      git symbolic-ref --short refs/remotes/origin/HEAD
      git remote set-head origin -a    # fallback: no origin/HEAD
      git fetch origin
      git switch --no-track -c <task-branch> <base>
      ```

      ## 3. Caveats

      Caveat base, caveat slot, caveat format, subagent ban and recorded items are in
      `core` §6.

      - A caveat found during planning MUST wait in the plan-mode proposal, not in the plan
        file. Right after the planning run's first commit, main session MUST have each such
        caveat written into the caveat base, except a held caveat.
      - Main session MUST write each caveat-base line itself, root `## Caveats` and topic files
        alike, and MUST commit each write (`core-main` §3).
      - Main session MUST have each caveat it receives or finds after the plan-file commit
        written into the caveat base immediately, unless the next bullet defers it.
      - A caveat of the bullet above, or a planning caveat, about code that a `TR` of this task
        still builds or changes is a held caveat. It MUST wait until that `TR` merges into the
        task branch; main session MUST then have it written as this section says.
      - Before that write, main session MUST check the line against `core` §6 and its place
        against the bullets below, and MUST check its claim against the code, with a search of
        the named file for the fact: by a short read when that settles it, else by a researcher
        that returns a verdict, not the lines. A line that fails MUST be split, cut, moved or
        dropped.
      <skills/code/SKILL.md:74-89>

      ## 4. Finish

      - MUST ask user whether to push, open a PR, merge into `<base>`, or stop. §2 guards each
        push and merge. Recommended option MUST be a PR when the repo has a remote, else a merge
        into `<base>`.
      - A merge into `<base>` MUST merge into the local default branch. With a remote, main
        session MUST then ask a separate question whether to push that branch.
      - After a push to a branch with an open PR, main session MUST have an agent compare the PR
        body's Summary and Evidence with plan's Design and latest gate and measured results, and
        return each stale line with its new text. Main session MUST update those lines in the
        same step. The push yes covers that edit. When the task-end cleanup removed the Design,
        the brief MUST name the commit before that cleanup to read it from.
      - A PR body MUST take the sections and order of `templates/pr.md`, relative to this
        skill, each filled as its format line says, with no format line.
      - With a tracker bound and a closing reference form in `closes by PR merge:`, the PR body
        MUST end with one closing line per item of the tracker done write: that form with the
        item's id filled in. Else it MUST hold no closing line.

        Abstract: load only through a skill that extends it. The tracker verbs, the docs
        fallback, the tracker write rules, branches, finish and caveat-base writes that the
        main-session skills share.

  - tests: lint (skill-sizes gives `workflow: 115/115`; `node scripts/skill-graph.mjs --verbose 2>&1 | grep '^skills/workflow/'` prints nothing; red case: with "except the merge of §Finish" in the §2 bullet, it prints a `§Finish is a name reference, resolves to §4` line; `git ls-files skills/code/templates` prints nothing, and `git ls-files skills/workflow/templates` prints `skills/workflow/templates/pr.md`), unit
  - needs: none
- TR-3 (skill-architecture-redesign/BR-40): MUST delete the moved text and wire `workflow` in, in one commit; then set `max-lines` of each edited skill to its line count.
  - `skills/code/SKILL.md`:
    - delete lines 29-35, 43-89 and 204-221;
    - replace line 10 with the first block;
    - put the fourth block after line 15;
    - replace lines 26-27 with the second block;
    - renumber the headings "## 3. Running the plan", "## 4. Review loop" and "## 5. Task end" to 2, 3 and 4;
    - replace lines 123-129 with the third block, lines 170-172 with the fifth, 175-179 with the sixth and 186-188 with the seventh;
    - on line 163, replace "(§Caveats)" with "(`workflow` §3)";
    - on line 194, replace "the push of §Finish," with "the push of `workflow` §4,".
  - `skills/plan/SKILL.md`:
    - replace line 11 with the eighth block;
    - put the fourth block after line 16;
    - replace "`code` §Finish" with "`workflow` §4" on line 60;
    - replace "`code` §Caveats" with "`workflow` §3" on lines 105 and 127;
    - replace "`code` §Branch and plan file" with "`workflow` §2" on line 174;
    - replace lines 179-181 with the ninth block and lines 186-187 with the tenth.
  - `skills/setup/SKILL.md`:
    - in line 11, replace "triage]" with "triage, workflow]";
    - put the fourth block after line 16;
    - replace line 77 with "- MUST load `delegate` for default rows and `test` for levels.";
    - replace "`code` §Branch and plan file" with "`workflow` §2" (line 79), "`code` §Finish" with "`workflow` §4" (line 81), and "`code` §Caveats" with "`workflow` §3" (lines 143 and 145).
  - `skills/delegate/SKILL.md`: replace "`code` §Caveats" with "`workflow` §3" (line 49) and "`code` §Branch and plan file" with "`workflow` §2" (line 50).
  - `skills/dnd/SKILL.md`: replace line 19 with the eleventh block and line 45 with the twelfth.
  - `skills/setup/templates/AGENTS.md:69`: replace "armory `code` §Caveats" with "armory `workflow` §3".
  - `AGENTS.md:109`: replace "armory `code` skill, section Caveats" with "armory `workflow` skill, section Caveats".

        extends: [core, delegate, implement, output-budget, plan, research, review, setup, test,
            workflow]

      Plan file and its first commit follow `plan` §Plan file. Merge of a worktree branch into
      the task branch is in `delegate` §Delegation and worktrees. Branch rules are in
      `workflow` §2.

      - A finding or a caveat with an `Unverified:` part (`review` §Output, `research` §When to
        research) MUST be checked before a fix brief, the recorded-items quiz or a caveat-base
        write: as `workflow` §3 sets for a code claim, by a researcher (`research` §When to
        research) when a web source can settle it, or by a coder whose brief says "check the
        claim first; change nothing if it is false". A false finding or caveat MUST be dropped;
        task report MUST name it, with the disproving command or source, in its skipped line
        (§Task end, step 6). A claim the check does not settle MUST keep its `Unverified:` part.

      Load `workflow` before your first step when its rules are not in your context.

           answer; each follow-up line of step 4; each held caveat (`workflow` §3) whose `TR`
           has not merged; any risk the user must know. Done when `lint` and `unit` results at
           the tip exist and the report holds each listed item.

        8. Cleanup: MUST run caveat cleanup (`workflow` §3), then ask user what to keep of plan
           file and design docs the task added to the repo. Recommended option MUST be: keep
           design docs, and of plan file only its Requirements section, which `req:` markers
           point into. It MUST also ask, for each kept diagnose-only branch, whether to keep or
           delete it. A cleanup commit gets no re-review. Done when user has answered.

        10. Finish: when the tip moved after the `lint` and `unit` results of step 6, MUST run
            them again, then MUST follow `workflow` §4. Done when that run is made or the tip
            did not move.

        extends: [code, core, delegate, implement, requirements, research, review, test, triage,
            workflow]

      - Right after that commit, the planning caveats go into the caveat base (`workflow` §3).

      - Strategic or milestone run with a branch MUST end with the finish question of
        `workflow` §4 for its branch.

      Main session runs each session task from `plan` to Finish (`workflow` §4) while user is
      away.

      - MUST run each task through `plan` at task level, then `code` through Finish
        (`workflow` §4).

  - tests: lint (red case for the cites: with `workflow` dropped from the `extends` of `code`, `plan` and `setup`, the skill-graph summary reads `cite 35`; after the edit it reads `cite 0`, against `cite 12` at de7c808; red case for the pointers: with the `code` pointer line missing, its pointer report reads "missing delegate, implement, plan, research, review, setup, test, workflow"; after the edit, each pointer report reads as at de7c808; the summary reads `payload 0`, with no `card-main` line; `git grep -l -F` over `skills .claude` finds only `skills/workflow/SKILL.md` for each of "`<base>` MUST mean the same branch", "MUST ask user before any push", "Main session MUST write each caveat-base line itself", "A topic file over 40 entries MUST be split", "MUST ask user whether to push, open a PR", "A PR body MUST take the sections and order" and "git switch --no-track -c", and nothing for "A task run MUST hold them in its"; `git grep -n -E '§Finish|§Caveats|§Branch and plan file|`code` (through its )?Finish' -- skills .claude AGENTS.md` finds nothing; skill-sizes passes), unit
  - needs: TR-2

- 2026-11-19: review fixes (auto-fix): TR-1's `workflow` row reads "17 (branch, push and merge guard, finish)"; in TR-3, `skills/setup/SKILL.md` line 144 reads "place each caveat it found under `workflow` §3, after the `Unverified:` check of `code` §Review loop.", and the ninth block reads "- Right after that commit, main session MUST have the planning caveats written into the caveat base (`workflow` §3).".
