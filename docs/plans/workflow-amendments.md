# Plan: workflow-amendments

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `workflow-amendments`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-26): MUST, in `docs/DESIGN.md`, replace lines 69-70 with the block, and on line 148 replace "through the pointers of `plan` and `plan-draft` |" with "through the pointers of `workflow`, `plan` and `plan-draft` |".

        abstract skill `requirements` instead, which `workflow`, `plan` and `plan-draft`
        extend: a skill that a card loads cannot have `workflow`, a child of `core-main`, as an
        ancestor.

  - tests: lint (`git grep -c -F 'which `workflow`, `plan` and `plan-draft`' docs/DESIGN.md` gives 1; `git grep -c -F 'pointers of `workflow`, `plan` and `plan-draft`' docs/DESIGN.md` gives 1; both give 0 at 49a7845), unit
  - needs: none
- TR-2 (skill-architecture-redesign/BR-26): MUST, in `skills/workflow/SKILL.md`, replace description lines 6-7 with the first block; replace line 10 with "  extends: [core-main, requirements]"; put "Load `requirements` before an amendment when its rules are not in your context." after line 16; append the second block after line 198, after one blank line; set `max-lines` to its line count. In `README.md` MUST replace, on line 13, "the claim, the done write and the triage roles. |" with "the claim, the done write, the triage roles, amendments and the business quiz topics. |", and on line 14 "| `plan`, `plan-draft`, through their pointers |" with "| `workflow`, `plan`, `plan-draft`, through their pointers |".

        homes, the claim, the done write, the triage roles, amendments and the business quiz
        topics that the main-session skills share.

      ## 9. Amendments

      - A requirement that changes during work, or needs user's answer, MUST stop the work until
        user's yes.
      - An added or changed requirement MUST get a new id, unless it is a `TR` edited in place
        (below), and MUST go to user for a yes, with the new text, through the question tool.
        One exception, the `TR` of a defect in built code (below), needs no yes: it repairs
        approved work.
      - An added or changed `TR` MUST come as a draft from planner.
      - A change user asks for during a code run MUST get its `BR` in the same amendment as its
        `TR`; user's request is the yes for both.
      - An amendment MUST go to the doc that owns the fact (§5).
      - A `BR` gap found in a task run MUST amend the owning doc, after user's yes: the
        milestone doc on the task branch, or the milestone item with a tracker bound.
      - With a tracker bound, an amendment that cites a follow-up item MUST list that item's
        create in its question.
      - A task that its milestone doc does not list MUST get its Tasks line as an amendment.
      - An amendment that adds a gate-type `BR` (`requirements` §3) MUST also add it to
        each open task of the milestone: to the `<what> : <BR list>` line of each open child
        item body, with the AI marker line above the changed line, or, in the docs fallback, to
        each open task line of the milestone doc. The amendment question MUST list these tracker
        writes.
      - A change to the design MUST go back through quizzes, plan and approval. A redesign
        user approves is such a change.
      - An architecture gap MUST re-plan at the strategic level, on a `design-<topic>` branch.
      - A defect in built code (`requirements` §1) MUST get a new `TR-n` and its test.
      - Main session MUST allocate every new id. Subagent MUST NOT allocate one.
      - Before the next brief or follow-up message, main session MUST have the writer write
        into the owning doc the new items, each `(replaced by <new id>)` mark, each dated note
        and the line updates below; no reason or history. The writer brief MUST carry the
        amendment's reason and history for the writer's commit message; main session MUST also
        put them into the tracker comment when one is written.
      - A replacing item MUST state its full text. A replaced item MUST keep its id line, never
        renumbered, with the mark `(replaced by <new id>)`; its old text MAY go. Before the
        plan's first commit, an item that user's yes replaces MAY be rewritten in place. Until
        the first brief that names it, a `TR` that user's yes changes MUST be edited in place
        and keep its id.
      - Brief or follow-up message of a `TR` that replaces another MUST tell the coder to
        re-point each `req:` marker of the old id to the new id.
      - A wrong `tests:` case of a `TR` whose behavior stays MUST get a dated note below the
        `TR` list that names the `TR` and gives the corrected case. A changed behavior takes a
        new id (above).
      - When a code run starts on a plan whose commit is behind `<base>`, main session MUST
        first have an agent check each `TR` against `<base>`. Each `TR` that `<base>` already
        meets MUST get a dated note below the `TR` list. Done when each `TR` is checked.
      - When an amendment replaces or removes a term, id, design choice or figure (a profile,
        a file, a class, a bound), main session MUST have the owning doc, plan file and project
        context grepped for it before it asks user: by a short read when that settles it, else
        by a researcher that returns the id of each line naming it. Each requirement line that
        names it MUST join that amendment's question, with its new id, and get its
        `(replaced by <new id>)` mark at the amendment commit. A `needs:` line that names a
        replaced id MUST be updated in place at that commit, with no new id.
      - Before the amendment commit, main session MUST have an agent list each line that is not
        a requirement (Goal, Design, Risks, Test scope) and that the amendment makes false. The
        amendment commit MUST update each such line. An amendment that changes a tested
        behavior or a data shape MUST add each case it breaks to Test scope in the same
        commit. A line with an `Unverified:` part that a `TR` proves MUST be deleted.

      ## 10. Business quiz

      - Business quiz topics: goal, who is affected, done criteria, users, features, business
        rules, out of scope, constraints.

  - tests: lint (skill-sizes gives `workflow: 262/262`; `node scripts/skill-graph.mjs --verbose 2>&1 | grep '^skills/workflow/'` prints nothing; red case: without the `Load requirements` line it prints "pointer: missing requirements"; red case: with `extends: [core-main]` and no pointer it prints "cite: `requirements` is not an ancestor of workflow" on the gate-type and defect bullets), unit
  - needs: none
- TR-3 (skill-architecture-redesign/BR-26): MUST delete the moved text and re-point its cites in one commit, then set `max-lines` of `plan` to its line count.
  - `skills/plan/SKILL.md`:
    - replace lines 90-91 with "- Business quiz MUST come first, on the topics of `workflow` §10.";
    - on line 111, replace "A `BR` gap MUST go to §Amendments." with "A `BR` gap MUST go to `workflow` §9.";
    - delete lines 172-231.
  - `skills/code/SKILL.md`:
    - in lines 33-34, replace "check (`plan`\n  §Amendments)." with "check (`workflow`\n  §9).";
    - on line 39, replace "`plan` §Amendments." with "`workflow` §9.";
    - on line 49, replace "(`plan` §Amendments)" with "(`workflow` §9)";
    - on line 51, replace "`plan` §Amendments." with "`workflow` §9.";
    - on line 61, replace "`plan` §Amendments" with "`workflow` §9".
  - `skills/delegate/SKILL.md:53`: replace "(`plan` §Amendments)" with "(`workflow` §9)".
  - `skills/triage/SKILL.md:59`: replace "each under its `plan` business-quiz topic (`plan` §Quizzes):" with "each under its business-quiz topic (`workflow` §10):".
  - tests: lint (skill-graph summary reads `extends 0, cycle 1, cite 0, pointer 7, type 0, card-load 0, section 144, payload 0`, against `section 157` at the TR-2 tip; red case: with TR-3 but without TR-2, it prints "§9 has no heading in workflow" and "§10 has no heading in workflow"; `grep -rlF` over `skills .claude` finds only `skills/workflow/SKILL.md` for each of "MUST allocate every new id", "whose commit is behind `<base>`", "who is affected", "A replacing item MUST state its full text" and "An architecture gap MUST re-plan", and nothing for "§Amendments", "`plan` §Quizzes" and "Models row 9"; skill-sizes gives `plan: 170/170`), unit
  - needs: TR-2
