import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

const scriptPath = fileURLToPath(new URL('./core-context.sh', import.meta.url));

// Claude Code caps hook plain stdout and each JSON string field at 10,000 characters.
// Longer output is replaced by a file path and a 2,000-character preview.
// Source: https://code.claude.com/docs/en/hooks
const HOOK_OUTPUT_LIMIT = 10000;

function runHook(input) {
  return execFileSync('sh', [scriptPath], { input, encoding: 'utf8' });
}

// The first body line of core, so an empty or wrong output fails too.
const FIRST_LINE = 'The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.';

function overLimitMessage(length) {
  return `core hook output is ${length} characters, over the limit of ${HOOK_OUTPUT_LIMIT}: trim skills/core/SKILL.md`;
}

// req: hook-size-guard/TR-1
describe('core-context.sh output cap', () => {
  test('SessionStart plain stdout stays within the hook output limit', () => {
    const out = runHook('{}');
    assert.ok(out.trimStart().startsWith(FIRST_LINE), 'SessionStart output does not start with core');
    assert.ok(out.length <= HOOK_OUTPUT_LIMIT, overLimitMessage(out.length));
  });

  test('SubagentStart additionalContext stays within the hook output limit', () => {
    const out = runHook('{"hook_event_name":"SubagentStart"}');
    const context = JSON.parse(out).hookSpecificOutput.additionalContext;
    assert.ok(context.trimStart().startsWith(FIRST_LINE), 'SubagentStart context does not start with core');
    assert.ok(context.length <= HOOK_OUTPUT_LIMIT, overLimitMessage(context.length));
  });
});
