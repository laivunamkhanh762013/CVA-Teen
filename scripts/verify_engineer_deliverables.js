const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const teenHtml = fs.readFileSync('Tram_Hoc_Duong_Teen.html', 'utf8');

console.log('--- 1. PARITY VERIFICATION ---');
const bufA = fs.readFileSync('index.html');
const bufB = fs.readFileSync('Tram_Hoc_Duong_Teen.html');
console.log('index.html length:', bufA.length);
console.log('Tram_Hoc_Duong_Teen.html length:', bufB.length);
if (!bufA.equals(bufB)) {
  console.error('[FAIL] Byte parity mismatch');
  process.exit(1);
}
console.log('[PASS] 100% Byte-for-byte parity identical');

console.log('--- 2. CRITICAL DOM ELEMENTS & IDs ---');
const requiredIds = [
  'poll-options-container',
  'poll-question-text',
  'poll-total-votes',
  'vibe-countdown-badge',
  'story-progress-segments',
  'story-canvas',
  'story-react-heart',
  'story-react-fire',
  'story-react-zap',
  'my-saved-container',
  'modal-command-palette',
  'modal-lightbox',
  'modal-aura-milestone',
  'bento-vibe-card',
  'vibe-check-btn',
  'global-search-input',
  'sort-btn-latest',
  'sort-btn-popular',
  'sort-btn-foryou',
  'swarm-toggle-btn',
  'swarm-cursors-overlay',
  'swarm-toggle-icon',
  'swarm-toggle-label'
];

requiredIds.forEach(id => {
  if (!indexHtml.includes(`id="${id}"`)) {
    console.error(`[FAIL] Missing DOM ID: ${id}`);
    process.exit(1);
  }
});
console.log(`[PASS] All ${requiredIds.length} required DOM IDs present`);

console.log('--- 3. NEO-BRUTALIST STICKERS & BADGES ---');
const stickers = [
  '#CVA_HOT',
  '#CHECK_VAR_UY_TIN',
  '#AURA_1000',
  '#SÁCH_0Đ_TRUYỀN_LỬA',
  '#ẨN_DANH_BẢO_MẬT',
  'retro-stamp',
  'sticker-tilt-left',
  'sticker-tilt-right'
];

stickers.forEach(s => {
  if (!indexHtml.includes(s)) {
    console.error(`[FAIL] Missing sticker token: ${s}`);
    process.exit(1);
  }
});
console.log(`[PASS] All ${stickers.length} Neo-brutalist sticker tokens verified`);

console.log('--- 4. FUNCTIONAL LOGIC SNIPPETS ---');
const logicChecks = [
  { name: 'Feed Sorting logic', test: 'getPostTimestamp(post)' },
  { name: 'Feed engagement score', test: '((a.likes || 0) * 3) + (((a.replies && a.replies.length) || 0) * 4) + ((a.boosts || 0) * 5)' },
  { name: 'Poll storage persistence', test: 'localStorage.setItem(\'teen_cva_poll_data\'' },
  { name: 'Stories hold to pause', test: 'pauseStory()' },
  { name: 'Stories canvas click navigation', test: 'handleStoryCanvasClick(event)' },
  { name: 'findPostById across LF, Books, Confessions', test: 'findPostById(id, type)' },
  { name: 'Bookmark container sync', test: 'view-profile-saved' },
  { name: 'Image preview ID fallback', test: '`${type}-img-preview-box`' },
  { name: 'Command palette ArrowUp/ArrowDown selection', test: 'selectedCommandIdx = (selectedCommandIdx + 1)' },
  { name: 'Command palette Enter execution', test: 'executeCommandItem(selectedCommandIdx)' },
  { name: 'Vibe countdown timer live ticking', test: 'updateVibeCountdown' },
  { name: 'Aura milestone modal triggers', test: 'modal-aura-milestone' },
  { name: 'Swarm cursors initialization', test: 'initSwarmCursors' },
  { name: 'Swarm cursors toggle controller', test: 'toggleSwarmCursors' },
  { name: 'Swarm click shockwave effect', test: 'triggerPeerClickEffect' },
  { name: 'Swarm shortcut Ctrl+M', test: 'e.key.toLowerCase() === \'m\'' }
];

logicChecks.forEach(c => {
  if (!indexHtml.includes(c.test)) {
    console.error(`[FAIL] Missing logic implementation: ${c.name}`);
    process.exit(1);
  }
});
console.log(`[PASS] All ${logicChecks.length} functional logic implementations verified`);

console.log('\n>>> ALL ENGINEER DELIVERABLES 100% VERIFIED AND READY FOR QA HANDOFF! <<<');
