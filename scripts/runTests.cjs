
const { spawnSync } = require('node:child_process');

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  if (result.error) {
    console.error(result.error);
    return 1;
  }

  return result.status ?? 1;
}

// Step 1: Execute Playwright tests
const testExitCode = run(npm, ['run', 'test']);

// Step 2: Generate our custom summary regardless of test outcome
const reportExitCode = run(npm, ['run', 'report:summary']);

// Step 3: Preserve the original test failure status
process.exitCode = testExitCode || reportExitCode;
