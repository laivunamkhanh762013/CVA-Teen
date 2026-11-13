const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
const teenPath = path.join(__dirname, '..', 'Tram_Hoc_Duong_Teen.html');

let html = fs.readFileSync(indexPath, 'utf8');
let normHtml = html.replace(/\r\n/g, '\n');

// 1. Update CSS animation durations for cinematic deliberate marquee
// Update .swarm-scroll-marquee animation duration from 0.22s to 0.65s
normHtml = normHtml.replace(
  'animation: marqueeExpand 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;',
  'animation: marqueeExpand 0.65s cubic-bezier(0.25, 1, 0.5, 1) forwards !important;'
);
console.log('[1] Updated .swarm-scroll-marquee CSS animation to 0.65s');

// Update .swarm-btn-marquee animation duration from 0.16s to 0.38s
normHtml = normHtml.replace(
  'animation: marqueeExpand 0.16s cubic-bezier(0.16, 1, 0.3, 1) forwards;',
  'animation: marqueeExpand 0.38s cubic-bezier(0.25, 1, 0.5, 1) forwards !important;'
);
console.log('[2] Updated .swarm-btn-marquee CSS animation to 0.38s');

// 2. Locate SCROLL-DRIVEN SWARM DRAW block
const oldEngineStart = '/* ==========================================================================\n       SCROLL-DRIVEN SWARM DRAW & REVEAL ENGINE';
const oldEngineEnd = 'window.triggerSwarmBuildIntro = triggerSwarmBuildIntro;';

const eStartIdx = normHtml.indexOf(oldEngineStart);
const eEndIdx = normHtml.indexOf(oldEngineEnd, eStartIdx);

if (eStartIdx === -1 || eEndIdx === -1) {
  console.error('[FAIL] Could not find SCROLL-DRIVEN SWARM DRAW engine block');
  process.exit(1);
}

const cinematicEngineBlock = `/* ==========================================================================
       SCROLL-DRIVEN SWARM DRAW & REVEAL ENGINE (CINEMATIC DELIBERATE PACING)
       ========================================================================== */
    let swarmDrawQueue = [];
    let swarmDrawTimer = null;
    let swarmDrawPeerIdx = 0;

    function queueSwarmDraw(el) {
      if (!el || (el.dataset && el.dataset.swarmRevealed === 'true')) return;
      swarmDrawQueue.push(el);

      if (!swarmDrawTimer) {
        processSwarmDrawQueue();
      }
    }

    function processSwarmDrawQueue() {
      if (swarmDrawQueue.length === 0) {
        swarmDrawTimer = null;
        return;
      }

      const el = swarmDrawQueue.shift();
      const peer = SWARM_PEERS[swarmDrawPeerIdx % SWARM_PEERS.length];
      swarmDrawPeerIdx++;

      executeSwarmDraw(el, peer);

      // Cinematic stagger delay between sequential cards in a row (380ms)
      swarmDrawTimer = setTimeout(() => {
        processSwarmDrawQueue();
      }, 380);
    }

    function executeSwarmDraw(el, peer) {
      if (!el || (el.dataset && el.dataset.swarmRevealed === 'true')) return;
      if (el.dataset) el.dataset.swarmRevealed = 'true';

      const rect = el.getBoundingClientRect();
      const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const safeY = getBottomNavSafeY();

      // Clamp coordinates to strictly keep cursor inside viewport and ABOVE bottom nav
      const startX = Math.max(16, Math.min(w - 40, rect.left));
      const startY = Math.max(70, Math.min(safeY - 12, rect.top));
      const targetX = Math.max(16, Math.min(w - 40, rect.left + rect.width - 24));
      const targetY = Math.max(70, Math.min(safeY - 12, rect.top + rect.height - 24));

      const peerObj = (swarmEnabled && swarmPeersState.length > 0) ? (swarmPeersState.find(p => p.id === peer.id) || swarmPeersState[0]) : null;

      // Deliberate, smooth gliding speed (speed = 0.08) across diagonal of the card
      if (peerObj && !isSwarmBuildPlaying) {
        peerObj.x = startX;
        peerObj.y = startY;
        peerObj.targetX = targetX;
        peerObj.targetY = targetY;
        peerObj.speed = 0.08;
      }

      // Create neon dashed marquee overlay
      const marquee = document.createElement('div');
      marquee.className = 'swarm-scroll-marquee';
      marquee.style.setProperty('--marquee-color', peer.color || '#FFE600');
      marquee.innerHTML = \`<span class="swarm-size-pill">w: \${Math.round(rect.width || 360)}px  h: \${Math.round(rect.height || 200)}px</span>\`;
      el.appendChild(marquee);

      // Clear, cinematic deliberate marquee drag (650ms) before spring bounce pop
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

        // Post-draw dispersal: Cursors disperse upward into content area, never clump at card bottom!
        if (peerObj && !isSwarmBuildPlaying) {
          peerObj.targetX = Math.random() * (w - 120) + 60;
          peerObj.targetY = Math.random() * (safeY - 180) + 80;
          peerObj.speed = 0.035;
        }

        // SWARM BUTTON MICRO-DRAW: Đàn con trỏ tiếp tục chia nhau kéo vẽ từng nút bên trong!
        drawCardButtons(el);
      };

      setTimeout(revealCard, 650);
      setTimeout(revealCard, 850); // Hard safety net: never leave card stuck
    }

    function drawCardButtons(cardEl) {
      if (!cardEl) return;
      const btns = cardEl.querySelectorAll('button:not(#notif-btn):not(#theme-toggle-btn):not(#swarm-toggle-btn):not(#sound-toggle-btn):not(#replay-swarm-build-btn)');
      if (btns.length === 0) return;

      btns.forEach((btn, idx) => {
        if ((btn.dataset && btn.dataset.btnRevealed === 'true') || typeof IntersectionObserver === 'undefined') {
          btn.classList.remove('swarm-btn-pending');
          btn.classList.add('swarm-btn-revealed');
          return;
        }

        btn.classList.add('swarm-btn-pending');
        btn.style.position = 'relative';

        // Staggered peer cursor draw on each button (380ms marquee, 160ms stagger)
        setTimeout(() => {
          const bRect = btn.getBoundingClientRect();
          const peer = SWARM_PEERS[(idx + 1) % SWARM_PEERS.length];
          const peerObj = swarmPeersState.find(p => p.id === peer.id) || swarmPeersState[0];
          const safeY = getBottomNavSafeY();
          const w = typeof window !== 'undefined' ? window.innerWidth : 1024;

          if (swarmEnabled && peerObj && !isSwarmBuildPlaying) {
            peerObj.x = Math.max(16, Math.min(w - 40, bRect.left));
            peerObj.y = Math.max(70, Math.min(safeY - 12, bRect.top));
            peerObj.targetX = Math.max(16, Math.min(w - 40, bRect.left + bRect.width - 15));
            peerObj.targetY = Math.max(70, Math.min(safeY - 12, bRect.top + bRect.height - 15));
            peerObj.speed = 0.08;
          }

          const bMarquee = document.createElement('div');
          bMarquee.className = 'swarm-btn-marquee';
          bMarquee.style.setProperty('--btn-marquee-color', peer.color || '#FFE600');
          btn.appendChild(bMarquee);

          setTimeout(() => {
            if (bMarquee.parentNode) bMarquee.remove();
            btn.classList.remove('swarm-btn-pending');
            btn.classList.add('swarm-btn-revealed');
            if (btn.dataset) btn.dataset.btnRevealed = 'true';

            if (typeof triggerPeerClickEffect === 'function' && swarmEnabled && !isSwarmBuildPlaying) {
              triggerPeerClickEffect(Math.max(16, Math.min(w - 40, bRect.left + bRect.width - 10)), Math.min(safeY - 12, bRect.top + bRect.height - 10), peer);
            }
            if (typeof playCuteSound === 'function') {
              playCuteSound('pop');
            }

            // Post-draw dispersal: Cursors float away after button draw
            if (peerObj && !isSwarmBuildPlaying) {
              peerObj.targetX = Math.random() * (w - 120) + 60;
              peerObj.targetY = Math.random() * (safeY - 180) + 80;
              peerObj.speed = 0.035;
            }
          }, 380);
        }, idx * 160);
      });
    }
    window.drawCardButtons = drawCardButtons;

    function initScrollSwarmDraw() {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;

      const landingSection = document.getElementById('tab-landing');
      if (!landingSection) return;

      // Accurately target all card boxes on landing tab
      const targets = landingSection.querySelectorAll([
        '#bento-hero-banner',
        '#bento-vibe-card',
        '#landing-live-stats > div',
        '#quizizz-live-lobby',
        '#cva-weekly-poll',
        '#landing-faqs-accordion',
        '#landing-final-cta',
        '#landing-problem-agitation .grid > div',
        '#cva-pillars-showcase .grid > div',
        '#landing-testimonials .grid > div'
      ].join(', '));

      if (typeof IntersectionObserver === 'undefined') {
        // Fallback for headless vm test sandbox or unsupported browsers: instant visibility
        targets.forEach(el => {
          el.classList.remove('swarm-draw-pending');
          el.classList.add('swarm-draw-revealed');
          if (el.dataset) el.dataset.swarmRevealed = 'true';
        });
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            queueSwarmDraw(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '20px 0px 20px 0px' });

      // STRICT ON-SCROLL: Initialize ALL targets in pending state
      targets.forEach(el => {
        el.classList.add('swarm-draw-target');
        el.classList.remove('swarm-draw-revealed');
        if (el.dataset) delete el.dataset.swarmRevealed;
        el.classList.add('swarm-draw-pending');

        // Bento Hero & Bento Vibe are drawn sequentially by triggerSwarmBuildIntro() at top of page
        if (el.id !== 'bento-hero-banner' && el.id !== 'bento-vibe-card') {
          observer.observe(el);
        }
      });

      window.__swarmDrawObserver = observer;
    }
    window.initScrollSwarmDraw = initScrollSwarmDraw;

    function triggerSwarmBuildIntro(isManual = false) {
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

      const p1 = swarmPeersState.find(p => p.id === 'p1') || swarmPeersState[0];
      const p2 = swarmPeersState.find(p => p.id === 'p2') || swarmPeersState[1];
      const p3 = swarmPeersState.find(p => p.id === 'p3') || swarmPeersState[2];
      const p4 = swarmPeersState.find(p => p.id === 'p4') || swarmPeersState[3];
      const p5 = swarmPeersState.find(p => p.id === 'p5') || swarmPeersState[4];

      const bentoHero = document.getElementById('bento-hero-banner');
      const bentoVibe = document.getElementById('bento-vibe-card');
      const heroTitle = document.getElementById('hero-main-title');
      const storiesContainer = document.getElementById('stories-container');
      const vibeBtn = document.getElementById('vibe-check-btn');
      const stampHot = document.getElementById('hero-stamp-cva-hot');
      const stampAura = document.getElementById('hero-stamp-aura');
      const marquee = document.getElementById('swarm-selection-marquee');

      // Manual replay: smoothly scroll to top and reset all targets
      if (isManual) {
        if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (bentoHero) {
          bentoHero.classList.remove('swarm-draw-revealed');
          bentoHero.classList.add('swarm-draw-pending');
          if (bentoHero.dataset) delete bentoHero.dataset.swarmRevealed;
          bentoHero.querySelectorAll('button').forEach(b => {
            b.classList.remove('swarm-btn-revealed');
            b.classList.add('swarm-btn-pending');
            if (b.dataset) delete b.dataset.btnRevealed;
          });
        }
        if (bentoVibe) {
          bentoVibe.classList.remove('swarm-draw-revealed');
          bentoVibe.classList.add('swarm-draw-pending');
          if (bentoVibe.dataset) delete bentoVibe.dataset.swarmRevealed;
        }
        if (vibeBtn) {
          vibeBtn.classList.remove('swarm-btn-revealed');
          vibeBtn.classList.add('swarm-btn-pending');
          if (vibeBtn.dataset) delete vibeBtn.dataset.btnRevealed;
        }
        const drawTargets = document.querySelectorAll('.swarm-draw-target');
        drawTargets.forEach(el => {
          if (el.id !== 'bento-hero-banner' && el.id !== 'bento-vibe-card') {
            if (el.dataset) delete el.dataset.swarmRevealed;
            el.classList.remove('swarm-draw-revealed');
            el.classList.add('swarm-draw-pending');
            if (window.__swarmDrawObserver) {
              window.__swarmDrawObserver.observe(el);
            }
          }
        });
      }

      const bentoRect = bentoHero ? bentoHero.getBoundingClientRect() : { left: 160, top: 180, width: 520, height: 240 };
      const heroLeft = bentoRect.left;
      const heroTop = bentoRect.top;
      const heroW = bentoRect.width || 520;
      const heroH = bentoRect.height || 240;

      // Act 1 (0ms - 650ms): Minh Trí (#FFE600) drags cyber yellow marquee over Bento Hero
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

      // 650ms: Bento Hero pops open and 4 action buttons inside are drawn
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

          // SWARM BUTTON DRAW: 4 CTA buttons drawn by Linh Đan & Bảo Anh
          drawCardButtons(bentoHero);
        }
        if (p2) {
          showPeerChat(p2, 'Kéo khung Bento Hero chuẩn rồi nha! 📐', 2200);
          triggerPeerClickEffect(heroLeft + heroW - 20, heroTop + heroH - 20, p2);
        }
        if (typeof playCuteSound === 'function') {
          playCuteSound('pop');
        }
      }, 650);

      // Act 2 (650ms - 1100ms): Linh Đan types title & Bảo Anh pops stickers
      setTimeout(() => {
        const titleRect = heroTitle ? heroTitle.getBoundingClientRect() : { left: heroLeft + 20, top: heroTop + 40, width: 300, height: 60 };
        if (p1) {
          p1.targetX = titleRect.left + 80;
          p1.targetY = titleRect.top + 20;
          p1.speed = 0.08;
          showPeerChat(p1, 'Set font Space Grotesk 900 cực cháy! ⚡', 2200);
          triggerPeerClickEffect(p1.x, p1.y, p1);
        }

        if (heroTitle) {
          heroTitle.innerHTML = \`TRẠM HỌC ĐƯỜNG TEEN <span class="inline-block bg-[#FFE600] text-black px-2 py-0.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000000] -rotate-1 text-2xl sm:text-3xl md:text-4xl">CVA</span>\`;
        }

        if (p3) {
          const hotRect = stampHot ? stampHot.getBoundingClientRect() : { left: heroLeft + 120, top: heroTop + 30 };
          p3.targetX = hotRect.left + 20;
          p3.targetY = hotRect.top + 10;
          triggerPeerClickEffect(hotRect.left + 10, hotRect.top + 5, p3);
          showPeerChat(p3, 'Đóng dấu tem chính chủ Chu Văn An! 🏷️', 2200);
        }

        if (stampHot) {
          stampHot.style.transition = 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
          stampHot.style.transform = 'scale(1.25) rotate(-6deg)';
          setTimeout(() => { stampHot.style.transform = ''; }, 250);
        }
        if (stampAura) {
          stampAura.style.transition = 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
          stampAura.style.transform = 'scale(1.25) rotate(6deg)';
          setTimeout(() => { stampAura.style.transform = ''; }, 250);
        }

        if (storiesContainer) {
          const storyNodes = storiesContainer.querySelectorAll('.group');
          storyNodes.forEach((node, idx) => {
            setTimeout(() => {
              node.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
              node.style.transform = 'scale(1.15)';
              setTimeout(() => { node.style.transform = ''; }, 180);
            }, idx * 50);
          });
        }
      }, 750);

      // Act 3 (1100ms - 1750ms): Hoàng Nam (#00F0FF) draws Bento Vibe Card (650ms)
      setTimeout(() => {
        const vibeRect = bentoVibe ? bentoVibe.getBoundingClientRect() : { left: heroLeft + heroW + 20, top: heroTop, width: 280, height: 260 };
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

        // Attach cyan marquee inside bentoVibe
        let vibeMarquee = null;
        if (bentoVibe) {
          vibeMarquee = document.createElement('div');
          vibeMarquee.className = 'swarm-scroll-marquee';
          vibeMarquee.style.setProperty('--marquee-color', '#00F0FF');
          vibeMarquee.innerHTML = \`<span class="swarm-size-pill">w: \${Math.round(vibeW)}px  h: \${Math.round(vibeH)}px</span>\`;
          bentoVibe.appendChild(vibeMarquee);
        }

        setTimeout(() => {
          if (vibeMarquee && vibeMarquee.parentNode) vibeMarquee.remove();
          if (bentoVibe) {
            bentoVibe.classList.remove('swarm-draw-pending');
            bentoVibe.classList.add('swarm-draw-revealed');
            if (bentoVibe.dataset) bentoVibe.dataset.swarmRevealed = 'true';
            bentoVibe.classList.add('swarm-bento-spring');
            setTimeout(() => bentoVibe.classList.remove('swarm-bento-spring'), 400);
          }
          if (p4) {
            triggerPeerClickEffect(vibeLeft + vibeW - 20, vibeTop + vibeH - 20, p4);
          }
          if (typeof playCuteSound === 'function') {
            playCuteSound('pop');
          }
        }, 650);
      }, 1100);

      // Act 4 (1750ms - 2150ms): Ngọc Diệp (#A855F7) draws "Rút Quẻ Ngay (+10 Aura)" button (380ms)
      setTimeout(() => {
        const btnRect = vibeBtn ? vibeBtn.getBoundingClientRect() : { left: heroLeft + heroW + 40, top: heroTop + 180, width: 220, height: 44 };
        const peerDrawer = p5 || p4;

        if (peerDrawer) {
          peerDrawer.x = btnRect.left;
          peerDrawer.y = btnRect.top;
          peerDrawer.targetX = btnRect.left + btnRect.width - 15;
          peerDrawer.targetY = btnRect.top + btnRect.height - 15;
          peerDrawer.speed = 0.08;
        }

        let bMarquee = null;
        if (vibeBtn) {
          vibeBtn.classList.add('swarm-btn-pending');
          vibeBtn.style.position = 'relative';
          bMarquee = document.createElement('div');
          bMarquee.className = 'swarm-btn-marquee';
          bMarquee.style.setProperty('--btn-marquee-color', '#A855F7');
          vibeBtn.appendChild(bMarquee);
        }

        setTimeout(() => {
          if (bMarquee && bMarquee.parentNode) bMarquee.remove();
          if (vibeBtn) {
            vibeBtn.classList.remove('swarm-btn-pending');
            vibeBtn.classList.add('swarm-btn-revealed');
            if (vibeBtn.dataset) vibeBtn.dataset.btnRevealed = 'true';
          }
          if (peerDrawer) {
            triggerPeerClickEffect(btnRect.left + btnRect.width / 2, btnRect.top + btnRect.height / 2, peerDrawer);
          }
          if (p4) {
            showPeerChat(p4, 'Xong kèo! Trang lên sóng toàn trường rồi anh em ơi! 🚀🎉', 2600);
          }
        }, 380);
      }, 1750);

      // Act 5 (2200ms - 2400ms): Confetti burst & completion celebration
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
      }, 2200);

      // Settle at 2400ms: Disperse peers upward into content area
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
      }, 2400);
    }
    window.triggerSwarmBuildIntro = triggerSwarmBuildIntro;`;

normHtml = normHtml.slice(0, eStartIdx) + cinematicEngineBlock + normHtml.slice(eEndIdx + oldEngineEnd.length);
console.log('[3] Replaced SCROLL-DRIVEN SWARM DRAW engine block with cinematic timing');

// Convert back to Windows CRLF
const finalHtml = normHtml.replace(/\n/g, '\r\n');

// Write to index.html and Tram_Hoc_Duong_Teen.html
fs.writeFileSync(indexPath, finalHtml, 'utf8');
fs.writeFileSync(teenPath, finalHtml, 'utf8');
console.log('[4] index.html & Tram_Hoc_Duong_Teen.html written successfully');

const bufA = fs.readFileSync(indexPath);
const bufB = fs.readFileSync(teenPath);

if (!bufA.equals(bufB)) {
  console.error('[FAIL] Buffer mismatch between index.html and Tram_Hoc_Duong_Teen.html');
  process.exit(1);
}
console.log('[PASS] 100% BITWISE PARITY CONFIRMED: Size = ' + bufA.length + ' bytes');
