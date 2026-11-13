const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
const teenPath = path.join(__dirname, '..', 'Tram_Hoc_Duong_Teen.html');

let html = fs.readFileSync(indexPath, 'utf8');
let normHtml = html.replace(/\r\n/g, '\n');

// 1. Update CSS: 100% initial invisibility for .swarm-draw-pending and .swarm-atomic-pending
const oldPendingCSS = `    .swarm-draw-pending {
      position: relative !important;
      border: 2px dashed rgba(0, 0, 0, 0.12) !important;
      background-color: rgba(0, 0, 0, 0.015) !important;
      box-shadow: none !important;
      border-radius: 24px !important;
      transition: border-color 0.2s ease, background-color 0.2s ease !important;
    }
    html.dark .swarm-draw-pending,
    [data-theme="dark"] .swarm-draw-pending {
      border-color: rgba(255, 255, 255, 0.12) !important;
      background-color: rgba(255, 255, 255, 0.015) !important;
    }

    /* Hide inner content during pending state with smooth spring-ready scale (DO NOT HIDE MARQUEE OR PILL) */
    .swarm-draw-pending > *:not(.swarm-scroll-marquee):not(.swarm-size-pill) {
      opacity: 0 !important;
      transform: scale(0.96) !important;
      pointer-events: none !important;
      transition: opacity 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    }

    /* Crosshair watermark in center of empty frame */
    .swarm-draw-pending::before {
      content: '+';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 22px;
      font-family: monospace;
      font-weight: 900;
      color: rgba(0, 0, 0, 0.22);
      pointer-events: none;
      z-index: 5;
    }
    html.dark .swarm-draw-pending::before,
    [data-theme="dark"] .swarm-draw-pending::before {
      color: rgba(255, 255, 255, 0.22);
    }`;

const newPendingCSS = `    /* GRADUAL SWARM REVELATION: 100% INVISIBLE INITIAL CANVAS (CLS = 0) */
    .swarm-draw-pending {
      position: relative !important;
      border: 2px dashed transparent !important;
      background-color: transparent !important;
      box-shadow: none !important;
      border-radius: 24px !important;
    }
    html.dark .swarm-draw-pending,
    [data-theme="dark"] .swarm-draw-pending {
      border-color: transparent !important;
      background-color: transparent !important;
    }

    /* Hide inner content during pending state: 100% invisible (DO NOT HIDE MARQUEE OR PILL) */
    .swarm-draw-pending > *:not(.swarm-scroll-marquee):not(.swarm-size-pill) {
      opacity: 0 !important;
      visibility: hidden !important;
      transform: scale(0.96) !important;
      pointer-events: none !important;
      transition: opacity 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    }

    /* Crosshair watermark removed completely for pure blank start */
    .swarm-draw-pending::before {
      display: none !important;
    }
    html.dark .swarm-draw-pending::before,
    [data-theme="dark"] .swarm-draw-pending::before {
      display: none !important;
    }`;

if (normHtml.includes(oldPendingCSS)) {
  normHtml = normHtml.replace(oldPendingCSS, newPendingCSS);
  console.log('[1] Updated .swarm-draw-pending CSS to 100% invisible transparent canvas');
} else {
  console.error('[FAIL] Could not match oldPendingCSS');
  process.exit(1);
}

// 2. Update .swarm-atomic-pending in CSS: opacity 0 & visibility hidden
const oldAtomicPendingCSS = `    /* Trạng thái đang chờ vẽ: viền phác thảo nhẹ, mờ ảo */
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
    }`;

const newAtomicPendingCSS = `    /* Trạng thái ban đầu: Hoàn toàn trống trơn / tàng hình (CLS = 0) */
    .swarm-atomic-pending {
      opacity: 0 !important;
      visibility: hidden !important;
      transform: scale(0.92) !important;
      outline: none !important;
      border-color: transparent !important;
      pointer-events: none !important;
    }
    html.dark .swarm-atomic-pending,
    [data-theme="dark"] .swarm-atomic-pending {
      outline: none !important;
      border-color: transparent !important;
    }`;

if (normHtml.includes(oldAtomicPendingCSS)) {
  normHtml = normHtml.replace(oldAtomicPendingCSS, newAtomicPendingCSS);
  console.log('[2] Updated .swarm-atomic-pending CSS to 100% invisible');
} else {
  console.error('[FAIL] Could not match oldAtomicPendingCSS');
  process.exit(1);
}

// Update .swarm-atomic-revealed to ensure visibility: visible !important;
normHtml = normHtml.replace(
  '.swarm-atomic-revealed {\n      opacity: 1 !important;\n      transform: scale(1) !important;',
  '.swarm-atomic-revealed {\n      opacity: 1 !important;\n      visibility: visible !important;\n      transform: scale(1) !important;'
);

// 3. Mark all atomic elements with swarm-atomic-pending in HTML markup so they load 100% blank
const atomicClassReplacements = [
  ['id="stories-header-row" class="swarm-atomic-item', 'id="stories-header-row" class="swarm-atomic-item swarm-atomic-pending'],
  ['id="story-item-0" onclick="openCreateStoryModal()" class="story-item-0 swarm-atomic-item', 'id="story-item-0" onclick="openCreateStoryModal()" class="story-item-0 swarm-atomic-item swarm-atomic-pending'],
  ['id="story-item-1" onclick="openStoryViewer(0)" class="story-item-1 swarm-atomic-item', 'id="story-item-1" onclick="openStoryViewer(0)" class="story-item-1 swarm-atomic-item swarm-atomic-pending'],
  ['id="story-item-2" onclick="openStoryViewer(1)" class="story-item-2 swarm-atomic-item', 'id="story-item-2" onclick="openStoryViewer(1)" class="story-item-2 swarm-atomic-item swarm-atomic-pending'],
  ['id="story-item-3" onclick="openStoryViewer(2)" class="story-item-3 swarm-atomic-item', 'id="story-item-3" onclick="openStoryViewer(2)" class="story-item-3 swarm-atomic-item swarm-atomic-pending'],
  ['id="story-item-4" onclick="openStoryViewer(3)" class="story-item-4 swarm-atomic-item', 'id="story-item-4" onclick="openStoryViewer(3)" class="story-item-4 swarm-atomic-item swarm-atomic-pending'],
  ['id="story-item-5" onclick="openStoryViewer(4)" class="story-item-5 swarm-atomic-item', 'id="story-item-5" onclick="openStoryViewer(4)" class="story-item-5 swarm-atomic-item swarm-atomic-pending'],
  ['id="hero-floating-sticker" class="swarm-atomic-item', 'id="hero-floating-sticker" class="swarm-atomic-item swarm-atomic-pending'],
  ['id="hero-badge-school" class="swarm-atomic-item', 'id="hero-badge-school" class="swarm-atomic-item swarm-atomic-pending'],
  ['id="hero-badge-tag" class="swarm-atomic-item', 'id="hero-badge-tag" class="swarm-atomic-item swarm-atomic-pending'],
  ['id="hero-stamp-cva-hot" class="swarm-atomic-item', 'id="hero-stamp-cva-hot" class="swarm-atomic-item swarm-atomic-pending'],
  ['id="hero-stamp-aura" class="swarm-atomic-item', 'id="hero-stamp-aura" class="swarm-atomic-item swarm-atomic-pending'],
  ['id="hero-main-title" class="swarm-atomic-item', 'id="hero-main-title" class="swarm-atomic-item swarm-atomic-pending'],
  ['id="hero-subtitle-desc" class="swarm-atomic-item', 'id="hero-subtitle-desc" class="swarm-atomic-item swarm-atomic-pending'],
  ['id="hero-btn-lost"\n              onclick="switchTab(\'lost-found\')"', 'id="hero-btn-lost"\n              onclick="switchTab(\'lost-found\')"\n              class="swarm-atomic-item swarm-atomic-pending'],
  ['id="hero-btn-books"\n              onclick="switchTab(\'books\')"', 'id="hero-btn-books"\n              onclick="switchTab(\'books\')"\n              class="swarm-atomic-item swarm-atomic-pending'],
  ['id="hero-btn-conf"\n              onclick="switchTab(\'confessions\')"', 'id="hero-btn-conf"\n              onclick="switchTab(\'confessions\')"\n              class="swarm-atomic-item swarm-atomic-pending'],
  ['id="hero-btn-profile"\n              onclick="openProfileModal()"', 'id="hero-btn-profile"\n              onclick="openProfileModal()"\n              class="swarm-atomic-item swarm-atomic-pending'],
  ['id="vibe-badge" class="swarm-atomic-item', 'id="vibe-badge" class="swarm-atomic-item swarm-atomic-pending'],
  ['id="vibe-title" class="swarm-atomic-item', 'id="vibe-title" class="swarm-atomic-item swarm-atomic-pending'],
  ['id="vibe-check-display" class="swarm-atomic-item', 'id="vibe-check-display" class="swarm-atomic-item swarm-atomic-pending'],
  ['id="vibe-check-btn" \n              onclick="rollVibeCheck()"\n              class="swarm-atomic-item', 'id="vibe-check-btn" \n              onclick="rollVibeCheck()"\n              class="swarm-atomic-item swarm-atomic-pending']
];

atomicClassReplacements.forEach(([target, repl]) => {
  if (normHtml.includes(target) && !normHtml.includes(repl)) {
    normHtml = normHtml.replace(target, repl);
  }
});
console.log('[3] Initialized atomic elements with swarm-atomic-pending in HTML markup');

// 4. Update triggerSwarmBuildIntro with Gradual Step-by-Step Orchestration (0.0s - 2.8s)
const triggerIntroStart = 'function triggerSwarmBuildIntro(isManual = false) {';
const triggerIntroEnd = 'window.triggerSwarmBuildIntro = triggerSwarmBuildIntro;';

const tStartIdx = normHtml.indexOf(triggerIntroStart);
const tEndIdx = normHtml.indexOf(triggerIntroEnd, tStartIdx);

if (tStartIdx === -1 || tEndIdx === -1) {
  console.error('[FAIL] Could not find triggerSwarmBuildIntro bounds');
  process.exit(1);
}

const gradualTriggerSwarmBuildIntro = `function triggerSwarmBuildIntro(isManual = false) {
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

      // Manual replay or load: smoothly scroll to top and reset all targets & atomic elements to blank
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
          bentoHero.classList.remove('swarm-draw-revealed');
          bentoHero.classList.add('swarm-draw-pending');
          if (bentoHero.dataset) delete bentoHero.dataset.swarmRevealed;
        }
        if (bentoVibe) {
          bentoVibe.classList.remove('swarm-draw-revealed');
          bentoVibe.classList.add('swarm-draw-pending');
          if (bentoVibe.dataset) delete bentoVibe.dataset.swarmRevealed;
        }
      }

      // =========================================================================
      // TIẾN TRÌNH DẦN DẦN MỚI HIỆN RA (0.0s - 2.8s)
      // Lúc đầu là KHÔNG CÓ GÌ CẢ (100% Trống trơn)
      // =========================================================================

      const bentoRect = bentoHero ? bentoHero.getBoundingClientRect() : { left: 160, top: 180, width: 520, height: 240 };
      const heroLeft = bentoRect.left;
      const heroTop = bentoRect.top;
      const heroW = bentoRect.width || 520;
      const heroH = bentoRect.height || 240;

      // BƯỚC 1 (0.0s - 0.50s): Minh Trí (#FFE600) kéo khung Bento Hero trên nền trống trơn
      if (p2) {
        p2.x = heroLeft;
        p2.y = heroTop;
        p2.targetX = heroLeft + heroW;
        p2.targetY = heroTop + heroH;
        p2.speed = 0.08;
      }

      if (marquee) {
        marquee.classList.remove('hidden');
        marquee.style.display = 'block';
        marquee.style.left = \`\${heroLeft}px\`;
        marquee.style.top = \`\${heroTop}px\`;
        marquee.style.width = '24px';
        marquee.style.height = '24px';
        marquee.innerHTML = \`<span class="absolute bottom-1 right-1 bg-black text-[#FFE600] px-1.5 py-0.5 rounded text-[9px] font-mono font-black border border-black shadow-[1px_1px_0px_0px_#000000]">w: \${Math.round(heroW)}px  h: \${Math.round(heroH)}px</span>\`;
        setTimeout(() => {
          if (marquee) {
            marquee.style.width = \`\${heroW}px\`;
            marquee.style.height = \`\${heroH}px\`;
          }
        }, 50);
      }

      // 0.50s: Vỏ Bento Hero bung nở (bên trong mọi chữ và nút vẫn tàng hình pending!)
      setTimeout(() => {
        if (marquee) {
          marquee.classList.add('hidden');
          marquee.style.display = 'none';
        }
        if (bentoHero) {
          bentoHero.classList.remove('swarm-draw-pending');
          bentoHero.classList.add('swarm-draw-revealed');
          if (bentoHero.dataset) bentoHero.dataset.swarmRevealed = 'true';
          bentoHero.classList.add('swarm-bento-spring');
          setTimeout(() => bentoHero.classList.remove('swarm-bento-spring'), 400);
        }
        if (p2) {
          showPeerChat(p2, 'Kéo khung Bento Hero chuẩn rồi nha! 📐', 2200);
          triggerPeerClickEffect(heroLeft + heroW - 20, heroTop + heroH - 20, p2);
        }
        if (typeof playCuteSound === 'function') playCuteSound('pop');
      }, 500);

      // BƯỚC 2 (0.50s - 0.90s): Kéo khung Tiêu đề lớn TRẠM HỌC ĐƯỜNG TEEN CVA
      setTimeout(() => {
        if (heroTitle) {
          drawAtomicElement(heroTitle, p2, 0, () => {
            showPeerChat(p1, 'Set font Space Grotesk 900 cực cháy! ⚡', 2200);
          });
        }
      }, 550);

      // BƯỚC 3 (0.90s - 1.30s): Kéo khung 4 Badge thương hiệu & Floating Sticker
      setTimeout(() => {
        const badgeSchool = document.getElementById('hero-badge-school');
        const badgeTag = document.getElementById('hero-badge-tag');
        const floatSticker = document.getElementById('hero-floating-sticker');

        if (badgeSchool) drawAtomicElement(badgeSchool, p1, 0);
        if (badgeTag) drawAtomicElement(badgeTag, p1, 60);
        if (stampHot) {
          drawAtomicElement(stampHot, p1, 120, () => {
            stampHot.style.transform = 'scale(1.25) rotate(-6deg)';
            setTimeout(() => { stampHot.style.transform = ''; }, 200);
          });
        }
        if (stampAura) {
          drawAtomicElement(stampAura, p1, 180, () => {
            stampAura.style.transform = 'scale(1.25) rotate(6deg)';
            setTimeout(() => { stampAura.style.transform = ''; }, 200);
            showPeerChat(p3, 'Đóng dấu tem chính chủ Chu Văn An! 🏷️', 2200);
          });
        }
        if (floatSticker) drawAtomicElement(floatSticker, p4, 80);
      }, 920);

      // BƯỚC 4 (1.30s - 1.60s): Kéo khung Đoạn văn mô tả (Subtitle)
      setTimeout(() => {
        const heroDesc = document.getElementById('hero-subtitle-desc');
        if (heroDesc) drawAtomicElement(heroDesc, p5, 0);
      }, 1320);

      // BƯỚC 5 (1.60s - 2.05s): Đàn chuột chia nhau kéo 4 nút hành động Hero
      setTimeout(() => {
        const btnLost = document.getElementById('hero-btn-lost');
        const btnBooks = document.getElementById('hero-btn-books');
        const btnConf = document.getElementById('hero-btn-conf');
        const btnProf = document.getElementById('hero-btn-profile');

        if (btnLost) drawAtomicElement(btnLost, p1, 0);
        if (btnBooks) drawAtomicElement(btnBooks, p3, 60);
        if (btnConf) drawAtomicElement(btnConf, p2, 120);
        if (btnProf) drawAtomicElement(btnProf, p4, 180);
      }, 1620);

      // BƯỚC 6 (2.05s - 2.45s): Kéo dải Stories CVA 24H (tiêu đề + 6 avatar tròn)
      setTimeout(() => {
        const storiesHeader = document.getElementById('stories-header-row');
        if (storiesHeader) drawAtomicElement(storiesHeader, p3, 0);

        for (let s = 0; s <= 5; s++) {
          const storyEl = document.getElementById(\`story-item-\${s}\`);
          if (storyEl) {
            drawAtomicElement(storyEl, p3, 40 + s * 45);
          }
        }
      }, 2080);

      // BƯỚC 7 (2.45s - 2.80s): Kéo khung Bento Vibe Card & Nút Quẻ
      setTimeout(() => {
        if (bentoVibe) {
          const vibeRect = bentoVibe.getBoundingClientRect();
          const vibeLeft = vibeRect.left;
          const vibeTop = vibeRect.top;
          const vibeW = vibeRect.width || 280;
          const vibeH = vibeRect.height || 260;

          if (p4) {
            p4.x = vibeLeft;
            p4.y = vibeTop;
            p4.targetX = vibeLeft + vibeW;
            p4.targetY = vibeTop + vibeH;
            p4.speed = 0.08;
          }

          let vibeMarquee = document.createElement('div');
          vibeMarquee.className = 'swarm-scroll-marquee';
          vibeMarquee.style.setProperty('--marquee-color', '#00F0FF');
          vibeMarquee.innerHTML = \`<span class="swarm-size-pill">w: \${Math.round(vibeW)}px  h: \${Math.round(vibeH)}px</span>\`;
          bentoVibe.appendChild(vibeMarquee);

          setTimeout(() => {
            if (vibeMarquee.parentNode) vibeMarquee.remove();
            bentoVibe.classList.remove('swarm-draw-pending');
            bentoVibe.classList.add('swarm-draw-revealed');
            if (bentoVibe.dataset) bentoVibe.dataset.swarmRevealed = 'true';
            bentoVibe.classList.add('swarm-bento-spring');
            setTimeout(() => bentoVibe.classList.remove('swarm-bento-spring'), 400);

            // Draw inner vibe elements
            const vibeBadge = document.getElementById('vibe-badge');
            const vibeTitle = document.getElementById('vibe-title');
            const vibeDisplay = document.getElementById('vibe-check-display');

            if (vibeBadge) drawAtomicElement(vibeBadge, p1, 0);
            if (vibeTitle) drawAtomicElement(vibeTitle, p2, 40);
            if (vibeDisplay) drawAtomicElement(vibeDisplay, p4, 80);

            if (vibeBtn) {
              drawAtomicElement(vibeBtn, p5, 120, () => {
                showPeerChat(p4, 'Xong kèo! Trang lên sóng toàn trường rồi anh em ơi! 🚀🎉', 2600);
              });
            }
          }, 320);
        }
      }, 2480);

      // BƯỚC 8 (2.80s): Pháo hoa Confetti ăn mừng hoàn tất toàn bộ giao diện!
      setTimeout(() => {
        if (typeof confetti === 'function') {
          try {
            confetti({
              particleCount: 55,
              spread: 75,
              origin: { y: 0.55 },
              colors: ['#FFE600', '#CCFF00', '#FF007A', '#00F0FF', '#000000']
            });
          } catch(e) {}
        }
        if (typeof playCuteSound === 'function') {
          playCuteSound('pop');
        }
      }, 2800);

      // Settle at 2950ms: Peers disperse smoothly upward into content area
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
      }, 2950);
    }\n    window.triggerSwarmBuildIntro = triggerSwarmBuildIntro;`;

normHtml = normHtml.slice(0, tStartIdx) + gradualTriggerSwarmBuildIntro + normHtml.slice(tEndIdx + triggerIntroEnd.length);
console.log('[4] Replaced triggerSwarmBuildIntro with Gradual Step-by-Step Revelation (0.0s - 2.8s)');

// Convert back to Windows CRLF
const finalHtml = normHtml.replace(/\n/g, '\r\n');

// Write to index.html and Tram_Hoc_Duong_Teen.html
fs.writeFileSync(indexPath, finalHtml, 'utf8');
fs.writeFileSync(teenPath, finalHtml, 'utf8');
console.log('[5] index.html & Tram_Hoc_Duong_Teen.html written successfully');

const bufA = fs.readFileSync(indexPath);
const bufB = fs.readFileSync(teenPath);

if (!bufA.equals(bufB)) {
  console.error('[FAIL] Buffer mismatch between index.html and Tram_Hoc_Duong_Teen.html');
  process.exit(1);
}
console.log('[PASS] 100% BITWISE PARITY CONFIRMED: Size = ' + bufA.length + ' bytes');
