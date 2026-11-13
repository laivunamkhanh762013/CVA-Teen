const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
const teenPath = path.join(__dirname, '..', 'Tram_Hoc_Duong_Teen.html');

let html = fs.readFileSync(indexPath, 'utf8');
let normHtml = html.replace(/\r\n/g, '\n');

// 1. Inject CSS for Atomic Component Swarm Draw
const atomicCSS = `
    /* ==========================================================================
       ATOMIC COMPONENT SWARM DRAW SYSTEM (ĐÚNG CHẤT SWARM MULTIPLAYER)
       ========================================================================== */
    .swarm-atomic-item {
      position: relative !important;
      transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.22s ease !important;
    }

    /* Trạng thái đang chờ vẽ: viền phác thảo nhẹ, mờ ảo */
    .swarm-atomic-pending {
      opacity: 0.18 !important;
      transform: scale(0.94) !important;
      outline: 1.5px dashed rgba(0, 0, 0, 0.25) !important;
      outline-offset: 2px !important;
      pointer-events: none !important;
    }
    html.dark .swarm-atomic-pending,
    [data-theme="dark"] .swarm-atomic-pending {
      outline-color: rgba(255, 255, 255, 0.25) !important;
    }

    /* Khung nét đứt mini dạ quang ôm sát phần tử khi con trỏ vẽ */
    .swarm-atomic-marquee {
      position: absolute;
      inset: -3px;
      border: 2px dashed var(--atomic-color, #FFE600) !important;
      background-color: rgba(255, 230, 0, 0.18) !important;
      border-radius: inherit;
      pointer-events: none;
      z-index: 55 !important;
      opacity: 1 !important;
      visibility: visible !important;
      animation: atomicMarqueeExpand 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
      box-shadow: 0 0 8px var(--atomic-color, #FFE600) !important;
    }

    @keyframes atomicMarqueeExpand {
      0%   { clip-path: polygon(0 0, 0 0, 0 0, 0 0); }
      100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
    }

    /* Trạng thái phần tử con bung nở hoàn tất: Nảy bật spring pop-in */
    .swarm-atomic-revealed {
      opacity: 1 !important;
      transform: scale(1) !important;
      outline: none !important;
      pointer-events: auto !important;
      animation: atomicPopIn 0.26s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards !important;
    }

    @keyframes atomicPopIn {
      0%   { transform: scale(0.92); }
      60%  { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
`;

if (!normHtml.includes('ATOMIC COMPONENT SWARM DRAW SYSTEM')) {
  const insertMarker = '/* ==========================================================================\n       SWARM BUTTON & CTA MICRO-DRAW SYSTEM';
  const insIdx = normHtml.indexOf(insertMarker);
  if (insIdx === -1) {
    console.error('[FAIL] Could not find CSS insertion marker');
    process.exit(1);
  }
  normHtml = normHtml.slice(0, insIdx) + atomicCSS + '\n' + normHtml.slice(insIdx);
  console.log('[1] Injected Atomic Swarm Draw CSS');
} else {
  console.log('[1] Atomic Swarm Draw CSS already present');
}

// 2. Add IDs and classes to Stories strip atomic elements
// Header row
normHtml = normHtml.replace(
  '<div class="flex items-center justify-between px-1 mb-2.5 pb-2 border-b-2 border-black/10 dark:border-zinc-800">',
  '<div id="stories-header-row" class="swarm-atomic-item flex items-center justify-between px-1 mb-2.5 pb-2 border-b-2 border-black/10 dark:border-zinc-800">'
);

// Story 0
normHtml = normHtml.replace(
  '<div onclick="openCreateStoryModal()" class="flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0">',
  '<div id="story-item-0" onclick="openCreateStoryModal()" class="story-item-0 swarm-atomic-item flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0">'
);

// Story 1
normHtml = normHtml.replace(
  '<div onclick="openStoryViewer(0)" class="flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0">',
  '<div id="story-item-1" onclick="openStoryViewer(0)" class="story-item-1 swarm-atomic-item flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0">'
);

// Story 2
normHtml = normHtml.replace(
  '<div onclick="openStoryViewer(1)" class="flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0">',
  '<div id="story-item-2" onclick="openStoryViewer(1)" class="story-item-2 swarm-atomic-item flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0">'
);

// Story 3
normHtml = normHtml.replace(
  '<div onclick="openStoryViewer(2)" class="flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0">',
  '<div id="story-item-3" onclick="openStoryViewer(2)" class="story-item-3 swarm-atomic-item flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0">'
);

// Story 4
normHtml = normHtml.replace(
  '<div onclick="openStoryViewer(3)" class="flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0">',
  '<div id="story-item-4" onclick="openStoryViewer(3)" class="story-item-4 swarm-atomic-item flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0">'
);

// Story 5
normHtml = normHtml.replace(
  '<div onclick="openStoryViewer(4)" class="flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0">',
  '<div id="story-item-5" onclick="openStoryViewer(4)" class="story-item-5 swarm-atomic-item flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0">'
);
console.log('[2] Updated Stories strip atomic elements with IDs and classes');

// 3. Update Bento Hero atomic elements
// Floating sticker
normHtml = normHtml.replace(
  '<div class="absolute -top-1 -right-1 rotate-6 hidden sm:flex items-center gap-1 bg-[#FFE600] text-black border-2 border-black px-3 py-1 rounded-2xl shadow-[3px_3px_0px_0px_#000000] text-[10px] font-black uppercase tracking-widest z-0 pointer-events-none select-none">',
  '<div id="hero-floating-sticker" class="swarm-atomic-item absolute -top-1 -right-1 rotate-6 hidden sm:flex items-center gap-1 bg-[#FFE600] text-black border-2 border-black px-3 py-1 rounded-2xl shadow-[3px_3px_0px_0px_#000000] text-[10px] font-black uppercase tracking-widest z-0 pointer-events-none select-none">'
);

// Badge school
normHtml = normHtml.replace(
  '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFF00] border-2 border-black text-black text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000000]">',
  '<span id="hero-badge-school" class="swarm-atomic-item inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFF00] border-2 border-black text-black text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000000]">'
);

// Badge tag
normHtml = normHtml.replace(
  '<span class="retro-stamp bg-black text-[#FFE600] sticker-tilt-right">',
  '<span id="hero-badge-tag" class="swarm-atomic-item retro-stamp bg-black text-[#FFE600] sticker-tilt-right">'
);

// Hero title & stamps
normHtml = normHtml.replace(
  '<span id="hero-stamp-cva-hot" class="retro-stamp bg-[#FF007A]',
  '<span id="hero-stamp-cva-hot" class="swarm-atomic-item retro-stamp bg-[#FF007A]'
);
normHtml = normHtml.replace(
  '<span id="hero-stamp-aura" class="retro-stamp bg-[#FFE600]',
  '<span id="hero-stamp-aura" class="swarm-atomic-item retro-stamp bg-[#FFE600]'
);
normHtml = normHtml.replace(
  '<h2 id="hero-main-title" class="text-3xl sm:text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight uppercase leading-tight font-display">',
  '<h2 id="hero-main-title" class="swarm-atomic-item text-3xl sm:text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight uppercase leading-tight font-display">'
);

// Subtitle description
normHtml = normHtml.replace(
  '<p class="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-semibold leading-relaxed max-w-2xl">',
  '<p id="hero-subtitle-desc" class="swarm-atomic-item text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-semibold leading-relaxed max-w-2xl">'
);

// Hero 4 buttons
normHtml = normHtml.replace(
  '<button \n              onclick="switchTab(\'lost-found\')"',
  '<button \n              id="hero-btn-lost"\n              onclick="switchTab(\'lost-found\')"'
);
normHtml = normHtml.replace(
  '<button \n              onclick="switchTab(\'books\')"',
  '<button \n              id="hero-btn-books"\n              onclick="switchTab(\'books\')"'
);
normHtml = normHtml.replace(
  '<button \n              onclick="switchTab(\'confessions\')"',
  '<button \n              id="hero-btn-conf"\n              onclick="switchTab(\'confessions\')"'
);
normHtml = normHtml.replace(
  '<button \n              onclick="openProfileModal()"',
  '<button \n              id="hero-btn-profile"\n              onclick="openProfileModal()"'
);
console.log('[3] Updated Bento Hero atomic elements with IDs and classes');

// 4. Update Bento Vibe atomic elements
normHtml = normHtml.replace(
  'id="vibe-badge">',
  'id="vibe-badge" class="swarm-atomic-item inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border-2 border-black bg-[#FFE600] text-black shadow-[2px_2px_0px_0px_#000000] cursor-pointer hover:scale-105 transition active:scale-95 select-none">'
);
normHtml = normHtml.replace(
  'class="text-xs font-black uppercase tracking-tight text-black dark:text-white font-heading" id="vibe-title">',
  'class="swarm-atomic-item text-xs font-black uppercase tracking-tight text-black dark:text-white font-heading" id="vibe-title">'
);
normHtml = normHtml.replace(
  'id="vibe-check-display" class="bg-white dark:bg-zinc-950',
  'id="vibe-check-display" class="swarm-atomic-item bg-white dark:bg-zinc-950'
);
normHtml = normHtml.replace(
  'id="vibe-check-btn" \n              onclick="rollVibeCheck()"',
  'id="vibe-check-btn" \n              onclick="rollVibeCheck()"\n              class="swarm-atomic-item w-full bg-[#FFE600]'
);
console.log('[4] Updated Bento Vibe atomic elements with IDs and classes');

// 5. In switchTab: add fail-safe to reveal .swarm-atomic-pending
const switchTabCleanMarker = 'document.querySelectorAll(\'.swarm-btn-pending\').forEach(b => {';
const switchTabCleanIdx = normHtml.indexOf(switchTabCleanMarker);
if (switchTabCleanIdx !== -1 && !normHtml.includes('swarm-atomic-pending\').forEach')) {
  const atomicClean = `document.querySelectorAll('.swarm-atomic-pending').forEach(el => {
        el.classList.remove('swarm-atomic-pending');
        el.classList.add('swarm-atomic-revealed');
        if (el.dataset) el.dataset.atomicRevealed = 'true';
        const m = el.querySelector('.swarm-atomic-marquee');
        if (m) m.remove();
      });\n      `;
  normHtml = normHtml.slice(0, switchTabCleanIdx) + atomicClean + normHtml.slice(switchTabCleanIdx);
  console.log('[5] Injected fail-safe in switchTab for swarm-atomic-pending');
}

// 6. Define drawAtomicElement and update triggerSwarmBuildIntro
const drawAtomicElementCode = `
    function drawAtomicElement(el, peer, delay = 0, onComplete = null) {
      if (!el || (el.dataset && el.dataset.atomicRevealed === 'true')) {
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      el.classList.add('swarm-atomic-item', 'swarm-atomic-pending');

      setTimeout(() => {
        const rect = el.getBoundingClientRect();
        const safeMaxY = typeof getBottomNavSafeY === 'function' ? getBottomNavSafeY() : 680;
        const clampedY = Math.max(70, Math.min(safeMaxY - 15, rect.top));

        // Direct assigned cursor to atomic element
        if (swarmEnabled && typeof swarmPeersState !== 'undefined' && swarmPeersState.length > 0) {
          const peerObj = swarmPeersState.find(p => p.id === peer.id) || swarmPeersState[0];
          if (peerObj) {
            peerObj.x = Math.max(16, rect.left);
            peerObj.y = clampedY;
            peerObj.targetX = Math.max(16, rect.left + rect.width);
            peerObj.targetY = Math.max(70, Math.min(safeMaxY - 15, rect.top + rect.height));
            peerObj.speed = 0.14;
          }
        }

        // Create atomic neon marquee overlay
        const marquee = document.createElement('div');
        marquee.className = 'swarm-atomic-marquee';
        marquee.style.setProperty('--atomic-color', peer.color || '#FFE600');
        el.appendChild(marquee);

        // After 240ms, release and pop in
        setTimeout(() => {
          if (marquee.parentNode) marquee.remove();
          el.classList.remove('swarm-atomic-pending');
          el.classList.add('swarm-atomic-revealed');
          if (el.dataset) el.dataset.atomicRevealed = 'true';
          if (typeof playCuteSound === 'function') playCuteSound('pop');
          if (typeof onComplete === 'function') onComplete();
        }, 240);
      }, delay);
    }
    window.drawAtomicElement = drawAtomicElement;
`;

if (!normHtml.includes('function drawAtomicElement(')) {
  const insertBeforeEngine = '/* ==========================================================================\n       SCROLL-DRIVEN SWARM DRAW & REVEAL ENGINE';
  const engIdx = normHtml.indexOf(insertBeforeEngine);
  if (engIdx === -1) {
    console.error('[FAIL] Could not find insertBeforeEngine marker');
    process.exit(1);
  }
  normHtml = normHtml.slice(0, engIdx) + drawAtomicElementCode + '\n' + normHtml.slice(engIdx);
  console.log('[6] Injected drawAtomicElement definition');
}

// 7. Update triggerSwarmBuildIntro to implement parallel atomic swarm draw!
const triggerIntroStart = 'function triggerSwarmBuildIntro(isManual = false) {';
const triggerIntroEnd = 'window.triggerSwarmBuildIntro = triggerSwarmBuildIntro;';

const tStartIdx = normHtml.indexOf(triggerIntroStart);
const tEndIdx = normHtml.indexOf(triggerIntroEnd, tStartIdx);

if (tStartIdx === -1 || tEndIdx === -1) {
  console.error('[FAIL] Could not find triggerSwarmBuildIntro bounds');
  process.exit(1);
}

const newTriggerSwarmBuildIntro = `function triggerSwarmBuildIntro(isManual = false) {
      if (typeof document === 'undefined') return;
      if (isSwarmBuildPlaying) return;

      if (typeof switchTab === 'function' && typeof currentTab !== 'undefined' && currentTab !== 'landing') {
        switchTab('landing');
      }

      const overlay = document.getElementById('swarm-cursors-overlay');
      if (overlay) overlay.style.display = 'block';
      if (!swarmPeersState || swarmPeersState.length === 0) {
        initSwarmCursors();
      }

      isSwarmBuildPlaying = true;

      const p1 = swarmPeersState.find(p => p.id === 'p1') || swarmPeersState[0]; // Linh Đan (#FF007A)
      const p2 = swarmPeersState.find(p => p.id === 'p2') || swarmPeersState[1]; // Minh Trí (#FFE600)
      const p3 = swarmPeersState.find(p => p.id === 'p3') || swarmPeersState[2]; // Bảo Anh (#CCFF00)
      const p4 = swarmPeersState.find(p => p.id === 'p4') || swarmPeersState[3]; // Hoàng Nam (#00F0FF)
      const p5 = swarmPeersState.find(p => p.id === 'p5') || swarmPeersState[4]; // Ngọc Diệp (#A855F7)

      const bentoHero = document.getElementById('bento-hero-banner');
      const bentoVibe = document.getElementById('bento-vibe-card');
      const heroTitle = document.getElementById('hero-main-title');
      const storiesContainer = document.getElementById('stories-container');
      const vibeBtn = document.getElementById('vibe-check-btn');
      const stampHot = document.getElementById('hero-stamp-cva-hot');
      const stampAura = document.getElementById('hero-stamp-aura');
      const marquee = document.getElementById('swarm-selection-marquee');

      // Manual replay: smoothly scroll to top and reset all targets & atomic elements
      if (isManual) {
        if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        document.querySelectorAll('.swarm-atomic-item').forEach(el => {
          el.classList.remove('swarm-atomic-revealed');
          el.classList.add('swarm-atomic-pending');
          if (el.dataset) delete el.dataset.atomicRevealed;
        });
        if (bentoHero) {
          bentoHero.classList.remove('swarm-draw-pending');
          bentoHero.classList.add('swarm-draw-revealed');
          if (bentoHero.dataset) bentoHero.dataset.swarmRevealed = 'true';
        }
        if (bentoVibe) {
          bentoVibe.classList.remove('swarm-draw-pending');
          bentoVibe.classList.add('swarm-draw-revealed');
          if (bentoVibe.dataset) bentoVibe.dataset.swarmRevealed = 'true';
        }
      }

      // Ensure outer Bento Hero and Bento Vibe containers are ready for atomic drawings
      if (bentoHero) {
        bentoHero.classList.remove('swarm-draw-pending');
        bentoHero.classList.add('swarm-draw-revealed');
        if (bentoHero.dataset) bentoHero.dataset.swarmRevealed = 'true';
      }
      if (bentoVibe) {
        bentoVibe.classList.remove('swarm-draw-pending');
        bentoVibe.classList.add('swarm-draw-revealed');
        if (bentoVibe.dataset) bentoVibe.dataset.swarmRevealed = 'true';
      }

      // =========================================================================
      // PHA 1 (0ms - 450ms): PARALLEL ATOMIC DRAWING (TIÊU ĐỀ, BADGES, STORIES, STICKER)
      // =========================================================================

      // Minh Trí (#FFE600) draws Hero main title
      if (heroTitle) {
        drawAtomicElement(heroTitle, p2, 0, () => {
          showPeerChat(p2, 'Kéo khung Bento Hero chuẩn rồi nha! 📐', 2200);
        });
      }

      // Linh Đan (#FF007A) draws Hero badges
      const badgeSchool = document.getElementById('hero-badge-school');
      const badgeTag = document.getElementById('hero-badge-tag');
      if (badgeSchool) drawAtomicElement(badgeSchool, p1, 30);
      if (badgeTag) drawAtomicElement(badgeTag, p1, 80);
      if (stampHot) {
        drawAtomicElement(stampHot, p1, 140, () => {
          stampHot.style.transform = 'scale(1.25) rotate(-6deg)';
          setTimeout(() => { stampHot.style.transform = ''; }, 200);
        });
      }
      if (stampAura) {
        drawAtomicElement(stampAura, p1, 200, () => {
          stampAura.style.transform = 'scale(1.25) rotate(6deg)';
          setTimeout(() => { stampAura.style.transform = ''; }, 200);
          showPeerChat(p1, 'Set font Space Grotesk 900 cực cháy! ⚡', 2200);
        });
      }

      // Hoàng Nam (#00F0FF) draws floating sticker "100% CVA GEN Z"
      const floatSticker = document.getElementById('hero-floating-sticker');
      if (floatSticker) {
        drawAtomicElement(floatSticker, p4, 50);
      }

      // Bảo Anh (#CCFF00) glides across CVA 24H Stories row & avatars
      const storiesHeader = document.getElementById('stories-header-row');
      if (storiesHeader) drawAtomicElement(storiesHeader, p3, 20);

      for (let s = 0; s <= 5; s++) {
        const storyEl = document.getElementById(\`story-item-\${s}\`);
        if (storyEl) {
          drawAtomicElement(storyEl, p3, 60 + s * 55, () => {
            if (s === 2) showPeerChat(p3, 'Đóng dấu tem chính chủ Chu Văn An! 🏷️', 2200);
          });
        }
      }

      // =========================================================================
      // PHA 2 (450ms - 950ms): HERO SUBTITLE & 4 ACTION BUTTONS SWARM DRAW
      // =========================================================================
      setTimeout(() => {
        const heroDesc = document.getElementById('hero-subtitle-desc');
        if (heroDesc) drawAtomicElement(heroDesc, p5, 0);

        const btnLost = document.getElementById('hero-btn-lost');
        const btnBooks = document.getElementById('hero-btn-books');
        const btnConf = document.getElementById('hero-btn-conf');
        const btnProf = document.getElementById('hero-btn-profile');

        if (btnLost) drawAtomicElement(btnLost, p1, 60);
        if (btnBooks) drawAtomicElement(btnBooks, p3, 120);
        if (btnConf) drawAtomicElement(btnConf, p2, 180);
        if (btnProf) drawAtomicElement(btnProf, p4, 240);
      }, 450);

      // =========================================================================
      // PHA 3 (950ms - 1550ms): BENTO VIBE CARD ATOMIC SWARM DRAW
      // =========================================================================
      setTimeout(() => {
        const vibeBadge = document.getElementById('vibe-badge');
        const vibeTitle = document.getElementById('vibe-title');
        const vibeDisplay = document.getElementById('vibe-check-display');

        if (vibeBadge) drawAtomicElement(vibeBadge, p1, 0);
        if (vibeTitle) drawAtomicElement(vibeTitle, p2, 60);
        if (vibeDisplay) drawAtomicElement(vibeDisplay, p4, 120);

        if (vibeBtn) {
          drawAtomicElement(vibeBtn, p5, 200, () => {
            showPeerChat(p4, 'Xong kèo! Trang lên sóng toàn trường rồi anh em ơi! 🚀🎉', 2600);
          });
        }
      }, 950);

      // =========================================================================
      // PHA 4 (1550ms - 1850ms): CONFETTI CELEBRATION & COMPLETION
      // =========================================================================
      setTimeout(() => {
        if (typeof confetti === 'function') {
          try {
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.55 },
              colors: ['#FFE600', '#CCFF00', '#FF007A', '#00F0FF', '#000000']
            });
          } catch(e) {}
        }
        if (typeof playCuteSound === 'function') {
          playCuteSound('pop');
        }
      }, 1550);

      // Settle at 1850ms: Peers disperse smoothly upward into content area
      setTimeout(() => {
        isSwarmBuildPlaying = false;
        const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
        const safeY = getBottomNavSafeY();
        swarmPeersState.forEach(p => {
          p.targetX = Math.random() * (w - 120) + 60;
          p.targetY = Math.random() * (safeY - 200) + 90;
          p.speed = 0.03;
        });
        if (!swarmEnabled && overlay) {
          overlay.style.display = 'none';
        }
        if (isManual && typeof showTeenToast === 'function') {
          showTeenToast("Hoàn thành dựng trang Swarm Landing Page! 🚀🎉", "⚡");
        }
      }, 1850);
    }\n    window.triggerSwarmBuildIntro = triggerSwarmBuildIntro;`;

normHtml = normHtml.slice(0, tStartIdx) + newTriggerSwarmBuildIntro + normHtml.slice(tEndIdx + triggerIntroEnd.length);
console.log('[7] Replaced triggerSwarmBuildIntro with Multiplayer Atomic Swarm Draw');

// Convert back to Windows CRLF
const finalHtml = normHtml.replace(/\n/g, '\r\n');

// Write to index.html and Tram_Hoc_Duong_Teen.html
fs.writeFileSync(indexPath, finalHtml, 'utf8');
fs.writeFileSync(teenPath, finalHtml, 'utf8');
console.log('[8] index.html & Tram_Hoc_Duong_Teen.html written successfully');

const bufA = fs.readFileSync(indexPath);
const bufB = fs.readFileSync(teenPath);

if (!bufA.equals(bufB)) {
  console.error('[FAIL] Buffer mismatch between index.html and Tram_Hoc_Duong_Teen.html');
  process.exit(1);
}
console.log('[PASS] 100% BITWISE PARITY CONFIRMED: Size = ' + bufA.length + ' bytes');
