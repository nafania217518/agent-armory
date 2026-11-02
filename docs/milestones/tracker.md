# Milestone: tracker

Parent: `docs/DESIGN.md` section Milestones, line `tracker`. Branch: `milestone-tracker`.

## Goal

Team projects plan and track work in their own tracker. With a tracker bound, the
tracker holds the milestone list, each milestone with its scope and `BR` list, the
tasks with their blocked-by edges, and all status; the repo keeps `DESIGN.md`
architecture and decisions and the task plan files. Without one, armory works as
today. Quiz on 2026-11-03 (strategic and milestone runs): the decisions of
`docs/DESIGN.md` section Decisions, dated 2026-11-03; three tasks; the tracker rules
sit in `core` by the term; a claim is the item's assignee; the drift check is deferred.

## Scope

In:

- `core` section Host terms: the `tracker` term, its verbs, its fallback and its rules.
- `setup`: the tracker probe and the `## Tracker` section; `templates/AGENTS.md`.
- `plan`: the tracker variant of each level; templates `strategic.md`, `milestone.md`,
  `task.md` where their lines name repo docs.
- `code`: the claim and the tracker done write. `delegate` section Briefs.
- `docs/DESIGN.md` sections 3 and 4 when a rule home moves.
- Two dry runs: a new private GitHub repo through `gh`, and the docs fallback.

Out:

- Drift detection: how a task run finds a `BR` change in the milestone item since its
  plan was approved. Deferred by the user on 2026-11-03.
- A triage flow and its labels.
- Migration of existing milestone docs into a tracker.
- Seed bindings shipped for any tracker.
- A fourth status value.
- Armory's own planning on a tracker.

## Requirements

Each `BR` is checked by reading the files, by `lint`, by `unit` or by a dry run.

- BR-1: `core` section Host terms MUST define the `tracker` term with its verbs: read
  an item (body and comments), list an item's children, create an item, link a child
  to its parent, add a blocked-by edge, claim (assign to the user), comment, and set
  the status open, done or dropped. Its binding MUST live in the project context
  `## Tracker`, not in the host profile. Its fallback MUST be the repo docs of `plan`
  section Levels.
- BR-2: `core` MUST hold the tracker rules next to the term: only the main session
  writes to the tracker, and a subagent MAY read; each write MUST be one the approved
  plan lists, or MUST get the user's yes first; each item body and comment an agent
  writes MUST start with one fixed AI marker line; a run MUST NOT edit a parent item it
  did not create; when a bound tracker is unreachable, the run MUST stop before the
  tracker step and ask the user, and MUST NOT fall back to the repo docs.
- BR-3: `setup` in project scope MUST probe the host's connections (MCP servers and
  CLIs) for a tracker, propose a binding for each verb of BR-1, and ask the user to
  confirm or edit it. When no connection fits, it MUST ask the user how to reach the
  tracker, or to keep the docs fallback. It MUST write `## Tracker` only for a bound
  tracker.
- BR-4: `skills/setup/templates/AGENTS.md` MUST hold the `## Tracker` section with its
  format line, and `setup` section Write MUST name it as the one optional section.
- BR-5: `plan` section Levels MUST give the tracker variant of each level. Strategic:
  each new milestone becomes a top-level tracker item, and `DESIGN.md` holds no
  milestone list. Milestone: the milestone item body takes the sections of
  `templates/milestone.md` except Tasks; each task becomes a child item with its
  blocked-by edges. Status MUST live only in the tracker.
- BR-6: with a tracker bound, a milestone run MUST cut its branch only when it writes a
  repo file.
- BR-7: a plan run MAY start from an existing tracker item; it MUST read the item's
  body and comments first and take the item as its milestone or task. Else it MUST
  create the items only after the approval.
- BR-8: the approval question of each level MUST list the tracker writes the run will
  make.
- BR-9: with a tracker bound, a task with no milestone MUST keep its `BR` list in its
  own task item; the plan file keeps the `TR` list.
- BR-10: with a tracker bound, the task plan file's parent line MUST name the task item
  and its milestone item.
- BR-11: with a tracker bound, the next task of a milestone MUST come from the
  frontier: the open tasks whose blockers are all done and that no one has claimed.
- BR-12: a `code` run with a tracker bound MUST claim its task item as its first
  tracker write. When the item is already assigned to another person, it MUST stop and
  ask the user: take it over, pick another frontier task, or stop.
- BR-13: with a tracker bound, the done write of `code` section Task end MUST comment
  on the task item with the branch, the merge commit or PR link and the plan file path,
  then set the item done. When it was the milestone's last open task, it MUST also set
  the milestone item done. It MUST make no repo commit for status.
- BR-14: with a tracker bound, a brief MUST quote each `BR` it covers from the tracker
  item that holds it, read at brief time (`delegate` section Briefs).
- BR-15: with no tracker bound, every armory flow MUST behave as before this milestone.
- BR-16: `lint` and `unit` MUST pass on every commit. A skill MAY raise its
  `max-lines`.
- BR-17: a changed fact or rule MUST have every reference and restatement updated in
  the same commit.

## Tasks

Format: `<branch> : <what> : <BR list> : <status>`. In execution order; the status
values are in the armory `plan` skill, section Levels.

- tracker-term : the `tracker` term and its rules in `core`; the probe and
  `## Tracker` in `setup` and its template : BR-1, BR-2, BR-3, BR-4, BR-16, BR-17 :
  open
- tracker-plan : the tracker variant of each plan level, start from an item, listed
  writes, lone-task `BR`, parent line, frontier : BR-5, BR-6, BR-7, BR-8, BR-9, BR-10,
  BR-11, BR-16, BR-17 : open
- tracker-code : the claim, the tracker done write, briefs from tracker items, then
  both dry runs : BR-12, BR-13, BR-14, BR-15, BR-16, BR-17 : open

## Risks

- `max-lines` room: `core` 130/134, `plan` 191/194, `code` 115/117, `delegate`
  147/149, `setup` 207/215. Each task raises what it needs.
- Without drift detection, a team edit to a milestone `BR` can go unseen until a
  brief quotes it. The brief quotes the live text (BR-14), so the coder sees it, but
  the `TR` list may no longer match.
- The GitHub dry run creates a private repo under the user's account: an
  outward-facing write. It needs the user's yes at run time; the user deletes the repo
  after.
- `gh` needs 2.94+ for sub-issues and blocked-by edges; 2.103.0 is installed.
- The installed plugin lags the repo: the dry runs read the repo skills by path.
- BR-15 covers every flow, but only the docs dry run and reading check it.

## Done criteria

- Each `BR` is met, checked by reading, by `lint`, by `unit` or by a dry run.
- GitHub dry run on a new private repo, repo skills read by path: `setup` binds
  `## Tracker` through `gh`; a strategic run creates a milestone item; a milestone run
  creates task child items with blocked-by edges; a task run claims, codes, comments
  and closes the task, and closes the milestone at its last task; each agent-written
  body and comment starts with the AI marker.
- Docs dry run: one task run on a scratch repo with no tracker follows today's flow.
- All three tasks are done, and the done write marks the milestone done in
  `docs/DESIGN.md` (`code` section Task end).
