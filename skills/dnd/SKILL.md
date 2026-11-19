---
name: dnd
description: >
  Do-not-disturb mode for the rest of the session: one start question round, then
  each task runs through plan and code to Finish with no more questions to the user;
  the run answers each question itself and reports every answer. Use for "/dnd".
disable-model-invocation: true
metadata:
  type: user-only
  extends: [code, core, plan]
  max-lines: 88
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` before your first step when its rules are not in your context.
Load `plan` before your first task when its rules are not in your context.
Load `code` before your first task when its rules are not in your context.

# dnd

Main session runs each session task from `plan` to Finish (`workflow` §4) while user is
away.

## 1. Start round

- MUST ask these three questions in one question call, before any other step. Done when
  each has an answer.
  1. Plan gate: self-approve (default), or one stop at each plan approval.
  2. Finish: PR + merge; merge into `<base>`; open a PR; local only. Default MUST follow
     project's setup (project context, CI workflows, branch protection); with no sign,
     PR + merge.
  3. Fable: Opus high (default), Opus max, or allow Fable.
- The answers MUST count as user's yes for each write they name (push, PR, merge, a run on
  Fable), each tracker write and the acceptance PR comment of §2. They hold for each
  task until session ends.
- PR + merge MUST push task branch, open a PR and squash-merge it. Merge into `<base>`
  MUST squash-merge task branch into `<base>` and push `<base>`. Open a PR MUST push task
  branch and open a PR.
- Opus high or Opus max MUST replace each run on Fable: answer to the Fable question.
  Allow Fable: run MUST answer the Fable question itself and follow `delegate` for each
  run on Fable.
- When the retry of `delegate` §6 also fails, the Fable answer MUST
  replace the ask to user. Opus max: one spawn on Opus max. Allow Fable: one spawn on
  Fable high. Opus high, or an escalation that also failed: the stop case of §2.

## 2. Run

- MUST run each task through `plan` at task level, then `code` through Finish
  (`workflow` §4).
- MUST NOT put any later question to user. MUST pick recommended option instead, or, with
  none, the option that leaves task done, gated and ready for a PR.
- An intent point's ladder (`research` §1) MUST take common practice from research as
  basis 3, for how a thing is done, never for whether or what to build, and the fallback
  option of the bullet above as basis 4, in place of smallest option.
- Before the run answers a question itself, MUST send its open points to research as
  `research` §1 sets for a question round. Each researcher brief MUST say the run is
  `dnd` and state the ladder of the bullet above.
- An answer or self-approved plan item that is irreversible or outward-facing (delete data
  git cannot restore, break a public interface, publish, spend) MUST rest on basis 1 of
  `research` §1, other than a plan or item a `dnd` run self-approved or
  created, or on a §1 answer; with neither, it is the stop case below.
- Self-approve: MUST NOT enter plan mode; passed self-review of `plan` §6
  is the approval.
- Acceptance (`code` §4, step 7): MUST try each by-hand item itself when it can and
  no earlier step tried it. MUST record proof of each try (command and its output) in the
  task report. When Finish opens a PR, MUST also post the proof as a PR comment before any
  merge. The report MUST list each item left for user.
- A case whose only option is to stop MUST save work (push task branch, unless Finish
  answer is local only) and log the stop in answers log. With a tracker bound, it MUST
  comment the cause on the task item. A blocker that is a tracker item MUST get a
  blocked-by edge. Any other blocker MUST set `needs-info` as item's one state label, when
  bound, and the comment MUST take the `## Triage notes` form of `tracking` §3.
- After a stop, MUST go on with next task only when user's request names more work (a
  list, or a query of tracker items); else MUST end the run.
- Loop bound (`code` §3): MUST end the loop after seventh round. Each open
  finding MUST become a follow-up item.
- When an open Must fix finding or a failing `on` gate is left at Finish, run MUST take
  the stop case above. It MUST NOT merge.

## 3. Answers log

- MUST record each question the run answers: question, answer, one-line why: its basis
  (number for an intent point, `research` §1) or `no basis`, and source.
- MUST log there each disagreement between two sources of one basis (`research` §1), in
  place of the question's message text.
- Each task MUST end with `code` task report, then its answers log.
- With self-approve, MUST also record each tracker write the plan lists (`plan`
  §6).
