# release (new skill)

Sources:
- https://github.com/rampstackco/claude-skills `skills/release-management/` @9d281db (MIT)
- https://github.com/ComposioHQ/awesome-claude-skills `changelog-generator/` @be2a406 (Apache-2.0)
- https://github.com/rockscy/solo-skills `skills/changelog-from-commits/` @80ec4cf (MIT)
- https://github.com/alirezarezvani/claude-skills `engineering/skills/ship-gate/SKILL.md`, `engineering/skills/runbook-generator/SKILL.md`, `engineering/skills/feature-flags-architect/SKILL.md` @f8593c4 (MIT)
- https://github.com/wshobson/agents `plugins/cicd-automation/skills/deployment-pipeline-design/SKILL.md` @9c61ab2 (MIT)
- https://github.com/affaan-m/everything-claude-code `skills/production-audit`, `skills/verification-loop` (§Target Acceptance) @3f14a10 (MIT)

Status: draft, not adopted

All text is paraphrase; no source text is copied.

## What it does
Takes merged work to a versioned release: derives the version bump, writes the changelog from
merged items, holds an evidence-based go/no-go, and, for deployed projects, runs a staged
rollout with a rollback path. It also covers the hotfix path.

## What it brings to armory
No armory skill covers versioning, the changelog, the go/no-go decision, rollout or rollback.
`code` §Finish ends at the merge or PR. Armory's own 0.4.x bumps are a live use. `code` §Finish
and `audit` would point to it.

Evidence needed: a session where a version bump was picked by feel, a changelog line was
missing or invented, or a release went out with no rollback path. Armory's own release
history may hold one.

## Cons
- The full source model (release train, freeze, roles, comms) is too much for a solo repo;
  this draft drops the train, the freeze and the roles.
- Overlaps the PR and merge step of `code` §Finish; the draft reuses it instead of adding a
  second merge path.
- The rollout section matters only for deployed projects; a library or plugin skips it.
- Merges six sources (release, ship, deploy, ECC readiness and target acceptance); the ECC
  readiness pass is cut to the go/no-go list.

## Fit
- Invocation: model-loaded. The user asks for a release, bump or hotfix in plain words.
- Hooks into:
  - `code` §Finish: add "A release request after the merge MUST load `release`."
  - `audit` §Audit-only checks: MAY point to `release` §Go/no-go for a readiness pass.
  - `migrate` §Rollback for each irreversible data step.
  - Project context: a new `## Release` section (version file, scheme, changelog path, deploy
    target); `setup` would ask for it.
- Size: 71 lines.

## Draft SKILL.md

````markdown
---
name: release
description: >
  Release of merged work: version bump from impact, changelog from merged items, an
  evidence-based go/no-go, staged rollout with rollback, and the hotfix path. Use for "cut a
  release", "bump the version", "write the changelog", "ship a hotfix", "/release".
max-lines: 71
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` first when its rules are not in your context.

# release

Main session runs it on user's request. Version and changelog edits go through a task branch
and `code` §Finish; each push, tag and merge follows `code` §Branch and plan file.

## 1. Release model

- MUST read project context `## Release`: version file, scheme (SemVer or CalVer), changelog
  path, deploy target or `none`.
- With no `## Release` section, MUST ask user for each value, then have the writer add the
  section after user's yes. Done when each value is known.

## 2. Version

- MUST list each item merged since the last release tag, from git history and the tracker.
- Each item MUST get one impact: breaking (a public interface changes or goes away), feature
  (new compatible behavior, or a deprecation) or fix.
- Bump MUST follow the highest impact: major, minor or patch under SemVer. A bump picked by
  feel MUST NOT be used; derive it from the impacts instead.
- Done when each merged item has its impact and the bump is set.

## 3. Changelog

- Writer MUST write the entry under the new version in Keep a Changelog groups: Added,
  Changed, Deprecated, Removed, Fixed, Security.
- Each line MUST say the effect for the reader it affects, not the commit text.
- Done when each line maps to a merged item, and each user-facing item has a line.

## 4. Go/no-go

- Each criterion MUST carry evidence. Missing evidence MUST count as fail.
  - each `on` gate passes at the release commit, shown by its own output, not an agent's
    summary;
  - the rollback path is stated and was run at least once, with its date;
  - each irreversible item is listed with its plan: a data migration (`migrate`), a
    published contract, a sent message;
  - deployed projects: env vars are documented, and a health check and error reporting
    exist.
- Main session MUST put the filled list to user. An agent MUST NOT decide go; it MUST fill
  the list and leave the decision to user.
- Done when user has answered go or no-go.

## 5. Rollout

- A project with deploy target `none` MUST skip this section.
- Rollout SHOULD run in stages, each with a numeric stop condition (error rate, latency) and
  a health check.
- Each production step MUST get user's yes first.
- A stop condition hit MUST halt the rollout and offer the rollback.
- Report MUST give target acceptance apart from local gates: verified or failed with
  evidence, not performed with its reason, or n/a. It MUST name the environment and version.
- Done when each stage has its result, or the rollout halted.

## 6. Hotfix

- A hotfix MUST branch from the released tag, and MUST keep review, a regression test and the
  version bump.
- The fix MUST merge back into `<base>` in the same run.
- Done when the hotfix release is tagged and `<base>` holds the fix.
````
