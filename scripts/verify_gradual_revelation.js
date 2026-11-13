const fs = require('fs');
const vm = require('vm');
const path = require('path');

console.log('=== VERIFYING GRADUAL SWARM REVELATION ("LÚC ĐẦU LÀ KO CÓ GÌ CẢ") ===');

const indexPath = path.join(__dirname, '..', 'index.html');
const teenPath = path.join(__dirname, '..', 'Tram_Hoc_Duong_Teen.html');

const htmlRaw = fs.readFileSync(indexPath, 'utf8');
const teenRaw = fs.readFileSync(teenPath, 'utf8');
const html = htmlRaw.replace(/\r\n/g, '\n');

// 1. Bitwise Parity
const bufA = fs.readFileSync(indexPath);
const bufB = fs.readFileSync(teenPath);
if (!bufA.equals(bufB)) {
  console.error('[FAIL] Parity mismatch between index.html and Tram_Hoc_Duong_Teen.html!');
  process.exit(1);
}
console.log(`[PASS] 100% Bitwise Parity: ${bufA.length} bytes identical`);

// 2. Check 100% Invisible Initial Canvas CSS
if (!html.includes('border: 2px dashed transparent !important;')) {
  console.error('[FAIL] .swarm-draw-pending border is not transparent!');
  process.exit(1);
}
console.log('[PASS] .swarm-draw-pending border is transparent');

if (!html.includes('.swarm-draw-pending::before {\n      display: none !important;')) {
  console.error('[FAIL] .swarm-draw-pending::before watermark not hidden!');
  process.exit(1);
}
console.log('[PASS] .swarm-draw-pending::before watermark is completely removed');

if (!html.includes('.swarm-atomic-pending {\n      opacity: 0 !important;\n      visibility: hidden !important;')) {
  console.error('[FAIL] .swarm-atomic-pending is not opacity: 0 and visibility: hidden!');
  process.exit(1);
}
console.log('[PASS] .swarm-atomic-pending is 100% invisible (opacity: 0, visibility: hidden)');

// 3. Check HTML Markup Elements Start With swarm-atomic-pending
const atomicTestIds = [
  'stories-header-row',
  'story-item-0',
  'story-item-1',
  'hero-floating-sticker',
  'hero-badge-school',
  'hero-main-title',
  'hero-subtitle-desc',
  'hero-btn-lost',
  'hero-btn-books',
  'vibe-badge',
  'vibe-title',
  'vibe-check-btn'
];

atomicTestIds.forEach(id => {
  const match = html.match(new RegExp(`id="${id}"[^>]*class="[^"]*swarm-atomic-pending`));
  if (!match) {
    console.error(`[FAIL] ${id} does not start with class swarm-atomic-pending!`);
    process.exit(1);
  }
  console.log(`[PASS] ${id} initialized with swarm-atomic-pending (100% blank)`);
});

// 4. Test VM Sandbox Execution
const scriptMatch = htmlRaw.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
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
  'stories-container',
  ...atomicTestIds
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
    querySelectorAll: (sel) => {
      if (sel.includes('.swarm-atomic-item')) {
        return Object.values(mockElements).filter(e => e.classList.contains('swarm-atomic-item'));
      }
      return [];
    },
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

console.log('[PASS] Script evaluated cleanly in VM sandbox');

sandbox.window.triggerSwarmBuildIntro(false);
console.log('[PASS] triggerSwarmBuildIntro(false) executed cleanly');

sandbox.window.triggerSwarmBuildIntro(true);
console.log('[PASS] triggerSwarmBuildIntro(true) executed cleanly');

console.log('\n>>> ALL GRADUAL SWARM REVELATION CHECKS PASSED (0 DEFECTS)! 🚀 <<<');
process.exit(0);
