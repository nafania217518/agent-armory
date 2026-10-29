# agent-browser

## What it is

`agent-browser` is a command-line tool. It reads web pages as markdown and searches the web. It does this through a Chrome browser that a background daemon owns. It replaces the old `mcp-browser` pair (`remote-browser-v2` and `browser-mcp`).

## Install

The tool runs on macOS and Linux only. The default channel needs Google Chrome installed.

From the repo root:

```bash
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm --prefix tools/agent-browser install
npm --prefix tools/agent-browser run build
```

Then choose one way to run it:

- Run `npm link` in `tools/agent-browser`. The `agent-browser` command is then on your PATH.
- Run `node tools/agent-browser/dist/cli.js` from the repo root.

## Commands

### `open <url>`

Prints the page as markdown. The URL MUST use `http` or `https`. The call wakes the daemon when it sleeps.

### `search <query> [--limit n]`

Searches the web. It prints a numbered list. Each item has the form `### n. [title](url)`, then the content. The default limit is 5. The value MUST be a positive integer. When nothing is found, it prints `no results`.

### `start [flags]`

Starts the daemon with the given settings. It prints `running:` and the settings, or `already running:` and the settings of the running daemon. The flags are:

- `--profile <dir>`
- `--headless` or `--headed` (not both)
- `--idle <minutes>`
- `--port <n>`
- `--concurrency <n>`
- `--channel chrome|chromium`

Only `start` accepts these flags.

### `stop`

Stops the daemon and waits until it is gone. It prints `stopped`. When no daemon runs, it prints `not running` and exits with 0.

### `status`

Prints `not running`, or one `key: value` line for each status field: `pid`, `port`, `headless`, `profile`, `channel`, `concurrency`, `idleMinutes`, `startedAt`, `uptimeMs`, `idleRemainingMs` and `inFlight`. The `status` call does not reset the idle timer.

## Settings

The config file is `~/.agent-browser/config.json`. It is optional. It MUST hold one JSON object. An unknown key is an error. An invalid value is an error.

| Key | Default | Allowed values |
|---|---|---|
| `profile` | `~/.agent-browser/profile` | a non-empty path |
| `headless` | `false` | `true` or `false` |
| `idleMinutes` | `10` | a number above 0 |
| `port` | `7788` | an integer from 1 to 65535 |
| `concurrency` | `4` | an integer of 1 or more |
| `channel` | `chrome` | `chrome` or `chromium` |

Example:

```json
{ "headless": true, "idleMinutes": 30 }
```

The order is: defaults, then the file, then the flags on `start`. A flag overrides the file.

The commands `open` and `search` use the file settings. They never take flags. To change a running daemon, run `stop`, then `start` with the new flags.

`AGENT_BROWSER_HOME` moves the whole home directory (config, profile, state file, log).

## Profile

The profile is a Chrome user-data directory. The default is `~/.agent-browser/profile`. Logins and cookies persist in it between daemon runs.

To log in to a site once:

1. Run `agent-browser stop`.
2. Run `agent-browser start --headed`.
3. Run `agent-browser open <login page url>`. A Chrome window opens.
4. Log in by hand in that window.
5. Later calls use the saved login.

Use `--profile <dir>` on `start` to use another directory. You MUST NOT point it at your own Chrome profile.

## Headless and headed

The default is headed. A Chrome window is visible. Use `start --headless` for no window. Use `start --headed` to switch back.

A headed daemon needs a GUI session. Over SSH or in CI, use `--headless`. Some sites block headless browsers. When a site blocks, use headed mode.

## Daemon

The first `open` or `search` call starts the daemon. It runs detached in the background. It listens on `127.0.0.1` at the configured port.

The daemon sleeps after `idleMinutes` (default 10) with no `open` or `search` request. A request that waits in the queue counts as active. The `status` call does not count. On sleep, the daemon closes the browser, frees the port, removes the state file and exits.

The daemon also exits when its browser closes, for example when you close the Chrome window.

Files in the home directory:

- State file: `~/.agent-browser/daemon.json`. The daemon binds the port, then launches the browser, then writes the state file. It removes the file last on exit.
- Log file: `~/.agent-browser/daemon.log`. It holds the output of the daemon. Read it when the daemon does not start.

Run `agent-browser stop` to stop the daemon at once.

Time limits of the client:

- A daemon that does not answer within 30 s after the spawn is an error. A daemon that exits during startup is an error at once. Both messages name the log file.
- An `open` or `search` request waits up to 150 s. A search can take two page loads of up to 30 s each, plus time in the queue.
- A status check waits up to 1 s.
- `stop` waits up to 10 s for the state file to go away.

When two calls wake the daemon at once, both start a daemon. The port bind is the lock. One daemon binds the port. The other fails to bind and exits before it launches a browser. Both calls then use the winner. One daemon remains.

## Parallel calls

The daemon serves requests at the same time. Each request opens its own page (tab) and closes it when done. One failed request does not affect the others.

The `concurrency` setting (default 4) caps the open pages. Requests over the cap wait in first-in, first-out order. If searches hit rate limits or captchas, lower `concurrency`.

## Exit codes

- 0: success.
- 1: the call was right but the work failed. Examples: the page is unreachable, a timeout, the daemon did not start, a bad config file. The message is on stderr.
- 2: the command line was wrong. Examples: unknown command, missing url or query, a bad flag value, settings flags on `open`. The usage text is on stderr. The daemon is not contacted.

## Tests

Unit tests and lint run on the host:

```bash
npm --prefix tools/agent-browser run test:unit
npm --prefix tools/agent-browser run lint
```

Integration tests and coverage run in Docker. Docker MUST be running:

```bash
docker compose -f tools/agent-browser/compose.yaml run --rm --build test npm run test:integration
docker compose -f tools/agent-browser/compose.yaml run --rm --build test npm run coverage
```

The container uses the Playwright bundled Chromium through the `chromium` channel. Google Chrome has no Linux arm64 build. The container runs under `xvfb-run`, so the headed mode is tested too. The coverage command fails below 90% per core module.

## Limits

- macOS and Linux only. There is no Windows support.
- Search works with Yahoo only. It depends on the Yahoo page markup. A markup change can return an empty list.
- A change of settings needs `stop` and `start`. `open` never relaunches the browser with new settings.
