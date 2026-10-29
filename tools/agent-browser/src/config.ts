import { readFileSync } from 'node:fs';
import { homePaths } from './paths.js';

export const CHANNELS = ['chrome', 'chromium'] as const;
export type Channel = (typeof CHANNELS)[number];

export interface Settings {
  profile: string;
  headless: boolean;
  idleMinutes: number;
  port: number;
  concurrency: number;
  channel: Channel;
}

/** A setting with a bad value; key names it, so callers need not parse the message. */
export class InvalidSetting extends Error {
  constructor(
    readonly key: keyof Settings,
    message: string,
  ) {
    super(message);
    this.name = 'InvalidSetting';
  }
}

type Check = (value: unknown) => boolean;

const CHECKS: Record<keyof Settings, Check> = {
  profile: (v) => typeof v === 'string' && v.length > 0,
  headless: (v) => typeof v === 'boolean',
  idleMinutes: (v) => typeof v === 'number' && Number.isFinite(v) && v > 0,
  port: (v) => Number.isInteger(v) && (v as number) >= 1 && (v as number) <= 65535,
  concurrency: (v) => Number.isInteger(v) && (v as number) >= 1,
  channel: (v) => (CHANNELS as readonly unknown[]).includes(v),
};

function defaults(): Settings {
  return {
    profile: homePaths().profile,
    headless: false,
    idleMinutes: 10,
    port: 7788,
    concurrency: 4,
    channel: 'chrome',
  };
}

function readConfigFile(path: string): Record<string, unknown> {
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {};
    throw error;
  }
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error(`config file ${path} is not valid JSON: ${(error as Error).message}`);
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error(`config file ${path} must hold a JSON object`);
  }
  return data as Record<string, unknown>;
}

function validate(merged: Settings): Settings {
  for (const [key, value] of Object.entries(merged)) {
    if (!CHECKS[key as keyof Settings](value)) {
      // String() keeps NaN visible; JSON.stringify would print null.
      const shown = typeof value === 'string' ? JSON.stringify(value) : String(value);
      throw new InvalidSetting(key as keyof Settings, `invalid value for ${key}: ${shown}`);
    }
  }
  return merged;
}

/** Resolves defaults <- config file <- flags, and validates the result once. */
export function resolveSettings(flags: Partial<Settings>): Settings {
  const path = homePaths().config;
  const fromFile = readConfigFile(path);
  for (const key of Object.keys(fromFile)) {
    if (!(key in CHECKS)) throw new Error(`unknown setting "${key}" in ${path}`);
  }
  return validate({ ...defaults(), ...fromFile, ...flags } as Settings);
}
