import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

// The repo has one unit suite; the plugin script is tested from it.
const scriptPath = fileURLToPath(new URL('../../../../scripts/bump-version.mjs', import.meta.url));

type Run = { status: number; stdout: string; stderr: string };

let tmpDir: string;
let manifest: string;

function writeManifest(text: string): void {
  mkdirSync(join(tmpDir, '.claude-plugin'), { recursive: true });
  writeFileSync(manifest, text);
}

function manifestText(version: string): string {
  const obj = { name: 'armory', version, description: 'd', author: { name: 'A' } };
  return JSON.stringify(obj, null, 2) + '\n';
}

function run(args: string[]): Run {
  try {
    const stdout = execFileSync(process.execPath, [scriptPath, ...args], {
      cwd: tmpDir,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return { status: 0, stdout, stderr: '' };
  } catch (err) {
    const e = err as Run;
    return { status: e.status, stdout: e.stdout, stderr: e.stderr };
  }
}

function readText(): string {
  return readFileSync(manifest, 'utf8');
}

function readVersion(): string {
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
  it('patch_raises_third_part', () => {
    writeManifest(manifestText('0.1.0'));
    run(['patch']);
    expect(readVersion()).toBe('0.1.1');
  });

  it('minor_raises_second_part_and_resets_patch', () => {
    writeManifest(manifestText('0.1.9'));
    run(['minor']);
    expect(readVersion()).toBe('0.2.0');
  });

  it('major_raises_first_part_and_resets_minor_and_patch', () => {
    writeManifest(manifestText('1.2.3'));
    run(['major']);
    expect(readVersion()).toBe('2.0.0');
  });

  it('keeps_other_fields_and_key_order', () => {
    writeManifest(manifestText('0.1.0'));
    run(['patch']);
    expect(Object.entries(JSON.parse(readText()))).toEqual([
      ['name', 'armory'],
      ['version', '0.1.1'],
      ['description', 'd'],
      ['author', { name: 'A' }],
    ]);
  });

  it('writes_two_space_indent_and_one_trailing_newline', () => {
    writeManifest(manifestText('0.1.0'));
    run(['patch']);
    expect(readText()).toBe(manifestText('0.1.1'));
  });

  it('prints_new_version_and_newline_on_stdout', () => {
    writeManifest(manifestText('0.1.0'));
    expect(run(['patch']).stdout).toBe('0.1.1\n');
  });

  it('exits_0_on_success', () => {
    writeManifest(manifestText('0.1.0'));
    expect(run(['patch']).status).toBe(0);
  });

  // req: trim-maihem-rules/TR-2
  it('no_argument_exits_2', () => {
    writeManifest(manifestText('0.1.0'));
    expect(run([]).status).toBe(2);
  });

  it('no_argument_prints_usage_on_stderr', () => {
    writeManifest(manifestText('0.1.0'));
    expect(run([]).stderr).toBe('usage: node scripts/bump-version.mjs <major|minor|patch>\n');
  });

  it('no_argument_leaves_file_unchanged', () => {
    writeManifest(manifestText('0.1.0'));
    run([]);
    expect(readText()).toBe(manifestText('0.1.0'));
  });

  it('unknown_argument_exits_2', () => {
    writeManifest(manifestText('0.1.0'));
    expect(run(['patc']).status).toBe(2);
  });

  it('missing_manifest_exits_1', () => {
    expect(run(['patch']).status).toBe(1);
  });

  it('missing_manifest_names_file_on_stderr', () => {
    expect(run(['patch']).stderr).toContain(manifest);
  });

  it('missing_manifest_creates_no_file', () => {
    run(['patch']);
    expect(existsSync(manifest)).toBe(false);
  });

  it('two_part_version_exits_1', () => {
    writeManifest(manifestText('1.2'));
    expect(run(['patch']).status).toBe(1);
  });

  it('two_part_version_leaves_file_unchanged', () => {
    writeManifest(manifestText('1.2'));
    run(['patch']);
    expect(readText()).toBe(manifestText('1.2'));
  });

  it('prefixed_version_exits_1', () => {
    writeManifest(manifestText('v1.2.3'));
    expect(run(['patch']).status).toBe(1);
  });

  it('invalid_json_exits_1', () => {
    writeManifest('{ not json');
    expect(run(['patch']).status).toBe(1);
  });

  it('invalid_json_leaves_file_unchanged', () => {
    writeManifest('{ not json');
    run(['patch']);
    expect(readText()).toBe('{ not json');
  });

  it('unknown_argument_prints_usage_on_stderr', () => {
    writeManifest(manifestText('0.1.0'));
    expect(run(['patc']).stderr).toContain('usage:');
  });

  it('invalid_json_names_reason_and_file_on_stderr', () => {
    writeManifest('{ not json');
    const { stderr } = run(['patch']);
    expect(stderr).toContain('invalid JSON');
    expect(stderr).toContain(manifest);
  });

  it('prefixed_version_names_reason_and_file_on_stderr', () => {
    writeManifest(manifestText('v1.2.3'));
    const { stderr } = run(['patch']);
    expect(stderr).toContain('major.minor.patch');
    expect(stderr).toContain(manifest);
  });

  it('missing_version_field_exits_1', () => {
    const text = JSON.stringify({ name: 'armory' }, null, 2) + '\n';
    writeManifest(text);
    expect(run(['patch']).status).toBe(1);
    expect(readText()).toBe(text);
  });

  it('null_manifest_names_reason_and_file_on_stderr', () => {
    writeManifest('null');
    const { status, stderr } = run(['patch']);
    expect(status).toBe(1);
    expect(stderr.trimEnd().split('\n')).toHaveLength(1);
    expect(stderr).toContain('version is not major.minor.patch');
    expect(stderr).toContain(manifest);
  });

  it('leading_zero_version_exits_1_and_leaves_file_unchanged', () => {
    writeManifest(manifestText('01.2.3'));
    expect(run(['patch']).status).toBe(1);
    expect(readText()).toBe(manifestText('01.2.3'));
  });
});
