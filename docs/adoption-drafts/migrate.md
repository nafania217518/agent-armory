# migrate (new skill)

Sources:
- https://github.com/wshobson/agents `plugins/framework-migration/skills/dependency-upgrade/SKILL.md`, `plugins/framework-migration/skills/database-migration/SKILL.md` @9c61ab2 (MIT)
- https://github.com/affaan-m/everything-claude-code `skills/database-migrations` @3f14a10 (MIT)

Status: draft, not adopted

All text is paraphrase; no source text is copied. Stack examples are left out.

## What it does
Rules for a major dependency upgrade and for a schema or data migration: one major step at a
time, breaking changes read first, forward-only migrations, expand then contract, and a
rollback stated before each step.

## What it brings to armory
Armory has no upgrade or migration flow. `implement` §Domain, boundaries and state asks only
that a migration be idempotent, and `plan` §The plan names expand–contract only for callers.
`plan` §The plan, `implement` §Domain, boundaries and state and `release` §Go/no-go would
point to it.

Evidence needed: a session where an upgrade jumped several majors at once, an applied
migration was edited, or an app rollback met a schema it could not read.

## Cons
- Overlaps `plan` §The plan (expand–contract for callers) and `implement` (idempotence); the
  draft points to both and does not restate them.
- Only for projects with dependencies or a database.
- The source files are long and stack-specific; only the method is kept.

## Fit
- Invocation: model-loaded. `plan` and the coder load it when a task upgrades a dependency by
  a major version or changes a schema or stored data.
- Hooks into:
  - `plan` §The plan, expand–contract bullet: add "A schema or data change MUST follow
    `migrate`."
  - `implement` §Domain, boundaries and state, idempotence bullet: add a pointer to `migrate`.
  - `release` §Go/no-go reads §Rollback for irreversible items.
- Size: 48 lines.

## Draft SKILL.md

````markdown
---
name: migrate
description: >
  Major dependency upgrade and schema or data migration: one major step at a time, breaking
  changes first, forward-only migrations, expand then contract, rollback before each step.
  Use for "upgrade <dependency>", "bump to the next major", "write a migration", "rename a
  column", and from `plan` for such a task.
max-lines: 48
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` first when its rules are not in your context.

# migrate

Planner and coder apply it. Idempotence is in `implement` §Domain, boundaries and state;
expand–contract for callers is in `plan` §The plan.

## 1. Dependency upgrade

- MUST upgrade one major version per `TR`. A jump over several majors MUST become one `TR`
  per major instead.
- Before the plan, a researcher MUST read the release notes or migration guide of each major
  (`research` §Sources) and list each breaking change.
- MUST grep the repo for each breaking change. Each hit MUST land in a `TR`'s scope.
- An official codemod SHOULD run before hand fixes.
- Lockfile change MUST go in the same commit as its manifest change.
- Done when each major step is one commit range with every `on` gate green.

## 2. Schema and data migration

- A migration that has run anywhere outside a dev machine MUST NOT be edited. A new
  migration MUST make the change instead.
- Production migrations MUST go forward only; a rollback MUST be a new migration.
- Schema change and data change MUST go in separate migrations.
- A rename or type change MUST expand and contract: add the new form, write both, backfill in
  batches, switch reads, then drop the old form in a later release.
- A migration on a large table MUST carry a lock bound as a `TR`, and a backfill MUST run in
  batches. Its load `TR` follows `plan` §The plan.
- Done when each migration step is its own migration with its own test on seed data.

## 3. Rollback

- Before each step, plan MUST state its rollback: the command, or `irreversible`.
- Each irreversible step MUST be a Risks line that names the quiz answer that accepts it
  (`plan` §The plan).
- After an expand step, the previous app version MUST still run on the new schema.
- Done when each step has its rollback or its accepted Risks line.
````
