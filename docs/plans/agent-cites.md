# Plan: agent-cites

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `agent-cites`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-21): MUST, in `skills/craft/SKILL.md`, replace lines 23-25 with the first block, lines 66-67 with the second block and lines 77-79 with the third block; MUST delete " Test that already fails on `<base>`: `implement` §4." from line 99; MUST set `max-lines` to the line count.

      - Scope MUST also hold each caveat-base line that names a file the change touches. Line
        found false SHOULD be reported with its fix, its new file or `drop`; main session has
        it written.

        change: coder MUST stop and report `stuck:` with the why.

      - Happy path, each edge case the requirement touches and each failure path (invalid
        input, missing dependency, error from a callee) MUST each have their own test.

  - tests: lint (skill-graph `--verbose` gives the summary line `craft: section 2` and no `cite` report on `skills/craft/SKILL.md`; at b778b04: `craft: cite 6, section 7`), unit
  - needs: none
- TR-2 (skill-architecture-redesign/BR-21): MUST, in `skills/test/SKILL.md`, set `extends: [core, craft, output-budget]`, replace lines 98-101 with the block, and set `max-lines` to the line count.

        a finding. Two more cases MUST be findings: in a `sociable` project, a double for a
        collaborator that is not remote, slow, non-deterministic or side-effecting; a separate
        service with no `contract` test while that gate is `on`.

  - tests: lint (`test: section 2`, no `pointer` or `cycle` report on `test`; at b778b04: `test: cycle 1, pointer 1, section 3`), unit
  - needs: none
- TR-3 (skill-architecture-redesign/BR-21): MUST, in `skills/implement/SKILL.md`, replace lines 6-7 with the first block; set `extends: [core, craft, output-budget]`; make lines 22-23 read "How to write code, for coder and debugger. Reviewer judges code against it."; make line 62 read "A human reads every line you write."; replace lines 99-104 with the second block; set `max-lines` to the line count.

        the gates per commit, atomic commits. Loaded by the coder and debugger cards;
        "/implement". Not for a coding request from the user.

        Exceptions: a failure that already exists on `<base>`, and the debugger's diagnose-only
        exemption. MUST compare with `<base>` to tell.
      - Gate failure that already exists on `<base>` MUST NOT be fixed. It MUST be recorded as
        an out-of-scope finding.
      - Before your report, every `on` gate the brief does not leave to main session MUST pass,
        or the report names the failing gate.

  - tests: lint (`implement: section 2`, no `cite`, `pointer` or `cycle` report on `implement`; at b778b04: `implement: cycle 1, pointer 1, section 7`; `git grep -n -F '`code`' -- skills/implement/SKILL.md` finds none), unit
  - needs: none
- TR-4 (skill-architecture-redesign/BR-21, skill-architecture-redesign/BR-38): MUST make these edits in one commit. In `skills/research/SKILL.md`: set `extends: [core]`; replace lines 25-27 with block A, 28-36 with block B, 48-51 with block C, 54-55 with block D and 67-68 with block E; set `max-lines` to the line count. In `skills/dnd/SKILL.md`: insert block F after line 47 and block G after line 73; set `max-lines` to the line count. In `skills/delegate/SKILL.md`: insert block H after line 176; set `max-lines` to the line count. In `skills/review/SKILL.md`: make lines 153-154 read "  the `Unverified:` part of `research` §1."; set `max-lines` to the line count. Blocks A to H follow in order.

        or changelog, independent sources (§2). A review finding or a report claim, caveat
        line included, with no proof MUST carry one more part, last:
        `Unverified: <the source or command that settles it>`; in a caveat line it follows one
        more ` : `. A proven claim MUST name its proof: the command, `path:line` or URL.

      - Main session MUST delegate web search and page reading to a researcher. Raw page text
        MUST NOT enter main context.
      - Before a question round, main session MUST send to research each open point whose
        options turn on an outside fact (library, tool, API, domain fact) or user's intent
        (goal, scope, priority, taste). One round's points and claims to prove MUST go in one
        researcher brief, split only past 5 web questions. Brief MUST state each point and its
        options with no preferred option.

        3. smallest option: one that leaves least built or changed at task end (`core` §4,
           YAGNI).

        that disagree, newer MUST win, in place of §2 choice of winner; agent MUST still say
        so. Run MUST log it in question's message text.

        to an agent on the Opus research row, fresh or reused, with those sources in its
        brief.

      - Before the run answers a question itself, MUST send its open points to research as
        `research` §1 sets for a question round. Each researcher brief MUST say the run is
        `dnd`.
      - An intent point's ladder (`research` §1) MUST take common practice from research as
        basis 3, for how a thing is done, never for whether or what to build, and the fallback
        option of the bullet above as basis 4, in place of smallest option.

      - MUST log there each disagreement between two sources of one basis (`research` §1), in
        place of the question's message text.

      - A researcher brief with an open point (`research` §1) MUST name row 7, or row 8 with a
        web question.

  - tests: lint (`research: section 4`, no `cite`, `pointer` or `cycle` report on `research`; at b778b04: `research: cycle 1, pointer 1, section 12`; `git grep -n -F 'Unverified: <the source or command that settles it>' -- skills` finds only `skills/research/SKILL.md`; `git grep -n -F '`dnd`' -- skills/research/SKILL.md` finds none), unit
  - needs: none
- TR-5 (skill-architecture-redesign/BR-21): MUST, in `skills/review/SKILL.md`, set `extends: [core, implement, research, test]`; insert the first block after line 15; replace lines 19-20 with the second block and lines 37-39 with the third block; set `max-lines` to the line count. TR-4's edit at lines 153-154 lands first.

      Load `implement` before you judge code when its rules are not in your context.
      Load `test` before you judge a test when its rules are not in your context.
      Load `research` before a finding on an unchecked or model-memory claim when its rules are
      not in your context.

      Reviewer judges code against `implement` and tests against `test`. "Reported" means
      listed as a finding.

      - With a plan, MUST take expected load from plan's load `TR`s. With no plan, MUST find
        it: a figure in `<docs>/DESIGN.md`, else in README or deploy config. MUST judge scale
        against it.

  - tests: lint (`review: section 10`, no `cite`, `pointer` or `cycle` report on `review`; at b778b04: `review: cycle 1, pointer 1, section 12`), unit
  - needs: TR-2, TR-3, TR-4
- TR-6 (skill-architecture-redesign/BR-21): MUST, in `skills/audit/SKILL.md`, set `extends: [core, review]`; insert "Load `review` before your first step when its rules are not in your context." after line 15; replace lines 19-24 with the first block and lines 44-45 with the second block; make line 50 read "  their claims, one spawn per topic file, plus one for root list."; set `max-lines` to the line count.

      Reviewer runs an audit on an audit brief; main session sends one when user asks. Audit
      MUST apply these `review` rules to a whole repo or package: full-report and read-only
      rules (`review` §1, first bullet), order of importance and classes (`review` §3),
      `review` §4, and finding groups and format of `review` §5. This skill holds only what
      differs from a review.

      - MUST check caveat base: each pointer names an existing topic file, and each entry's
        file exists. Each failure MUST be a finding.

  - tests: lint (`audit: section 5`, no `cite`, `pointer` or `cycle` report on `audit`; at b778b04: `audit: cycle 1, pointer 1, section 11`), unit
  - needs: TR-5
- TR-7 (skill-architecture-redesign/BR-21): MUST, in `skills/debug/SKILL.md`, insert the block after line 14 and set `max-lines` to the line count.

      Load `implement` before your first code edit or commit when its rules are not in your
      context.
      Load `test` before you write a test when its rules are not in your context.

  - tests: lint (`debug: section 5`, no `pointer` or `cycle` report on `debug`; at b778b04: `debug: cycle 1, pointer 1, section 5`; the skill-graph line reads `cycle: code, delegate, plan, setup, triage`, and no `card-main` line appears), unit
  - needs: TR-2, TR-3, TR-4, TR-5, TR-6
- TR-8 (skill-architecture-redesign/BR-21): MUST, in `docs/DESIGN.md` §4, make the `research` home row read `` | `research` | 7 | researcher; reviewer, through the pointer of `review` | ``, and append ``, `research` `` before the closing ` |` of the actor rows "reviewer" and "reviewer, audit brief".
  - tests: none, table text that no check reads
  - needs: TR-5

- 2026-11-19: review fixes (auto-fix): TR-4 block F puts the ladder bullet (block G's neighbour) right under the fallback bullet and the research-brief bullet after it, and that bullet also makes each researcher brief state the `dnd` ladder (common practice as basis 3, the fallback option as basis 4); TR-1 moves the edge-case kinds of `review` §3 class Bug into `craft` §3, and `review` §3 cites `craft` §3.

