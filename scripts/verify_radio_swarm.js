const fs = require('fs');
const crypto = require('crypto');
const vm = require('vm');

console.log('=== TEST SUITE: CVA RADIO SWARM DRAW VERIFICATION ===\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failCount++;
  }
}

// 1. Bitwise Byte Parity
const indexContent = fs.readFileSync('index.html');
const teenContent = fs.readFileSync('Tram_Hoc_Duong_Teen.html');

assert(indexContent.length === teenContent.length, `Byte length parity: index.html (${indexContent.length}) === Tram_Hoc_Duong_Teen.html (${teenContent.length})`);

const hashIndex = crypto.createHash('sha256').update(indexContent).digest('hex');
const hashTeen = crypto.createHash('sha256').update(teenContent).digest('hex');
assert(hashIndex === hashTeen, `SHA-256 parity: ${hashIndex}`);

const html = indexContent.toString('utf8');

// 2. HTML Markup structure for CVA Radio
assert(html.includes('id="cva-radio-broadcast"'), 'Found container #cva-radio-broadcast in HTML');
assert(html.includes('id="radio-broadcast-header"'), 'Found header #radio-broadcast-header in HTML');
assert(html.includes('id="radio-sort-pills"'), 'Found feed sorter container #radio-sort-pills in HTML');

// 3. Header classes
const headerMatch = html.match(/id="radio-broadcast-header"[^>]*class="([^"]*)"/);
if (headerMatch) {
  const classes = headerMatch[1];
  assert(classes.includes('swarm-draw-target'), 'Header has class swarm-draw-target');
  assert(classes.includes('swarm-draw-pending'), 'Header has class swarm-draw-pending');
} else {
  assert(false, 'Header #radio-broadcast-header has class attribute');
}

// 4. Selector targeting in initScrollSwarmDraw
const initIdx = html.indexOf('function initScrollSwarmDraw');
if (initIdx !== -1) {
  const initChunk = html.slice(initIdx, initIdx + 1200);
  assert(initChunk.includes('#radio-broadcast-header'), 'initScrollSwarmDraw targets #radio-broadcast-header');
  assert(initChunk.includes('landing-threads-feed') || initChunk.includes('thread-card'), 'initScrollSwarmDraw targets landing threads cards');
} else {
  assert(false, 'function initScrollSwarmDraw exists');
}

// 5. Thread card markup in buildThreadCardHTML
const buildIdx = html.indexOf('function buildThreadCardHTML');
if (buildIdx !== -1) {
  const buildChunk = html.slice(buildIdx, buildIdx + 4500);
  assert(buildChunk.includes('swarm-draw-target') && buildChunk.includes('swarm-draw-pending'), 'buildThreadCardHTML outputs swarm-draw-target and swarm-draw-pending on thread cards');
} else {
  assert(false, 'function buildThreadCardHTML exists');
}

// 6. Dynamic observation in renderLandingFeed
const renderIdx = html.indexOf('function renderLandingFeed');
if (renderIdx !== -1) {
  const renderChunk = html.slice(renderIdx, renderIdx + 3500);
  assert(renderChunk.includes('__swarmDrawObserver') && renderChunk.includes('observe'), 'renderLandingFeed registers thread cards with __swarmDrawObserver');
} else {
  assert(false, 'function renderLandingFeed exists');
}

// 7. Syntax validity of inline scripts
const scriptRegex = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi;
let match;
let scriptIndex = 0;
let syntaxOk = true;

while ((match = scriptRegex.exec(html)) !== null) {
  const code = match[1];
  if (!code.trim()) continue;
  scriptIndex++;
  try {
    new vm.Script(code);
  } catch (err) {
    syntaxOk = false;
    console.error(`  [FAIL] Script #${scriptIndex} syntax error: ${err.message}`);
  }
}
assert(syntaxOk, `All ${scriptIndex} inline scripts pass V8 syntax check`);

console.log(`\n=== RESULTS: ${passCount} PASSED, ${failCount} FAILED ===`);
if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
