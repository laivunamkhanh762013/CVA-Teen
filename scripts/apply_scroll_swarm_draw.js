const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
const destPath = path.join(__dirname, '..', 'Tram_Hoc_Duong_Teen.html');

let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// 1. CSS for Scroll-Driven Swarm Draw & Reveal
const cssTarget = `    /* Selection Marquee for Swarm Page Build */
    #swarm-selection-marquee {`;

const cssReplacement = `    /* ==========================================================================
       SCROLL-DRIVEN SWARM DRAW & REVEAL SYSTEM (CLS = 0 NEOBRUTALISM)
       ========================================================================== */
    .swarm-draw-pending {
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

    /* Hide inner content during pending state with smooth spring-ready scale */
    .swarm-draw-pending > * {
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
      color: rgba(0, 0, 0, 0.18);
      pointer-events: none;
      z-index: 10;
    }
    html.dark .swarm-draw-pending::before,
    [data-theme="dark"] .swarm-draw-pending::before {
      color: rgba(255, 255, 255, 0.18);
    }

    /* Scroll-Driven Selection Marquee Overlay */
    .swarm-scroll-marquee {
      position: absolute;
      inset: 0;
      border: 2.5px dashed var(--marquee-color, #FFE600);
      background-color: rgba(255, 230, 0, 0.12);
      border-radius: inherit;
      pointer-events: none;
      z-index: 30;
      animation: marqueeExpand 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes marqueeExpand {
      0%   { clip-path: polygon(0 0, 0 0, 0 0, 0 0); }
      100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
    }
    .swarm-size-pill {
      position: absolute;
      bottom: -22px;
      right: 0;
      background-color: #000000;
      color: var(--marquee-color, #FFE600);
      border: 1.5px solid #000000;
      font-size: 9px;
      font-family: monospace;
      font-weight: 900;
      padding: 1px 6px;
      border-radius: 6px;
      box-shadow: 1.5px 1.5px 0px 0px var(--marquee-color, #FFE600);
      white-space: nowrap;
      z-index: 35;
    }

    /* Phase 3: Revealed card with spring bounce */
    .swarm-draw-revealed {
      animation: cardSpringBounce 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards !important;
    }
    .swarm-draw-revealed > * {
      opacity: 1 !important;
      transform: scale(1) !important;
      pointer-events: auto !important;
    }
    @keyframes cardSpringBounce {
      0%   { transform: scale(0.97); }
      60%  { transform: scale(1.015); }
      100% { transform: scale(1); }
    }

    /* Selection Marquee for Swarm Page Build */
    #swarm-selection-marquee {`;

if (!content.includes(cssTarget)) {
  console.error('[ERROR] cssTarget not found');
  process.exit(1);
}
content = content.replace(cssTarget, cssReplacement);
console.log('[OK] CSS for Scroll-Driven Swarm Draw injected');

// 2. Add id="landing-faqs-accordion" and swarm-draw-target class to FAQ
const faqTarget = `      <!-- ==================== ACCORDION FAQS: CẨM NANG & HỎI ĐÁP CVA (NEOBRUTALISM) ==================== -->
      <div class="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_0px_#000000] dark:shadow-[5px_5px_0px_0px_#CCFF00] space-y-4 mt-5">`;

const faqReplacement = `      <!-- ==================== ACCORDION FAQS: CẨM NANG & HỎI ĐÁP CVA (NEOBRUTALISM) ==================== -->
      <div id="landing-faqs-accordion" class="swarm-draw-target bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_0px_#000000] dark:shadow-[5px_5px_0px_0px_#CCFF00] space-y-4 mt-5">`;

if (!content.includes(faqTarget)) {
  console.error('[ERROR] faqTarget not found');
  process.exit(1);
}
content = content.replace(faqTarget, faqReplacement);
console.log('[OK] FAQ Accordion ID and class injected');

// 3. Add swarm-draw-target to Bento Hero and Bento Vibe
content = content.replace('id="bento-hero-banner" class="md:col-span-2 relative', 'id="bento-hero-banner" class="swarm-draw-target md:col-span-2 relative');
content = content.replace('id="bento-vibe-card" class="bg-[#FFF8E7]', 'id="bento-vibe-card" class="swarm-draw-target bg-[#FFF8E7]');
content = content.replace('id="quizizz-live-lobby" class="bg-white', 'id="quizizz-live-lobby" class="swarm-draw-target bg-white');
content = content.replace('id="cva-weekly-poll" class="bg-white', 'id="cva-weekly-poll" class="swarm-draw-target bg-white');
content = content.replace('id="landing-final-cta" class="bg-[#FFE600]', 'id="landing-final-cta" class="swarm-draw-target bg-[#FFE600]');
console.log('[OK] Added swarm-draw-target to main section cards');

// 4. Inject Scroll-Driven Swarm Draw Engine in script
const engineTarget = `    function triggerSwarmBuildIntro(isManual = false) {`;

const engineReplacement = `    /* ==========================================================================
       SCROLL-DRIVEN SWARM DRAW & REVEAL ENGINE
       ========================================================================== */
    let swarmDrawQueue = [];
    let swarmDrawTimer = null;
    let swarmDrawPeerIdx = 0;

    function queueSwarmDraw(el) {
      if (!el || el.dataset.swarmRevealed === 'true') return;
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

      // Stagger delay between parallel draws (110ms)
      swarmDrawTimer = setTimeout(() => {
        processSwarmDrawQueue();
      }, 110);
    }

    function executeSwarmDraw(el, peer) {
      if (!el || el.dataset.swarmRevealed === 'true') return;
      el.dataset.swarmRevealed = 'true';

      const rect = el.getBoundingClientRect();

      // Dispatch assigned peer cursor toward card corner if enabled
      if (swarmEnabled && swarmPeersState.length > 0 && !isSwarmBuildPlaying) {
        const peerObj = swarmPeersState.find(p => p.id === peer.id) || swarmPeersState[0];
        if (peerObj) {
          peerObj.x = Math.max(10, rect.left);
          peerObj.y = Math.max(10, rect.top);
          peerObj.targetX = Math.max(10, rect.left + rect.width);
          peerObj.targetY = Math.max(10, rect.top + rect.height);
          peerObj.speed = 0.085;
        }
      }

      // Create neon dashed marquee overlay
      const marquee = document.createElement('div');
      marquee.className = 'swarm-scroll-marquee';
      marquee.style.setProperty('--marquee-color', peer.color || '#FFE600');
      marquee.innerHTML = \`<span class="swarm-size-pill">w: \${Math.round(rect.width || 360)}px  h: \${Math.round(rect.height || 200)}px</span>\`;
      el.appendChild(marquee);

      // Complete reveal after 240ms or safety 350ms
      let completed = false;
      const revealCard = () => {
        if (completed) return;
        completed = true;
        if (marquee.parentNode) marquee.remove();
        el.classList.remove('swarm-draw-pending');
        el.classList.add('swarm-draw-revealed');

        if (typeof triggerPeerClickEffect === 'function' && swarmEnabled && !isSwarmBuildPlaying) {
          triggerPeerClickEffect(rect.left + rect.width - 20, rect.top + rect.height - 20, peer);
        }
        if (typeof playCuteSound === 'function') {
          playCuteSound('pop');
        }
      };

      setTimeout(revealCard, 240);
    }

    function initScrollSwarmDraw() {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;

      const targets = document.querySelectorAll('.swarm-draw-target, #bento-hero-banner, #bento-vibe-card, #quizizz-live-lobby, #landing-problem-agitation > div > div, #cva-pillars-showcase > div > div, #landing-testimonials > div > div, #cva-weekly-poll, #landing-faqs-accordion, #landing-final-cta');

      if (typeof IntersectionObserver === 'undefined') {
        // Fallback for headless vm test sandbox or unsupported browsers: instant visibility
        targets.forEach(el => {
          el.classList.remove('swarm-draw-pending');
          el.classList.add('swarm-draw-revealed');
          el.dataset.swarmRevealed = 'true';
        });
        return;
      }

      targets.forEach(el => {
        el.classList.add('swarm-draw-target');
        // Do not hide top Hero and Vibe cards initially (managed by Build Intro)
        if (el.id !== 'bento-hero-banner' && el.id !== 'bento-vibe-card') {
          el.classList.add('swarm-draw-pending');
        } else {
          el.dataset.swarmRevealed = 'true';
        }
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            queueSwarmDraw(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' });

      targets.forEach(el => {
        if (el.id !== 'bento-hero-banner' && el.id !== 'bento-vibe-card') {
          observer.observe(el);
        }
      });

      window.__swarmDrawObserver = observer;
    }
    window.initScrollSwarmDraw = initScrollSwarmDraw;

    function triggerSwarmBuildIntro(isManual = false) {`;

if (!content.includes(engineTarget)) {
  console.error('[ERROR] engineTarget not found');
  process.exit(1);
}
content = content.replace(engineTarget, engineReplacement);
console.log('[OK] Scroll-Driven Swarm Draw Engine injected');

// 5. In triggerSwarmBuildIntro, reset targets on manual replay
const replayResetTarget = `        if (isManual && typeof showTeenToast === 'function') {
          showTeenToast("Hoàn thành dựng trang Swarm Landing Page! 🚀🎉", "⚡");
        }`;

const replayResetReplacement = `        // Re-observe scroll draw targets if manual replay
        if (isManual) {
          const drawTargets = document.querySelectorAll('.swarm-draw-target');
          drawTargets.forEach(el => {
            if (el.id !== 'bento-hero-banner' && el.id !== 'bento-vibe-card') {
              el.dataset.swarmRevealed = 'false';
              el.classList.remove('swarm-draw-revealed');
              el.classList.add('swarm-draw-pending');
              if (window.__swarmDrawObserver) {
                window.__swarmDrawObserver.observe(el);
              }
            }
          });
        }

        if (isManual && typeof showTeenToast === 'function') {
          showTeenToast("Hoàn thành dựng trang Swarm Landing Page! 🚀🎉", "⚡");
        }`;

if (!content.includes(replayResetTarget)) {
  console.error('[ERROR] replayResetTarget not found');
  process.exit(1);
}
content = content.replace(replayResetTarget, replayResetReplacement);
console.log('[OK] Manual replay reset for scroll draw targets injected');

// 6. In DOMContentLoaded, call initScrollSwarmDraw
const dclTarget = `      safeRun(initSwarmCursors, 'initSwarmCursors');`;

const dclReplacement = `      safeRun(initSwarmCursors, 'initSwarmCursors');
      safeRun(initScrollSwarmDraw, 'initScrollSwarmDraw');`;

if (!content.includes(dclTarget)) {
  console.error('[ERROR] dclTarget not found');
  process.exit(1);
}
content = content.replace(dclTarget, dclReplacement);
console.log('[OK] initScrollSwarmDraw called in DOMContentLoaded');

// Normalize line endings to Windows CRLF (\r\n)
content = content.replace(/\r?\n/g, '\r\n');

// Write to index.html and Tram_Hoc_Duong_Teen.html
fs.writeFileSync(filePath, content, 'utf8');
fs.writeFileSync(destPath, content, 'utf8');

console.log('Successfully applied Scroll-Driven Swarm Draw to index.html and Tram_Hoc_Duong_Teen.html with 100% byte parity!');
