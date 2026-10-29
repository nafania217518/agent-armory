import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      // Entry shims hold one call each; the plan excludes them.
      exclude: ['src/cli.ts', 'src/daemon.ts'],
      // perFile: AGENTS.md sets 90% per core module, not for the total.
      thresholds: { lines: 90, branches: 90, functions: 90, statements: 90, perFile: true },
    },
  },
});
