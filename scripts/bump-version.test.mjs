import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

const scriptPath = fileURLToPath(new URL('./bump-version.mjs', import.meta.url));

let tmpDir;
let manifest;

function writeManifest(text) {
  mkdirSync(join(tmpDir, '.claude-plugin'), { recursive: true });
  writeFileSync(manifest, text);
}

function manifestText(version) {
  const obj = { name: 'armory', version, description: 'd', author: { name: 'A' } };
  return JSON.stringify(obj, null, 2) + '\n';
}

function run(args) {
  try {
    const stdout = execFileSync(process.execPath, [scriptPath, ...args], {
      cwd: tmpDir,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return { status: 0, stdout, stderr: '' };
  } catch (e) {
    return { status: e.status, stdout: e.stdout, stderr: e.stderr };
  }
}

function readText() {
  return readFileSync(manifest, 'utf8');
}

function readVersion() {
  return JSON.parse(readText()).version;
}

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), 'bump-'));
  manifest = join(tmpDir, '.claude-plugin', 'plugin.json');
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

describe('bump-version', () => {
  // req: trim-maihem-rules/TR-1
  test('patch_raises_third_part', () => {
    writeManifest(manifestText('0.1.0'));
    run(['patch']);
    assert.equal(readVersion(), '0.1.1');
  });

  test('minor_raises_second_part_and_resets_patch', () => {
    writeManifest(manifestText('0.1.9'));
    run(['minor']);
    assert.equal(readVersion(), '0.2.0');
  });

  test('major_raises_first_part_and_resets_minor_and_patch', () => {
    writeManifest(manifestText('1.2.3'));
    run(['major']);
    assert.equal(readVersion(), '2.0.0');
  });

  test('keeps_other_fields_and_key_order', () => {
    writeManifest(manifestText('0.1.0'));
    run(['patch']);
    assert.deepEqual(Object.entries(JSON.parse(readText())), [
      ['name', 'armory'],
      ['version', '0.1.1'],
      ['description', 'd'],
      ['author', { name: 'A' }],
    ]);
  });

  test('writes_two_space_indent_and_one_trailing_newline', () => {
    writeManifest(manifestText('0.1.0'));
    run(['patch']);
    assert.equal(readText(), manifestText('0.1.1'));
  });

  test('prints_new_version_and_newline_on_stdout', () => {
    writeManifest(manifestText('0.1.0'));
    assert.equal(run(['patch']).stdout, '0.1.1\n');
  });

  test('exits_0_on_success', () => {
    writeManifest(manifestText('0.1.0'));
    assert.equal(run(['patch']).status, 0);
  });

  // req: trim-maihem-rules/TR-2
  test('no_argument_exits_2', () => {
    writeManifest(manifestText('0.1.0'));
    assert.equal(run([]).status, 2);
  });

  test('no_argument_prints_usage_on_stderr', () => {
    writeManifest(manifestText('0.1.0'));
    assert.equal(run([]).stderr, 'usage: node scripts/bump-version.mjs <major|minor|patch>\n');
  });

  test('no_argument_leaves_file_unchanged', () => {
    writeManifest(manifestText('0.1.0'));
    run([]);
    assert.equal(readText(), manifestText('0.1.0'));
  });

  test('unknown_argument_exits_2', () => {
    writeManifest(manifestText('0.1.0'));
    assert.equal(run(['patc']).status, 2);
  });

  test('missing_manifest_exits_1', () => {
    assert.equal(run(['patch']).status, 1);
  });

  test('missing_manifest_names_file_on_stderr', () => {
    assert.ok(run(['patch']).stderr.includes(manifest));
  });

  test('missing_manifest_creates_no_file', () => {
    run(['patch']);
    assert.equal(existsSync(manifest), false);
  });

  test('two_part_version_exits_1', () => {
    writeManifest(manifestText('1.2'));
    assert.equal(run(['patch']).status, 1);
  });

  test('two_part_version_leaves_file_unchanged', () => {
    writeManifest(manifestText('1.2'));
    run(['patch']);
    assert.equal(readText(), manifestText('1.2'));
  });

  test('prefixed_version_exits_1', () => {
    writeManifest(manifestText('v1.2.3'));
    assert.equal(run(['patch']).status, 1);
  });

  test('invalid_json_exits_1', () => {
    writeManifest('{ not json');
    assert.equal(run(['patch']).status, 1);
  });

  test('invalid_json_leaves_file_unchanged', () => {
    writeManifest('{ not json');
    run(['patch']);
    assert.equal(readText(), '{ not json');
  });

  test('unknown_argument_prints_usage_on_stderr', () => {
    writeManifest(manifestText('0.1.0'));
    assert.ok(run(['patc']).stderr.includes('usage:'));
  });

  test('invalid_json_names_reason_and_file_on_stderr', () => {
    writeManifest('{ not json');
    const { stderr } = run(['patch']);
    assert.ok(stderr.includes('invalid JSON'));
    assert.ok(stderr.includes(manifest));
  });

  test('prefixed_version_names_reason_and_file_on_stderr', () => {
    writeManifest(manifestText('v1.2.3'));
    const { stderr } = run(['patch']);
    assert.ok(stderr.includes('major.minor.patch'));
    assert.ok(stderr.includes(manifest));
  });

  test('missing_version_field_exits_1', () => {
    const text = JSON.stringify({ name: 'armory' }, null, 2) + '\n';
    writeManifest(text);
    assert.equal(run(['patch']).status, 1);
    assert.equal(readText(), text);
  });

  test('null_manifest_names_reason_and_file_on_stderr', () => {
    writeManifest('null');
    const { status, stderr } = run(['patch']);
    assert.equal(status, 1);
    assert.equal(stderr.trimEnd().split('\n').length, 1);
    assert.ok(stderr.includes('version is not major.minor.patch'));
    assert.ok(stderr.includes(manifest));
  });

  test('leading_zero_version_exits_1_and_leaves_file_unchanged', () => {
    writeManifest(manifestText('01.2.3'));
    assert.equal(run(['patch']).status, 1);
    assert.equal(readText(), manifestText('01.2.3'));
  });
});
