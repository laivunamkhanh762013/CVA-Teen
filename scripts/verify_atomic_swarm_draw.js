const fs = require('fs');
const vm = require('vm');
const path = require('path');

console.log('=== VERIFYING SWARM MULTIPLAYER ATOMIC COMPONENT DRAWING ===');

const indexPath = path.join(__dirname, '..', 'index.html');
const teenPath = path.join(__dirname, '..', 'Tram_Hoc_Duong_Teen.html');

const html = fs.readFileSync(indexPath, 'utf8');

// 1. Bitwise Parity
const bufA = fs.readFileSync(indexPath);
const bufB = fs.readFileSync(teenPath);
if (!bufA.equals(bufB)) {
  console.error('[FAIL] Parity mismatch between index.html and Tram_Hoc_Duong_Teen.html!');
  process.exit(1);
}
console.log(`[PASS] 100% Bitwise Parity: ${bufA.length} bytes identical`);

// 2. Check Atomic DOM IDs
const atomicIds = [
  'stories-header-row',
  'story-item-0',
  'story-item-1',
  'story-item-2',
  'story-item-3',
  'story-item-4',
  'story-item-5',
  'hero-floating-sticker',
  'hero-badge-school',
  'hero-badge-tag',
  'hero-stamp-cva-hot',
  'hero-stamp-aura',
  'hero-main-title',
  'hero-subtitle-desc',
  'hero-btn-lost',
  'hero-btn-books',
  'hero-btn-conf',
  'hero-btn-profile',
  'vibe-badge',
  'vibe-title',
  'vibe-check-display',
  'vibe-check-btn'
];

atomicIds.forEach(id => {
  if (!html.includes(`id="${id}"`)) {
    console.error(`[FAIL] Missing required atomic DOM ID: ${id}`);
    process.exit(1);
  }
  console.log(`[PASS] Found atomic DOM ID: ${id}`);
});

// 3. Check CSS rules
const atomicCSS = [
  '.swarm-atomic-item',
  '.swarm-atomic-pending',
  '.swarm-atomic-marquee',
  '.swarm-atomic-revealed',
  'atomicMarqueeExpand',
  'atomicPopIn'
];

atomicCSS.forEach(cls => {
  if (!html.includes(cls)) {
    console.error(`[FAIL] Missing atomic CSS token: ${cls}`);
    process.exit(1);
  }
  console.log(`[PASS] Found atomic CSS token: ${cls}`);
});

// 4. Check JS Function
if (!html.includes('function drawAtomicElement(')) {
  console.error('[FAIL] Missing drawAtomicElement function definition');
  process.exit(1);
}
console.log('[PASS] Found drawAtomicElement function definition');

if (!html.includes('window.drawAtomicElement = drawAtomicElement')) {
  console.error('[FAIL] drawAtomicElement not exposed on window');
  process.exit(1);
}
console.log('[PASS] drawAtomicElement is exposed on window');

// 5. Test execution in sandbox VM
const scriptMatch = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
const lastScript = scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '');

const mockElements = {};
function createMockEl(id, className = '') {
  const el = {
    id,
    className,
    classList: {
      _classes: new Set(className ? className.split(' ') : []),
      add: function(...c) { c.forEach(x => this._classes.add(x)); },
      remove: function(...c) { c.forEach(x => this._classes.delete(x)); },
      contains: function(c) { return this._classes.has(c); }
    },
    style: { setProperty: () => {} },
    dataset: {},
    appendChild: function(c) { return c; },
    remove: function() {},
    querySelectorAll: () => [],
    querySelector: () => null,
    getBoundingClientRect: () => ({ left: 100, top: 100, width: 200, height: 40 }),
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
  ...atomicIds
].forEach(id => createMockEl(id, 'swarm-atomic-item'));

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

console.log('[PASS] Script evaluated in sandbox');

// Test single atomic element draw
let completed = false;
sandbox.window.drawAtomicElement(mockElements['hero-badge-school'], { id: 'p1', color: '#FF007A' }, 0, () => {
  completed = true;
});

if (!completed) {
  console.error('[FAIL] drawAtomicElement callback not invoked');
  process.exit(1);
}
console.log('[PASS] drawAtomicElement executed cleanly and fired onComplete callback');

// Test triggerSwarmBuildIntro with full atomic orchestration
sandbox.window.triggerSwarmBuildIntro(false);
console.log('[PASS] triggerSwarmBuildIntro(false) executed cleanly');

sandbox.window.triggerSwarmBuildIntro(true);
console.log('[PASS] triggerSwarmBuildIntro(true) executed cleanly');

console.log('\n>>> ALL SWARM MULTIPLAYER ATOMIC DRAW CHECKS PASSED (0 DEFECTS)! 🚀 <<<');
process.exit(0);
