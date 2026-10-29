# Plan: agent-browser (task branch `agent-browser`)

Mode `min`. The task text stands in for the BRs. The key words MUST, MUST NOT, SHOULD
and MAY follow RFC 2119.

## Context

Today web access for agents is two hand-started processes in `~/fun/test/demo`:
`remote-browser-v2` (Express on `:3030`, a headed Chrome with its own profile, routes
`/read` and `/search`) and `browser-mcp` (a stdio MCP server that forwards to `:3030`).
The browser is always on, nothing starts it, and the MCP layer is the only interface.

`agent-browser` replaces both with one CLI. The first call starts a daemon that owns the
browser; the daemon exits after 10 minutes without a request. Settings come from
defaults, then `~/.agent-browser/config.json`, then flags. Headed is the default,
`--headless` is the other option. The profile is the tool's own directory, pointable
with `--profile`. It lives in this repo under `tools/agent-browser/`, the first phase-2
tool. Stack as the reference, minus Express: TypeScript on Node 26, `playwright-extra`
with the stealth plugin over installed Chrome (`channel: 'chrome'`), `turndown`, Yahoo
for search, `node:http` and `node:util.parseArgs`.

Task text (stands in for BR): CLI; browser in a daemon that sleeps after inactivity;
docs; pointable profile; both headless options.

## Design

```
tools/agent-browser/
  package.json          name agent-browser, type module, bin agent-browser -> dist/cli.js
  tsconfig.json         strict, ES2022, Node16 modules, outDir dist
  vitest.config.ts      coverage thresholds 90 (lines, branches, functions, statements)
  Dockerfile            test image: Playwright base image (bundled Chromium; Chrome has no Linux arm64 build, see TR-13)
  compose.yaml          service `test`: builds the image, mounts nothing, runs under xvfb-run
  src/
    cli.ts              entry shim: main(process.argv)
    daemon.ts           entry shim: runDaemon(settingsFromArgv)
    args.ts             parseArgs -> Command (open|search|start|stop|status), exit code 2 on misuse
    config.ts           Settings: defaults <- ~/.agent-browser/config.json <- flags; validated once
    paths.ts            home dir ($AGENT_BROWSER_HOME or ~/.agent-browser): config, profile, state, log
    client.ts           ensureDaemon(settings): read state file, GET /status, else spawn + poll; request()
    server.ts           createServer(ops, idle, gate): POST /read, POST /search, GET /status, POST /stop
    idle.ts             IdleTimer(ms, onIdle): begin()/end() in-flight count, arms only at zero
    gate.ts             Semaphore(n): run(fn) admits n at once, the rest wait FIFO
    browser.ts          launchBrowser(settings) -> context; closeBrowser
    read.ts             readPage(context, url) -> html; pageToMarkdown(html) pure (strip + turndown)
    search.ts           searchWeb(context, {query, limit, baseUrl}); extractResults (DOM fn); renderResults pure
  test/
    unit/               vitest, sociable, fake timers where time matters
    integration/        real Chrome, headless, fixture pages on a loopback http server
    fixtures/           article.html, yahoo-page1.html, yahoo-page2.html (captured once from a live page)
docs/agent-browser.md   the user docs (project rule: docs live in docs/)
```

Key decisions:

- Daemon transport: HTTP on `127.0.0.1:<port>` (default `7788`; `3030` is taken by the
  old server). JSON in and out: `{markdown}`, `{results}`, `{error}`; HTTP status carries
  the outcome (400 bad input, 404 route, 405 method, 500 callee error).
- The port bind is the lock. Two CLIs that wake the daemon at once both spawn; the
  loser fails to bind and exits before it writes the state file; both CLIs then poll
  `/status` and use the winner. Idempotent, no lock file.
- State file `~/.agent-browser/daemon.json` `{pid, port, headless, profile, startedAt}`
  is written only after `listen` succeeds and removed on exit. `status` reads it and
  confirms with `GET /status`; a dead pid is a stale file, treated as "not running".
- Idle: `/read` and `/search` count as activity; `/status` does not. The timer arms only
  when no request is in flight, so a slow page never gets cut. On idle, SIGINT or
  SIGTERM: close the context, close the server, remove the state file, exit 0.
- Settings flags (`--profile`, `--headless`, `--headed`, `--idle <minutes>`, `--port`, `--concurrency`, `--channel`)
  are accepted by `start` only. `open` and `search` wake the daemon with the config
  file settings. To change a running daemon: `stop`, then `start` with flags.
- The reference calls `browser().newPage()`, which opens a fresh context and bypasses the
  persistent profile. agent-browser uses `context.newPage()`. This becomes a Caveats line.
- Markdown conversion runs in Node on `page.content()`: turndown with `remove()` rules
  for the boilerplate selectors of the reference. Pure, unit-tested on fixtures.
- Search extraction runs in the page (`page.evaluate`) as in the reference, paged
  through `a.next` until `limit` or 2 pages. `baseUrl` is a parameter so the
  integration test can point it at a fixture; the daemon passes Yahoo.
- Output of `search` is the mcp-browser markdown: `### n. [title](url)` + content.
- Exit codes: 0 ok. 1: the command line was right but the work failed (page unreachable,
  timeout, daemon did not start, daemon returned an error); message on stderr. 2: the
  command line itself was wrong (unknown command, missing url or query, a flag with a bad
  value, settings flags on `open`); usage on stderr, the daemon is never contacted. The
  split lets a caller tell "fix my call" from "retry or give up".
- Parallel calls: the daemon serves requests concurrently. Each `/read` or `/search`
  opens its own page in the shared context and closes it when done, so N calls at once
  are N tabs at once. A semaphore caps the open pages at `concurrency` (default 4,
  config key and `--concurrency` flag); requests past the cap wait in FIFO order and
  are still counted as in flight by the idle timer. One failing request does not touch
  the others. Node runs this on one thread; the browser does the parallel work. Two CLIs
  that wake the daemon at once are covered by the port lock above.
- Integration tests run in Docker, not on the host: `compose.yaml` service `test` built
  from `Dockerfile` (Playwright's Ubuntu image with its bundled Chromium; TR-13 amends
  the Chrome plan: Chrome has no Linux arm64 build, the container runs `channel: chromium`,
  the host runs Chrome). The suite runs under `xvfb-run`, so the headed default is tested too. The
  `coverage` gate runs both suites in the same container, so the threshold covers the
  browser layer. Unit tests and lint stay on the host, fast, for the per-commit gate.
- `$AGENT_BROWSER_HOME` moves the whole home dir; tests use it for isolation.
- macOS and Linux only; no Windows (detached spawn, paths). Stated in the docs.

## Items

```
TR-1 [opus] (task): MUST add the package tools/agent-browser (manifest, tsconfig, vitest with
     90% fail-under, scripts lint/test:unit/test:integration/coverage/build), the Docker test
     image (Dockerfile, compose.yaml: Playwright base image + Google Chrome, xvfb-run) and the
     AGENTS.md command lines and gates for it (lint, owasp, unit, integration, coverage on; run).
  tests: test_tr1_coverage_config_fails_under_90 (vitest config exposes thresholds = 90);
         gates run green on the empty package (lint, unit, integration, coverage exit 0;
         integration and coverage through the container)

TR-2 [opus] (task): MUST resolve Settings as defaults <- config file <- flags and reject invalid
     values once, at entry (profile string, headless boolean, idle minutes > 0, port 1..65535,
     concurrency integer >= 1).
  tests: test_tr2_defaults_when_no_file; test_tr2_file_overrides_defaults;
         test_tr2_flags_override_file; test_tr2_malformed_json_names_the_file;
         test_tr2_unknown_key_rejected; test_tr2_negative_idle_rejected;
         test_tr2_port_out_of_range_rejected; test_tr2_concurrency_zero_rejected;
         test_tr2_home_env_var_moves_all_paths

TR-3 [opus] (task): MUST parse the CLI: open <url>, search <query> [--limit n], start [flags],
     stop, status; misuse exits 2 with usage on stderr.
  tests: test_tr3_open_parses_url; test_tr3_search_parses_query_and_limit;
         test_tr3_search_limit_not_a_number_is_usage_error; test_tr3_start_parses_setting_flags;
         test_tr3_settings_flags_on_open_are_usage_error; test_tr3_unknown_command_is_usage_error;
         test_tr3_open_without_url_is_usage_error; test_tr3_invalid_url_is_usage_error

TR-4 [opus] (task): MUST convert page HTML to markdown with the boilerplate removed
     (script, style, noscript, iframe, nav, footer, aside, banner/navigation/complementary roles,
     ad/sidebar/comment/social/share/menu/header/footer/popup/modal classes).
  tests: test_tr4_article_fixture_keeps_headings_paragraphs_links_lists;
         test_tr4_nav_footer_script_removed; test_tr4_role_and_class_boilerplate_removed;
         test_tr4_empty_body_gives_empty_string; test_tr4_malformed_html_does_not_throw

TR-5 [opus] (task): MUST render search results as `### n. [title](url)` + content, and
     MUST say "no results" for an empty list.
  tests: test_tr5_renders_numbered_markdown; test_tr5_empty_list_says_no_results;
         test_tr5_title_with_brackets_is_escaped

TR-6 [opus] (task): IdleTimer MUST fire after the idle period with no activity, MUST NOT fire
     while a request is in flight, and MUST re-arm when the last request ends.
  tests: test_tr6_fires_after_idle; test_tr6_activity_resets; test_tr6_holds_while_in_flight;
         test_tr6_rearms_when_in_flight_reaches_zero; test_tr6_stop_cancels

TR-7 [opus] (task): The daemon server MUST serve POST /read {url}, POST /search {query, limit},
     GET /status, POST /stop on 127.0.0.1 only, with the status codes above; /read and /search
     count as activity, /status does not; it MUST write the state file only after listen and
     remove it on shutdown.
  tests (unit, injected fake ops, real node:http on an ephemeral port):
         test_tr7_read_returns_markdown; test_tr7_read_without_url_is_400;
         test_tr7_read_callee_error_is_500_with_message; test_tr7_search_returns_results;
         test_tr7_search_default_limit_5; test_tr7_status_reports_settings_and_uptime;
         test_tr7_status_does_not_reset_idle; test_tr7_stop_shuts_down_and_removes_state_file;
         test_tr7_unknown_route_404; test_tr7_get_on_read_405; test_tr7_bind_failure_exits_nonzero;
         test_tr7_state_file_written_after_listen; test_tr7_binds_loopback_only;
         test_tr7_invalid_json_body_is_400

TR-12 [opus] (task): The server MUST run parallel requests concurrently, each in its own page,
      at most `concurrency` at once; requests past the cap MUST wait FIFO and MUST still count
      as in flight for the idle timer; one request's failure MUST NOT affect another.
  tests (unit, fake ops with controllable promises):
         test_tr12_two_reads_run_at_once; test_tr12_third_waits_when_concurrency_is_2;
         test_tr12_waiting_request_runs_after_release_in_order;
         test_tr12_failed_request_releases_its_slot; test_tr12_idle_held_while_queue_not_empty;
         test_tr12_semaphore_run_returns_fn_result_and_rethrows
      tests (integration, in TR-10's suite): test_tr12_eight_parallel_opens_all_succeed;
         test_tr12_pages_closed_after_parallel_calls

TR-8 [opus] (task): The browser layer MUST launch a persistent context on the profile dir with
     the stealth plugin, channel chrome, headless per settings; readPage MUST return the page
     HTML after domcontentloaded (30 s timeout); searchWeb MUST page through a.next until
     limit or 2 pages and return {title, url, content}.
  tests (integration, headless, fixture server on loopback):
         test_tr8_read_fixture_article; test_tr8_read_unreachable_url_throws;
         test_tr8_read_timeout_throws; test_tr8_search_fixture_extracts_results;
         test_tr8_search_stops_at_limit; test_tr8_search_follows_next_until_two_pages;
         test_tr8_search_no_next_link_stops; test_tr8_cookie_survives_relaunch_on_same_profile;
         test_tr8_pages_closed_after_each_call

TR-9 [opus] (task): The client MUST find a running daemon through the state file and
     GET /status, else spawn the daemon detached (stdout and stderr to the log file) and poll
     /status until ready (30 s), then send the request; a daemon that never becomes ready MUST
     fail with the log path in the message.
  tests (unit, spawn and fetch injected):
         test_tr9_healthy_daemon_not_respawned; test_tr9_missing_state_spawns;
         test_tr9_stale_state_spawns; test_tr9_never_ready_fails_with_log_path;
         test_tr9_request_timeout_fails; test_tr9_spawn_passes_settings_as_args

TR-10 [opus] (task): The CLI commands MUST work end to end: open prints markdown, search prints
      the rendered list, start reports the running settings, stop is idempotent, status reports
      running or not; the daemon MUST exit after the idle period; two concurrent first calls
      MUST end with one daemon; --headless and --headed MUST be visible in status.
  tests (integration, $AGENT_BROWSER_HOME in a temp dir, idle set short):
         test_tr10_open_prints_markdown_and_wakes_daemon; test_tr10_search_prints_rendered_list;
         test_tr10_daemon_exits_after_idle_and_removes_state;
         test_tr10_two_concurrent_opens_one_daemon; test_tr10_stop_when_not_running_exits_0;
         test_tr10_start_headless_shows_in_status; test_tr10_start_twice_reports_already_running;
         test_tr10_open_bad_url_exit_1_message_on_stderr; test_tr10_status_not_running

TR-11 [sonnet] (task): docs/agent-browser.md MUST explain install (npm install, build, npm link),
      the commands, the config file and flags, the profile (where, how to log in through the
      headed window, --profile), headless vs headed, the daemon (wake, sleep, log, state file,
      stop), parallel calls and the concurrency cap, exit codes with their meaning, how to
      run the tests (unit on the host, integration and coverage in Docker), and the
      macOS/Linux limit; README.md gets a Tools row; AGENTS.md
      gets the Glossary terms (daemon, profile, state file) and the Caveats line on
      context.newPage vs browser().newPage.
  why: prose per a ready spec
  tests: lint (claude plugin validate) green; every command in the docs is one that
         test_tr3 accepts (writer checks against args.ts, reports any mismatch)
```

Execution order: TR-1, TR-2, TR-3, TR-4, TR-5, TR-6 (pure parts first; each helps every
later item), TR-7, TR-12, TR-8, TR-9, TR-10, TR-11. TR-4, TR-5 and TR-6 have no shared
files and MAY run as parallel coders in their own worktrees.

## Test scope

No existing tests in the repo. The `lint` gate command changes (TR-1): it gains the
package's `tsc --noEmit` after `claude plugin validate .`.

## Gates

From AGENTS.md after TR-1: lint, owasp, unit, integration, coverage on; contract,
functional, e2e off. Commands run from the repo root:

- lint: `claude plugin validate . && npm --prefix tools/agent-browser run lint`
- owasp: `npm --prefix tools/agent-browser audit --audit-level=high`
- unit: `npm --prefix tools/agent-browser run test:unit`
- integration: `docker compose -f tools/agent-browser/compose.yaml run --rm --build test npm run test:integration`
- coverage: `docker compose -f tools/agent-browser/compose.yaml run --rm --build test npm run coverage`
  (both suites, vitest thresholds 90; entry shims `cli.ts` and `daemon.ts` excluded,
  they hold one call each)
- run: `node tools/agent-browser/dist/cli.js`

The compose service runs its command under `xvfb-run` and sets `AGENT_BROWSER_HOME` to a
directory inside the container. Docker Desktop is installed on this machine.

## Risks

- `playwright-extra` and the stealth plugin lag Playwright releases. The reference runs
  them on Playwright 1.63; the coder pins the versions that install together and notes
  the pair in Caveats.
- Search is coupled to Yahoo markup (`.algo`, `.compTitle`, `a.next`). A markup change
  breaks `search` silently (empty list). Carried as `tech-debt:` in `search.ts`.
- A headed daemon needs a GUI session. Over SSH or in CI, use `--headless`.
- Chrome auto-updates under `channel: 'chrome'`; a Chrome newer than Playwright knows
  may break. The fix is `npm update playwright`.
- Integration tests need Docker running; the first image build downloads the Playwright
  base image and Chrome (minutes). The Playwright base image tag MUST match the
  installed `playwright` version, or the container's Chrome setup drifts; the coder pins
  both to one value and notes it in Caveats.
- Linux Chrome in the container and macOS Chrome on the host can differ in details
  (fonts, headless flags). The tests use loopback fixtures, so this does not reach the
  assertions; acceptance by hand on the host covers the host path.
- Parallel searches against Yahoo may hit rate limits or captchas; the cap of 4 keeps
  the burst small, the user lowers `concurrency` if it happens.
- Dependency install may try to download Playwright browsers (not needed with
  `channel: 'chrome'`); docs give `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` for the host.

## Tech debt accepted

- Yahoo-only search, selector-coupled (comment in `search.ts`).
- No Windows support.
- Changing settings needs `stop` + `start`; `open` never re-launches with new flags.

## After acceptance (user's own files, not in this plan)

- Global `~/.claude/CLAUDE.md` rule 3, the `researcher` agent and `code` skill section 10
  name `mcp-browser`; they move to `agent-browser` once it works. Separate change.
- Remove the `mcp-browser` entry from the desktop config when the old server retires.

## Verification

1. Gates: the five commands above, all green (integration and coverage inside the
   Docker container, Docker Desktop running).
2. By hand, from the repo root after `npm --prefix tools/agent-browser run build`:
   - `node tools/agent-browser/dist/cli.js status` → not running
   - `node tools/agent-browser/dist/cli.js open https://example.com` → markdown, a
     Chrome window appears
   - `node tools/agent-browser/dist/cli.js search "playwright persistent context"
     --limit 3` → three numbered results
   - `node tools/agent-browser/dist/cli.js status` → running, headed, profile path,
     idle remaining
   - wait 10 minutes, or `stop` → window closes, `status` → not running
   - `node tools/agent-browser/dist/cli.js start --headless` then `status` → headless
3. Report per the `code` skill, section 12.

On 'implement', run the `code` skill on Opus.

## Amendments

Approved 2026-10-30, after the Docker check: the engine on this machine is linux/arm64 and
Google Chrome has no Linux arm64 build, so `channel: 'chrome'` cannot run in the container.

```
TR-13 [opus] (task): Settings MUST gain `channel`: `chrome` (default; the installed Google
      Chrome) or `chromium` (Playwright's bundled browser), as a config key and a `--channel`
      flag on `start`; any other value is rejected at entry; launchBrowser MUST pass it as the
      Playwright channel (`chromium` means no channel, the bundled browser); `status` MUST
      report it. The Dockerfile installs no Chrome; the compose service sets
      `AGENT_BROWSER_TEST_CHANNEL=chromium`, and the integration test helper uses that value
      (default `chrome`) for the settings it builds and the config files it writes.
  tests: test_tr13_channel_default_chrome; test_tr13_channel_chromium_from_file;
         test_tr13_channel_flag_on_start; test_tr13_channel_invalid_rejected;
         test_tr13_status_reports_channel; test_tr8 integration suite runs with
         chromium in the container (no extra test; the helper decides)
```

TR-13 runs with TR-2 and TR-3 (the setting and the flag), TR-7 (status) and TR-8 (the
launch). The TR-1 Dockerfile follows the amended design.
