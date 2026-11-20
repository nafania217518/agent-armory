# test ← playwright-skill (improvement)

Sources: https://github.com/lackeyjb/playwright-skill `skills/playwright-skill/SKILL.md` @dd47a6a (MIT); https://github.com/conorluddy/ios-simulator-skill `ios-simulator-skill/skills/ios-simulator-skill/SKILL.md` @86fb9ba (MIT)
Status: draft, not adopted

## What it brings
Rules for a loop or check that drives a running web app or iOS simulator: pick the right dev server, and read UI state from the accessibility tree, not from screenshots. Both changes target `debug`, whose only UI loop is "headless browser script".

## Cons
- Tool installs: Playwright with a browser, or Xcode with a simulator.
- Overlaps Anthropic's webapp-testing skill, which another draft covers.
- Dropped: "scripts go to a temp folder". `core` §Tools and background tasks already keeps subagent temp files in its own temp folder.
- Dropped: "never claim success without checking the page". `debug` §Feedback loop already ends on a run with its output shown.
- Moved: the role-first selector order is in `test-wshobson-improvement` change 1.
- The token figures in change 2 are the iOS source's own claims, not measured here.
- `debug` is at its `max-lines` cap (102); each added line needs a raise.

## Proposed changes
### 1. Pick the dev server
- Target: `debug` §Feedback loop (add bullet after the cost-order list)
- Text: ``- An HTTP or browser loop against a local dev server MUST first list the servers running and use the one the brief names. With no name and several running, MUST report `stuck:` with the list instead of a guess.``
- Why: a loop against the wrong local server goes green or red for reasons that have nothing to do with the bug.
- Evidence needed: a debug or check run that hit a stale or wrong local server.

### 2. Accessibility tree before screenshots
- Target: `debug` §Probes (add bullet after "SHOULD use a debugger or REPL first")
- Text: `- A probe of UI state SHOULD read the accessibility tree (role, name, state of each element). A screenshot SHOULD be used only for a visual property: layout, color or a rendered image.`
- Why: the tree gives exact text and state to assert on; a screenshot costs far more context and is read by eye.
- Evidence needed: a measured debug run on a UI bug, with context used per probe for a tree read and for a screenshot. Source claim, unverified: about 10–50 tokens for a tree read against 1.6k–6.3k for a screenshot.
