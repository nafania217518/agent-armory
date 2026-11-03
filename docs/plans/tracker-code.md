# Plan: tracker-code

Parent: `docs/milestones/tracker.md` section Tasks, line `tracker-code`.

## Goal

A `code` run claims its task item, writes the done write after the Finish answer,
and closes items directly or through a PR merge; briefs quote each `BR` from its
tracker item. Two dry runs prove the milestone on a live GitHub tracker and on the
docs fallback. Quiz on 2026-11-03: done write after Finish; one `closes by PR merge:`
line; stop or push only keeps the claim; the dry runs run in one subagent with
answers and approvals given up front.

## Requirements

- TR-1 (tracker/BR-25, tracker/BR-17): `code` section Branch and plan file MUST say
  that with a tracker bound (`plan` section Levels, tracker variant), the run claims
  its task item as its first tracker write, before it cuts the task branch. When the
  item is assigned to another person, it MUST stop and ask the user: take it over,
  pick another ready task, or stop.
  tests: none, a prose rule; checked by reading, by `lint` and by the GitHub dry run.
- TR-2 (tracker/BR-31, tracker/BR-17): `skills/setup/templates/AGENTS.md` `## Tracker`
  MUST hold the line `closes by PR merge: <no | the closing reference form>`, for
  example `Closes #<id>`. `setup` question item 8 MUST propose it from the probe and the
  answer checks MUST treat it as required. `docs/DESIGN.md` section 3 MUST name it.
  `setup` MAY raise `max-lines` from 217.
  tests: none, a prose rule and a template; checked by reading and by `lint`.
- TR-3 (replaced by TR-8, TR-10, TR-11) (tracker/BR-18, tracker/BR-17): `code` section
  Task end MUST give the tracker done write, run after the Finish answer in place of
  step 9, with no repo commit for status. It MUST comment on the task item with the
  branch, the plan file path and, when they exist, the merge commit or the PR link.
  Then: on a merge into `<base>`, set the task item done, and the milestone item too
  when it was the last open task; on a PR with a closing reference form, the PR body
  MUST carry the closing reference for the task item, and for the milestone item when it
  was the last open task, and MUST NOT set them done itself; on a PR with `closes by PR
  merge: no`, set the items done after the user merges the PR; on push only or stop,
  comment only, and the item keeps its claim. `templates/pr.md` MUST gain an optional
  closing-reference line. `code` MAY raise `max-lines` from 117.
  tests: none, a prose rule; checked by reading, by `lint` and by the GitHub dry run.
- TR-4 (tracker/BR-14, tracker/BR-17): `delegate` section Briefs MUST say that with a
  tracker bound, each `BR` is quoted from the item that holds it (the milestone item,
  or the task item for a task with no milestone), read at brief time. `delegate` MAY
  raise `max-lines` from 149.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-5 (tracker/BR-34, tracker/BR-17): with no tracker bound, every armory flow MUST
  behave as before the milestone, except for the fixes of BR-33.
  tests: the docs dry run (below); reading of each tracker clause for its gate.
- TR-6 (tracker/BR-25, tracker/BR-17): `plan` section Plan file MUST say that a task run
  with a tracker bound first makes the claim of `code` section Branch and plan file,
  before it cuts the task branch. `plan` MAY raise `max-lines` from 230.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-7 (tracker/BR-24, tracker/BR-28, tracker/BR-17): the `core` verb MUST read "list an
  item's children, in order, each with its status, assignee and blockers".
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-8 (tracker/BR-31, tracker/BR-21, tracker/BR-17): the PR-body closing rule MUST live
  only in `code` section Finish: one line per item, the `closes by PR merge:` form with
  the item's id filled in; `templates/pr.md` MUST match. Step 11's PR case MUST only
  leave the status to the PR merge. The `core` naming rule MUST exempt the closing line.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-9 (tracker/BR-28, tracker/BR-17): `core` MUST say that `## Tracker` binds each
  verb, the target and the `closes by PR merge:` line. `core` MAY raise `max-lines` from
  154.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-10 (tracker/BR-31, tracker/BR-17): with `closes by PR merge: no`, step 11 MUST set
  the items done only when the run merges the PR itself after the user's yes; else its
  report MUST say that the items stay open.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-11 (tracker/BR-31, tracker/BR-17): the done comment MUST name the merge commit, or
  the merged HEAD commit on a fast-forward.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-12 (tracker/BR-27, tracker/BR-17): the optional branch-name verb MUST be a read
  with no side effect; a tracker that can only create the branch MUST leave the verb
  unbound (`core`, `setup`).
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-13 (tracker/BR-29, tracker/BR-17): the `core` marker rule MUST read: one marker
  line above each block of text a run adds to an item body, and at the start of each
  comment and each new item body.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-14 (tracker/BR-5, tracker/BR-17): the milestone tracker variant of `plan` MUST drop
  the template title line, and drop `## Goal` when the item already holds its one-line
  goal.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-15 (tracker/BR-33, tracker/BR-17): `code` section Branch and plan file MUST give
  the fallback `git remote set-head origin -a` when the `<base>` lookup finds no
  `origin/HEAD`, and MUST cut the task branch with `git switch --no-track -c
  <task-branch> <base>`.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-16 (tracker/BR-33, tracker/BR-17): `setup` MUST ask the local-or-committed question
  only when it installs the hook or the skills in the repo, and MUST name its task
  branch `setup-armory`.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-17 (sweep part replaced by TR-20) (tracker/BR-33, tracker/BR-17): `plan` MUST say
  that a docs-fallback task with no milestone takes a slug of its title as its branch,
  and that a run that reads a milestone whose tasks are all done marks the milestone
  done (in the milestone item, or in `DESIGN.md` for the docs fallback), as a listed
  write.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-18 (tracker/BR-33, tracker/BR-17): when `setup-armory` exists, `setup` MUST delete
  it and cut it again if it is merged into `<base>`, else cut `setup-armory-<n>` with
  the next free `<n>`.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-19 (tracker/BR-33, tracker/BR-27, tracker/BR-17): the `plan` rule that a task with
  no milestone takes a slug of its title as its branch MUST apply only with no tracker
  bound.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-20 (tracker/BR-33, tracker/BR-29, tracker/BR-17): the milestone-done sweep MUST run
  only in a task-level plan run, or a `code` run, that adds no task to the milestone;
  with a tracker bound, its write MUST follow the `core` tracker write rule.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-21 (tracker/BR-33, tracker/BR-17): when both the `origin/HEAD` lookup and `git
  remote set-head origin -a` fail (a remote with no commits), `<base>` MUST be the local
  default branch, as with no remote.
  tests: none, a prose rule; checked by reading and by `lint`.

BR-16 (`lint` and `unit` pass on every commit) is a gate on every commit.

## Test scope

None in `scripts/`: the change is prose and templates; `lint` checks the skills. The
dry runs are the acceptance check of the milestone.

## Risks

- The GitHub dry run writes to a live private repo under the user's account; the user
  deletes it after.
- The dry-run agent plays the main session of a scratch project; it cannot ask the
  user, so a question outside the script takes the recommended option and is recorded.

## Stack choices

## Out of scope

- Drift detection (milestone Scope Out).
- A claim conflict with a second person: the scratch repo has one user; reading only.

## Accepted tech debt

## Overrides

- `core` section Host terms, tracker rule "a subagent MUST NOT write": the dry-run
  agent plays the main session of the scratch project, with the user's approval given
  in this plan.

## Caveats
