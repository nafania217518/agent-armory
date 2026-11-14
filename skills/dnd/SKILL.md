---
name: dnd
description: >
  Do-not-disturb mode for the rest of the session: one start question round, then
  each task runs through plan and code to Finish with no more questions to the user;
  the run answers each question itself and reports every answer. Use for "/dnd".
disable-model-invocation: true
max-lines: 62
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# dnd

Main session runs each task of the session from `plan` to `code` Finish while user is
away. It asks once at start, then answers every later question itself.

## 1. Start round

- MUST ask these three questions in one question call, before any other step. Done when
  each has an answer.
  1. Plan gate: self-approve (default), or one stop at each plan approval.
  2. Finish: PR + merge; merge into `<base>`; open a PR; local only. Default MUST follow
     project's setup (project context, CI workflows, branch protection); with no sign,
     PR + merge.
  3. Fable: Opus high (default), Opus max, stop and ask, or allow Fable.
- The answers MUST count as user's yes for each write they name: push, PR, merge, a run
  on Fable. They hold for each task until session ends.
- PR + merge MUST push task branch, open a PR and squash-merge it. Merge into `<base>`
  MUST squash-merge task branch into `<base>` and push `<base>`. Open a PR MUST push task
  branch and open a PR.
- Opus high or Opus max MUST replace each run on Fable: answer to the Fable question and
  a Fable retry (`delegate` §Re-spawn and retry). Allow Fable: run MUST answer the Fable
  question itself and follow `delegate` for each run on Fable.

## 2. Run

- MUST run each task through `plan` at task level, then `code` through its Finish.
- MUST NOT put any later question to user. MUST pick recommended option instead, or,
  with none, the option that leaves task done, gated and ready for a PR. Exception: the
  Fable question when start answer is "stop and ask".
- Self-approve: MUST NOT enter plan mode; passed self-review of `plan` §Self-review and
  approval is the approval.
- Acceptance (`code` §Task end, step 7): MUST try each by-hand item itself when it can
  and no earlier step tried it. MUST record proof of each try (command and its output)
  in a comment on the task item, or in the task report with no tracker bound. The report
  MUST list each item left for user.
- A case whose only option is to stop MUST save work (push task branch, unless Finish
  answer is local only) and log the stop in answers log. With a tracker bound, it MUST
  comment the cause on the task item. A blocker that is a tracker item MUST get a
  blocked-by edge. Any other blocker MUST set `needs-info` as item's one state label,
  when bound, and the comment MUST take the `## Triage notes` form of `triage` §Outcomes.
- After a stop, MUST go on with next task only when user's request names more work (a
  list, or a query of tracker items); else MUST end the run.
- Loop bound (`code` §Review loop): MUST end the loop after seventh round. Each open
  finding MUST become a follow-up.

## 3. Answers log

- MUST record each question the run answers: question, answer, a one-line why.
- Each task MUST end with `code` task report, then its answers log.
