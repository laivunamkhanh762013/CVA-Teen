const fs = require('fs');
const vm = require('vm');
const path = require('path');

console.log('=== VERIFYING SWARM BUILD ANIMATION & FIGMA CURSOR CHAT ===');

const html = fs.readFileSync('index.html', 'utf8');

// 1. Check DOM Elements
const expectedIds = [
  'replay-swarm-build-btn',
  'swarm-selection-marquee',
  'user-cursor-chat-box',
  'user-cursor-chat-input',
  'bento-hero-banner',
  'hero-main-title',
  'hero-stamp-cva-hot',
  'hero-stamp-aura'
];

expectedIds.forEach(id => {
  if (!html.includes(`id="${id}"`)) {
    console.error(`[FAIL] Missing required DOM ID: ${id}`);
    process.exit(1);
  }
  console.log(`[PASS] Found DOM ID: ${id}`);
});

// 2. Check CSS classes
const expectedClasses = [
  '.swarm-cursor-chat-bubble',
  '#swarm-selection-marquee',
  '.swarm-bento-spring',
  '.user-active-chat-bubble',
  'cursorBubblePop'
];

expectedClasses.forEach(cls => {
  if (!html.includes(cls)) {
    console.error(`[FAIL] Missing CSS class or rule: ${cls}`);
    process.exit(1);
  }
  console.log(`[PASS] Found CSS rule: ${cls}`);
});

// 3. Check Quotes and Functions
const expectedSnippets = [
  'triggerSwarmBuildIntro',
  'openUserCursorChat',
  'closeUserCursorChat',
  'submitUserCursorChat',
  'showPeerChat',
  'SWARM_CHAT_QUOTES',
  'Web CVA nhìn chiến ghê ⚡',
  'Kéo khung Bento Hero chuẩn rồi nha! 📐',
  'Set font Space Grotesk 900 cực cháy! ⚡',
  'Đóng dấu tem chính chủ Chu Văn An! 🏷️',
  'Xong kèo! Trang lên sóng toàn trường rồi anh em ơi! 🚀🎉'
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
function createMockEl(id) {
  const el = {
    id,
    classList: {
      _classes: new Set(),
      add: function(...c) { c.forEach(x => this._classes.add(x)); },
      remove: function(...c) { c.forEach(x => this._classes.delete(x)); },
      contains: function(c) { return this._classes.has(c); }
    },
    style: {
      setProperty: function() {}
    },
    innerHTML: '',
    textContent: '',
    appendChild: function(child) { return child; },
    remove: function() {},
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
  'hero-main-title',
  'stories-container',
  'vibe-check-btn',
  'hero-stamp-cva-hot',
  'hero-stamp-aura',
  'swarm-toggle-btn',
  'swarm-toggle-icon',
  'swarm-toggle-label',
  'modal-command-palette',
  'modal-lightbox',
  'modal-story-viewer'
].forEach(id => createMockEl(id));

const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
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
  requestAnimationFrame: (cb) => setTimeout(cb, 16),
  cancelAnimationFrame: (id) => clearTimeout(id)
};
sandbox.window.document = sandbox.document;

const script = new vm.Script(lastScript);
const ctx = vm.createContext(sandbox);
script.runInContext(ctx);

console.log('[PASS] Inline script compiled & evaluated in sandbox cleanly');

// Check window globals
if (typeof sandbox.window.triggerSwarmBuildIntro !== 'function') {
  console.error('[FAIL] triggerSwarmBuildIntro not exposed on window');
  process.exit(1);
}
console.log('[PASS] triggerSwarmBuildIntro is exposed on window');

if (typeof sandbox.window.openUserCursorChat !== 'function') {
  console.error('[FAIL] openUserCursorChat not exposed on window');
  process.exit(1);
}
console.log('[PASS] openUserCursorChat is exposed on window');

if (typeof sandbox.window.closeUserCursorChat !== 'function') {
  console.error('[FAIL] closeUserCursorChat not exposed on window');
  process.exit(1);
}
console.log('[PASS] closeUserCursorChat is exposed on window');

if (typeof sandbox.window.submitUserCursorChat !== 'function') {
  console.error('[FAIL] submitUserCursorChat not exposed on window');
  process.exit(1);
}
console.log('[PASS] submitUserCursorChat is exposed on window');

// Execute user chat
sandbox.window.openUserCursorChat(200, 200);
console.log('[PASS] openUserCursorChat executed');

sandbox.window.submitUserCursorChat('Test teen chat message');
console.log('[PASS] submitUserCursorChat executed');

// Execute build intro
sandbox.window.triggerSwarmBuildIntro(true);
console.log('[PASS] triggerSwarmBuildIntro executed');

console.log('\n>>> ALL SWARM BUILD ANIMATION & CURSOR CHAT CHECKS PASSED WITH 0 DEFECTS! 🚀 <<<');
process.exit(0);
