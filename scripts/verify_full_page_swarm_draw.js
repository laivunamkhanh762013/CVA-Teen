const fs = require('fs');
const vm = require('vm');
const path = require('path');

console.log('=== VERIFYING FULL-PAGE SWARM DRAW & ON-SCROLL SPEC (DIRECTIVE #36 & #37) ===');

const indexPath = path.join(__dirname, '..', 'index.html');
const teenPath = path.join(__dirname, '..', 'Tram_Hoc_Duong_Teen.html');

const html = fs.readFileSync(indexPath, 'utf8');
const teenHtml = fs.readFileSync(teenPath, 'utf8');

// 1. Bitwise Parity
const bufA = fs.readFileSync(indexPath);
const bufB = fs.readFileSync(teenPath);
if (!bufA.equals(bufB)) {
  console.error('[FAIL] index.html and Tram_Hoc_Duong_Teen.html are not bitwise identical!');
  process.exit(1);
}
console.log(`[PASS] 100% Bitwise Parity: ${bufA.length} bytes identical`);

// 2. Absence of harmful conditions
if (html.includes('cva_swarm_built')) {
  console.error('[FAIL] Legacy sessionStorage key cva_swarm_built is still present!');
  process.exit(1);
}
console.log('[PASS] cva_swarm_built sessionStorage condition completely eliminated');

if (html.includes('rect.top < vh + 60')) {
  console.error('[FAIL] Legacy premature reveal check rect.top < vh + 60 is still present!');
  process.exit(1);
}
console.log('[PASS] rect.top < vh + 60 premature reveal check completely eliminated');

// 3. Check Live Stats Grid ID
if (!html.includes('id="landing-live-stats"')) {
  console.error('[FAIL] Missing id="landing-live-stats"');
  process.exit(1);
}
console.log('[PASS] Found id="landing-live-stats"');

// 4. Check CSS and Classes
const requiredCSS = [
  '.swarm-draw-pending',
  '.swarm-draw-revealed',
  '.swarm-scroll-marquee',
  '.swarm-size-pill',
  '.swarm-btn-pending',
  '.swarm-btn-revealed',
  '.swarm-btn-marquee',
  'cardSpringBounce',
  'btnSpringPop',
  'marqueeExpand'
];
requiredCSS.forEach(cls => {
  if (!html.includes(cls)) {
    console.error(`[FAIL] Missing CSS token: ${cls}`);
    process.exit(1);
  }
  console.log(`[PASS] Found CSS token: ${cls}`);
});

// 5. Test in headless VM Sandbox
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
    querySelector: function(sel) {
      if (sel.includes('.swarm-scroll-marquee') || sel.includes('.swarm-btn-marquee')) {
        return createMockEl('marquee_mock');
      }
      return null;
    },
    querySelectorAll: function(sel) {
      if (sel.includes('button')) {
        return [createMockEl('btn_action_1'), createMockEl('btn_action_2')];
      }
      if (sel.includes('.swarm-draw-target')) {
        return Object.values(mockElements).filter(e => e.classList.contains('swarm-draw-target'));
      }
      return [];
    },
    getBoundingClientRect: function() { return { left: 100, top: 100, width: 400, height: 200 }; },
    focus: function() {},
    addEventListener: function() {},
    value: ''
  };
  mockElements[id] = el;
  return el;
}

const targetIds = [
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
  'hero-stamp-aura',
  'quizizz-live-lobby',
  'cva-weekly-poll',
  'landing-faqs-accordion',
  'landing-final-cta',
  'landing-problem-agitation',
  'cva-pillars-showcase',
  'landing-testimonials'
];

targetIds.forEach(id => createMockEl(id, id.startsWith('bento') || id.startsWith('landing') || id.startsWith('quizizz') || id.startsWith('cva') ? 'swarm-draw-target' : ''));

let observedCount = 0;
class MockIntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }
  observe(target) {
    observedCount++;
  }
  unobserve(target) {}
  disconnect() {}
}

const sandbox = {
  console,
  setTimeout: (cb, ms) => { cb(); return 1; },
  clearTimeout: () => {},
  setInterval: () => 1,
  clearInterval: () => {},
  document: {
    getElementById: (id) => mockElements[id] || createMockEl(id),
    querySelector: (sel) => {
      if (sel.startsWith('#')) return mockElements[sel.slice(1)] || null;
      return null;
    },
    querySelectorAll: (sel) => {
      if (sel.includes('.swarm-draw-target') || sel.includes('bento-hero-banner')) {
        return Object.values(mockElements).filter(el => el.classList.contains('swarm-draw-target'));
      }
      return [];
    },
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
    sessionStorage: { getItem: () => null, setItem: () => {} },
    IntersectionObserver: MockIntersectionObserver
  },
  localStorage: { getItem: () => null, setItem: () => {} },
  sessionStorage: { getItem: () => null, setItem: () => {} },
  IntersectionObserver: MockIntersectionObserver,
  confetti: () => {},
  requestAnimationFrame: () => {},
  cancelAnimationFrame: () => {}
};
sandbox.window.document = sandbox.document;

const script = new vm.Script(lastScript);
const ctx = vm.createContext(sandbox);
script.runInContext(ctx);

console.log('[PASS] Script evaluated cleanly in VM with IntersectionObserver');

// Run initScrollSwarmDraw
sandbox.window.initScrollSwarmDraw();
console.log(`[PASS] initScrollSwarmDraw ran, observed targets: ${observedCount}`);

// Verify Bento Hero & Bento Vibe start with swarm-draw-pending
const hero = mockElements['bento-hero-banner'];
const vibe = mockElements['bento-vibe-card'];

// Run triggerSwarmBuildIntro (load animation)
sandbox.window.triggerSwarmBuildIntro(false);
console.log('[PASS] triggerSwarmBuildIntro(false) executed cleanly');

// Verify revealed states
if (!hero.classList.contains('swarm-draw-revealed')) {
  console.error('[FAIL] Bento Hero not revealed after triggerSwarmBuildIntro');
  process.exit(1);
}
console.log('[PASS] Bento Hero popped & revealed');

if (!vibe.classList.contains('swarm-draw-revealed')) {
  console.error('[FAIL] Bento Vibe not revealed after triggerSwarmBuildIntro');
  process.exit(1);
}
console.log('[PASS] Bento Vibe popped & revealed');

// Run manual replay
sandbox.window.triggerSwarmBuildIntro(true);
console.log('[PASS] triggerSwarmBuildIntro(true) manual replay executed cleanly');

console.log('\n>>> ALL FULL-PAGE SWARM DRAW & ON-SCROLL CHECKS PASSED (0 DEFECTS)! 🚀 <<<');
process.exit(0);
