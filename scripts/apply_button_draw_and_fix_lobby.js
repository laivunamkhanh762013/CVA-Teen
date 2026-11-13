const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
const destPath = path.join(__dirname, '..', 'Tram_Hoc_Duong_Teen.html');

let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// 1. Fix Quizizz Lobby HTML leak and compact card grid
const lobbyOld = `            <div onclick="pokeStudent('Minh Trang (7A1)')" class="group flex items-center gap-2 bg-white dark:bg-zinc-800 border-2 border-black dark:border-zinc-700 rounded-2xl p-2.5 shadow-[2.5px_2.5px_0px_0px_#000000] dark:shadow-[2.5px_2.5px_0px_0px_#FF007A] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer">
              <span class="text-xl group-hover:scale-110 transition-transform">🐨</span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1">
                  <p class="text-xs font-black text-black dark:text-white truncate">Minh Trang</p>
                  <span class="text-[9px] font-black bg-zinc-100 dark:bg-zinc-700 text-black dark:text-zinc-200 border border-black px-1 py-0.2 rounded-md">7A1</span>
                </div>
                <p class="text-[9px] font-black text-pink-600 dark:text-[#FF007A] truncate">🌸 Thích Đọc Sách</p>
              </div>
            </div>div onclick="openModal('modal-online-students')" class="flex items-center justify-center gap-1.5 bg-indigo-50/70 dark:bg-indigo-950/50 border border-dashed border-indigo-300 dark:border-indigo-700/60 rounded-2xl p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100/80 hover:-translate-y-0.5 transition-all cursor-pointer">
              <span class="text-xs font-extrabold">+35 bạn...</span>
            </div>`;

const lobbyNew = `            <div onclick="pokeStudent('Minh Trang (7A1)')" class="group flex items-center gap-2 bg-white dark:bg-zinc-800 border-2 border-black dark:border-zinc-700 rounded-2xl p-2.5 shadow-[2.5px_2.5px_0px_0px_#000000] dark:shadow-[2.5px_2.5px_0px_0px_#FF007A] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer">
              <span class="text-xl group-hover:scale-110 transition-transform">🐨</span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1">
                  <p class="text-xs font-black text-black dark:text-white truncate">Minh Trang</p>
                  <span class="text-[9px] font-black bg-zinc-100 dark:bg-zinc-700 text-black dark:text-zinc-200 border border-black px-1 py-0.2 rounded-md">7A1</span>
                </div>
                <p class="text-[9px] font-black text-pink-600 dark:text-[#FF007A] truncate">🌸 Thích Đọc Sách</p>
              </div>
            </div>
            <div onclick="openModal('modal-online-students')" class="flex items-center justify-center gap-1.5 bg-indigo-50/70 dark:bg-indigo-950/50 border border-dashed border-indigo-300 dark:border-indigo-700/60 rounded-2xl p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100/80 hover:-translate-y-0.5 transition-all cursor-pointer min-h-[50px]">
              <span class="text-xs font-extrabold">+35 bạn...</span>
            </div>`;

if (!content.includes(lobbyOld)) {
  console.error('[ERROR] lobbyOld not found');
  process.exit(1);
}
content = content.replace(lobbyOld, lobbyNew);
console.log('[OK] Fixed Quizizz Lobby raw HTML leak (missing < before div)');

// Also ensure lobby-player-grid has items-center and auto-rows
const gridOld = `<div id="lobby-player-grid" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2">`;
const gridNew = `<div id="lobby-player-grid" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 items-center">`;
content = content.replace(gridOld, gridNew);
console.log('[OK] lobby-player-grid alignment updated');

// 2. Add CSS for Button Micro-Draw
const cssTarget = `    /* Selection Marquee for Swarm Page Build */
    #swarm-selection-marquee {`;

const cssReplacement = `    /* ==========================================================================
       SWARM BUTTON & CTA MICRO-DRAW SYSTEM (ĐÚNG CHẤT SWARM)
       ========================================================================== */
    .swarm-btn-pending {
      opacity: 0 !important;
      transform: scale(0.92) !important;
      pointer-events: none !important;
      transition: opacity 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    }

    .swarm-btn-revealed {
      opacity: 1 !important;
      transform: scale(1) !important;
      pointer-events: auto !important;
      animation: btnSpringPop 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) forwards !important;
    }

    @keyframes btnSpringPop {
      0% { transform: scale(0.88); }
      65% { transform: scale(1.06); }
      100% { transform: scale(1.0); }
    }

    .swarm-btn-marquee {
      position: absolute;
      inset: -2px;
      border: 2px dashed var(--btn-marquee-color, #FFE600);
      background-color: rgba(255, 230, 0, 0.2);
      border-radius: inherit;
      pointer-events: none;
      z-index: 30;
      animation: marqueeExpand 0.16s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    /* Selection Marquee for Swarm Page Build */
    #swarm-selection-marquee {`;

if (!content.includes(cssTarget)) {
  console.error('[ERROR] cssTarget not found');
  process.exit(1);
}
content = content.replace(cssTarget, cssReplacement);
console.log('[OK] CSS for Swarm Button Micro-Draw injected');

// 3. Inject drawCardButtons logic and update executeSwarmDraw
const drawLogicOld = `      // Complete reveal after 220ms or safety 350ms
      let completed = false;
      const revealCard = () => {
        if (completed) return;
        completed = true;
        if (marquee.parentNode) marquee.remove();
        el.classList.remove('swarm-draw-pending');
        el.classList.add('swarm-draw-revealed');

        if (typeof triggerPeerClickEffect === 'function' && swarmEnabled && !isSwarmBuildPlaying) {
          triggerPeerClickEffect(targetX, targetY, peer);
        }
        if (typeof playCuteSound === 'function') {
          playCuteSound('pop');
        }
      };`;

const drawLogicNew = `      // Complete reveal after 220ms or safety 350ms
      let completed = false;
      const revealCard = () => {
        if (completed) return;
        completed = true;
        if (marquee.parentNode) marquee.remove();
        el.classList.remove('swarm-draw-pending');
        el.classList.add('swarm-draw-revealed');

        if (typeof triggerPeerClickEffect === 'function' && swarmEnabled && !isSwarmBuildPlaying) {
          triggerPeerClickEffect(targetX, targetY, peer);
        }
        if (typeof playCuteSound === 'function') {
          playCuteSound('pop');
        }

        // SWARM BUTTON MICRO-DRAW: Đàn con trỏ tiếp tục chia nhau kéo vẽ từng nút bên trong!
        drawCardButtons(el);
      };`;

if (!content.includes(drawLogicOld)) {
  console.error('[ERROR] drawLogicOld not found');
  process.exit(1);
}
content = content.replace(drawLogicOld, drawLogicNew);

// Add drawCardButtons function right before initScrollSwarmDraw
const funcOld = `    function initScrollSwarmDraw() {`;

const funcNew = `    function drawCardButtons(cardEl) {
      if (!cardEl) return;
      const btns = cardEl.querySelectorAll('button:not(#notif-btn):not(#theme-toggle-btn):not(#swarm-toggle-btn):not(#sound-toggle-btn):not(#replay-swarm-build-btn)');
      if (btns.length === 0) return;

      btns.forEach((btn, idx) => {
        if (btn.dataset.btnRevealed === 'true' || typeof IntersectionObserver === 'undefined') {
          btn.classList.remove('swarm-btn-pending');
          btn.classList.add('swarm-btn-revealed');
          return;
        }

        btn.classList.add('swarm-btn-pending');
        btn.style.position = 'relative';

        // Staggered peer cursor draw on each button
        setTimeout(() => {
          const bRect = btn.getBoundingClientRect();
          const peer = SWARM_PEERS[(idx + 1) % SWARM_PEERS.length];
          const peerObj = swarmPeersState.find(p => p.id === peer.id) || swarmPeersState[0];

          if (swarmEnabled && peerObj && !isSwarmBuildPlaying) {
            const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
            const h = typeof window !== 'undefined' ? window.innerHeight : 768;
            peerObj.x = Math.max(16, Math.min(w - 40, bRect.left));
            peerObj.y = Math.max(70, Math.min(h - 40, bRect.top));
            peerObj.targetX = Math.max(16, Math.min(w - 40, bRect.left + bRect.width - 15));
            peerObj.targetY = Math.max(70, Math.min(h - 40, bRect.top + bRect.height - 15));
            peerObj.speed = 0.14;
          }

          const bMarquee = document.createElement('div');
          bMarquee.className = 'swarm-btn-marquee';
          bMarquee.style.setProperty('--btn-marquee-color', peer.color || '#FFE600');
          btn.appendChild(bMarquee);

          setTimeout(() => {
            if (bMarquee.parentNode) bMarquee.remove();
            btn.classList.remove('swarm-btn-pending');
            btn.classList.add('swarm-btn-revealed');
            btn.dataset.btnRevealed = 'true';

            if (typeof triggerPeerClickEffect === 'function' && swarmEnabled && !isSwarmBuildPlaying) {
              triggerPeerClickEffect(bRect.left + bRect.width - 10, bRect.top + bRect.height - 10, peer);
            }
          }, 140);
        }, idx * 80);
      });
    }
    window.drawCardButtons = drawCardButtons;

    function initScrollSwarmDraw() {`;

if (!content.includes(funcOld)) {
  console.error('[ERROR] funcOld not found');
  process.exit(1);
}
content = content.replace(funcOld, funcNew);
console.log('[OK] drawCardButtons function injected');

// 4. Update switchTab to reveal buttons too
const tabOld = `      // Fail-safe tab switch: Reveal all pending cards on tab navigation
      document.querySelectorAll('.swarm-draw-pending').forEach(el => {
        el.classList.remove('swarm-draw-pending');
        el.classList.add('swarm-draw-revealed');
        el.dataset.swarmRevealed = 'true';
        const m = el.querySelector('.swarm-scroll-marquee');
        if (m) m.remove();
      });`;

const tabNew = `      // Fail-safe tab switch: Reveal all pending cards & buttons on tab navigation
      document.querySelectorAll('.swarm-draw-pending').forEach(el => {
        el.classList.remove('swarm-draw-pending');
        el.classList.add('swarm-draw-revealed');
        el.dataset.swarmRevealed = 'true';
        const m = el.querySelector('.swarm-scroll-marquee');
        if (m) m.remove();
      });
      document.querySelectorAll('.swarm-btn-pending').forEach(b => {
        b.classList.remove('swarm-btn-pending');
        b.classList.add('swarm-btn-revealed');
        b.dataset.btnRevealed = 'true';
        const bm = b.querySelector('.swarm-btn-marquee');
        if (bm) bm.remove();
      });`;

if (!content.includes(tabOld)) {
  console.error('[ERROR] tabOld not found');
  process.exit(1);
}
content = content.replace(tabOld, tabNew);
console.log('[OK] switchTab button reveal fail-safe updated');

// 5. In triggerSwarmBuildIntro Act 1: Bento Hero spring triggers drawCardButtons
const heroSpringOld = `        if (bentoHero) {
          bentoHero.classList.add('swarm-bento-spring');
          setTimeout(() => bentoHero.classList.remove('swarm-bento-spring'), 400);
        }`;

const heroSpringNew = `        if (bentoHero) {
          bentoHero.classList.add('swarm-bento-spring');
          setTimeout(() => bentoHero.classList.remove('swarm-bento-spring'), 400);
          drawCardButtons(bentoHero);
        }`;

if (!content.includes(heroSpringOld)) {
  console.error('[ERROR] heroSpringOld not found');
  process.exit(1);
}
content = content.replace(heroSpringOld, heroSpringNew);
console.log('[OK] Bento Hero build triggers drawCardButtons');

// Normalize line endings to Windows CRLF (\r\n)
content = content.replace(/\r?\n/g, '\r\n');

// Write to index.html and Tram_Hoc_Duong_Teen.html
fs.writeFileSync(filePath, content, 'utf8');
fs.writeFileSync(destPath, content, 'utf8');

console.log('Successfully applied Swarm Button Micro-Draw and Quizizz Lobby fix with 100% byte parity!');
