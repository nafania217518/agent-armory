# test ← superpowers (improvement)

Sources: https://github.com/obra/superpowers `skills/test-driven-development/writing-good-tests.md` @22f0b46 (MIT)
Status: draft, not adopted

## What it brings
Four checks for honest tests and doubles that `test` lacks: no change detectors, doubles with the full real data shape, no test-only methods in production code, and no assertion on a double itself.

## Cons
- `test` §TDD, §Unit style and §Determinism already cover most of the source (expected values from an independent source, test the public interface, no trivial-code tests).
- Dropped: the source's mental mutation list before done. `test` §TDD already makes a test that passes on first run fail on a real break, which is stronger than a mental check. Tool-based mutation is in `test-cek-improvement` change 5.
- `test` is at its `max-lines` cap (137); each added line needs a raise.

## Proposed changes
### 1. No change detectors
- Target: `test` §TDD (add bullet after "An expected value MUST come from a source independent of the code")
- Text: `- A test MUST NOT assert only a constant's value or a message's exact wording, unless the requirement fixes that value or text. It MUST assert the behavior that depends on it instead (a call retried 5 times, not a limit equal to 5).`
- Why: such a test fails on every deliberate redesign and passes through real bugs.
- Evidence needed: a review finding or a red gate where a test failed only because a constant or a message changed on purpose.

### 2. Doubles copy the full real shape
- Target: `test` §Unit style (add bullet after "A double SHOULD stub a query")
- Text: `- A double's data MUST hold every field the real source returns, not only the fields the test reads.`
- Why: a partial double passes while code downstream reads a field the double left out.
- Evidence needed: a bug that unit tests with a partial double missed and an integration test or production found.

### 3. No test-only methods in production code
- Target: `test` §Structure and naming (add bullet)
- Text: `- Production code MUST NOT hold a method that only tests call, such as a reset or cleanup hook. MUST put it in a test helper instead.`
- Why: a test-only method widens the public interface and can run in production by mistake.
- Evidence needed: a diff or audit finding with a production method whose only callers are tests.

### 4. No assertion on the double itself
- Target: `test` §Unit style (replace bullet "A double SHOULD stub a query. A test SHOULD verify a call only when the call is the behavior.")
- Text: `- A double SHOULD stub a query. A test SHOULD verify a call only when the call is the behavior. A test MUST NOT assert that a double exists or was rendered; it MUST assert the real unit's output instead.`
- Why: an assertion on a double passes whenever the double is in place, whatever the unit does.
- Evidence needed: a test that kept passing after the unit under test was broken, because it asserted on a stub.
