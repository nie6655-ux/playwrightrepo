
import fs from 'node:fs';
import path from 'node:path';

type TestResult = {
  status: 'expected' | 'unexpected' | 'flaky' | 'skipped';
};

type TestSuite = {
  specs?: {
    tests?: TestResult[];
  }[];
  suites?: TestSuite[];
};

type JsonReport = {
  suites: TestSuite[];
};

const jsonPath = path.resolve('test-results.json');
const htmlPath = path.resolve('playwright-report/index.html');

const report: JsonReport = JSON.parse(
  fs.readFileSync(jsonPath, 'utf-8')
);

const statuses: TestResult['status'][] = [];

function collectResults(suites: TestSuite[]): void {
  for (const suite of suites) {
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        statuses.push(test.status);
      }
    }

    collectResults(suite.suites ?? []);
  }
}

collectResults(report.suites);

const total = statuses.length;
const passed = statuses.filter(s => s === 'expected').length;
const failed = statuses.filter(s => s === 'unexpected').length;
const flaky = statuses.filter(s => s === 'flaky').length;
const skipped = statuses.filter(s => s === 'skipped').length;

const percentage = (count: number): string =>
  total === 0 ? '0.0%' : `${((count / total) * 100).toFixed(1)}%`;


const summary = `
<div id="custom-test-summary" style="
  max-width: 976px;
  margin: 24px auto;
  padding: 20px;
  background: #1c2129;
  color: #ffffff;
  border: 1px solid #38404c;
  border-radius: 10px;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
">
  <h2 style="margin: 0 0 18px; color: #ffffff;">
    Test Execution Summary
  </h2>

  <div style="
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
  ">
    <div style="background:#173d2a;padding:16px;border-radius:8px;">
      <div style="color:#86efac;">PASSED</div>
      <div style="font-size:28px;font-weight:bold;color:#4ade80;">
        ${percentage(passed)}
      </div>
      <div style="color:#d1fae5;">${passed} tests</div>
    </div>

    <div style="background:#451f25;padding:16px;border-radius:8px;">
      <div style="color:#fca5a5;">FAILED</div>
      <div style="font-size:28px;font-weight:bold;color:#f87171;">
        ${percentage(failed)}
      </div>
      <div style="color:#fecaca;">${failed} tests</div>
    </div>

    <div style="background:#443518;padding:16px;border-radius:8px;">
      <div style="color:#fde68a;">FLAKY</div>
      <div style="font-size:28px;font-weight:bold;color:#facc15;">
        ${percentage(flaky)}
      </div>
      <div style="color:#fef3c7;">${flaky} tests</div>
    </div>

    <div style="background:#293344;padding:16px;border-radius:8px;">
      <div style="color:#bfdbfe;">SKIPPED</div>
      <div style="font-size:28px;font-weight:bold;color:#60a5fa;">
        ${percentage(skipped)}
      </div>
      <div style="color:#dbeafe;">${skipped} tests</div>
    </div>
  </div>

  <div style="margin-top:18px;font-size:14px;color:#cbd5e1;">
    Total Tests: <strong style="color:white;">${total}</strong>
  </div>
</div>
`;


let html = fs.readFileSync(htmlPath, 'utf-8');

// Remove a previously inserted summary, if present.
html = html.replace(
  /<!-- CUSTOM SUMMARY START -->[\s\S]*?<!-- CUSTOM SUMMARY END -->/g,
  ''
);

// Insert the summary before Playwright's application root.
const bodyPattern = /<body\b[^>]*>/i;

if (!bodyPattern.test(html)) {
  throw new Error('Could not locate HTML body element.');
}

html = html.replace(
  bodyPattern,
  `$&\n<!-- CUSTOM SUMMARY START -->\n${summary}\n<!-- CUSTOM SUMMARY END -->`
);

fs.writeFileSync(htmlPath, html);

console.log('Report summary added successfully!');
console.log(`Passed: ${percentage(passed)}`);
console.log(`Failed: ${percentage(failed)}`);
