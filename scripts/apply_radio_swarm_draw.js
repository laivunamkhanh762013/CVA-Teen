const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
const teenPath = path.join(__dirname, '..', 'Tram_Hoc_Duong_Teen.html');

let content = fs.readFileSync(indexPath, 'utf8');

// Check line endings:
const isCRLF = content.includes('\r\n');
const eol = isCRLF ? '\r\n' : '\n';
console.log('Detected EOL:', isCRLF ? 'CRLF' : 'LF');

// 1. Replace Radio Broadcast markup
const oldRadioMarkup = [
  '      <!-- ĐÀI PHÁT THANH CVA (LIVE THREADS FEED & SOCIAL FEED SORTER) -->',
  '      <div class="space-y-3 pt-2">',
  '        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">',
  '          <div class="flex items-center gap-2">',
  '            <h3 class="text-xs sm:text-sm font-black text-black dark:text-white flex items-center gap-1.5 uppercase font-display">',
  '              <span>📻 Đài Phát Thanh CVA</span>',
  '              <span class="text-[9px] bg-[#FF007A] text-white px-2 py-0.5 rounded-full font-black uppercase border border-black shadow-[1px_1px_0px_0px_#000000] animate-pulse">Live</span>',
  '            </h3>',
  '            <span class="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 hidden sm:inline">• Bảng tin mạng xã hội</span>',
  '          </div>',
  '',
  '          <!-- Feed Sorter Pills -->',
  '          <div class="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 p-1.5 rounded-2xl border-2 border-black dark:border-zinc-700 text-xs font-black">',
  '            <button id="sort-btn-foryou" onclick="setFeedSort(\'foryou\', this)" class="feed-sort-btn active bg-black text-[#FFE600] border-2 border-black px-3 py-1.5 rounded-xl uppercase text-[10px] sm:text-xs font-black shadow-[2px_2px_0px_0px_#000000] cursor-pointer">🔥 Dành cho bạn</button>',
  '            <button id="sort-btn-latest" onclick="setFeedSort(\'latest\', this)" class="feed-sort-btn bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-700 hover:bg-zinc-100 px-3 py-1.5 rounded-xl uppercase text-[10px] sm:text-xs font-bold shadow-[1px_1px_0px_0px_#000000] cursor-pointer">⏱️ Mới nhất</button>',
  '            <button id="sort-btn-popular" onclick="setFeedSort(\'popular\', this)" class="feed-sort-btn bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-700 hover:bg-zinc-100 px-3 py-1.5 rounded-xl uppercase text-[10px] sm:text-xs font-bold shadow-[1px_1px_0px_0px_#000000] cursor-pointer">⚡ Thịnh hành</button>',
  '          </div>',
  '        </div>'
].join(eol);

const newRadioMarkup = [
  '      <!-- ĐÀI PHÁT THANH CVA (LIVE THREADS FEED & SOCIAL FEED SORTER) -->',
  '      <div id="cva-radio-broadcast" class="space-y-4 pt-2">',
  '        <div id="radio-broadcast-header" class="swarm-draw-target swarm-draw-pending flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FFE600] relative">',
  '          <div class="flex items-center gap-2">',
  '            <h3 class="text-xs sm:text-sm font-black text-black dark:text-white flex items-center gap-1.5 uppercase font-display">',
  '              <span>📻 Đài Phát Thanh CVA</span>',
  '              <span class="text-[9px] bg-[#FF007A] text-white px-2 py-0.5 rounded-full font-black uppercase border border-black shadow-[1px_1px_0px_0px_#000000] animate-pulse">Live</span>',
  '            </h3>',
  '            <span class="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 hidden sm:inline">• Bảng tin mạng xã hội</span>',
  '          </div>',
  '',
  '          <!-- Feed Sorter Pills -->',
  '          <div id="radio-sort-pills" class="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 p-1.5 rounded-2xl border-2 border-black dark:border-zinc-700 text-xs font-black">',
  '            <button id="sort-btn-foryou" onclick="setFeedSort(\'foryou\', this)" class="feed-sort-btn active bg-black text-[#FFE600] border-2 border-black px-3 py-1.5 rounded-xl uppercase text-[10px] sm:text-xs font-black shadow-[2px_2px_0px_0px_#000000] cursor-pointer">🔥 Dành cho bạn</button>',
  '            <button id="sort-btn-latest" onclick="setFeedSort(\'latest\', this)" class="feed-sort-btn bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-700 hover:bg-zinc-100 px-3 py-1.5 rounded-xl uppercase text-[10px] sm:text-xs font-bold shadow-[1px_1px_0px_0px_#000000] cursor-pointer">⏱️ Mới nhất</button>',
  '            <button id="sort-btn-popular" onclick="setFeedSort(\'popular\', this)" class="feed-sort-btn bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-700 hover:bg-zinc-100 px-3 py-1.5 rounded-xl uppercase text-[10px] sm:text-xs font-bold shadow-[1px_1px_0px_0px_#000000] cursor-pointer">⚡ Thịnh hành</button>',
  '          </div>',
  '        </div>'
].join(eol);

if (!content.includes(oldRadioMarkup)) {
  console.error('[ERROR] oldRadioMarkup snippet not found!');
  process.exit(1);
}
content = content.replace(oldRadioMarkup, newRadioMarkup);
console.log('[PASS] Radio markup updated');

// 2. Update buildThreadCardHTML
const oldThreadCardOpen = '        <div class="thread-card bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#CCFF00] space-y-3 relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000000]">';

const newThreadCardOpen = '        <div class="thread-card swarm-draw-target swarm-draw-pending bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#CCFF00] space-y-3 relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000000]">';

if (!content.includes(oldThreadCardOpen)) {
  console.error('[ERROR] oldThreadCardOpen snippet not found!');
  process.exit(1);
}
content = content.replace(oldThreadCardOpen, newThreadCardOpen);
console.log('[PASS] buildThreadCardHTML updated');

// 3. Update renderLandingFeed
const oldRenderFeedEnd = [
  '      allPosts.forEach(item => {',
  '        container.innerHTML += buildThreadCardHTML(item, item._postType);',
  '      });',
  '      ',
  '      safeCreateLucideIcons();',
  '    }'
].join(eol);

const newRenderFeedEnd = [
  '      allPosts.forEach(item => {',
  '        container.innerHTML += buildThreadCardHTML(item, item._postType);',
  '      });',
  '      ',
  '      safeCreateLucideIcons();',
  '',
  '      if (typeof window !== \'undefined\' && window.__swarmDrawObserver) {',
  '        const cards = container.querySelectorAll(\'.thread-card\');',
  '        cards.forEach(c => {',
  '          if (!c.dataset || c.dataset.swarmRevealed !== \'true\') {',
  '            window.__swarmDrawObserver.observe(c);',
  '          }',
  '        });',
  '      } else if (typeof IntersectionObserver === \'undefined\') {',
  '        container.querySelectorAll(\'.thread-card\').forEach(el => {',
  '          el.classList.remove(\'swarm-draw-pending\');',
  '          el.classList.add(\'swarm-draw-revealed\');',
  '          if (el.dataset) el.dataset.swarmRevealed = \'true\';',
  '        });',
  '      }',
  '    }'
].join(eol);

if (!content.includes(oldRenderFeedEnd)) {
  console.error('[ERROR] oldRenderFeedEnd snippet not found!');
  process.exit(1);
}
content = content.replace(oldRenderFeedEnd, newRenderFeedEnd);
console.log('[PASS] renderLandingFeed observer registration updated');

// 4. Update initScrollSwarmDraw targets query list
const oldTargetsList = [
  '        \'#quizizz-live-lobby\',',
  '        \'#cva-weekly-poll\',',
  '        \'#landing-faqs-accordion\','
].join(eol);

const newTargetsList = [
  '        \'#quizizz-live-lobby\',',
  '        \'#cva-weekly-poll\',',
  '        \'#radio-broadcast-header\',',
  '        \'#landing-threads-feed .thread-card\',',
  '        \'#landing-faqs-accordion\','
].join(eol);

if (!content.includes(oldTargetsList)) {
  console.error('[ERROR] oldTargetsList snippet not found!');
  process.exit(1);
}
content = content.replace(oldTargetsList, newTargetsList);
console.log('[PASS] initScrollSwarmDraw targets query updated');

// Write to both files
fs.writeFileSync(indexPath, content, 'utf8');
fs.writeFileSync(teenPath, content, 'utf8');

const bA = fs.readFileSync(indexPath);
const bB = fs.readFileSync(teenPath);

if (!bA.equals(bB)) {
  console.error('[FAIL] Parity mismatch between index.html and Tram_Hoc_Duong_Teen.html');
  process.exit(1);
}

console.log(`[SUCCESS] 100% Bitwise Parity verified: ${bA.length} bytes identical.`);
