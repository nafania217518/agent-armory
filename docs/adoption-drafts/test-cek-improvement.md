# test ← context-engineering-kit (improvement)

Sources: https://github.com/NeoLabHQ/context-engineering-kit `plugins/tdd/skills/design-testing-strategy/SKILL.md`, `plugins/tdd/skills/test-coverage/SKILL.md` @23e2428 (GPL-3.0; ideas only, no text taken); https://github.com/omkamal/pypict-claude-skill `SKILL.md` @fbda212 (MIT); https://github.com/rampstackco/claude-skills `skills/test-case-authoring/SKILL.md` @9d281db (MIT)
Status: draft, not adopted

## What it brings
Techniques for choosing test cases, which `test` lacks: partitions and boundaries, decision tables, state transitions and pairwise sets. Also a gate for property-based tests, and a mutation check before a coverage target goes up.

## Cons
- Licence: CEK is GPL-3.0, so ideas only; every line below is new wording.
- Dropped: CEK's skip list (no e2e for internal helpers, no integration test for pure functions). `test` §Pyramid already puts each test at the lowest level that proves the behavior.
- Dropped: CEK's test-type gates; they repeat `test` §Pyramid and §Levels.
- Pairwise needs a generator (such as Microsoft PICT) or a hand table.
- Change 5 only matters where `coverage` is `on`.
- Five changes add about eight lines; `test` is at its `max-lines` cap (137).

## Proposed changes
### 1. Partitions and boundaries
- Target: `test` §TDD (add bullet after "Happy path, each edge case the requirement touches")
- Text: `- Edge cases SHOULD come from partitions and boundaries: split each input into classes the code treats alike, test one value per class, and for each range test min, min−1, max and max+1.`
- Why: §TDD demands each edge case a test, but gives no way to find them, so the set depends on the writer.
- Evidence needed: a bug at a range limit (off-by-one, empty, max length) in code whose tests named only typical values.

### 2. Decision and state tables
- Target: `test` §TDD (add bullet after change 1)
- Text: `- Conditions that interact SHOULD get a decision table, one test per row after rows with the same outcome merge. A stateful unit SHOULD get a state-transition table: one test per valid transition and one per invalid transition the unit must reject.`
- Why: interacting flags and state machines hide bugs in combinations that edge-case lists miss.
- Evidence needed: a bug in one combination of conditions, or one state transition, that no test covered.

### 3. Pairwise set for many parameters
- Target: `test` §TDD (add bullet after change 2)
- Text: `- An input of three or more parameters whose full product is too large to test SHOULD get a pairwise set: each pair of values appears in at least one test, with constraints that drop invalid combinations. Done when the plan or test file names the parameters, values and constraints.`
- Why: without a rule, a writer either tests the full product (slow) or a few picks (gaps).
- Evidence needed: a config or option bug that only a pair of parameter values set off, in code with a hand-picked test set.

### 4. When to add a property-based test
- Target: `test` §TDD (add bullet after change 3)
- Text: `- A property-based test MAY be added only for a large or unbounded input domain with a stable invariant (round trip, idempotency, order kept). A small finite domain MUST get partition tests instead.`
- Why: `debug` §Feedback loop names a property loop, but `test` never says when one earns a place.
- Evidence needed: a parser, encoder or serializer bug on an input class no example test named.

### 5. Mutation check before a coverage target rises
- Target: `test` §Review checks (add bullet)
- Text: `` - Before a project raises its coverage target, it SHOULD run a mutation tool on the covered code. Each mutant that survives MUST be recorded (`core` §Reports) as a hollow assertion to fix before the raise. ``
- Why: high line coverage with weak asserts passes; a coverage target then measures the wrong thing.
- Evidence needed: a mutation run on an armory-using project where covered code let mutants survive.
