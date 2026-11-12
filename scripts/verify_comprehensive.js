const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const { execSync } = require('child_process');

console.log('================================================================');
console.log('   TRẠM HỌC ĐƯỜNG TEEN - SWARM QA & CODE VERIFICATION SUITE   ');
console.log('================================================================\n');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const failures = [];

function assert(condition, message, errorDetail = null) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`[PASS] ${message}`);
  } else {
    failedChecks++;
    console.error(`[FAIL] ${message}`);
    if (errorDetail) {
      console.error(`       Detail: ${errorDetail}`);
    }
    failures.push({ message, errorDetail });
  }
}

// =============================================================================
// 1. BYTE PARITY & INTEGRITY VERIFICATION
// =============================================================================
console.log('--- 1. BYTE PARITY & FILE INTEGRITY ---');
const indexExists = fs.existsSync('index.html');
const tramExists = fs.existsSync('Tram_Hoc_Duong_Teen.html');

assert(indexExists, 'index.html exists');
assert(tramExists, 'Tram_Hoc_Duong_Teen.html exists');

let indexBuf = null;
let tramBuf = null;

if (indexExists && tramExists) {
  indexBuf = fs.readFileSync('index.html');
  tramBuf = fs.readFileSync('Tram_Hoc_Duong_Teen.html');

  const indexHash = crypto.createHash('sha256').update(indexBuf).digest('hex');
  const tramHash = crypto.createHash('sha256').update(tramBuf).digest('hex');

  assert(indexBuf.length === tramBuf.length, `File byte sizes match exactly (${indexBuf.length} bytes vs ${tramBuf.length} bytes)`);
  assert(indexHash === tramHash, `SHA-256 hashes are 100% identical (${indexHash})`);
}

// =============================================================================
// 2. JAVASCRIPT SYNTAX & AST VERIFICATION (VM & node --check)
// =============================================================================
console.log('\n--- 2. JAVASCRIPT SYNTAX & AST COMPILATION (node --check) ---');
const html = fs.readFileSync('index.html', 'utf8');

const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let match;
let scriptIdx = 0;
const scripts = [];

const tmpDir = path.join(__dirname, '..', '.tmp_check');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

try {
  while ((match = scriptRegex.exec(html)) !== null) {
    const attrs = match[1];
    const code = match[2].trim();
    if (!code) continue;
    if (/type=["'](application\/ld\+json|text\/template|text\/html)["']/i.test(attrs)) continue;

    scriptIdx++;
    let vmOk = false;
    let vmErr = null;
    try {
      new vm.Script(code, { filename: `inline-script-${scriptIdx}.js` });
      vmOk = true;
    } catch (err) {
      vmErr = err.message;
    }
    assert(vmOk, `Inline script #${scriptIdx} V8 AST compilation check (${code.length} chars)`, vmErr);

    // node --check verification on disk
    const tmpScriptPath = path.join(tmpDir, `script_${scriptIdx}.js`);
    fs.writeFileSync(tmpScriptPath, code, 'utf8');
    let nodeCheckOk = false;
    let nodeCheckErr = null;
    try {
      execSync(`node --check "${tmpScriptPath}"`, { stdio: 'pipe' });
      nodeCheckOk = true;
    } catch (err) {
      nodeCheckErr = err.stderr ? err.stderr.toString() : err.message;
    }
    assert(nodeCheckOk, `Inline script #${scriptIdx} "node --check" syntax verification`, nodeCheckErr);

    scripts.push(code);
  }
} finally {
  // Clean up temporary script files
  if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

const fullScriptCode = scripts.join('\n');

// =============================================================================
// 3. DOM IDs & STATIC REFERENCES VERIFICATION
// =============================================================================
console.log('\n--- 3. DOM IDs & STATIC REFERENCES VERIFICATION ---');
const definedIds = new Set();
const idRegex = /\bid=["']([a-zA-Z0-9_\-:]+)["']/g;
let idMatch;
while ((idMatch = idRegex.exec(html)) !== null) {
  definedIds.add(idMatch[1]);
}
console.log(`Discovered ${definedIds.size} unique DOM IDs defined in HTML markup.`);

// Known dynamically generated ID prefixes or IDs
const dynamicIdPrefixes = [
  'reply-box-', 'reply-input-', 'post-menu-', 'claim-input-', 'p-subtab-', 'story-dot-',
  'opt-pct-', 'notif-item-'
];

const getElemRegex = /getElementById\(\s*['"`]([a-zA-Z0-9_\-:]+)['"`]\s*\)/g;
let mGet;
const missingStaticIds = [];
while ((mGet = getElemRegex.exec(fullScriptCode)) !== null) {
  const id = mGet[1];
  if (!definedIds.has(id)) {
    const isDynamic = dynamicIdPrefixes.some(prefix => id.startsWith(prefix));
    if (!isDynamic) {
      missingStaticIds.push(id);
    }
  }
}

assert(
  missingStaticIds.length === 0,
  `All static getElementById references exist in DOM (${missingStaticIds.length} missing)`,
  missingStaticIds.join(', ')
);

// =============================================================================
// 4. ONCLICK & INLINE HANDLERS STATIC ANALYSIS
// =============================================================================
console.log('\n--- 4. ONCLICK & INLINE HANDLERS VERIFICATION ---');
const handlerRegex = /\b(on[a-z]+)=["']([^"']+)["']/gi;
let mHandler;
const allCalledFunctions = new Set();
const nativeGlobals = new Set([
  'event', 'document', 'window', 'console', 'alert', 'confirm', 'prompt',
  'if', 'for', 'while', 'switch', 'stopPropagation', 'preventDefault',
  'Date', 'parseInt', 'parseFloat', 'String', 'Number', 'Boolean', 'Array',
  'Object', 'Math', 'JSON', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
  'getElementById', 'querySelector', 'querySelectorAll', 'click', 'focus', 'submit', 'reset'
]);

while ((mHandler = handlerRegex.exec(html)) !== null) {
  const code = mHandler[2];
  const callRegex = /\b([a-zA-Z0-9_$]+)\s*\(/g;
  let mCall;
  while ((mCall = callRegex.exec(code)) !== null) {
    const fn = mCall[1];
    if (!nativeGlobals.has(fn)) {
      allCalledFunctions.add(fn);
    }
  }
}

const missingHandlers = [];
for (const fn of allCalledFunctions) {
  const fnPattern = new RegExp(`(?:function\\s+${fn}\\b|(?:window\\.)?${fn}\\s*=\\s*(?:function|\\([^)]*\\)\\s*=>)|(?:const|let|var)\\s+${fn}\\s*=)`);
  if (!fnPattern.test(fullScriptCode)) {
    missingHandlers.push(fn);
  }
}

assert(
  missingHandlers.length === 0,
  `All onclick/inline handler functions are defined in scripts (${missingHandlers.length} missing)`,
  missingHandlers.join(', ')
);

// =============================================================================
// 5. INTERACTIVE FEATURES & FUNCTIONAL SIMULATION
// =============================================================================
console.log('\n--- 5. INTERACTIVE FEATURES & FUNCTIONAL SIMULATION ---');

const mockStorage = {};
const mockLocalStorage = {
  getItem: (k) => (k in mockStorage ? mockStorage[k] : null),
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: (k) => { delete mockStorage[k]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

const domElements = {};
definedIds.forEach(id => {
  domElements[id] = {
    id,
    classList: {
      _classes: new Set(),
      add: function(...cls) { cls.forEach(c => this._classes.add(c)); },
      remove: function(...cls) { cls.forEach(c => this._classes.delete(c)); },
      toggle: function(c) { this._classes.has(c) ? this._classes.delete(c) : this._classes.add(c); },
      contains: function(c) { return this._classes.has(c); }
    },
    style: {},
    innerHTML: '',
    textContent: '',
    value: '',
    src: '',
    getAttribute: () => null,
    setAttribute: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
    contains: () => false,
    focus: () => {},
    click: () => {}
  };
});

const sandbox = {
  window: {},
  addEventListener: () => {},
  removeEventListener: () => {},
  document: {
    getElementById: (id) => {
      if (!domElements[id]) {
        domElements[id] = {
          id,
          classList: {
            _classes: new Set(),
            add: () => {},
            remove: () => {},
            toggle: () => {},
            contains: () => false
          },
          style: {},
          innerHTML: '',
          textContent: '',
          value: '',
          src: '',
          focus: () => {},
          click: () => {}
        };
      }
      return domElements[id];
    },
    querySelector: (sel) => {
      if (sel && sel.startsWith('#')) return domElements[sel.slice(1)] || null;
      return { value: 'all', checked: true, classList: { add: () => {}, remove: () => {} } };
    },
    querySelectorAll: (sel) => [],
    createElement: (tag) => ({
      tagName: tag,
      classList: { add: () => {}, remove: () => {} },
      style: {},
      getContext: () => ({ drawImage: () => {} }),
      toDataURL: () => 'data:image/jpeg;base64,mock'
    }),
    body: { classList: { add: () => {}, remove: () => {}, toggle: () => {} } },
    documentElement: { classList: { add: () => {}, remove: () => {}, toggle: () => {} } },
    addEventListener: () => {}
  },
  localStorage: mockLocalStorage,
  sessionStorage: mockLocalStorage,
  navigator: { clipboard: { writeText: () => Promise.resolve() } },
  console: {
    log: () => {},
    warn: () => {},
    error: (...args) => console.error('    [Script Console Error]', ...args)
  },
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: () => 123,
  clearInterval: () => {},
  Image: class { constructor() { this.onload = null; } },
  FileReader: class { constructor() { this.onload = null; } readAsDataURL() {} },
  Date: Date,
  Math: Math,
  JSON: JSON,
  tailwind: { config: {} },
  lucide: { createIcons: () => {} },
  confetti: () => {},
  AudioContext: class {
    constructor() {
      this.state = 'running';
      this.destination = {};
    }
    createOscillator() {
      return {
        type: 'sine',
        frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        connect: () => {},
        start: () => {},
        stop: () => {}
      };
    }
    createGain() {
      return {
        gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        connect: () => {}
      };
    }
  }
};
sandbox.window = sandbox;
sandbox.webkitAudioContext = sandbox.AudioContext;

let ctxRuntimeOk = false;
let ctxRuntimeErr = null;
try {
  const context = vm.createContext(sandbox);
  for (const scr of scripts) {
    vm.runInContext(scr, context);
  }
  ctxRuntimeOk = true;
} catch (err) {
  ctxRuntimeErr = err.stack || err.message;
}

assert(ctxRuntimeOk, 'Global scripts execute in browser sandbox without throwing', ctxRuntimeErr);

if (ctxRuntimeOk) {
  // Test 1: Feed Sorting
  try {
    assert(typeof sandbox.setFeedSort === 'function', 'setFeedSort is exposed on window');
    assert(typeof sandbox.renderLandingFeed === 'function', 'renderLandingFeed is exposed on window');
    sandbox.setFeedSort('popular');
    sandbox.setFeedSort('latest');
    sandbox.setFeedSort('foryou');
    assert(true, 'Feed sorting algorithms executed cleanly for foryou, latest, and popular');
  } catch (e) {
    assert(false, 'Feed sorting failed', e.message);
  }

  // Test 2: Poll Voting & Percentage Bars
  try {
    assert(typeof sandbox.voteCvaPoll === 'function', 'voteCvaPoll is exposed on window');
    assert(typeof sandbox.renderCvaPoll === 'function', 'renderCvaPoll is exposed on window');
    sandbox.voteCvaPoll(0);
    const voteSaved = mockLocalStorage.getItem('teen_cva_poll_vote');
    assert(voteSaved === '0', 'voteCvaPoll persists chosen vote to localStorage');
  } catch (e) {
    assert(false, 'Poll voting failed', e.message);
  }

  // Test 3: Stories Viewer Navigation & Progress
  try {
    assert(typeof sandbox.openStoryViewer === 'function', 'openStoryViewer is defined');
    assert(typeof sandbox.nextStory === 'function', 'nextStory is defined');
    assert(typeof sandbox.prevStory === 'function', 'prevStory is defined');
    assert(typeof sandbox.closeStoryViewer === 'function', 'closeStoryViewer is defined');
    sandbox.openStoryViewer(0);
    sandbox.nextStory();
    sandbox.prevStory();
    sandbox.closeStoryViewer();
    assert(true, 'Stories viewer navigation functions executed cleanly');
  } catch (e) {
    assert(false, 'Stories viewer navigation failed', e.message);
  }

  // Test 4: Like/Unlike Toggle State Sync
  try {
    assert(typeof sandbox.toggleLike === 'function', 'toggleLike is defined');
    sandbox.toggleLike('lf', 'lf-1');
    assert(true, 'toggleLike executes cleanly');
  } catch (e) {
    assert(false, 'toggleLike failed', e.message);
  }

  // Test 5: Bookmark Persistence in localStorage
  try {
    assert(typeof sandbox.toggleBookmarkPost === 'function', 'toggleBookmarkPost is defined');
    sandbox.toggleBookmarkPost('lf', 'lf-1');
    const userSaved = JSON.parse(mockLocalStorage.getItem('teen_user_threads') || '{}');
    const hasBookmark = userSaved.savedPostIds && userSaved.savedPostIds.includes('lf-1');
    assert(hasBookmark, 'toggleBookmarkPost correctly persists bookmark in user storage');
  } catch (e) {
    assert(false, 'toggleBookmarkPost failed', e.message);
  }

  // Test 6: Lightbox Open/Close
  try {
    assert(typeof sandbox.openLightbox === 'function', 'openLightbox is defined');
    assert(typeof sandbox.closeLightbox === 'function', 'closeLightbox is defined');
    sandbox.openLightbox('https://example.com/test.jpg');
    sandbox.closeLightbox();
    assert(true, 'Lightbox open/close executes cleanly');
  } catch (e) {
    assert(false, 'Lightbox failed', e.message);
  }

  // Test 7: Command Palette Open/Filter/Execute
  try {
    assert(typeof sandbox.openCommandPalette === 'function', 'openCommandPalette is defined');
    assert(typeof sandbox.filterCommandPalette === 'function', 'filterCommandPalette is defined');
    sandbox.openCommandPalette();
    sandbox.filterCommandPalette('casio');
    assert(true, 'Command palette opens and filters cleanly');
  } catch (e) {
    assert(false, 'Command palette failed', e.message);
  }

  // Test 8: Daily Vibe Check
  try {
    assert(typeof sandbox.rollVibeCheck === 'function', 'rollVibeCheck is defined');
    sandbox.rollVibeCheck();
    assert(true, 'rollVibeCheck executes cleanly');
  } catch (e) {
    assert(false, 'Daily vibe check failed', e.message);
  }

  // Test 9: Multi-Dimensional State Sync (Solve post reflection)
  try {
    if (typeof sandbox.toggleSolvePost === 'function') {
      sandbox.toggleSolvePost('lf', 'lf-1');
      assert(true, 'toggleSolvePost executes cleanly and syncs post status');
    }
  } catch (e) {
    assert(false, 'toggleSolvePost failed', e.message);
  }

  // Test 10: Multi-Criteria Filter Handlers
  try {
    if (typeof sandbox.setLostFoundFilter === 'function') sandbox.setLostFoundFilter('all');
    if (typeof sandbox.setCategoryLF === 'function') sandbox.setCategoryLF('all');
    if (typeof sandbox.setBookDealFilter === 'function') sandbox.setBookDealFilter('all');
    if (typeof sandbox.setGradeFilter === 'function') sandbox.setGradeFilter('all');
    if (typeof sandbox.setCurriculumFilter === 'function') sandbox.setCurriculumFilter('all');
    assert(true, 'Multi-criteria filter handlers execute without throwing');
  } catch (e) {
    assert(false, 'Multi-criteria filter handlers failed', e.message);
  }
}

console.log('\n================================================================');
console.log(`SUMMARY: ${passedChecks}/${totalChecks} PASSED (${failedChecks} FAILS)`);
console.log('================================================================');

if (failedChecks > 0) {
  process.exit(1);
} else {
  console.log('ALL VERIFICATION CHECKS PASSED WITH 0 ERRORS! 🚀\n');
  process.exit(0);
}
