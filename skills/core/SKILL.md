---
name: core
description: >
  Always-on base rules for every armory actor: rule words, writing, questions, background
  tasks, web access, design principles, the Fable guard, report slots. Use for "/core".
max-lines: 100
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.

# core

Base rules for the main session and every subagent. A plugin hook injects them.

## 1. Rule words

- MUST and MUST NOT have no exception but one: the approved plan MAY override a design
  rule, a MUST rule included, because the user approved it. Design rules: section Design
  principles; `implement` sections The smallest complete change and Domain, boundaries
  and state. The plan's Overrides part names each one (`plan` section The plan).
- A SHOULD rule is on by default. The agent MAY bypass it for one task only, with a
  reasonable cause or after the user approves. Section Reports records each bypass, and
  only an override made during the work.
- MAY is the agent's choice. Every rule MUST carry one RFC 2119 word.

## 2. Writing and questions

- Replies and docs MUST follow "80% ASD-STE100": short sentences (about 20 words max),
  one idea per sentence, active voice, present tense, one meaning per word, no idioms,
  no filler. Natural phrasing and domain terms stay where strict STE reads badly.
- A report SHOULD explain each technical term at first use, for a reader new to the code.
- A code comment MUST say only the why the code cannot show, in one line. Exceptions:
  `req:` (`test` section Markers), `tech-debt:` (`implement` section The smallest
  complete change).
- The main session MUST ask the user through `AskUserQuestion`; the message text MUST
  hold only the context. A free-text question (a name, a description, a command) MAY
  offer only "Other", or go as a plain message. A subagent cannot reach the user: it
  MUST report `stuck: <question>` instead.
- A choice question MUST have 2–4 options, the recommended one first. One call MUST hold
  1–4 questions; more questions MUST go in more calls.

## 3. Tools and background tasks

- MUST NOT use `nohup` or `command &` for a background task. MUST start it through the
  tool with `run_in_background=true`, so it stays tracked and can be stopped.
- A background task started through the tool, and a spawned agent, MUST stop as soon as
  it is no longer needed (stop tool, timer, any other means). One left running MUST have
  a valid reason, stated in the report. `code` section Task end checks only these kinds.
- MUST NOT use the built-in web search. To search the web or read a page, MUST load the
  `browse` skill of the agent-browser plugin (`/agent-browser:browse`) and follow it.
  The main session delegates web work (`research` section When to research); a subagent
  does its web work itself.

## 4. Design principles

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

## 5. Models

- MUST NOT run anything on Fable without the user's yes. Subagent models: `delegate`
  section Models.

## 6. Reports

- Every subagent report MUST hold two slots, each under its label. Recorded-items slot,
  `Recorded items:`: each recorded item with its kind, or `no recorded item`. Caveat
  slot, `Caveats:`: each caveat as one caveat line, or `no caveat`. A caveat is anything
  a later reader of the code would not expect: a changed default, a pinned version pair,
  a deprecated call, a limit.
- A caveat line, in a report or in `AGENTS.md` `## Caveats`, MUST take the format
  `SHORT_DESCRIPTION : <file>` (`SHORT_DESCRIPTION : —` when no file exists yet).
- A finding that the output already numbers MUST be referenced by its number in the
  recorded-items slot, not repeated.
- These items MUST be recorded during the task: each SHOULD bypass and each override
  made during the work (section Rule words), scope addition (`test` section Test scope),
  design misfit (`implement` section Before you write), out-of-scope finding
  (`implement` sections The smallest complete change and Gates per commit; `test`
  section Pyramid), and Should fix or Nice to have finding (`review` section Output).
  A subagent MUST put each recorded item in its report.
- The main session MUST make every write to `AGENTS.md` `## Caveats`. A subagent MUST
  NOT write to `## Caveats`. `code` section Caveats sets when the main session writes.
