# delegate ← wshobson (improvement)

Sources: https://github.com/wshobson/agents `plugins/agent-teams/skills/parallel-feature-development/SKILL.md`, `plugins/agent-teams/skills/task-coordination-strategies/SKILL.md`, `plugins/agent-teams/skills/team-composition-patterns/SKILL.md` @9c61ab2 (MIT)
Status: draft, not adopted

## What it brings

Two file-ownership rules for parallel coders: one item owns each shared index file, and
contract files stay read-only for the items that build on them. Both keep ready items
free to run at once.

## Cons

- Most of the source already exists in armory: one file per running agent (`delegate`
  §Delegation and worktrees), contract-first items and needs (`plan` §The plan).
- Change 1 targets `plan`, which is the longest skill (374 lines).
- Left out: the brief fields (owned files, out of scope, acceptance), since `TR`s, their
  `tests:` lines and the `implement` scope rule already cover them.
- Left out: the team size of 2 to 4, with no armory evidence that more parallel items
  fail.
- Left out: the Agent Teams parts (messages between teammates, broadcasts), which armory
  does not use.

## Proposed changes

### 1. One owner for a shared index file

- Target: `plan` §The plan (add bullet, after the contract-item bullet)
- Text:
  - When several items would each add a line to one shared file (an index or barrel
    export, a route table, a registry), plan SHOULD give all those lines to one item: the
    contract item or the last join item.
- Why: a shared index file makes items that touch it wait for each other's merge
  (`code` §Running the plan), so it turns parallel items into a chain.
- Evidence needed: a plan run where items waited for each other only because of one index
  file.

### 2. Contract files are read-only downstream

- Target: `delegate` §Briefs (add bullet, after "A brief MUST hold no design choice the
  plan lacks")
- Text:
  - A brief for an item that needs a contract item (`plan` §The plan) MUST name the
    contract's files as read-only. A coder that needs a contract change MUST NOT make it;
    it MUST report `stuck:` with the change instead, and main session amends plan (`plan`
    §Amendments).
- Why: one side of an interface that edits the shared contract breaks the other side,
  which builds against the old form.
- Evidence needed: a run where a coder changed a contract file another item built on.
