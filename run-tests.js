#!/usr/bin/env node
/**
 * Node.js test runner for bracket.test.html (and future .test.html files).
 * Extracts the <script> block, mocks the DOM, and runs the tests headlessly.
 * Exit code 0 = all tests passed, 1 = one or more failures.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const testFiles = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs.readdirSync(__dirname).filter(f => f.endsWith('.test.html'));

if (testFiles.length === 0) {
  console.error('No .test.html files found.');
  process.exit(1);
}

let totalPassed = 0;
let totalFailed = 0;

for (const file of testFiles) {
  const filePath = path.resolve(__dirname, file);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Running: ${file}`);
  console.log('='.repeat(60));

  const html = fs.readFileSync(filePath, 'utf-8');
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/i);
  if (!scriptMatch) {
    console.error(`  No <script> block found in ${file}`);
    totalFailed++;
    continue;
  }

  let script = scriptMatch[1];

  // ── Mock the DOM ──────────────────────────────────────────────
  // Replace the `out` / `sumEl` references with no-ops so the
  // pure-logic tests can run in Node without a browser.
  const domMock = `
    const out = {
      appendChild: function(el) {
        if (el._cls === 'fail') console.log(el._text);
      }
    };
    const __createElement = function() {
      const o = { _cls: '', _text: '' };
      Object.defineProperty(o, 'className', {
        set(v) { o._cls = v; },
        get()  { return o._cls; }
      });
      Object.defineProperty(o, 'textContent', {
        set(v) { o._text = v; },
        get()  { return o._text; }
      });
      return o;
    };
  `;

  // Replace document.getElementById / createElement calls
  script = script.replace(
    /const out = document\.getElementById\('output'\);/,
    domMock
  );
  script = script.replace(
    /document\.createElement\(\s*['"][^'"]+['"]\s*\)/g,
    '__createElement()'
  );

  // Replace the summary block to capture results in Node
  script = script.replace(
    /\/\* === Summary === \*\/[\s\S]*$/,
    `
    // ── Node summary ──
    if (failed === 0) {
      console.log('\\n✅  All ' + passed + ' tests passed');
    } else {
      console.log('\\n❌  ' + failed + ' FAILED / ' + (passed + failed) + ' total');
    }
    __results.passed = passed;
    __results.failed = failed;
    `
  );

  try {
    const results = { passed: 0, failed: 0 };
    const context = vm.createContext({
      console,
      JSON,
      Array,
      Object,
      Set,
      Map,
      Math,
      String,
      Number,
      __results: results
    });

    vm.runInContext(script, context, { filename: file });

    totalPassed += results.passed;
    totalFailed += results.failed;
  } catch (err) {
    console.error(`  Runtime error in ${file}:`, err.message);
    totalFailed++;
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Total: ${totalPassed} passed, ${totalFailed} failed`);
console.log('='.repeat(60));

process.exit(totalFailed > 0 ? 1 : 0);
