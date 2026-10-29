---
name: browse
description: >
  Web search and page reading for agents through the agent-browser CLI: the two commands,
  their output, exit codes, the daemon behaviour, and what to do when the command is
  missing. Load before any web search, page read, or source check for a claim. Use for
  "search the web", "read this page", "check the docs for", "/browse".
---

# browse

The key words MUST, MUST NOT, SHOULD and MAY follow RFC 2119. The tool is
`agent-browser` (`tools/agent-browser/` in agent-armory). This skill holds how an agent
uses it. The user docs, `docs/agent-browser.md` in agent-armory, hold the settings, the
profile, the daemon details and the limits; this skill does not repeat them.

## 1. When

- Any web search, any page read, and every source check that the `code` skill section 10
  (Research) requires: at least 4 independent sources per claim about a library, API,
  model or tool.
- MUST NOT use the built-in web search. It is broken.

## 2. Commands

Run them through Bash. Both print markdown on stdout.

```bash
agent-browser search "<query>" --limit <n>
```

Returns `n` results as `### <i>. [<title>](<url>)` plus a one-line snippet each. The
default for `--limit` is 5.

```bash
agent-browser open <url>
```

Returns the page as markdown with navigation, ads and scripts removed. `<url>` MUST be
`http` or `https`.

- Exit code 0: success. 1: the call was right but the work failed (host unreachable,
  timeout, site blocked); retry once, then take another source. 2: the command line is
  wrong; the usage text is on stderr; fix the call.
- The first call starts a daemon that owns the browser. By default a Chrome window
  appears; that is normal. The daemon exits by itself after 10 minutes without a call.
  MUST NOT run `agent-browser stop` between calls; it only costs the next call a
  browser start.
- Pages are long. Cut the output to what you need (`| head -n 200`, or `grep`) before it
  enters the context. MUST NOT paste a whole page into a reply.
- Several calls MAY run at once; the daemon serves up to 4 in parallel and queues the
  rest.

## 3. When the command is missing

`command -v agent-browser` prints nothing: build and link it once from the agent-armory
checkout.

```bash
cd <agent-armory>/tools/agent-browser && PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install && npm run build && npm link
```

Without the link, `node <agent-armory>/tools/agent-browser/dist/cli.js <command>` does
the same. Google Chrome MUST be installed for the default channel; see the user docs
for `--headless` and `--channel`.

## 4. Research with it

1. `search` for the topic; take the official documentation, changelog or source
   repository first.
2. `open` each source; note its date.
3. Four independent sources per claim; say when they disagree and which one you trust
   and why.
4. Anything worth remembering goes under `## Caveats` in the project `AGENTS.md`, in
   the format `SHORT_DESCRIPTION : file_reference.md`.
