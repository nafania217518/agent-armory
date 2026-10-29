import { homedir } from 'node:os';
import { join } from 'node:path';

export interface HomePaths {
  config: string;
  profile: string;
  state: string;
  log: string;
}

export function homePaths(): HomePaths {
  const home = process.env.AGENT_BROWSER_HOME || join(homedir(), '.agent-browser');
  return {
    config: join(home, 'config.json'),
    profile: join(home, 'profile'),
    state: join(home, 'daemon.json'),
    log: join(home, 'daemon.log'),
  };
}
