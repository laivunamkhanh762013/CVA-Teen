const fs = require('fs');
const vm = require('vm');
const path = require('path');

console.log('=== VERIFYING SCROLL-DRIVEN SWARM DRAW & REVEAL SYSTEM ===');

const html = fs.readFileSync('index.html', 'utf8');

// 1. Check DOM Elements & Targets
const expectedIds = [
  'bento-hero-banner',
  'bento-vibe-card',
  'quizizz-live-lobby',
  'cva-weekly-poll',
  'landing-faqs-accordion',
  'landing-final-cta'
];

expectedIds.forEach(id => {
  if (!html.includes(`id="${id}"`)) {
    console.error(`[FAIL] Missing required DOM ID: ${id}`);
    process.exit(1);
  }
  console.log(`[PASS] Found DOM ID: ${id}`);
});

// Check swarm-draw-target class presence
if (!html.includes('swarm-draw-target')) {
  console.error('[FAIL] Missing .swarm-draw-target class in markup');
  process.exit(1);
}
console.log('[PASS] Found .swarm-draw-target in markup');

// 2. Check CSS classes
const expectedClasses = [
  '.swarm-draw-pending',
  '.swarm-scroll-marquee',
  '.swarm-size-pill',
  '.swarm-draw-revealed',
  'cardSpringBounce',
  'marqueeExpand'
];

expectedClasses.forEach(cls => {
  if (!html.includes(cls)) {
    console.error(`[FAIL] Missing CSS class or rule: ${cls}`);
    process.exit(1);
  }
  console.log(`[PASS] Found CSS rule: ${cls}`);
});

// 3. Check JavaScript Snippets
const expectedSnippets = [
  'initScrollSwarmDraw',
  'queueSwarmDraw',
  'processSwarmDrawQueue',
  'executeSwarmDraw',
  'window.initScrollSwarmDraw = initScrollSwarmDraw'
];

expectedSnippets.forEach(snip => {
  if (!html.includes(snip)) {
    console.error(`[FAIL] Missing snippet: ${snip}`);
    process.exit(1);
  }
  console.log(`[PASS] Found snippet: ${snip}`);
});

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
    querySelectorAll: function() { return []; },
    getBoundingClientRect: function() { return { left: 100, top: 100, width: 400, height: 200 }; },
    focus: function() {},
    addEventListener: function() {},
    value: ''
  };
  mockElements[id] = el;
  return el;
}

[
  'swarm-cursors-overlay',
  'swarm-selection-marquee',
  'user-cursor-chat-box',
  'user-cursor-chat-input',
  'bento-hero-banner',
  'bento-vibe-card',
  'stories-container',
  'vibe-check-btn',
  'hero-stamp-cva-hot',
  'hero-stamp-aura',
  'swarm-toggle-btn',
  'swarm-toggle-icon',
  'swarm-toggle-label',
  'modal-command-palette',
  'modal-lightbox',
  'modal-story-viewer',
  'quizizz-live-lobby',
  'cva-weekly-poll',
  'landing-faqs-accordion',
  'landing-final-cta'
].forEach(id => createMockEl(id, 'swarm-draw-target'));

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
      if (sel.includes('.swarm-draw-target') || sel.includes('#bento-hero-banner')) {
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
    localStorage: {
      getItem: () => null,
      setItem: () => {}
    },
    sessionStorage: {
      getItem: () => null,
      setItem: () => {}
    }
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {}
  },
  sessionStorage: {
    getItem: () => null,
    setItem: () => {}
  },
  confetti: () => {},
  requestAnimationFrame: () => {},
  cancelAnimationFrame: () => {}
};
sandbox.window.document = sandbox.document;

const script = new vm.Script(lastScript);
const ctx = vm.createContext(sandbox);
script.runInContext(ctx);

console.log('[PASS] Script evaluated cleanly in sandbox');

// Check initScrollSwarmDraw
if (typeof sandbox.window.initScrollSwarmDraw !== 'function') {
  console.error('[FAIL] initScrollSwarmDraw not exposed on window');
  process.exit(1);
}
console.log('[PASS] initScrollSwarmDraw is exposed on window');

sandbox.window.initScrollSwarmDraw();
console.log('[PASS] initScrollSwarmDraw executed cleanly');

// Check replay reset
sandbox.window.triggerSwarmBuildIntro(true);
console.log('[PASS] triggerSwarmBuildIntro manual replay executed cleanly');

console.log('\n>>> ALL SCROLL-DRIVEN SWARM DRAW & REVEAL CHECKS PASSED (0 DEFECTS)! 🚀 <<<');
process.exit(0);
