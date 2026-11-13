const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
const destPath = path.join(__dirname, '..', 'Tram_Hoc_Duong_Teen.html');

let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// 1. CSS Hotfix
const cssOld = `    /* Hide inner content during pending state with smooth spring-ready scale */
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
    }`;

const cssNew = `    /* Hide inner content during pending state with smooth spring-ready scale (DO NOT HIDE MARQUEE OR PILL) */
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
    }

    /* Scroll-Driven Selection Marquee Overlay (100% VISIBLE & CYBER POP) */
    .swarm-scroll-marquee {
      position: absolute;
      inset: 0;
      border: 3px dashed var(--marquee-color, #FFE600) !important;
      background-color: rgba(255, 230, 0, 0.16) !important;
      border-radius: inherit;
      pointer-events: none;
      z-index: 50 !important;
      opacity: 1 !important;
      visibility: visible !important;
      animation: marqueeExpand 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      box-shadow: 0 0 12px rgba(255, 230, 0, 0.35) !important;
    }
    @keyframes marqueeExpand {
      0%   { clip-path: polygon(0 0, 0 0, 0 0, 0 0); }
      100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
    }
    .swarm-size-pill {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background-color: #000000 !important;
      color: var(--marquee-color, #FFE600) !important;
      border: 2px solid #000000 !important;
      font-size: 10px !important;
      font-family: monospace !important;
      font-weight: 900 !important;
      padding: 2px 8px !important;
      border-radius: 8px !important;
      box-shadow: 2px 2px 0px 0px var(--marquee-color, #FFE600) !important;
      white-space: nowrap !important;
      z-index: 52 !important;
      opacity: 1 !important;
      visibility: visible !important;
    }`;

if (!content.includes(cssOld)) {
  console.error('[ERROR] cssOld not found');
  process.exit(1);
}
content = content.replace(cssOld, cssNew);
console.log('[OK] CSS updated with hotfix');

// 2. Tab switching safety in switchTab
const switchTabOld = `      if (tabId === 'profile') {
        updateProfileUI();
        renderMyActivities();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });`;

const switchTabNew = `      if (tabId === 'profile') {
        updateProfileUI();
        renderMyActivities();
      }

      // Fail-safe tab switch: Reveal all pending cards on tab navigation
      document.querySelectorAll('.swarm-draw-pending').forEach(el => {
        el.classList.remove('swarm-draw-pending');
        el.classList.add('swarm-draw-revealed');
        el.dataset.swarmRevealed = 'true';
        const m = el.querySelector('.swarm-scroll-marquee');
        if (m) m.remove();
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });`;

if (!content.includes(switchTabOld)) {
  console.error('[ERROR] switchTabOld not found');
  process.exit(1);
}
content = content.replace(switchTabOld, switchTabNew);
console.log('[OK] switchTab fail-safe updated');

// 3. Engine update: executeSwarmDraw & initScrollSwarmDraw
const engineOld = `    function executeSwarmDraw(el, peer) {
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
    }`;

const engineNew = `    function executeSwarmDraw(el, peer) {
      if (!el || el.dataset.swarmRevealed === 'true') return;
      el.dataset.swarmRevealed = 'true';

      const rect = el.getBoundingClientRect();
      const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const h = typeof window !== 'undefined' ? window.innerHeight : 768;

      // Clamp coordinates to strictly keep cursor inside viewport
      const startX = Math.max(16, Math.min(w - 40, rect.left));
      const startY = Math.max(70, Math.min(h - 40, rect.top));
      const targetX = Math.max(16, Math.min(w - 40, rect.left + rect.width - 24));
      const targetY = Math.max(70, Math.min(h - 40, rect.top + rect.height - 24));

      // Dispatch assigned peer cursor toward card corner if enabled
      if (swarmEnabled && swarmPeersState.length > 0 && !isSwarmBuildPlaying) {
        const peerObj = swarmPeersState.find(p => p.id === peer.id) || swarmPeersState[0];
        if (peerObj) {
          peerObj.x = startX;
          peerObj.y = startY;
          peerObj.targetX = targetX;
          peerObj.targetY = targetY;
          peerObj.speed = 0.12;
        }
      }

      // Create neon dashed marquee overlay
      const marquee = document.createElement('div');
      marquee.className = 'swarm-scroll-marquee';
      marquee.style.setProperty('--marquee-color', peer.color || '#FFE600');
      marquee.innerHTML = \`<span class="swarm-size-pill">w: \${Math.round(rect.width || 360)}px  h: \${Math.round(rect.height || 200)}px</span>\`;
      el.appendChild(marquee);

      // Complete reveal after 220ms or safety 350ms
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
      };

      setTimeout(revealCard, 220);
      setTimeout(revealCard, 350); // Hard safety net: never leave card stuck
    }

    function initScrollSwarmDraw() {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;

      const landingSection = document.getElementById('tab-landing');
      if (!landingSection) return;

      // Accurately target card boxes without catching section headers
      const targets = landingSection.querySelectorAll([
        '#bento-hero-banner',
        '#bento-vibe-card',
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
          el.dataset.swarmRevealed = 'true';
        });
        return;
      }

      const vh = window.innerHeight || 768;

      targets.forEach(el => {
        el.classList.add('swarm-draw-target');
        const rect = el.getBoundingClientRect();
        // Cards initially in or near the viewport are immediately revealed (CLS = 0, no flash of empty content)
        if (el.id === 'bento-hero-banner' || el.id === 'bento-vibe-card' || rect.top < vh + 60) {
          el.dataset.swarmRevealed = 'true';
          el.classList.remove('swarm-draw-pending');
          el.classList.add('swarm-draw-revealed');
        } else {
          el.classList.add('swarm-draw-pending');
        }
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            queueSwarmDraw(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '100px 0px 100px 0px' });

      targets.forEach(el => {
        if (el.dataset.swarmRevealed !== 'true') {
          observer.observe(el);
        }
      });

      window.__swarmDrawObserver = observer;

      // Fail-safe global timer: 2.5s after load, ensure ALL pending cards are revealed
      setTimeout(() => {
        document.querySelectorAll('.swarm-draw-pending').forEach(el => {
          el.classList.remove('swarm-draw-pending');
          el.classList.add('swarm-draw-revealed');
          el.dataset.swarmRevealed = 'true';
        });
      }, 2500);
    }`;

if (!content.includes(engineOld)) {
  console.error('[ERROR] engineOld not found');
  process.exit(1);
}
content = content.replace(engineOld, engineNew);
console.log('[OK] Engine updated: Precise card selectors (.grid > div), viewport clamping, 2.5s global safety net');

// Normalize line endings to Windows CRLF (\r\n)
content = content.replace(/\r?\n/g, '\r\n');

// Write to index.html and Tram_Hoc_Duong_Teen.html
fs.writeFileSync(filePath, content, 'utf8');
fs.writeFileSync(destPath, content, 'utf8');

console.log('Successfully applied all hotfixes with 100% byte parity!');
