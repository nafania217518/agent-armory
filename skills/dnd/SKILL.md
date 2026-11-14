---
name: dnd
description: >
  Do-not-disturb mode for the rest of the session: one start question round, then
  each task runs through plan and code to Finish with no more questions to the user;
  the run answers each question itself and reports every answer. Use for "/dnd".
disable-model-invocation: true
max-lines: 63
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# dnd

The main session runs each task of the session from `plan` to `code` Finish while the
user is away. It asks once at the start, then answers every later question itself.

## 1. Start round

- MUST ask these three questions in one question call, before any other step. Done
  when each has an answer.
  1. Plan gate: self-approve (default), or one stop at each plan approval.
  2. Finish: PR + merge; merge into `<base>`; open a PR; local only. The default
     MUST follow the project's setup (the project context, CI workflows, branch
     protection); with no sign, PR + merge.
  3. Fable: Opus high (default), Opus max, stop and ask, or allow Fable.
- The answers MUST count as the user's yes for each write they name: the push, the PR,
  the merge, a run on Fable. They hold for each task until the session ends.
- PR + merge MUST push the task branch, open a PR and squash-merge it. Merge into
  `<base>` MUST squash-merge the task branch into `<base>` and push `<base>`. Open a
  PR MUST push the task branch and open a PR.
- Opus high or Opus max MUST replace each run on Fable: the answer to the Fable
  question and a Fable retry (`delegate` section Re-spawn and retry). Allow Fable: the
  run MUST answer the Fable question itself and follow `delegate` for each run on Fable.

## 2. Run

- MUST run each task through `plan` at the task level, then `code` through its Finish.
- MUST NOT put any later question to the user. MUST pick the recommended option
  instead, or, with none, the option that leaves the task done, gated and ready for a
  PR. Exception: the Fable question when the start answer is "stop and ask".
- Self-approve: MUST NOT enter plan mode; the passed self-review of `plan` section
  Self-review and approval is the approval.
- Acceptance (`code` section Task end, step 7): MUST try each by-hand item itself
  when it can and no earlier step tried it. MUST record the proof of each try (the
  command and its output) in a comment on the task item, or in the task report with
  no tracker bound. The report MUST list each item left for the user.
- A case whose only option is to stop MUST save the work (push the task branch,
  unless the Finish answer is local only) and log the stop in the answers log. With
  a tracker bound, it MUST comment the cause on the task item. A blocker that is a
  tracker item MUST get a blocked-by edge. Any other blocker MUST set `needs-info` as
  the item's one state label, when bound, and the comment MUST take the
  `## Triage notes` form of `triage` section Outcomes.
- After a stop, MUST go on with the next task only when the user's request names
  more work (a list, or a query of tracker items); else MUST end the run.
- Loop bound (`code` section Review loop): MUST end the loop after the seventh round.
  Each open finding MUST become a follow-up.

## 3. Answers log

- MUST record each question the run answers: the question, the answer, a one-line why.
- Each task MUST end with the `code` task report, then its answers log.
