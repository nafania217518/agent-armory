import { existsSync } from 'node:fs';
import { parseCommand, UsageError, type Command } from './args.js';
import { ensureDaemon, findDaemon, request, type ClientDeps, type Status } from './client.js';
import { InvalidSetting, resolveSettings, type Settings } from './config.js';
import { homePaths } from './paths.js';
import { renderResults, type SearchResult } from './search.js';

export interface CommandDeps extends ClientDeps {
  stopTimeoutMs: number;
  stopPollMs: number;
}

const STOP_DEFAULTS = { stopTimeoutMs: 10_000, stopPollMs: 200 };
const SHOWN_SETTINGS = ['pid', 'port', 'headless', 'profile', 'channel', 'concurrency', 'idleMinutes'];

function settingsLine(status: Status): string {
  return SHOWN_SETTINGS.map((key) => `${key}=${String(status[key])}`).join(' ');
}

// A bad flag value is the caller's mistake (exit 2); a bad config file is not.
function startSettings(flags: Partial<Settings>): Settings {
  try {
    return resolveSettings(flags);
  } catch (error) {
    if (error instanceof InvalidSetting && error.key in flags) throw new UsageError(error.message);
    throw error;
  }
}

// The daemon removes the state file last, so its absence means the browser and the port are gone too.
async function waitUntilGone(deps: Partial<CommandDeps>): Promise<void> {
  const { stopTimeoutMs, stopPollMs } = { ...STOP_DEFAULTS, ...deps };
  const deadline = Date.now() + stopTimeoutMs;
  while (existsSync(homePaths().state)) {
    if (Date.now() >= deadline) throw new Error(`daemon still runs after ${stopTimeoutMs / 1000} s; see the log ${homePaths().log}`);
    await new Promise((resolve) => setTimeout(resolve, stopPollMs));
  }
}

async function run(command: Command, deps: Partial<CommandDeps>): Promise<string> {
  switch (command.kind) {
    case 'open': {
      const { port } = await ensureDaemon(resolveSettings({}), deps);
      return String((await request(port, 'POST', '/read', { url: command.url }, deps)).markdown);
    }
    case 'search': {
      const { port } = await ensureDaemon(resolveSettings({}), deps);
      const body = await request(port, 'POST', '/search', { query: command.query, limit: command.limit }, deps);
      return renderResults(body.results as SearchResult[]);
    }
    case 'start': {
      const settings = startSettings(command.flags);
      const running = await findDaemon(deps);
      if (running) return `already running: ${settingsLine(running)}`;
      return `running: ${settingsLine(await ensureDaemon(settings, deps))}`;
    }
    case 'stop': {
      const running = await findDaemon(deps);
      if (!running) return 'not running';
      await request(running.port, 'POST', '/stop', undefined, deps);
      await waitUntilGone(deps);
      return 'stopped';
    }
    case 'status': {
      const running = await findDaemon(deps);
      if (!running) return 'not running';
      return Object.entries(running)
        .map(([key, value]) => `${key}: ${String(value)}`)
        .join('\n');
    }
  }
}

/** Runs one CLI call; returns the exit code: 0 ok, 1 the work failed, 2 the command line is wrong. */
export async function main(argv: string[], deps: Partial<CommandDeps> = {}): Promise<number> {
  try {
    console.log(await run(parseCommand(argv), deps));
    return 0;
  } catch (error) {
    console.error((error as Error).message);
    return error instanceof UsageError ? 2 : 1;
  }
}
