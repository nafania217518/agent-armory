import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const hooks = JSON.parse(readFileSync(join(repoRoot, 'hooks/hooks.json'), 'utf8')).hooks;
const version = JSON.parse(readFileSync(join(repoRoot, '.claude-plugin/plugin.json'), 'utf8')).version;

let emptyDir;

// Runs the event's one hook command as the host does: through sh -c, from a foreign folder.
function runHook(event) {
  const r = spawnSync('sh', ['-c', hooks[event][0].hooks[0].command], {
    cwd: emptyDir,
    encoding: 'utf8',
    env: { ...process.env, CLAUDE_PLUGIN_ROOT: repoRoot },
  });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout;
}

beforeEach(() => {
  emptyDir = mkdtempSync(join(tmpdir(), 'hooks-test-'));
});

afterEach(() => {
  rmSync(emptyDir, { recursive: true, force: true });
});

// req: core-split/TR-7, release-0-5-0/TR-1
describe('hooks', () => {
  test('session_start_prints_main_payload', () => {
    const lines = runHook('SessionStart').split('\n');
    assert.equal(lines[0], 'The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.');
    assert.ok(lines.includes(`armory-core ${version}`));
    assert.ok(lines.includes(`armory-core-main ${version}`));
    assert.ok(!lines.includes('A subagent MUST skip this skill: its rules are for the main session only.'));
  });

  test('subagent_start_prints_agent_json', () => {
    const output = JSON.parse(runHook('SubagentStart')).hookSpecificOutput;
    assert.equal(output.hookEventName, 'SubagentStart');
    const lines = output.additionalContext.split('\n');
    assert.ok(lines.includes(`armory-core ${version}`));
    assert.ok(!lines.some((line) => line.startsWith('armory-core-main')));
  });
});
