import type { Settings } from './config.js';
import { createOps } from './ops.js';
import { runDaemon } from './server.js';

// The client passes the resolved settings as one JSON argument.
const settings = JSON.parse(process.argv[2]) as Settings;
runDaemon(settings, createOps).catch((error) => {
  console.error(error);
  process.exit(1);
});
