# Milestone: new-skills

Parent: `docs/DESIGN.md` section Milestones, line `new-skills`; the decision in section
Decisions, the line of 2026-11-02 on groups B and C. Branch: `milestone-new-skills`.

## Goal

Two skills from mattpocock/skills (<https://github.com/mattpocock/skills>, commit
4ae2317, MIT) become armory skills. `debug`, from `diagnosing-bugs`, owns the diagnosis
of a bug whose cause is not known; a new `debugger` agent runs it and, in the fix flow,
fixes the bug under the `implement` fix rules. `retro`, user-only, reviews the current
session and lists ranked findings for the project and for armory; it changes nothing.

## Scope

In:

- `skills/debug/SKILL.md` (new) and `skills/setup/templates/agents/debugger.md` (new).
- `delegate`: the Debugging row and section What each agent returns; `code`, where the
  main session spawns for a bug.
- `implement` section Fixing and refactoring: only the pointers and the hand-over to
  the debugger; the fix rules stay.
- `skills/retro/SKILL.md` (new).
- `setup`: the card count and list; the rendered `.claude/agents/debugger.md` here.
- `docs/DESIGN.md`, this repo's `AGENTS.md`, `README.md`: each skill list, card list and
  load table the new skills and card change.

Out:

- The source's HITL script, its `agents/` and `scripts/` folders, and its glossary and
  ADR reads.
- A host term for stored session logs: `retro` reads only the current session.
- `retro` as a step of `code` section Task end (dropped on 2026-11-02).
- The source's seam rule and fix steps: `implement` keeps the fix rules.

## Requirements

Each `BR` is checked by reading the files, by `lint`, or by a grep.

- BR-1: `debug` MUST make the actor build a feedback loop before any hypothesis: one
  command, already run once, that drives the bug's code path and asserts the reported
  symptom, and is deterministic, fast and runs without a human. With no such loop, the
  actor MUST stop and report what it tried.
- BR-2: `debug` MUST make the actor reproduce the reported symptom with the loop and
  minimise the repro until each remaining element is needed for the failure.
- BR-3: `debug` MUST make the actor write 3–5 ranked hypotheses, each with a
  falsifiable prediction, and test them with probes that change one variable at a
  time. A performance bug MUST get a baseline measurement first. The debugger MUST test
  its own ranking and report the list with a verdict for each hypothesis.
- BR-4 (replaced by BR-14): each debug log MUST carry one unique prefix; before the
  end, a grep for it MUST show no hit. The commit message of the fix MUST state the
  confirmed hypothesis.
- BR-5: every command, output and artifact that `debug` shows MUST replace each secret
  with `<REDACTED>`.
- BR-6 (replaced by BR-15): a `debugger` agent card MUST load `core`, `debug`,
  `implement` and `test`, run in its own worktree, and after the diagnosis write the
  regression test and the fix under `implement` section Fixing and refactoring. Its
  report MUST hold the hypothesis list and the two `core` report slots.
- BR-7: the main session MUST spawn the debugger for a bug whose cause is not known: a
  bug the user reports with no cause, or a coder `stuck:` after two failed fixes. The
  `delegate` Debugging row MUST name the debugger.
- BR-8: `retro` MUST be a user-only skill (the `small-rules` form) that the main session
  runs on the current session. It MUST change no file.
- BR-9: `retro` MUST look for four finding classes: navigation and information access;
  checks and review rules (a mechanical miss gets a check, a judgement miss gets a
  review rule); context size and no-op lines; tool economy. Each finding MUST name the
  file to change, the change, and whether it targets the project or an armory skill.
  The findings MUST be ranked by severity.
- BR-10: `setup` MUST render six agent cards, the debugger included.
- BR-11: `lint` MUST pass. A new skill MUST carry `max-lines`.
- BR-12: a new skill or card, or a moved fact, MUST have every list, load table,
  reference and restatement updated in the same commit.
- BR-13 (replaced by BR-17): the debugger MUST run in one of two flows, named in its
  brief: diagnose only, or diagnose and fix. The diagnose-only flow MUST NOT write the
  fix; it MUST end with
  a report of the confirmed cause, the loop command with its last output, a proposed
  fix outline, and the list of debug commits. It MAY commit debug code (the loop, a
  harness, tagged logs); each debug commit subject MUST start with `debug(<id>):`,
  where `<id>` is the id of the run's prefix.
- BR-14: each debug log MUST carry one unique prefix for the run. In the fix flow,
  before the end, a grep for the prefix MUST show no hit, and the commit message of the
  fix MUST state the confirmed hypothesis.
- BR-15 (replaced by BR-19): a `debugger` agent card MUST load `core`, `debug`,
  `implement` and `test`, run
  in its own worktree, and take its flow from the brief. In the fix flow it MUST write
  the regression test and the fix under `implement` section Fixing and refactoring. Its
  report MUST hold the hypothesis list, the diagnose-only items of BR-13 in that flow,
  and the two `core` report slots.
- BR-16 (replaced by BR-18): the main session MUST pick the flow from the request:
  diagnose only when the user asks for the cause; the fix flow when the user asks for a
  fix, or for a coder's
  `stuck: cause unknown`. When the request is unclear, it MUST ask the user. A fix
  after a diagnose-only run MUST go to the coder with the cause and the debug commits
  in its brief; the coder MUST revert each debug commit after the fix passes.
- BR-17: the debugger MUST run in one of two flows, named in its brief: diagnose only,
  or diagnose and fix. The diagnose-only flow MUST NOT write the fix; it MUST end with a
  report of the confirmed cause, the loop command with its last output, a proposed fix
  outline, and the debug branch with its commits. It MAY commit debug code (the loop, a
  harness, tagged logs), only on a branch `debug-<id>` cut from the task branch, where
  `<id>` is the id of the run's prefix; each debug commit subject MUST start with
  `debug(<id>):` and MUST keep the `on` gates green, so a loop test goes in skipped. The
  debug branch MUST NOT be merged into the task branch.
- BR-18: the main session MUST pick the flow from the request: diagnose only when the
  user asks for the cause; the fix flow when the user asks for a fix, or for a coder's
  `stuck: cause unknown`. When the request is unclear, it MUST ask the user. A bug whose
  cause neither the plan nor a diagnose-only report names MUST go to the debugger. A fix
  after a diagnose-only run MUST go to the coder with the cause, the loop command, the
  fix outline and the debug branch in its brief. At task end, the main session MUST ask
  the user, for each debug branch, whether to delete or keep it.
- BR-19: a `debugger` agent card MUST load `core`, `debug`, `implement` and `test`, run
  in its own worktree, and take its flow from the brief. In the fix flow it MUST write
  the regression test and the fix under `implement` section Fixing and refactoring. Its
  report MUST hold the hypothesis list, the diagnose-only items of BR-17 in that flow,
  and the two `core` report slots.

## Tasks

Format: `<branch> : <what> : <BR list> : <status>`. In execution order; the status
values are in the armory `plan` skill, section Levels.

- debug-skill : the `debug` skill, the debugger card and its spawn rules : BR-1, BR-2,
  BR-3, BR-4, BR-5, BR-6, BR-7, BR-10, BR-11, BR-12, BR-13, BR-14, BR-15, BR-16,
  BR-17, BR-18, BR-19 : done
- retro-skill : the user-only `retro` skill : BR-8, BR-9, BR-11, BR-12 : open

## Risks

- A sixth card grows every project's agent set; projects set up before this milestone
  need a `setup` rerun to get the debugger.
- `debug` and `implement` both speak about bugs; a rule stated in both breaks SSOT. The
  task run gives each rule one home.
- The installed plugin cache is older than the repo; a dry run of `debug` or `retro`
  reads the repo files by path.
- `retro` reads only the current session; findings from earlier sessions need the user
  to restate them.

## Done criteria

- Each `BR` is met, checked by reading, by `lint`, or by a grep.
- Both tasks are done, and the done write marks the milestone done in `docs/DESIGN.md`
  (`code` section Task end).
