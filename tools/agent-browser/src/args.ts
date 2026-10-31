import { parseArgs } from 'node:util';
import type { Channel, Settings } from './config.js';

export type Command =
  | { kind: 'open'; url: string }
  | { kind: 'search'; query: string; limit: number }
  | { kind: 'start'; flags: Partial<Settings> }
  | { kind: 'stop' }
  | { kind: 'status' };

export const USAGE =
  'usage: agent-browser open <url> | search <query> [--limit n] | start [--profile dir] ' +
  '[--headless|--headed] [--idle minutes] [--port n] [--concurrency n] [--channel chrome|chromium] | stop | status';

export class UsageError extends Error {
  constructor(reason: string) {
    super(`${reason}\n${USAGE}`);
    this.name = 'UsageError';
  }
}

const SETTINGS_FLAGS = ['profile', 'headless', 'headed', 'idle', 'port', 'concurrency', 'channel'] as const;

const OPTIONS = {
  limit: { type: 'string' },
  profile: { type: 'string' },
  headless: { type: 'boolean' },
  headed: { type: 'boolean' },
  idle: { type: 'string' },
  port: { type: 'string' },
  concurrency: { type: 'string' },
  channel: { type: 'string' },
} as const;

type Values = ReturnType<typeof parseArgs<{ options: typeof OPTIONS; allowPositionals: true }>>['values'];

/** True when text parses as a URL with the http or https scheme. */
export function isHttpUrl(text: string): boolean {
  try {
    const { protocol } = new URL(text);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

function parseUrl(text: string | undefined): string {
  if (text === undefined) throw new UsageError('open needs a url');
  if (!isHttpUrl(text)) throw new UsageError(`url must be a valid http or https url: ${text}`);
  return text;
}

function parseLimit(text: string | undefined): number {
  if (text === undefined) return 5;
  if (!/^\d+$/.test(text) || Number(text) < 1) {
    throw new UsageError(`--limit must be a positive integer: ${text}`);
  }
  return Number(text);
}

// Value checks of settings flags belong to config.ts; here only the type conversion.
function startFlags(values: Values): Partial<Settings> {
  if (values.headless && values.headed) throw new UsageError('use --headless or --headed, not both');
  const flags: Partial<Settings> = {};
  if (values.profile !== undefined) flags.profile = values.profile;
  if (values.headless) flags.headless = true;
  if (values.headed) flags.headless = false;
  if (values.idle !== undefined) flags.idleMinutes = Number(values.idle);
  if (values.port !== undefined) flags.port = Number(values.port);
  if (values.concurrency !== undefined) flags.concurrency = Number(values.concurrency);
  if (values.channel !== undefined) flags.channel = values.channel as Channel;
  return flags;
}

/** Parses the CLI arguments (without node and the script path) into a Command. */
export function parseCommand(argv: string[]): Command {
  let parsed;
  try {
    parsed = parseArgs({ args: argv, options: OPTIONS, allowPositionals: true, strict: true });
  } catch (error) {
    throw new UsageError((error as Error).message);
  }
  const { values, positionals } = parsed;
  const [name, operand, ...extra] = positionals;
  if (extra.length > 0) throw new UsageError(`unexpected arguments: ${extra.join(' ')}`);

  if (name !== 'start') {
    const misplaced = SETTINGS_FLAGS.filter((flag) => values[flag] !== undefined);
    if (misplaced.length > 0) throw new UsageError(`--${misplaced[0]} is accepted by start only`);
  }
  if (name !== 'search' && values.limit !== undefined) {
    throw new UsageError('--limit is accepted by search only');
  }
  if (operand !== undefined && name !== 'open' && name !== 'search') {
    throw new UsageError(`unexpected argument: ${operand}`);
  }

  switch (name) {
    case 'open':
      return { kind: 'open', url: parseUrl(operand) };
    case 'search':
      if (!operand) throw new UsageError('search needs a query');
      return { kind: 'search', query: operand, limit: parseLimit(values.limit) };
    case 'start':
      return { kind: 'start', flags: startFlags(values) };
    case 'stop':
      return { kind: 'stop' };
    case 'status':
      return { kind: 'status' };
    default:
      throw new UsageError(name === undefined ? 'missing command' : `unknown command: ${name}`);
  }
}
