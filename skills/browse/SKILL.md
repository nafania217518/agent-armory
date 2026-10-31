---
name: browse
description: >
  Web search and page reading for agents through the agent-browser CLI: the two commands,
  their output, exit codes, the daemon behaviour, and what to do when the command is
  missing. Load before any web search, page read, or source check for a claim. Use for
  "search the web", "read this page", "check the docs for", "/browse".
max-lines: 60
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context (`/core`, or
`/armory:core` in the plugin).

# browse

How any agent searches the web and reads pages. The tool is `agent-browser`
(`tools/agent-browser/` in agent-armory).

## 1. Commands

- MUST run the two commands through Bash. Both print markdown on stdout.

```
agent-browser search "<query>" --limit <n>
agent-browser open <url>
```

- `search` gives `n` results (default 5): `### <i>. [<title>](<url>)`, a one-line snippet.
- `open` returns the page as markdown, without navigation, ads and scripts.
- Exit code 0 is success. Exit code 1 means the call is right but the work failed (host
  unreachable, timeout, site blocked): SHOULD retry once, then take another source.
- Exit code 2: the command line is wrong, the usage text is on stderr. MUST fix the call.
- The first call starts the daemon. A Chrome window appears by default; that is normal.
  The daemon exits after 10 minutes without a call. MUST NOT run `agent-browser stop`
  between calls; it only costs the next call a browser start.
- MUST cut the output to what you need (`| head -n 200`, or `grep`) before it enters the
  context. MUST NOT paste a whole page into a reply.
- Several calls MAY run at once. The daemon runs up to 4 in parallel, queues the rest.
- Google Chrome MUST be installed for the default channel.

## 2. When the command is missing

- When `command -v agent-browser` prints nothing, the main session MUST build and link
  it once. `<agent-armory>` is the agent-armory checkout, or the plugin cache folder
  `~/.claude/plugins/cache/agent-armory/armory/<version>/`:

```
cd <agent-armory>/tools/agent-browser
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install && npm run build && npm link
```

- Without the link, `node <agent-armory>/tools/agent-browser/dist/cli.js <command>` MAY
  replace the command.
- A subagent MUST NOT build a missing command. It MUST report it to the main session.
- The main session MUST then build and link it (above), and re-spawn the agent on the
  same row of `delegate` section Models.
