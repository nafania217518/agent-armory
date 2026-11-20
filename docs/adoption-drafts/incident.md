# incident (new skill)

Sources:
- https://github.com/rampstackco/claude-skills `skills/incident-response/`, `skills/after-action-report/` @9d281db (MIT)
- https://github.com/rockscy/solo-skills `skills/postmortem-solo/` @80ec4cf (MIT)
- https://github.com/wshobson/agents `plugins/incident-response/skills/postmortem-writing/SKILL.md` @9c61ab2 (MIT)

Status: draft, not adopted

All text is paraphrase; no source text is copied. Roles, comms cadence and status-page
patterns are left out: a solo developer has no incident team.

## What it does
Runs a live production incident: rate severity, stop the harm before the root cause, verify
the fix on the user flow, keep a timeline, then write a blameless postmortem with at most two
tracked actions.

## What it brings to armory
`debug` finds a cause but has no "stop the harm first" path, and nothing turns an incident
into actions, caveats or retro findings. `debug` and `retro` would point to it.

Evidence needed: a session where a production failure was debugged while users stayed
affected, or an incident left no recorded action.

## Cons
- Ops-heavy; most of the source (roles, comms) means little to a solo developer.
- Only for projects that run in production.
- The postmortem overlaps `retro` §Findings; the draft hands process misses to `retro` and
  keeps only the incident record.
- The severity rubric is a judgment call; its thresholds are this draft's, not a measured
  standard.

## Fit
- Invocation: model-loaded. The user reports a production failure or asks for a postmortem.
- Hooks into:
  - `debug`, intro: add "A live production failure MUST run `incident` §Mitigate first."
  - `retro` §Finding classes: a postmortem's process miss is input for the next run.
  - `code` §Caveats: a surprising fact the incident finds goes to the caveat slot.
  - `release` §Rollout: a rollback is the first mitigation to offer.
- Size: 60 lines.

## Draft SKILL.md

````markdown
---
name: incident
description: >
  Live production incident: severity, mitigation before root cause, verification on the user
  flow, timeline, then a blameless postmortem with tracked actions. Use for "production is
  down", "users report errors", "we have an incident", "write a postmortem", "/incident".
max-lines: 60
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` first when its rules are not in your context.

# incident

Main session runs it. Each action on production MUST get user's yes first.

## 1. Severity

- MUST rate severity and re-rate it when facts change:
  - SEV-1: core flow down for all users, data loss, or a security breach;
  - SEV-2: core flow degraded, or one major feature down;
  - SEV-3: a minor feature broken, with a workaround;
  - SEV-4: no user impact.
- SEV-4 MUST skip §Mitigate and go to `debug` instead.
- Done when user has seen the rating.

## 2. Mitigate

- MUST stop the harm before diagnosing. A root-cause hunt MUST wait until mitigation holds.
- MUST offer the first mitigation that fits, in this order: roll back the last deploy, turn a
  feature flag off, fail over, throttle, turn off a non-core feature, maintenance mode.
- A rollback over an applied migration MUST follow `migrate` §Rollback.
- MUST verify the mitigation by running the user flow that failed, not by a dashboard alone.
- Done when that flow works, or user stops the run.

## 3. Timeline

- MUST record UTC times for trigger, detection, first response, mitigation and resolution,
  each with its source (log line, alert, message).
- Done when each time has its source, or `unknown`.

## 4. Diagnose

- After mitigation, MUST spawn a debugger in diagnose-only flow (`debug` §Diagnose only).
- Brief SHOULD name the common causes to check first: a recent deploy, a config change, a
  dependency or outside-service change, a data or traffic change.
- Done when the debugger reports a cause, or `stuck:`.

## 5. Postmortem

- Writer MUST write `<docs>/incidents/<date>-<slug>.md`: summary, severity, timeline, cause,
  what went well, actions.
- Cause MUST come from asking why until a system cause appears. "Be more careful" MUST NOT
  be a cause; name the missing check or guard instead.
- It MUST hold at most 2 actions, each with owner, date and a check that proves it done.
- With a tracker bound, each action MUST become a tracker item after user's yes (`core`
  §Host terms, tracker). Else it stays in the file.
- A process miss SHOULD be named to user as input for a `retro` run. A fact a reader would
  not expect MUST go to the caveat base, as `code` §Caveats sets.
- Done when the file is committed and each action has its item.
````
