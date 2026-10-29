#!/usr/bin/env node
import { main } from './commands.js';

// exitCode, not exit(): exit() can cut off piped stdout.
main(process.argv.slice(2)).then((code) => (process.exitCode = code));
