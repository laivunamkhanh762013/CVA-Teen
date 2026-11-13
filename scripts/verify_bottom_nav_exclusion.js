const fs = require('fs');
const vm = require('vm');
const path = require('path');

console.log('=== VERIFYING BOTTOM NAV EXCLUSION ZONE & RHYTHM SPEC ===');

const indexPath = path.join(__dirname, '..', 'index.html');
const teenPath = path.join(__dirname, '..', 'Tram_Hoc_Duong_Teen.html');

const html = fs.readFileSync(indexPath, 'utf8');

// 1. Bitwise Parity
const bufA = fs.readFileSync(indexPath);
const bufB = fs.readFileSync(teenPath);
if (!bufA.equals(bufB)) {
  console.error('[FAIL] Parity check failed!');
  process.exit(1);
}
console.log(`[PASS] 100% Bitwise Parity: ${bufA.length} bytes identical`);

// 2. Check Z-Index on #bottom-nav and FAB
if (!html.includes('<nav id="bottom-nav" class="fixed bottom-0 left-0 right-0 z-[60]')) {
  console.error('[FAIL] Missing z-[60] on #bottom-nav');
  process.exit(1);
}
console.log('[PASS] #bottom-nav has z-[60]');

if (!html.includes('class="fixed right-4 bottom-20 z-[60]"')) {
  console.error('[FAIL] Missing z-[60] on FAB container');
  process.exit(1);
}
console.log('[PASS] FAB container has z-[60]');

// 3. Check <main> padding
if (!html.includes('pb-32 sm:pb-36')) {
  console.error('[FAIL] Missing pb-32 sm:pb-36 on <main>');
  process.exit(1);
}
console.log('[PASS] <main> has pb-32 sm:pb-36');

// 4. Check function signatures & exclusion
if (!html.includes('function getBottomNavSafeY(')) {
  console.error('[FAIL] Missing getBottomNavSafeY function');
  process.exit(1);
}
console.log('[PASS] Found getBottomNavSafeY function definition');

if (html.includes('targets = document.querySelectorAll(\'.feed-sort-btn, .thread-card, #bento-vibe-card, #poll-options-container, .story-item, button.tab-btn\')')) {
  console.error('[FAIL] button.tab-btn is still in pickNewPeerTarget query selector!');
  process.exit(1);
}
console.log('[PASS] button.tab-btn successfully removed from pickNewPeerTarget');

// 5. Test execution in sandbox VM
const scriptMatch = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
const lastScript = scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '');

const mockNav = {
  id: 'bottom-nav',
  offsetHeight: 68
};

const sandbox = {
  console,
  setTimeout: (cb) => { cb(); return 1; },
  clearTimeout: () => {},
  setInterval: () => 1,
  clearInterval: () => {},
  document: {
    getElementById: (id) => {
      if (id === 'bottom-nav') return mockNav;
      return {
        id,
        classList: { add: () => {}, remove: () => {}, contains: () => false },
        style: { setProperty: () => {} },
        dataset: {},
        appendChild: () => {},
        remove: () => {},
        querySelectorAll: () => [],
        getBoundingClientRect: () => ({ left: 100, top: 100, width: 400, height: 200 })
      };
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({
      classList: { add: () => {}, remove: () => {} },
      style: { setProperty: () => {} },
      appendChild: () => {},
      remove: () => {}
    }),
    body: { appendChild: () => {} },
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

// Check getBottomNavSafeY
if (typeof sandbox.window.getBottomNavSafeY !== 'function') {
  console.error('[FAIL] getBottomNavSafeY not on window');
  process.exit(1);
}

const safeY = sandbox.window.getBottomNavSafeY();
console.log(`[PASS] getBottomNavSafeY returned: ${safeY} (expected ~680 for h=768, navH=88)`);

if (safeY > 700 || safeY < 600) {
  console.error(`[FAIL] safeY out of expected range: ${safeY}`);
  process.exit(1);
}

console.log('\n>>> ALL BOTTOM NAV EXCLUSION & RHYTHM CHECKS PASSED (0 DEFECTS)! 🚀 <<<');
process.exit(0);
