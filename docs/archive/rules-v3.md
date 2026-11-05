# Rules v3

Snapshot of the armory skill rules at commit 89b1628 (2026-11-05). Reference only: the
skills under `skills/` stay the single source. It holds one section per skill, with
the skill body as is, the frontmatter and the preamble dropped and each heading one
level down. The one frontmatter rule, in `retro`, opens its section. The `setup`,
`triage` and `plan` skills are not in it. The earlier snapshot is
`docs/archive/RULES-v2.md`.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.

## core

Base rules for the main session and every subagent. The hook or the pointer injects
them (section Host terms).

### 1. Rule words

- MUST and MUST NOT have one exception: the approved plan MAY override a design rule, a
  MUST rule included, because the user approved it. Design rules: section Design
  principles; `implement` sections The smallest complete change and Domain, boundaries
  and state. The plan's Overrides section names each override (`plan` section The plan).
- A SHOULD rule is on by default. The agent MAY bypass it for one task only, with a
  reasonable cause or after the user approves. Section Reports records each bypass, and
  an override only when it is made during the work.
- MAY is the agent's choice. Every rule MUST carry one RFC 2119 word.

### 2. Writing and questions

- Replies and docs MUST follow "80% ASD-STE100": sentences of about 20 words max, one
  idea each, active voice, present tense, one meaning per word, no idioms, no filler.
  Natural phrasing and domain terms stay where strict STE reads badly.
- Each main-session reply to the user MUST follow the three rules below. A skill's fixed
  output format and the question bullets of this section win over them.
  - Shape: MUST lead with the answer or the next action, a command, path or snippet
    first. Before sending, MUST delete an announcing first line, a recap of done work, an
    offer as the last line, and a side remark. The first and last lines alone MUST tell
    what happened and what is next. A reply to "explain" or "walk through" MAY run long,
    under headers.
  - Lists: steps MUST be numbered, one bounded action each, the fewest that work. A
    free-prose group SHOULD hold about five items max, most relevant first, the rest on
    request. When completeness matters, MUST keep every relevant item.
  - Flow: when anything is open, MUST end with one concrete next action. A second issue
    MUST get its own question, never a clause of the first. With an approved plan, each
    turn MUST restate step n of m and the next step through the task list, with no prose
    copy of the plan.
- A report SHOULD explain each technical term at first use, for a reader new to the code.
- A code comment MUST say only the why the code cannot show, in one line. Exceptions:
  the `req:` marker (`test` section Markers) and the `tech-debt:` marker (`implement`
  section The smallest complete change).
- The main session MUST ask the user through the question tool; the message text MUST
  hold only the context. A free-text question (a name, a description, a command) MAY
  offer only "Other", or go as a plain message. A subagent cannot reach the user: it
  MUST report `stuck: <question>` instead.
- A choice question MUST have 2–4 options, the recommended one first. One call MUST hold
  1–4 questions; more questions MUST go in more calls.

### 3. Tools and background tasks

- MUST NOT use `nohup`, `command &` or any other detached shell job for a background
  task. MUST start it as a tracked background task of the host.
- A tracked background task or a spawned agent MUST stop as soon as it is no longer
  needed, by stop tool, timer or any other means. One left running MUST have a valid
  reason, stated in the report. `code` section Task end checks only these kinds.
- Web search and page reading MUST follow `research` section When to research.

### 4. Design principles

- YAGNI: MUST NOT design or implement anything that was not requested.
- DRY + SSOT: each fact, rule, decision or piece of logic MUST live in exactly one
  place. Everywhere else MUST reference it.
- DAMP: test code MAY repeat itself when that reads easier; the one exception to DRY.
  SHOULD extract a helper at the third repeat.
- Big design up front: the design MUST be complete and refined before implementation.
- MUST NOT optimize without a measured problem.
- Occam's razor + KISS: SHOULD prefer the explanation or solution with the fewest
  elements, as simple as the task allows, so a reader understands it without help.
- SHOULD get the data shape right before the logic. SHOULD do first what helps every
  later phase. SHOULD aim at an end state you can check; a break in the middle MAY
  happen when it is planned and can be undone.
- Work not obvious at a glance: SHOULD do one unit by hand, then build the tool that
  does the rest, matched to that unit.

### 5. Models

- MUST NOT run anything on Fable without the user's yes. Subagent models: `delegate`
  section Models.

### 6. Reports

- Every subagent report MUST hold two slots, each under its label. Recorded-items slot,
  `Recorded items:`: each recorded item with its kind, or `no recorded item`. Caveat
  slot, `Caveats:`: each caveat as one caveat line, or `no caveat`. A caveat is anything
  a later reader of the code would not expect: a changed default, a pinned version pair,
  a deprecated call, a limit.
- A subagent report MUST hold only the items of its card's report format, the two
  slots, and the returns other armory rules require. It MUST NOT narrate the steps,
  restate the brief, or paste file content, a diff or command output that none of these
  asks for. It MUST point to code by `path:lines` or commit SHA instead.
- A report item is needed when the main session uses it to spawn an agent, to plan or
  change the next work, or to put a decision to the user. A report format and a report
  MUST hold only needed items, and every needed item. Each item MUST give only its value.
  An item whose condition does not hold MUST be left out.
- A caveat line, in a report or in the project context `## Caveats`, MUST take the
  format `- SHORT_DESCRIPTION : <file>`, a list item, or `- SHORT_DESCRIPTION : —` when
  no file exists yet. It MUST hold one fact. A caveat with two facts MUST become two
  lines, or one line with only the fact a reader would not expect.
- A finding that the output already numbers MUST be referenced by its number in the
  recorded-items slot, not repeated.
- These items MUST be recorded during the task: each SHOULD bypass and each override
  made during the work (section Rule words), scope addition (`test` section Test scope),
  design misfit (`implement` section Before you write), out-of-scope finding
  (`implement` sections The smallest complete change and Gates per commit; `test`
  section Pyramid), and Should fix or Nice to have finding (`review` section Output).
  A subagent MUST put each recorded item in its report.
- The main session MUST make every write to the project context `## Caveats`; a
  subagent MUST NOT write to it. `code` section Caveats sets when the main session
  writes.

### 7. Host terms

- question tool: the host's structured way to ask the user. Fallback: the main session
  MUST ask in plain text, one round at a time, with numbered options and the default
  marked.
- skill load: the host's way to load a skill by name. Fallback: the agent MUST read the
  skill file from the armory clone.
- spawn: the host's way to run a subagent from an agent card. Fallback: the main session
  MUST do that work itself under the card's rules.
- agent card: the host's agent definition file, rendered from an armory template.
  Fallback: the card's rules MUST live as a section of the project context.
- worktree: an isolated checkout per coding agent. Fallback: coders MUST run one at a
  time in the task branch.
- plan mode: the host's read-only planning mode; its exit is the approval. Fallback: the
  main session MUST ask an explicit approval question through the question tool.
- task list: the host's list of plan steps with their status, shown to the user.
  Fallback: the main session MUST give one line `Step <n> of <m> done. Next: <step>.`
- hook: the host's command that injects `core` at session start and at subagent start.
  Fallback: the pointer, one line in the global context or the project context that
  MUST load `core`, and the profile when it sits elsewhere, at session start.
- global context: the file or setting the host loads in every session. Fallback: when
  none is editable, the profile MUST stay in the run and in the report.
- project context: the file the host loads for a project (`AGENTS.md`, `CLAUDE.md`, a
  rules file); the skills MUST name its sections. Fallback: when none is editable, the
  sections MUST stay in the run and in the report. Its `## Rules` line `Documentation
  lives in <folder>` sets `<docs>` for every actor.
- tracker: the system that holds the milestones, the tasks and their status (`plan`
  section Levels). Verbs: read an item (body, comments and labels), list an item's
  children, in order, each with its status, assignee and blockers, create an item, edit
  an item body, link a child to its parent, add a blocked-by edge, claim (assign to the
  user), comment, set the status open, done or dropped; optional: branch name (a read of
  the tracker's branch name for an item, with no side effect), and the label verbs:
  list items (by status and label), list labels, set labels (add or remove) and create
  label. The project context `## Tracker` binds each verb, the target, the
  `closes by PR merge:` line and the `label <role>: <label>` lines (`triage`), not the
  host profile. Fallback: the repo docs of `plan` section Levels.
  - A subagent MAY read the tracker but MUST NOT write to it. It MUST report a needed
    write to the main session instead.
  - Each write MUST be one that the approved plan lists. Any other write MUST get the
    user's yes first.
  - Before a run's first create, the main session MUST check that the binding targets
    the project's own tracker. It MUST ask the user when the target points elsewhere,
    such as a fork's upstream or another organization.
  - A run MUST put the marker line `> *This was generated by AI.*` above each block of
    text it adds to an existing item body, and at the start of each comment and each
    new item body.
  - A report or an item text MUST name a tracker item by its title, with its link
    inside, not by a bare id. The PR closing line (`code` section Finish) is exempt: it
    takes the binding's form with the id.
  - A run MUST NOT edit the body of a parent item (an item above the one the run plans
    or codes), except to write an amendment the user approved (`plan` section
    Amendments). It MUST comment on that item instead. A run that starts from an
    existing item MUST keep the item's text and add its own sections below it.
  - When a bound tracker is unreachable, the run MUST stop before the tracker step and
    ask the user. It MUST NOT fall back to the repo docs.

The host profile binds each term except `tracker` on the host; `setup` writes it.

Outside this section, every skill uses these terms and skill names; it MUST NOT name a
host's own tool or file.

## delegate

The main session follows this skill for each spawn of a project agent.

### 1. Context

- The main session SHOULD stay small: it delegates intensive reading (many files, long
  files, wide searches) and other bulk work to agents, and keeps only what they return.
  It SHOULD delegate coding, review and writing to the project agents through a spawn,
  else its fallback (`core` section Host terms).
- When the main session wrote code in the task, every review MUST go to a reviewer
  agent through a spawn, else its fallback. A bypass of the delegation rule above MUST
  NOT cover it.
- In any other task, a main session that bypasses the delegation rule for a review
  MUST load `review` and run it itself.

### 2. Delegation and worktrees

- Coding agents that run at once MUST each run in their own worktree. Without worktrees,
  they MUST run one at a time (`core` section Host terms).
- Two agents that run at once MUST NOT edit the same file.
- A worktree a spawn cuts MAY start from the default branch: the brief MUST name the
  task branch (the coder card sets the reset).
- When an agent finishes in a worktree, the main session MUST merge its branch into the
  task branch, run `lint` and `unit`, then remove the worktree. `code` section Review
  loop sets the review that follows.
- This merge MAY run without the user's yes.
- A diagnose-only debugger result MUST NOT be merged: the main session keeps its
  `debug-<id>` branch and removes the worktree.
- A worktree with uncommitted work MUST wait for the user's decision when no retry
  follows (section Re-spawn and retry) or the retry fails too.

### 3. Briefs

- A coding or review brief MUST hold: the full text of each `TR` it covers, quoted from
  the plan file, and of each `BR` it covers, quoted from the milestone doc, or from the
  plan file for a task with no milestone (`plan` section Plan file), or with a tracker
  bound (`plan` section Levels, tracker variant), from the item that holds it (the
  milestone item, or the task item for a task with no milestone), read at brief time;
  the test-scope list (`test` section Test scope), from the plan; for a review brief,
  also each scope addition with its reason, from the coder or debugger recorded-items
  slot; the project context lines of `## Commands`, `## Gates`, `## Test levels` (the
  unit style included), `## Rules` and `## Caveats` that apply; which skills or skill
  sections the agent loads; the task branch and `<base>` (`code` section Branch and
  plan file); the plan's Overrides and Accepted tech debt sections (`plan` section The
  plan).
- A review brief MUST also hold the commit range and, for a final review, the
  whole-task checks. A re-review brief MUST hold the findings sent to fix.
- Any other brief (research, reading, writing) MUST hold the question and the context
  the agent needs.
- The `core` rules reach every subagent through the hook, else its fallback. A brief
  MUST NOT repeat them or claim `core` is in context; the agent loads it when the hook
  did not.

### 4. What each agent returns

- The project agents MUST be these six: coder, debugger, reviewer, researcher, writer
  and planner. Each card `skills/setup/templates/agents/<agent>.md` holds the role rules
  and the report format.
- Only the main session MAY delegate. A subagent cannot spawn agents, so it MUST do the
  work of its brief itself.
- Each report MUST hold the recorded-items slot and the caveat slot of `core` section
  Reports.
- Each agent returns its card's report. The coder and the debugger also return
  `stuck: <why>`; the researcher, `sources disagree`.
- A bug whose cause neither the plan nor a diagnose-only report names MUST go to the
  debugger, not the coder. So MUST a coder's `stuck: cause unknown`; it MUST NOT get the
  retry of section Re-spawn and retry.
- The main session MUST name the debugger's flow in the brief: diagnose only when the
  user asks for the cause; the fix flow when the user asks for a fix, or for a coder's
  `stuck: cause unknown`. When the request is unclear, it MUST ask the user. A fix after
  a diagnose-only run MUST go to the coder, with the cause, the loop command, the
  proposed fix outline and the debug branch in the brief.

### 5. Models

- Fable, Opus, Sonnet and Haiku are tier names; the host profile (`setup`) maps each to
  a model id of the host.
- Each subagent spawn SHOULD use the model and effort of its row in the table below
  (`core` section Rule words covers a bypass). The user picks the main session model.
- A task that no row names SHOULD run on Opus, with effort from the effort map.
- Effort map, each SHOULD: `low` for one clear step or a ready spec; `medium` for
  several steps with some judgment; `high` for analysis, comparison, review, design, an
  unknown cause.
- `max` MUST be used only through the Fable question, or when the user asks.

| Task | Model | Effort |
|---|---|---|
| Coding from a brief (TDD), a fix whose cause the plan or a diagnose-only report names included | Opus | low |
| Coding, trivial change | Sonnet | low |
| Debugging: a bug whose cause neither the plan nor a diagnose-only report names | Opus | high |
| Refactoring; code review, any diff size; audit; planner: any draft | Opus | high |
| Writing or summary, restating given facts | Sonnet | low |
| Writing or reading that needs judgment | Opus | effort map |
| Research, one fact from an official source | Sonnet | low |
| Research: sources disagree, many sources, a comparison, a design choice | Opus | high |
| Trivial task, no reading (run, list, grep, format, gate runs) | Haiku | low |
| Trivial task, light reading | Sonnet | low |
| Frontier task | the Fable question | — |

- Default rows: coder "Coding from a brief" (Opus low); debugger "Debugging" (Opus
  high); reviewer and planner (Opus high); researcher "one fact" and writer
  "restating" (Sonnet low). A spawn MAY override the default with another row.
- The table MUST be read with these definitions:
  - Trivial change: no new branch, loop or data shape (renames, typos, config values,
    copy edits, code moved as is, a change given in full in the brief). Trivial task:
    mechanical work that needs no judgment.
  - Judgment test: Sonnet when the input holds every fact and the job is to restate it;
    Opus when the job is to choose, compare, find gaps or decide.
  - Frontier task: complex, unusual work that needs a frontier model (pentests, attack
    prevention, complex vulnerabilities, deep reverse engineering, big system design,
    complex analysis from many sources). Triggers: security-critical work, work across
    many systems, a case that an Opus-high reviewer cannot judge.
- A task with a frontier trigger MUST count as a frontier task. A planner or researcher
  spawn MUST move to the frontier row when the case is complex or has a trigger.

### 6. The Fable question

- A frontier task, or a user request for Fable, MUST go through the Fable question: a
  question through the question tool, else its fallback, with the options Opus high
  (default, first), Opus max, Fable high, Fable max. `core` section Models requires the
  user's yes for any run on Fable.

### 7. Re-spawn and retry

- A spawn fails when it returns no report or a `stuck:` report. These MUST NOT count
  as a fail: a failing gate (`implement` section Gates per commit and `review` section
  The diff is the truth handle it); a `sources disagree` report (`research` section
  Sources), whose section sets the re-spawn.
- A spawn that fails because of an open requirement or a question for the user MUST go
  to the user at once.
- Any other failed spawn SHOULD get one retry on Opus high. When the spawn had a
  worktree, the retry MUST run in it, on its uncommitted work: its brief MUST name the
  worktree path of the first spawn, since the agent card cuts a fresh one. The main
  session MUST remove that fresh worktree when the retry ends; one with uncommitted work
  MUST wait for the user's decision. When the retry fails too, the main session MUST
  ask the user.

## code

The main session follows this skill after `plan` section Self-review and approval.
Spawns follow `delegate`. The coding rules are in `implement` and `test`.

- No approved plan: MUST run `plan` first.
- When the main session codes itself, it MUST load `implement` and `test`; for a bug
  whose cause neither the plan nor a diagnose-only report names, also `debug`.

### 1. Branch and plan file

The plan file and its first commit follow `plan` section Plan file. The merge of a
worktree branch into the task branch is in `delegate` section Delegation and worktrees.

- MUST work on one branch per task.
- `<base>` MUST mean the same branch in every armory skill: with a remote, `origin/HEAD`
  (first command below; when it finds none, the fallback command, then the lookup
  again); without one, or when the fallback also fails (a remote with no commits), the
  local default branch (`main` or `master`, whichever exists), else the current branch.
- The tech quiz MAY confirm `<base>` when it is unclear.
- MUST cut the task branch from `<base>`. With a remote, MUST run `git fetch origin`
  first.
- With a tracker bound (`plan` section Levels, tracker variant), the run MUST claim its
  task item as its first tracker write, before it cuts the task branch. When the item
  is assigned to another person, the run MUST stop and ask the user: take it over, pick
  another ready task, or stop.
- MUST NOT commit to `<base>`.
- MUST ask the user before any push, and before any merge into `<base>`, PR merges too.

```
git symbolic-ref --short refs/remotes/origin/HEAD
git remote set-head origin -a    # fallback: no origin/HEAD
git fetch origin
git switch --no-track -c <task-branch> <base>
```

### 2. Caveats

Before the plan-file commit, a caveat goes into the plan (`plan` section The plan). The
caveat slot, the caveat format, the subagent ban and the recorded items are in `core`
section Reports.

- The main session MUST write each caveat it receives after the plan-file commit into
  the project context `## Caveats` immediately.

### 3. Running the plan

Brief each item as `delegate` section Briefs sets. A requirement change during the work
follows `plan` section Amendments.

- MUST run the plan items in the plan's order, also when they go to different executors.
- A finding that blocks the task MUST NOT wait for the recorded-items quiz. It is
  `stuck:` (`delegate` section Re-spawn and retry).

### 4. Review loop

- The reviewer MUST run on each coder or fix-flow debugger result: its diff, after the
  merge when the agent ran in a worktree.
- After a review, the main session MUST have each Must fix item fixed (`delegate`
  section Context), run the reviewer on the fix commits, and repeat until no Must fix
  remains.
- Loop bound: when a loop needs a third round, the main session MUST ask the user first.
- The final review MUST cover only the commits since the last review, or since `<base>`
  when none ran. It MUST add these whole-task checks on `<base>..HEAD`: each requirement
  met, the `req:` markers, the work summary against the diff, stray files, the gates.

### 5. Task end

- Before the task report: every `on` gate MUST pass, or the report MUST name the failing
  gate.
- The recorded-items quiz MUST offer these options per kind:
  - scope addition: keep or revert;
  - model-row bypass (`delegate` section Models): accept, or re-run it on its row;
  - other SHOULD bypass or override made during the work: accept, or undo if possible;
  - out-of-scope finding or design misfit: fix as an amendment, make it a follow-up, or
    ignore;
  - Should fix or Nice to have finding: fix now, make it a follow-up, or ignore.
- The main session MUST take these steps in this order:
  1. Stray-task check: MUST check each task in the scope of `core` section Tools and
     background tasks. One that still runs with no valid reason is a stray task: MUST
     stop it, report it as a finding, and write a caveat on its cause (section Caveats).
  2. MUST run the final review and its fix loop (section Review loop).
  3. MUST run the recorded-items quiz, then apply the answers.
  4. After any commit since the last review: MUST run `lint` and `unit` again, and the
     reviewer on each such commit that is not a pure revert.
  5. Quiz loop: MUST repeat steps 3 and 4 while a re-review in step 4 adds a new
     recorded item. The loop bound (section Review loop) applies.
  6. The report MUST hold, in this order: a one-line outcome; the met requirements in
     one line by id range (`TR-1..TR-7 met`), then each unmet one with its id and
     status; the gate results, one line per gate; what was skipped or not checked; each
     recorded item with only its applied answer; any risk the user must know.
  7. Acceptance: MUST ask the user which items they want to try by hand, with the exact
     commands or clicks for each.
  8. Cleanup: MUST ask the user whether to keep the plan file and the design docs the
     task added to the repository. Default: keep them. It MUST also ask, for each
     `debug-<id>` branch, whether to delete or keep it.
  9. Done write: when the task has a milestone, MUST make one more commit, the last on
     the task branch. It MUST mark the task done in the milestone doc. When the task was
     the milestone's last open one, the same commit MUST also mark the milestone done in
     `<docs>/DESIGN.md` (`plan` section Levels). It MUST change only status lines, so the
     re-review of step 4 does not apply. It MUST NOT be committed directly on `<base>`.
     A task with no milestone MUST skip this step. With a tracker bound, step 11
     MUST replace this step.
  10. Finish: section Finish.
  11. Tracker done write, with a tracker bound: after the Finish answer, MUST comment
      on the task item with the branch, the plan file path and, when they exist, the
      PR link and the merge commit (the merged HEAD commit on a fast-forward). It MUST
      make no repo commit for status. "The items" MUST mean the task item, and the
      milestone item too when the task was its last open one. Per Finish answer:
      - merge into `<base>`: MUST set the items done;
      - PR, with a closing reference form in `closes by PR merge:`: the run MUST
        leave the status to the PR merge;
      - PR, with `closes by PR merge: no`: MUST set the items done only when the run
        merges the PR itself after the user's yes; else the report MUST say that the
        items stay open;
      - push only or stop: MUST comment only; the task item MUST keep its claim.

### 6. Finish

- MUST ask the user whether to push, open a PR, merge into `<base>`, or stop. Section
  Branch and plan file guards each push and merge.
- A PR body MUST take the sections, order and format lines of `templates/pr.md`,
  relative to this skill.
- With a tracker bound and a closing reference form in `closes by PR merge:`, the PR
  body MUST end with one closing line per item of section Task end, step 11: that form
  with the item's id filled in. Else it MUST hold no closing line.

## implement

How to write code, for the coder, the debugger, or the main session when it codes. The
reviewer judges code against it. Test rules: `test`.

### 1. Before you write

- MUST read the task and the code it touches.
- MUST list every place the change must reach: callers, tests, fixtures, config,
  exports. That is the scope. Extra features are not.
- MUST check what the change can break for users: data it would destroy or expose,
  callers that stop working.
- A vague request SHOULD get the smallest version that does the core job.
- Design misfit: when a new requirement does not fit the design, SHOULD ask what you
  would build had it been there from the start. When that differs from the plan, the
  coder MUST still follow the plan and MUST record the misfit with its reasoning (`core`
  section Reports). It MAY stop and report at once when going on wastes significant
  work. On the user's yes, the change goes back to plan mode (`plan` section
  Amendments); the new design SHOULD ship in pieces.
- When the plan cannot be followed at all, the coder MUST stop and report `stuck:` (the
  coder agent card).

### 2. The smallest complete change

- The ladder. MUST take the first option that fully works:
  1. Does it need to exist? Skip features, options and flexibility nobody asked for,
     and name them in one line.
  2. Already in this codebase? Use it the way the surrounding code does.
  3. Standard library or platform feature? Use it, unless the project has its own.
     SHOULD prefer a house component over a native widget.
  4. An installed dependency? Use it. MUST NOT add a dependency for a few lines.
  5. One line a reader gets at a glance? One line.
  6. Otherwise: the minimum code that works.
- MUST ship the smallest complete change, once you know everything it must touch. MUST
  finish every caller, test and fixture that the change breaks. A one-liner that needs
  decoding MUST NOT count as small.
- MUST limit the change to the scope (section Before you write) and the approved plan.
  MUST NOT make unrequested changes: refactors, renames, reformatting, fixes outside
  the scope. The one exception is the scope addition (`test` section Test scope).
- A bug found outside the scope MUST NOT be fixed. It MUST be recorded as an
  out-of-scope finding.
- MUST NOT add an abstraction, wrapper, type conversion, option, config, boilerplate or
  "for later" code that nobody asked for.
- SHOULD keep values in the form the platform already gives.
- MUST keep the structure the codebase already has: its layers, interfaces and
  conventions, unless the approved plan changes them (`core` section Rule words). Code
  that is already clear and local MUST stay as it is.
- Code that is moved or merged MUST keep its error handling and validation.
- Between options of equal size, MUST take the one that is correct on edge cases.
- Never cut: MUST keep validation at trust boundaries, error handling that prevents data
  loss, security, accessibility, the calibration real hardware needs, and anything the
  user asked for.
- A shortcut with a known limit MUST carry the marker comment
  `tech-debt: <what was simplified>, <the limit>, <when to upgrade>`.
- A `tech-debt:` marker MUST NOT cover a shortcut on a never-cut item (above).

### 3. Readability

A human reads every line you write. `review` section Look for checks these rules.

- Names of variables, functions and classes MUST say what they hold or do.
- Lines SHOULD stay under 120–140 characters, with spacing.
- A long signature or call SHOULD put one argument per line, unless it hurts readability.
- High-level code SHOULD be short and read as the steps: one function that calls private
  helpers with clear names, not one long function.
- SHOULD prefer chaining over a declarative mess, unless it hurts readability. A chain
  MAY span several lines when each call has its own line.

### 4. Domain, boundaries and state

- Domain structure and types MUST make illegal states and values impossible to write.
- SHOULD report each new domain term. The main session writes it into the project
  context `## Glossary`, so two agents never edit that file at once.
- MUST check and parse outside data once, where it enters. Inside, trust it.
- SHOULD keep the business logic in pure functions.
- MUST NOT silence the compiler.
- An operation that can run more than once MUST be idempotent: a second run, or a run
  after a crash halfway, ends in the same state. Such operations are retried handlers,
  jobs, migrations, scripts, message consumers and a resume after a crash. A plain
  create call MUST be idempotent only when the plan says so.
- MUST NOT share mutable state that does not need to be shared. Shared state MUST have
  one writer, enforced by the structure.

### 5. Fixing and refactoring

- MUST fix the root cause of each bug in scope (bugs outside it: section The smallest
  complete change). A bug report or an own finding MUST first get a test that reproduces
  it. Then MUST grep every caller of the function you touch and fix the cause once, in
  the shared code. A guard that only hides the crash MUST NOT count as a fix.
- After two failed fixes that share one premise, MUST write the premise in one sentence
  and remove it. MUST NOT start a third fix before that.
- A coder that still has no cause after that MUST report `stuck: cause unknown`, with
  the premise it removed.
- When the brief names a debug branch, MUST NOT merge it; MUST write the fix on the
  task branch instead. MAY copy its loop test, without the debug prefix and the skip,
  as the regression test.
- Refactoring: MUST pin what the code does with a test, change the structure, then prove
  the behavior did not change.
- SHOULD sequence work into small units. Finish and check one before you start the next.

### 6. Tests while coding

- MUST change only the test cases on the test-scope list. A new case in an existing file
  is an addition, not a change outside the scope.
- A test outside the list that the change makes fail MUST count as a bug the change
  introduced. MUST fix the code so the test passes. A test that already fails on
  `<base>`: section Gates per commit.
- MAY add the test to your scope only when you can prove it was missed from the list:
  the change is expected and explains the failure.
- MUST report the test only when you can neither fix the code nor prove the miss.

### 7. Gates per commit

The gates and their commands are in the project context `## Gates` and `## Commands`.

- `coverage`: MUST run the command and never compute a number yourself. The build
  tools hold the threshold.
- `owasp`: MUST run the command, then read the changed code against the current OWASP
  Top 10.
- Per commit: `lint` and `unit`, when `on`, MUST pass, except a failure that already
  exists on `<base>` (`code` section Branch and plan file). MUST compare with it to tell.
- A gate failure that already exists on `<base>` MUST NOT be fixed. It MUST be recorded
  as an out-of-scope finding. `code` section Task end sets the report gates.
- Before your report, every `on` gate MUST pass, or the report names the failing gate.
- The report MUST give one line per gate for a commit range when every commit in it
  gives the same result. A commit that differs MUST get its own line.

### 8. Commits

- Commits MUST be small and atomic: one requirement or one fix per commit, also in one
  coder result that covers several items.
- Subject: MUST be one imperative sentence under 72 characters that says what was done,
  so that `git log --oneline` reads as the log of the task.
- Body: SHOULD say why and how the change was proved.

## test

What to test, at which level, and how.

### 1. Pyramid

- You SHOULD write fewer tests the higher the level: many `unit`, some `integration`
  and `functional`, very few `e2e`.
- You MUST put a test at the lowest level that can prove the behavior.
- A bug that only a higher-level test finds MUST get the lower-level test.
- The coder MAY delete a higher-level test on the touched behavior that only repeats a
  lower-level one. The deletion is a scope addition (section Test scope). A duplicate
  outside the touched behavior MUST NOT be touched. It MUST be recorded as an
  out-of-scope finding (`core` section Reports).

### 2. Levels

Each level MUST cover what its line says, in every project. A project adds to these
lines in its project context `## Test levels`.

- unit: one unit (a function, a class, or a small cluster), fast, runs on every change.
  Frontend unit tests with the backend stubbed are `unit`.
- integration: narrow, one integration point at a time (a real database, the file
  system, one separate service or its double), at the boundary of the service. The test
  MUST start the real part, trigger the code that uses it, and check the result there.
- contract: consumer-driven contract tests for each interface with a separate service.
  The consumer MUST write the contract; the provider MUST verify it. It keeps the
  doubles of `integration` honest.
- functional: acceptance from the user's view, black box, given/when/then, through the
  API or the UI, externals doubled.
- e2e: the deployed stack through its UI or API, the main user journeys only. Slow and
  flaky by nature: the project SHOULD keep only the few that earn their place.
- Surface rule: each surface MUST have at least one test level. Frontend: `unit` or
  `e2e` (browser). Backend: `unit` or `integration`. CLI and library: `unit`.

### 3. Unit style

- The project MUST pick `sociable` (real collaborators; doubles only for remote,
  non-deterministic, slow or side-effecting ones) or `solitary` (every collaborator
  doubled). Default: `sociable`.
- You SHOULD stub queries, and verify a call only when the call is the behavior.

### 4. TDD

- You MUST write the failing test for every requirement before the code, except one with
  `tests: none`. You MUST work one test at a time: write it, see it fail for the
  expected reason, make the smallest change that passes it, and only then write the
  next test. A test that passes on its first run MUST fail once you break the code it
  covers; you MUST then undo the break.
- A requirement where an honest test is impractical MUST NOT get a bad test. The plan
  MUST decide it: the plan item carries the line `tests: none, <why>`.
- A coder that finds a planned test impractical MUST NOT drop it. That is a requirement
  change (`plan` section Amendments): the coder MUST stop and report `stuck:` with the
  why. `delegate` section Re-spawn and retry handles the rest.
- A test MUST call the code through its public interface, as its user does, and check
  what that user sees.
- A test that still passes when every function returns nothing MUST be thrown out.
- An expected value MUST come from a source independent of the code: a literal, a worked
  example, the spec. A test MUST NOT compute its expected value the way the code does.
- You MUST NOT assert the order of internal calls, or test private methods or trivial
  code (a getter, a pass-through, code with no branch).
- The happy path, each edge case the requirement touches (`review` section Look for,
  class Bug) and each failure path (invalid input, a missing dependency, an error from a
  callee) MUST each have their own test.

### 5. Test scope

- The main session MUST write the test-scope list into the plan: the existing test
  cases the change will break, rework or remove, each with the reason.
- A scope addition is the one exception to the ban on unrequested changes (`implement`
  section The smallest complete change). It MUST be a failing test proven missed from
  the list (`implement` section Tests while coding), or a duplicate higher-level test on
  the touched behavior (section Pyramid). Its recorded item MUST carry its reason.
- The reviewer MUST check the reason and the code of each scope addition, and decide
  whether a rework is needed.

### 6. Structure and naming

- A test SHOULD arrange, act, assert (given, when, then).
- A test SHOULD check one condition; there SHOULD be one test per condition.
- A test case name MUST state the behavior. A prefix the framework requires comes first.
  The requirement id MUST NOT be in the case name or the file name.
- A test file MUST be named after the unit under test, in the framework's convention.
- You SHOULD keep one test file per unit and level; a unit's requirements share it.
  The level's command sets what marks its files: directory, suffix, build tag or target.

### 7. Markers

- The test that proves a requirement MUST carry the marker `req: <task-branch>/TR-n` in a
  comment on the line above the case, or above the group that holds its tests
  (`// req: add-login/TR-8`; several ids: `// req: add-login/TR-8, add-login/TR-13`).
  Scan:
```
git grep --no-index --exclude-standard -nE '(#|//|/[*]) ?req: ' -- ':!*.md' ':!<docs>/'
```
- The scan MUST cover only code and test files: a marker in prose is an example.

### 8. Determinism

- A test MUST be deterministic: no sleep as a wait, no mutable state shared between
  tests, no dependence on test order or the clock.
- A real timer MAY run in an integration test when the timer is the behavior under test,
  with the shortest wait that proves it.

### 9. Review checks

- Each breach of a MUST or MUST NOT in this skill or in `implement` section Tests while
  coding MUST be reported as a finding, in the group `review` section Output sets. Two
  more cases MUST be findings: in a `sociable` project, a double for a collaborator that
  is not remote, slow, non-deterministic or side-effecting; a separate service with no
  `contract` test while that gate is `on`.

## debug

How to find the cause of a bug, for the debugger or the main session when it debugs.
It runs in one of two flows: diagnose only (section 6), or diagnose and fix, the fix
flow (section 7). The brief names the flow, or the user's request when the main session
debugs itself.

### 1. Redact

- Each command, output and artifact you show MUST replace each secret with
  `<REDACTED>`.
- A loop MUST read credentials from the environment, so no secret appears in the
  command.
- A quote from a captured artifact MUST hold only the lines with the signal.
- When the redacted output is not enough to diagnose the bug, MUST report `stuck:` with
  what is missing.

### 2. Feedback loop

- MUST NOT write a hypothesis, or build a theory from reading code, before the loop
  exists. MUST build the loop first.
- MUST take the first way to build the loop that works, in this order:
  1. A failing test at the seam that reaches the bug.
  2. An HTTP script against a running dev server.
  3. A CLI run on a fixture, diffed against a known-good output.
  4. A headless browser script.
  5. A replay of a captured trace through the code path.
  6. A throwaway harness that calls the code path with one function call.
  7. A property or fuzz loop over many random inputs.
  8. A bisection harness for `git bisect run`, when the bug appeared between two known
     states.
  9. A differential run of two versions or two configs on the same input.
- SHOULD tighten the loop: make it faster, assert on the exact symptom, and make it
  deterministic (pinned time, seeded random, isolated files and network).
- A flaky bug: SHOULD raise the reproduction rate (repeat the trigger, run in parallel,
  add stress) until the rate is high enough to debug against.
- Done when one command, already run once with its output shown, goes red on the
  reported symptom, gives the same verdict each run (a flaky bug: a pinned high rate),
  runs in seconds and needs no human.
- With no such loop, MUST stop and report `stuck:` with what you tried and what you
  need: access to an environment that reproduces the bug, a redacted captured artifact,
  or a yes for temporary instrumentation.

### 3. Reproduce and minimise

- MUST run the loop several times and check that it shows the reported symptom, not a
  nearby failure. MUST capture the exact symptom: the error message, the wrong output
  or the slow timing.
- MUST cut inputs, callers, config, data and steps one at a time, with a loop run after
  each cut. A cut that turns the loop green MUST be undone.
- Done when removing any remaining element turns the loop green.

### 4. Hypotheses

- MUST write 3–5 ranked hypotheses before you test any.
- Each hypothesis MUST carry a falsifiable prediction in the form `If <X> is the cause,
  then <changing Y> makes the bug go away`. A hypothesis with no prediction MUST be
  dropped or sharpened.
- Done when the ranked hypotheses, each with its prediction, are written.

### 5. Probes

- Each probe MUST test one prediction and change one variable.
- SHOULD use a debugger or a REPL first, then targeted logs at the boundaries that tell
  the hypotheses apart.
- MUST NOT log everything and grep. MUST name the targeted log and the hypothesis it
  tests instead.
- Each debug log MUST carry one unique prefix for the run, such as `[DEBUG-a4f2]`.
- A performance bug MUST get a baseline measurement first, then a bisection.
- MUST test your own ranking and record a verdict for each hypothesis: confirmed,
  refuted or untested. Done when one hypothesis is confirmed. When all are refuted,
  MUST go back to section 4.

### 6. Diagnose only

- MUST NOT write the fix. MUST end with the report instead.
- MAY commit debug code (the loop, a harness, tagged logs), only on a branch
  `debug-<id>` cut from the task branch, where `<id>` is the id of the run's prefix.
  MUST NOT merge it into the task branch; MUST name it in the report instead.
- Each debug commit subject MUST start with `debug(<id>):`. Each debug commit MUST keep
  the `on` gates green: a loop test goes in skipped, with the prefix in its name.
- Done when the report names the confirmed hypothesis, the loop command with its last
  output, a proposed fix outline, and the debug branch with its commits, no debug code
  is left uncommitted, and the checkout is back on the branch the run started on.

### 7. Fix and cleanup

In the fix flow:

- The fix MUST follow `implement` section Fixing and refactoring. The minimised repro
  MUST become its regression test.
- Done when the original loop passes, a grep for the prefix shows no hit, each
  throwaway harness is deleted, and the commit message of the fix states the confirmed
  hypothesis.

## review

The reviewer, or a main session that reviews itself, judges code against `implement` and
tests against `test` (load both when not in context). "Reported" means listed as a
finding.

### 1. Understand first

- Review and audit are reports the user asked for: MUST give them in full. Both are
  read-only: MUST NOT change any tracked file. Gate output (a coverage folder) is exempt.
- MUST review what the user names: uncommitted or staged changes, a branch, a PR link,
  or files. Nothing named: the uncommitted changes, or else the last commit.
- Inside a task, the review MUST cover the commit range and the checks the brief names.
  With no brief, the range and checks of `code` section Review loop apply.
- MUST read the task the change serves: the `BR` and `TR` text in the brief, the user's
  request, the PR description, or the commit messages.
- MUST read the diff, then the code it touches: callers of every changed function, the
  functions it calls, the tests, the README.
- MUST trace the real flow: where data comes in, what is stored, what goes out.
- When a signature, return value or behavior changes, MUST grep every caller.
- MUST find the expected load in the repo (README, deploy config); judge scale against it.

### 2. The diff is the truth

- MUST check the commit messages or the work summary against the diff. A wrong or
  missing change MUST be reported.
- Stray files in the diff (test inputs, outputs, scratch scripts) MUST be reported.
- MUST run every `on` gate at the range's last commit (a detached worktree when HEAD moved
  past it), or take the run the brief hands over; `owasp` reading included (`implement`
  section Gates per commit, also for a failure already on `<base>`). An `on` gate with no
  command MUST be reported.
- MUST confirm that an `on` gate's command covers each changed file, else report the file.
  A prose or docs file is exempt when no gate covers prose: the reviewer MUST read it.
- Each requirement the task names MUST be shown met by the diff or by a check.
- A `TR` that traces to no `BR` is scope creep and MUST be reported.
- MUST grep the `req:` markers (`test` section Markers). A `TR` with code and no marker
  MUST be reported, unless its plan item says `tests: none`.
- A marker whose task branch or id the task does not have MUST be reported. This check
  MUST scan only the lines the diff adds or changes.
- Test cases changed outside the declared test scope MUST be reported. `test` section
  Test scope sets how to check a scope addition.
- When the diff touches tests, MUST apply `test` section Review checks.

### 3. Look for

- Findings MUST follow this order of importance: correct, safe, holds under load, tested,
  fast, lean, well shaped, readable.
- A review and an audit MUST cover each class:

1. Bug: wrong result, crash, missed edge case (empty, zero, last item, rounding, time
   zones), a caller the change breaks, a fix in one caller while the shared function
   stays broken, callers that disagree on a return value, one rule applied two ways.
2. Risk: security holes (injection, weak randomness, secrets, missing checks on input
   from users), data loss (errors swallowed, writes in the wrong order, no transaction).
3. Scale: fine for one user, wrong for many: check-then-write races, the same work done
   by every process, memory or lists that only grow, a query per item, O(n²) on big
   input, per-process state that must be shared.
4. Missing test: risky new logic (a branch, a parser, money, security, data writes, a
   bug fix) with no test that fails when it breaks. Judge by that, not by coverage.
5. Speed: big slowdowns are problems. Small wins (hot-loop repeats) are suggestions.
6. Lean: code that should not exist or should be smaller.
   - delete: dead code, unused options, flags and config, speculative features
   - reuse: the repo already has this helper (name the path); two helpers do one job
   - stdlib / native: stdlib or platform does it; a dependency does what a few lines can
   - yagni: an abstraction with one implementation, a factory with one product, a
     wrapper that only passes calls through, config nobody sets. Deletion test: delete
     the module in thought; complexity that vanishes marks a pass-through, complexity
     that returns in every caller marks a module that earns its place. A seam with one
     adapter is hypothetical; a second adapter makes it real.
   - merge: near-copies that must change together
   - split: a function with unrelated jobs, hard to read or test. Split by job, not lines.
   - unrequested (review only): a change the task did not ask for: a refactor, a
     rename, reformatting, a fix outside the scope. Fix: revert it.
7. Shape: code in the wrong place or form. Each smell is a judgement call. A `## Rules`
   line in the project context that allows the pattern MUST remove the finding, unless
   the code also breaks an `implement` MUST.
   - Feature Envy: a function uses another unit's data more than its own. Fix: move it
     to that data.
   - Data Clumps: the same fields or parameters travel together. Fix: one type for them.
   - Primitive Obsession: a primitive or a string stands for a domain concept and lets
     an illegal value in (`implement` section Domain, boundaries and state). Fix: a
     small type of its own.
   - Shotgun Surgery: one change edits many scattered places. Fix: gather what changes
     together into one module.
   - Message Chains: a caller reaches through objects it does not own, as in
     `order.customer().address().city()`. Fix: one method on the first object hides the
     walk.
   - Repeated Switches: the same switch on one type in several places. Fix: one shared
     map, or polymorphism.
8. Readability: code that breaks a rule of `implement` section Readability.

### 4. Check before you report

- Every finding MUST have a concrete case: "this input or situation leads to this wrong
  result".
- MUST re-read the lines and confirm: the caller exists, the value can be empty, the code
  is unused.
- A `tech-debt:` marker (`implement` section The smallest complete change) that is a
  decision MUST NOT be reported, unless the expected load already crosses its limit. In
  a review, a marker is a decision only when the plan's Accepted tech debt section names
  it (`plan` section The plan); one the diff adds that is not a decision MUST be reported
  as Should fix. In an audit, a marker that names its limit is a decision.
- MUST propose the smallest fix that works. SHOULD prefer fixes that delete code. MUST
  NOT add layers, frameworks or config the problem does not need.
- MUST NOT report style taste, "consider", or vague worries.

### 5. Output

- A reviewer subagent on a task's commit range MUST start with the load assumed only.
  Any other review MUST start with `What this change does:` in two or three sentences,
  and the load assumed. Then MUST give `Gates:`, one line per gate: `pass`; `fail <one
  line>`; `fail <one line>, exists on <base>`, no blocker; `(per <who> at <commit or
  range>)` after `pass` or `fail` for a run by another agent; `off <reason from the
  project context>`; `no command`; `not run (<cause>)`, neither pass nor fail, when an
  `on` gate's command cannot run (a file the range lacks: name the commit that adds it).
- On a re-review, MUST check each finding sent to fix, and MUST give after `Gates:` one
  `Re-review:` line per earlier finding: `fixed`, `open` or `not re-opened`.
- Findings MUST come in three groups, empty groups skipped:
  - Must fix: bug, security, data loss, breaks at the expected load, an `on` gate
    failure that the change introduced.
  - Should fix: risky code without a test, real slowness, duplication, a function that
    mixes jobs, code that should not exist, a smell (class Shape), code that is hard to
    read; process findings, unless one hides a bug: a breach of a `test` rule (a missing
    or wrong `req:` marker, a test case changed outside the scope), a commit message not
    matching the diff, a stray file.
  - Nice to have: small speed-ups, shorter forms.
- A wrong fact in prose or config MUST be graded by its effect, like code: Must fix when
  it misleads a reader into a wrong action, else Should fix.
- Each finding MUST have a number across all groups, a bold title with `file:lines` (or
  `commit <sha>`), then three parts of one or two short sentences each: Problem, Fix,
  If we skip it.
- Then MUST give `Answers:`, one line per question or listed check the brief asks the
  reviewer to judge, or `no question`; then the two slots of `core` section Reports.
- MUST end with these lines, in this order: `Verdict: Ship.` or
  `Verdict: fix 1 and 3 first.`; `Not checked:` one line on what mattered and could
  not be checked, each `per` and `not run` gate included, or `nothing`.
- Nothing found: one line on what was checked MUST replace the groups; `Re-review:` stays.

## audit

The reviewer runs an audit on an audit brief; the main session runs it when the user
asks. Load `review`, `test` and `implement` first. The audit MUST apply these `review`
rules to a whole repo or package: the full-report and read-only rules (`review` section
Understand first, first bullet), the order of importance and the classes (`review`
section Look for), `review` section Check before you report, and the finding format of
`review` section Output. This skill holds only what differs from a review.

### 1. Map first

- MUST audit what the user names: a folder, a package, or the whole repo. Nothing
  named: the whole repo.
- MUST read the README, deploy and build config, dependency list, entry points (main,
  routes, handlers, jobs, CLI commands) and tests.
- MUST find the expected load.
- MUST trace the main flows end to end. MUST read these fully: input from users, money,
  auth, data writes, background jobs, anything shared between processes.
- Big repo: SHOULD go deep where a mistake costs the most, not file by file. SHOULD
  read first the files that `git log` shows changing most often.

### 2. Audit-only checks

- Before you call code unused, MUST grep the whole tree, including tests, fixtures,
  config, and string or dynamic references.
- When the tree has tests, MUST apply `test` sections Pyramid and Review checks to the
  whole suite: the pyramid shape, duplication across levels.
- When the `owasp` gate is `on`, MUST run the `owasp` command on the whole tree. Then
  MUST read the entry points and data writes against the OWASP Top 10.

### 3. Tech-debt ledger

- MUST grep the `tech-debt:` markers, skipping `.git` and ignored files. MAY add other
  comment prefixes for the stack.

```
git grep --no-index --exclude-standard -nE '(#|//|/[*]) ?tech-debt:'
```

- MUST skip hits that are not a deferral.
- MUST give one row per marker, grouped by file:
  `<file>:<line>, <what was simplified>. ceiling: <limit>. upgrade: <trigger>.`
- A marker with no upgrade trigger MUST get a `no-trigger` tag.
- MUST end the ledger with `<N> markers, <M> with no trigger.` Nothing found: MUST give
  `No tech debt. Clean ledger.`

### 4. Output

- MUST start with `What this repo does:` in two or three sentences, and the load
  assumed. Then MUST give the `Gates:` block of `review` section Output.
- Then MUST give the findings, the tech-debt ledger, the recorded-items slot and the
  caveat slot (`core` section Reports).
- MUST end with these lines, in this order: `Verdict:` one line (`Verdict: healthy.`, or
  what to fix first); `Not checked:` the parts not read or not run.
- Nothing found: MUST give `What this repo does:`, `Gates:`, the ledger, one line on
  what was checked and the two slots. The end lines follow, with `Verdict: healthy.`

## research

How to check a claim against sources. The main session delegates; the researcher reads.

### 1. When to research

- A claim that can be outdated is a hypothesis until a source confirms it. It MUST go
  to research when the plan or the code depends on it and the installed source, the
  types or the repo docs do not settle it.
- The main session MUST delegate web search and page reading to an agent on a research
  row (`delegate` section Models). Raw page text MUST NOT enter the main context.
- The agent MUST return only the result of section Result. A subagent MUST do the web
  work itself (`delegate` section What each agent returns).

### 2. Sources

- MUST read the official documentation, changelog or source code first.
- When the official source is unclear, old or disputed, SHOULD read at least 3 further
  independent sources. A copy of the same text MUST NOT count as independent.
- An agent on the Sonnet research row that meets such a source MUST stop and report
  `sources disagree`. The main session MUST then re-spawn it on the Opus research row.
- MUST note the date of each source. SHOULD prefer the newest primary source. An older
  primary source SHOULD beat a newer secondary one.
- When sources disagree, MUST say so, name the source you trust, and say why.

### 3. Result

The result MUST hold, in this order:

1. The claim, in one or two sentences, with its confidence: confirmed, likely, or open.
2. The sources, one per line: title, URL, date, what it says.
3. The recorded-items slot and the caveat slot (section Caveats).

### 4. Caveats

`core` section Reports holds the two slots, what counts as a caveat and the line format.
The main session writes each caveat into the project context (`code` section Caveats).

## retro

From the frontmatter description: "User-only: the model MUST NOT load this skill on its
own; it MUST ask the user to start it instead."

The main session looks back on the current session when the user starts it. It lists
what to change in the project or in armory so that later sessions go better.

### 1. Scope

- The main session MUST run it on the current session only.
- MUST change no file: MUST NOT edit, commit or spawn a coder. MUST list each change as
  a finding instead (section Findings).
- MUST read the session, and each touched file that a finding's evidence needs.
- Done when the steps of the session are read, and each file a finding's evidence
  needs.

### 2. Finding classes

- MUST check the session against each class below. A class applies in its "use when"
  case.
  - Navigation and information access. Use when the session took long to find a fact,
    or could not reach it. The change: a pointer in the project context or a doc, or
    read access (logs, a tool).
  - Checks and review rules. Use when a mistake got past a gate or the reviewer. A
    mechanical miss (a fixed pattern, a banned call, a file place) MUST get a check: a
    lint rule, a gate or a hook. A judgement miss MUST get a review rule (`review`, or
    the project context `## Rules`).
  - Context size and no-op lines. Use when a line of the project context, the global
    context or a skill changed no behavior, or belongs in a check or a review rule.
  - Tool economy. Use when a cheaper call, model row or tool could replace a costly
    tool call or spawn.
- Before the class Checks and review rules, SHOULD read the project context `## Gates`
  and `## Commands`. An existing check that is off or broken is then the finding.
- Done when each class was checked against the session.

### 3. Findings

- Each finding MUST name these fields:
  - class: one of section Finding classes;
  - severity: High, Medium or Low (below);
  - target: the project or armory;
  - file: the file to change; for armory, the skill file and its section;
  - change: what to change in that file;
  - evidence: the step of this session where the miss cost something.
- Severity MUST follow the cost of the miss. High: the miss gave a wrong result, or
  would give one again. Medium: it cost a round, a retry or a re-review. Low: it cost
  only tokens or time.
- The list MUST be ranked High first, then Medium, then Low.
- Done when each finding has every field.

### 4. After the list

- The main session MUST ask the user, through the question tool, which findings to turn
  into a task. The question MUST be multi-select.
- No finding: MUST say so and skip the question. One finding: MUST ask yes or no,
  single-select. More than four: MUST split them into questions of 2–4 options, up to
  four questions per call (`core` section Writing and questions).
- MUST NOT start the task. MUST name each chosen finding as a task to plan instead.
- Done when the user answered, or no finding exists.
