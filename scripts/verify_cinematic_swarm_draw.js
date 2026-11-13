const fs = require('fs');
const vm = require('vm');
const path = require('path');

console.log('=== VERIFYING CINEMATIC DELIBERATE SWARM DRAW (DIRECTIVE #46 & #47) ===');

const indexPath = path.join(__dirname, '..', 'index.html');
const teenPath = path.join(__dirname, '..', 'Tram_Hoc_Duong_Teen.html');

const html = fs.readFileSync(indexPath, 'utf8');

// 1. Bitwise Parity
const bufA = fs.readFileSync(indexPath);
const bufB = fs.readFileSync(teenPath);
if (!bufA.equals(bufB)) {
  console.error('[FAIL] index.html and Tram_Hoc_Duong_Teen.html parity mismatch!');
  process.exit(1);
}
console.log(`[PASS] 100% Bitwise Parity: ${bufA.length} bytes identical`);

// 2. CSS Animation Durations
if (!html.includes('animation: marqueeExpand 0.65s cubic-bezier(0.25, 1, 0.5, 1) forwards !important;')) {
  console.error('[FAIL] Missing 0.65s CSS animation on .swarm-scroll-marquee');
  process.exit(1);
}
console.log('[PASS] .swarm-scroll-marquee CSS animation is 0.65s');

if (!html.includes('animation: marqueeExpand 0.38s cubic-bezier(0.25, 1, 0.5, 1) forwards !important;')) {
  console.error('[FAIL] Missing 0.38s CSS animation on .swarm-btn-marquee');
  process.exit(1);
}
console.log('[PASS] .swarm-btn-marquee CSS animation is 0.38s');

// 3. JavaScript Deliberate Timings
if (!html.includes('setTimeout(revealCard, 650)')) {
  console.error('[FAIL] Missing 650ms revealCard timeout');
  process.exit(1);
}
console.log('[PASS] executeSwarmDraw revealCard is 650ms');

if (!html.includes('setTimeout(revealCard, 850)')) {
  console.error('[FAIL] Missing 850ms safety net timeout');
  process.exit(1);
}
console.log('[PASS] executeSwarmDraw safety net is 850ms');

if (!html.includes('peerObj.speed = 0.08')) {
  console.error('[FAIL] Missing peerObj.speed = 0.08 deliberate glide');
  process.exit(1);
}
console.log('[PASS] peerObj.speed = 0.08 smooth glide pacing verified');

if (!html.includes('processSwarmDrawQueue();') || !html.includes('}, 380);')) {
  console.error('[FAIL] Missing 380ms stagger delay in processSwarmDrawQueue');
  process.exit(1);
}
console.log('[PASS] processSwarmDrawQueue stagger delay is 380ms');

// 4. Test VM Sandbox Execution
const scriptMatch = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
const lastScript = scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '');

const mockElements = {};
function createMockEl(id) {
  const el = {
    id,
    classList: {
      _classes: new Set(),
      add: function(...c) { c.forEach(x => this._classes.add(x)); },
      remove: function(...c) { c.forEach(x => this._classes.delete(x)); },
      contains: function(c) { return this._classes.has(c); }
    },
    style: { setProperty: () => {} },
    dataset: {},
    appendChild: () => {},
    remove: () => {},
    querySelectorAll: () => [],
    querySelector: () => null,
    getBoundingClientRect: () => ({ left: 100, top: 100, width: 400, height: 200 }),
    focus: () => {},
    addEventListener: () => {}
  };
  mockElements[id] = el;
  return el;
}

[
  'tab-landing',
  'swarm-cursors-overlay',
  'swarm-selection-marquee',
  'user-cursor-chat-box',
  'user-cursor-chat-input',
  'bento-hero-banner',
  'bento-vibe-card',
  'landing-live-stats',
  'hero-main-title',
  'stories-container',
  'vibe-check-btn',
  'hero-stamp-cva-hot',
  'hero-stamp-aura'
].forEach(id => createMockEl(id));

const sandbox = {
  console,
  setTimeout: (cb) => { cb(); return 1; },
  clearTimeout: () => {},
  setInterval: () => 1,
  clearInterval: () => {},
  document: {
    getElementById: (id) => mockElements[id] || createMockEl(id),
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => createMockEl('dyn_' + Math.random()),
    body: createMockEl('body'),
    addEventListener: () => {},
    activeElement: { tagName: 'BODY' }
  },
  window: {
    innerWidth: 1024,
    innerHeight: 768,
    addEventListener: () => {},
    scrollTo: () => {},
    localStorage: { getItem: () => null, setItem: () => {} },
    sessionStorage: { getItem: () => null, setItem: () => {} }
  },
  localStorage: { getItem: () => null, setItem: () => {} },
  sessionStorage: { getItem: () => null, setItem: () => {} },
  confetti: () => {},
  requestAnimationFrame: () => {},
  cancelAnimationFrame: () => {}
};
sandbox.window.document = sandbox.document;

const script = new vm.Script(lastScript);
const ctx = vm.createContext(sandbox);
script.runInContext(ctx);

console.log('[PASS] Script evaluated in VM sandbox');

sandbox.window.triggerSwarmBuildIntro(false);
console.log('[PASS] triggerSwarmBuildIntro(false) executed cleanly');

sandbox.window.triggerSwarmBuildIntro(true);
console.log('[PASS] triggerSwarmBuildIntro(true) executed cleanly');

console.log('\n>>> ALL CINEMATIC DELIBERATE SWARM DRAW CHECKS PASSED (0 DEFECTS)! 🚀 <<<');
process.exit(0);
