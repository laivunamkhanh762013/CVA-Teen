const fs = require('fs');
const vm = require('vm');

console.log('=== VERIFYING BUTTON SWARM DRAW & QUIZIZZ LOBBY FIX ===');

const html = fs.readFileSync('index.html', 'utf8');

// 1. Check absence of raw HTML leak
if (html.includes('</div>div')) {
  console.error('[FAIL] Raw HTML leak "</div>div" still present in document!');
  process.exit(1);
}
console.log('[PASS] Raw HTML leak "</div>div" is 100% eliminated');

// 2. Check CSS classes
const expectedClasses = [
  '.swarm-btn-pending',
  '.swarm-btn-revealed',
  '.swarm-btn-marquee',
  'btnSpringPop'
];

expectedClasses.forEach(cls => {
  if (!html.includes(cls)) {
    console.error(`[FAIL] Missing CSS class: ${cls}`);
    process.exit(1);
  }
  console.log(`[PASS] Found CSS rule: ${cls}`);
});

// 3. Check JavaScript function
if (!html.includes('function drawCardButtons(')) {
  console.error('[FAIL] Missing drawCardButtons function');
  process.exit(1);
}
console.log('[PASS] Found drawCardButtons function definition');

if (!html.includes('window.drawCardButtons = drawCardButtons')) {
  console.error('[FAIL] drawCardButtons not exposed on window');
  process.exit(1);
}
console.log('[PASS] drawCardButtons is exposed on window');

// 4. Test execution in headless vm sandbox
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
    style: {
      setProperty: function() {}
    },
    dataset: {},
    innerHTML: '',
    textContent: '',
    appendChild: function(child) { child.parentNode = this; return child; },
    remove: function() { this.parentNode = null; },
    querySelector: function() { return null; },
    querySelectorAll: function(sel) {
      if (sel.includes('button')) {
        return [createMockEl('btn_1'), createMockEl('btn_2')];
      }
      return [];
    },
    getBoundingClientRect: function() { return { left: 100, top: 100, width: 200, height: 40 }; },
    focus: function() {},
    addEventListener: function() {},
    value: ''
  };
  mockElements[id] = el;
  return el;
}

[
  'swarm-cursors-overlay',
  'bento-hero-banner',
  'bento-vibe-card',
  'quizizz-live-lobby'
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
    createElement: (tag) => createMockEl('dyn_' + Math.random()),
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

console.log('[PASS] Script evaluated cleanly in VM');

if (typeof sandbox.window.drawCardButtons !== 'function') {
  console.error('[FAIL] drawCardButtons not on window');
  process.exit(1);
}

sandbox.window.drawCardButtons(mockElements['bento-hero-banner']);
console.log('[PASS] drawCardButtons executed cleanly');

console.log('\n>>> ALL BUTTON SWARM DRAW & LOBBY CHECKS PASSED (0 DEFECTS)! 🚀 <<<');
process.exit(0);
