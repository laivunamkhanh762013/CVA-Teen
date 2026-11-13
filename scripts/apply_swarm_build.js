const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
const destPath = path.join(__dirname, '..', 'Tram_Hoc_Duong_Teen.html');

let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// 1. CSS Injection
const cssTarget = `    .swarm-flying-emoji {
      position: absolute;
      font-size: 1.5rem;
      pointer-events: none;
      z-index: 56;
      animation: swarmEmojiFlyUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    /* Retro Badge Stamp Token */`;

const cssReplacement = `    .swarm-flying-emoji {
      position: absolute;
      font-size: 1.5rem;
      pointer-events: none;
      z-index: 56;
      animation: swarmEmojiFlyUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    /* Peer & User Cursor Chat Bubble */
    .swarm-cursor-chat-bubble {
      position: absolute;
      top: -36px;
      left: 12px;
      background-color: #FFFFFF;
      color: #000000;
      border: 2px solid #000000;
      border-radius: 14px;
      padding: 3px 9px;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: -0.01em;
      white-space: nowrap;
      box-shadow: 2.5px 2.5px 0px 0px #000000;
      pointer-events: none;
      user-select: none;
      z-index: 60;
      animation: cursorBubblePop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .swarm-cursor-chat-bubble::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 10px;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid #000000;
    }

    @keyframes cursorBubblePop {
      0% { transform: scale(0.6) translateY(6px); opacity: 0; }
      100% { transform: scale(1) translateY(0); opacity: 1; }
    }

    /* Selection Marquee for Swarm Page Build */
    #swarm-selection-marquee {
      position: absolute;
      border: 2px dashed #000000;
      background: rgba(255, 230, 0, 0.18);
      box-shadow: 3px 3px 0px #000000;
      border-radius: 20px;
      pointer-events: none;
      z-index: 56;
      transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1), height 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .swarm-bento-spring {
      animation: swarmBentoScaleSpring 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    @keyframes swarmBentoScaleSpring {
      0% { transform: scale(0.96); }
      60% { transform: scale(1.02); }
      100% { transform: scale(1.0); }
    }

    .user-active-chat-bubble {
      position: fixed;
      pointer-events: none;
      user-select: none;
      z-index: 60;
      background: #FFE600;
      color: #000000;
      border: 2px solid #000000;
      border-radius: 14px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 900;
      box-shadow: 3px 3px 0px 0px #000000;
      animation: cursorBubblePop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .user-active-chat-bubble::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 12px;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid #000000;
    }

    /* Retro Badge Stamp Token */`;

if (!content.includes(cssTarget)) {
  console.error('[ERROR] cssTarget not found');
  process.exit(1);
}
content = content.replace(cssTarget, cssReplacement);
console.log('[OK] CSS injected');

// 2. Overlay container and User cursor chat box
const domTarget1 = `  <!-- Swarm Cursors Multiplayer Overlay Container -->
  <div id="swarm-cursors-overlay"></div>
  
  <!-- FLOATING COLORFUL AMBIENT MESH GLOW ORBS (THÊM MÀU SẮC GEN Z) -->`;

const domReplacement1 = `  <!-- Swarm Cursors Multiplayer Overlay Container -->
  <div id="swarm-cursors-overlay">
    <div id="swarm-selection-marquee" class="hidden"></div>
  </div>

  <!-- User Cursor Chat Floating Box (Slash '/' shortcut) -->
  <div id="user-cursor-chat-box" class="fixed z-50 pointer-events-auto hidden items-center gap-1.5 bg-[#FFE600] text-black border-2 border-black px-3 py-1.5 rounded-2xl shadow-[4px_4px_0px_0px_#000000]">
    <span class="text-xs">💬</span>
    <input 
      id="user-cursor-chat-input" 
      type="text" 
      placeholder="Gõ tin nhắn dính chuột... (Enter để gửi)" 
      maxlength="50" 
      class="bg-transparent border-none text-xs font-black text-black outline-none placeholder:text-black/60 w-44 sm:w-56"
    />
    <span class="text-[9px] bg-black text-[#FFE600] px-1 py-0.2 rounded font-mono font-black">↵</span>
  </div>
  
  <!-- FLOATING COLORFUL AMBIENT MESH GLOW ORBS (THÊM MÀU SẮC GEN Z) -->`;

if (!content.includes(domTarget1)) {
  console.error('[ERROR] domTarget1 not found');
  process.exit(1);
}
content = content.replace(domTarget1, domReplacement1);
console.log('[OK] DOM overlay and chat box injected');

// 3. Header Replay Swarm Build button
const headerTarget = `        <!-- Swarm Cursors Toggle Button (Multiplayer CVA, Ctrl+M) -->
        <button 
          id="swarm-toggle-btn"
          onclick="toggleSwarmCursors()" 
          title="Bật/Tắt con trỏ học sinh CVA trực tuyến (Phím tắt: Ctrl + M)" 
          class="flex items-center gap-1.5 bg-[#CCFF00] text-black border-2 border-black px-2.5 py-1 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000000] transition-all cursor-pointer"
        >
          <span id="swarm-toggle-icon" class="text-sm">👥</span>
          <span id="swarm-toggle-label" class="hidden sm:inline text-[11px] font-black uppercase">Swarm (5)</span>
        </button>

        <!-- Sound Toggle -->`;

const headerReplacement = `        <!-- Swarm Cursors Toggle Button (Multiplayer CVA, Ctrl+M) -->
        <button 
          id="swarm-toggle-btn"
          onclick="toggleSwarmCursors()" 
          title="Bật/Tắt con trỏ học sinh CVA trực tuyến (Phím tắt: Ctrl + M)" 
          class="flex items-center gap-1.5 bg-[#CCFF00] text-black border-2 border-black px-2.5 py-1 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000000] transition-all cursor-pointer"
        >
          <span id="swarm-toggle-icon" class="text-sm">👥</span>
          <span id="swarm-toggle-label" class="hidden sm:inline text-[11px] font-black uppercase">Swarm (5)</span>
        </button>

        <!-- Replay Swarm Build Button -->
        <button 
          id="replay-swarm-build-btn"
          onclick="triggerSwarmBuildIntro(true)" 
          title="Xem lại hiệu ứng đàn con trỏ cùng dựng trang (Figma Swarm Build)" 
          class="flex items-center gap-1.5 bg-[#FFE600] text-black border-2 border-black px-2.5 py-1 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000000] transition-all cursor-pointer"
        >
          <span>🚀</span>
          <span class="hidden md:inline text-[11px] font-black uppercase">Swarm Build</span>
        </button>

        <!-- Sound Toggle -->`;

if (!content.includes(headerTarget)) {
  console.error('[ERROR] headerTarget not found');
  process.exit(1);
}
content = content.replace(headerTarget, headerReplacement);
console.log('[OK] Header replay button injected');

// 4. Bento Hero Banner with IDs and Stamps
const bentoTarget = `      <!-- BENTO GRID HERO SECTION (AESTHETIC & HARMONIOUS) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        <!-- Bento 1: Main Hero Banner (Col span 2) -->
        <div class="md:col-span-2 relative bg-white dark:bg-zinc-900 border-2 sm:border-3 border-black dark:border-zinc-700 rounded-3xl p-6 sm:p-7 shadow-[6px_6px_0px_0px_#000000] dark:shadow-[6px_6px_0px_0px_#CCFF00] hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_#000000] dark:hover:shadow-[8px_8px_0px_0px_#CCFF00] transition-all overflow-hidden flex flex-col justify-between group">
          
          <!-- Top Right Floating Sticker Stamp -->
          <div class="absolute -top-1 -right-1 rotate-6 hidden sm:flex items-center gap-1 bg-[#FFE600] text-black border-2 border-black px-3 py-1 rounded-2xl shadow-[3px_3px_0px_0px_#000000] text-[10px] font-black uppercase tracking-widest z-0 pointer-events-none select-none">
            <span>⚡</span> 100% CVA GEN Z
          </div>

          <div class="space-y-3 relative z-10">
            <!-- School Brand Tag -->
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFF00] border-2 border-black text-black text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000000]">
                <img src="logo.png" onerror="this.onerror=null; this.src=CVA_LOGO;" alt="CVA" class="w-3.5 h-3.5 rounded-full object-contain" />
                <span>THCS Chu Văn An</span>
              </span>
              <span class="retro-stamp bg-black text-[#FFE600] sticker-tilt-right">
                #TRẠM_TEEN_2026
              </span>
            </div>

            <!-- Clean Hero Title -->
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight uppercase leading-tight font-display">
              TRẠM HỌC ĐƯỜNG TEEN <span class="inline-block bg-[#FFE600] text-black px-2 py-0.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000000] -rotate-1 text-2xl sm:text-3xl md:text-4xl">CVA</span>
            </h2>`;

const bentoReplacement = `      <!-- BENTO GRID HERO SECTION (AESTHETIC & HARMONIOUS) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        <!-- Bento 1: Main Hero Banner (Col span 2) -->
        <div id="bento-hero-banner" class="md:col-span-2 relative bg-white dark:bg-zinc-900 border-2 sm:border-3 border-black dark:border-zinc-700 rounded-3xl p-6 sm:p-7 shadow-[6px_6px_0px_0px_#000000] dark:shadow-[6px_6px_0px_0px_#CCFF00] hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_#000000] dark:hover:shadow-[8px_8px_0px_0px_#CCFF00] transition-all overflow-hidden flex flex-col justify-between group">
          
          <!-- Top Right Floating Sticker Stamp -->
          <div class="absolute -top-1 -right-1 rotate-6 hidden sm:flex items-center gap-1 bg-[#FFE600] text-black border-2 border-black px-3 py-1 rounded-2xl shadow-[3px_3px_0px_0px_#000000] text-[10px] font-black uppercase tracking-widest z-0 pointer-events-none select-none">
            <span>⚡</span> 100% CVA GEN Z
          </div>

          <div class="space-y-3 relative z-10">
            <!-- School Brand Tag -->
            <div class="flex items-center gap-2 flex-wrap">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFF00] border-2 border-black text-black text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000000]">
                <img src="logo.png" onerror="this.onerror=null; this.src=CVA_LOGO;" alt="CVA" class="w-3.5 h-3.5 rounded-full object-contain" />
                <span>THCS Chu Văn An</span>
              </span>
              <span class="retro-stamp bg-black text-[#FFE600] sticker-tilt-right">
                #TRẠM_TEEN_2026
              </span>
              <span id="hero-stamp-cva-hot" class="retro-stamp bg-[#FF007A] text-white -rotate-2">🔥 #CVA_HOT</span>
              <span id="hero-stamp-aura" class="retro-stamp bg-[#FFE600] text-black rotate-1">⚡ #AURA_1000</span>
            </div>

            <!-- Clean Hero Title -->
            <h2 id="hero-main-title" class="text-3xl sm:text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight uppercase leading-tight font-display">
              TRẠM HỌC ĐƯỜNG TEEN <span class="inline-block bg-[#FFE600] text-black px-2 py-0.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000000] -rotate-1 text-2xl sm:text-3xl md:text-4xl">CVA</span>
            </h2>`;

if (!content.includes(bentoTarget)) {
  console.error('[ERROR] bentoTarget not found');
  process.exit(1);
}
content = content.replace(bentoTarget, bentoReplacement);
console.log('[OK] Bento Hero Banner updated with IDs and stamps');

// 5. Command Palette items
const cpTarget = `        { icon: '👥', title: 'Bật / Tắt Swarm Cursors (Ctrl+M)', desc: 'Đàn con trỏ học sinh CVA trực tuyến cùng tương tác thời gian thực', action: () => { toggleSwarmCursors(); } },
        { icon: '🌓', title: 'Đổi giao diện Tối / Sáng (Dark / Light Mode)', desc: 'Phím tắt Ctrl+D • Midnight Cyber hoặc Clean Pastel', action: () => { toggleThemeMode(); } },`;

const cpReplacement = `        { icon: '👥', title: 'Bật / Tắt Swarm Cursors (Ctrl+M)', desc: 'Đàn con trỏ học sinh CVA trực tuyến cùng tương tác thời gian thực', action: () => { toggleSwarmCursors(); } },
        { icon: '🚀', title: 'Xem lại Swarm Landing Page Build', desc: 'Đàn con trỏ Figma cùng kéo khung, gõ chữ dựng trang', action: () => { switchTab('landing'); triggerSwarmBuildIntro(true); } },
        { icon: '💬', title: 'Figma Cursor Chat (Phím /)', desc: 'Mở ô chat dính theo chuột để trò chuyện với bạn học ảo', action: () => { openUserCursorChat(); } },
        { icon: '🌓', title: 'Đổi giao diện Tối / Sáng (Dark / Light Mode)', desc: 'Phím tắt Ctrl+D • Midnight Cyber hoặc Clean Pastel', action: () => { toggleThemeMode(); } },`;

if (!content.includes(cpTarget)) {
  console.error('[ERROR] cpTarget not found');
  process.exit(1);
}
content = content.replace(cpTarget, cpReplacement);
console.log('[OK] Command Palette items injected');

// 6. Keydown listener
const kdTarget = `      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleSwarmCursors();
        return;
      }

      if (e.key === 'Escape') {
        if (isPaletteOpen) closeCommandPalette();
        if (isLightboxOpen) closeLightbox();
        if (isStoryOpen) closeStoryViewer();
        return;
      }`;

const kdReplacement = `      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleSwarmCursors();
        return;
      }

      if (e.key === 'Escape') {
        if (isPaletteOpen) closeCommandPalette();
        if (isLightboxOpen) closeLightbox();
        if (isStoryOpen) closeStoryViewer();
        if (typeof closeUserCursorChat === 'function') closeUserCursorChat();
        return;
      }

      // Figma Cursor Chat: Slash key '/' opens floating input at cursor
      if (e.key === '/' && !isPaletteOpen && !isLightboxOpen && !isStoryOpen) {
        const activeTag = document.activeElement ? document.activeElement.tagName : '';
        const isEditable = document.activeElement ? document.activeElement.isContentEditable : false;
        if (!['INPUT', 'TEXTAREA'].includes(activeTag) && !isEditable) {
          e.preventDefault();
          if (typeof openUserCursorChat === 'function') openUserCursorChat();
          return;
        }
      }`;

if (!content.includes(kdTarget)) {
  console.error('[ERROR] kdTarget not found');
  process.exit(1);
}
content = content.replace(kdTarget, kdReplacement);
console.log('[OK] Keydown listener updated');

// 7. Swarm Cursors Engine Enhancements
const swarmEngineTarget = `    let swarmEnabled = true;
    let swarmAnimId = null;
    let userMouseX = -100;
    let userMouseY = -100;
    let userMouseActiveTime = 0;
    let swarmPeersState = [];

    function initSwarmCursors() {
      const saved = localStorage.getItem(SWARM_STORAGE_KEY);
      swarmEnabled = saved === null ? true : saved === 'true';

      let overlay = document.getElementById('swarm-cursors-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'swarm-cursors-overlay';
        document.body.appendChild(overlay);
      }

      updateSwarmToggleButton();

      if (!swarmEnabled) {
        overlay.style.display = 'none';
        return;
      }
      overlay.style.display = 'block';

      // Setup peers initial positions
      const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const h = typeof window !== 'undefined' ? window.innerHeight : 768;

      overlay.innerHTML = '';
      swarmPeersState = SWARM_PEERS.map((peer, idx) => {
        const startX = Math.random() * (w - 150) + 50;
        const startY = Math.random() * (h - 200) + 100;

        const cursorEl = document.createElement('div');
        cursorEl.id = \`swarm-cursor-\${peer.id}\`;
        cursorEl.className = 'swarm-cursor-item';
        cursorEl.style.transform = \`translate(\${startX}px, \${startY}px)\`;

        cursorEl.innerHTML = \`
          <svg class="swarm-cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 2L20 12L13 14L9 22L4 2Z" fill="\${peer.color}" stroke="#000000" stroke-width="2.2" stroke-linejoin="round"/>
          </svg>
          <div id="swarm-bubble-\${peer.id}" class="swarm-thought-bubble opacity-0 scale-95" style="border-color: #000000;">
            \${peer.bubbles[0]}
          </div>
          <div class="swarm-name-tag" style="background-color: \${peer.badgeColor}; color: \${peer.textColor};">
            <span>\${peer.avatar}</span>
            <span>\${peer.name}</span>
            <span class="bg-black text-[#FFE600] px-1 py-0.2 rounded text-[8px] font-mono border border-black">\${peer.grade}</span>
          </div>
        \`;

        overlay.appendChild(cursorEl);

        return {
          ...peer,
          x: startX,
          y: startY,
          targetX: startX,
          targetY: startY,
          speed: 0.025 + Math.random() * 0.02,
          state: 'move', // 'move', 'pause', 'click'
          timer: Math.floor(Math.random() * 120) + 60,
          bubbleTimer: 0,
          el: cursorEl,
          bubbleEl: cursorEl.querySelector('.swarm-thought-bubble')
        };
      });

      // Track user mouse for social interaction
      window.addEventListener('mousemove', (e) => {
        userMouseX = e.clientX;
        userMouseY = e.clientY;
        userMouseActiveTime = Date.now();
      }, { passive: true });

      startSwarmLoop();
    }
    window.initSwarmCursors = initSwarmCursors;`;

const swarmEngineReplacement = `    let swarmEnabled = true;
    let swarmAnimId = null;
    let userMouseX = -100;
    let userMouseY = -100;
    let userMouseActiveTime = 0;
    let swarmPeersState = [];
    let isSwarmBuildPlaying = false;
    let swarmChatQuotesTimer = 0;
    let userChatActiveBubble = null;
    let userChatBubbleTimer = null;

    const SWARM_CHAT_QUOTES = [
      "Web CVA nhìn chiến ghê ⚡",
      "Ai để quên Casio 580 phòng Tin học lên nhận nè 😭",
      "Pass trọn bộ đề thi thử vào 10 Toán - Văn 0đ nha! 📚",
      "Bốc trúng quẻ May Mắn Đại Cát +10 Aura ✨",
      "Giờ ra chơi tụ tập căn-tin uống trà sữa hông? 🧋",
      "Sân trường trực tuyến đang có 42 bạn online kìa! 🎮",
      "Check VAR câu hỏi bí mật bảo mật 100% luôn! 🔒"
    ];

    function showPeerChat(peer, text, duration = 3000) {
      if (!peer || !peer.el) return;
      let bubble = peer.el.querySelector('.swarm-cursor-chat-bubble');
      if (!bubble) {
        bubble = document.createElement('div');
        bubble.className = 'swarm-cursor-chat-bubble';
        peer.el.appendChild(bubble);
      }
      bubble.textContent = text;
      bubble.classList.remove('hidden');
      bubble.style.display = 'block';
      if (peer.chatTimer) clearTimeout(peer.chatTimer);
      peer.chatTimer = setTimeout(() => {
        if (bubble) bubble.style.display = 'none';
      }, duration);
    }
    window.showPeerChat = showPeerChat;

    function openUserCursorChat(x, y) {
      const box = document.getElementById('user-cursor-chat-box');
      const input = document.getElementById('user-cursor-chat-input');
      if (!box || !input) return;

      const posX = typeof x === 'number' && x >= 0 ? x : Math.max(20, userMouseX >= 0 ? userMouseX : ((typeof window !== 'undefined' ? window.innerWidth : 1024) / 2) - 100);
      const posY = typeof y === 'number' && y >= 0 ? y : Math.max(60, userMouseY >= 0 ? userMouseY : ((typeof window !== 'undefined' ? window.innerHeight : 768) / 2) - 50);

      const maxW = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const maxH = typeof window !== 'undefined' ? window.innerHeight : 768;
      const clampedX = Math.min(Math.max(10, posX + 12), maxW - 270);
      const clampedY = Math.min(Math.max(50, posY - 45), maxH - 60);

      box.style.left = \`\${clampedX}px\`;
      box.style.top = \`\${clampedY}px\`;
      box.classList.remove('hidden');
      box.classList.add('flex');
      input.value = '';
      setTimeout(() => input.focus(), 30);
      if (typeof playCuteSound === 'function') playCuteSound('pop');
    }
    window.openUserCursorChat = openUserCursorChat;

    function closeUserCursorChat() {
      const box = document.getElementById('user-cursor-chat-box');
      if (!box) return;
      box.classList.add('hidden');
      box.classList.remove('flex');
    }
    window.closeUserCursorChat = closeUserCursorChat;

    function submitUserCursorChat(text) {
      if (!text || !text.trim()) {
        closeUserCursorChat();
        return;
      }
      const cleanText = text.trim();
      closeUserCursorChat();

      if (userChatActiveBubble) {
        userChatActiveBubble.remove();
        userChatActiveBubble = null;
      }
      if (userChatBubbleTimer) clearTimeout(userChatBubbleTimer);

      const maxW = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const maxH = typeof window !== 'undefined' ? window.innerHeight : 768;
      const bubble = document.createElement('div');
      bubble.className = 'user-active-chat-bubble';
      bubble.textContent = \`💬 \${cleanText}\`;
      const x = Math.min(Math.max(10, userMouseX >= 0 ? userMouseX + 15 : 200), maxW - 220);
      const y = Math.min(Math.max(50, userMouseY >= 0 ? userMouseY - 45 : 150), maxH - 50);
      bubble.style.left = \`\${x}px\`;
      bubble.style.top = \`\${y}px\`;
      document.body.appendChild(bubble);
      userChatActiveBubble = bubble;

      if (typeof playCuteSound === 'function') playCuteSound('pop');

      if (swarmPeersState && swarmPeersState.length > 0) {
        const responder = swarmPeersState[Math.floor(Math.random() * Math.min(2, swarmPeersState.length))];
        if (responder) {
          responder.targetX = Math.max(30, x + 50 + (Math.random() - 0.5) * 60);
          responder.targetY = Math.max(80, y + 40 + (Math.random() - 0.5) * 40);
          responder.speed = 0.05;
          setTimeout(() => {
            showPeerChat(responder, Math.random() < 0.5 ? 'Okie bạn êi! ✨' : 'Thả tim nè! ❤️', 3000);
            triggerPeerClickEffect(responder.x, responder.y, responder);
          }, 600);
        }
      }

      userChatBubbleTimer = setTimeout(() => {
        if (userChatActiveBubble) {
          userChatActiveBubble.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          userChatActiveBubble.style.opacity = '0';
          userChatActiveBubble.style.transform = 'translateY(-10px)';
          setTimeout(() => {
            if (userChatActiveBubble) {
              userChatActiveBubble.remove();
              userChatActiveBubble = null;
            }
          }, 400);
        }
      }, 4000);
    }
    window.submitUserCursorChat = submitUserCursorChat;

    function initSwarmCursors() {
      const saved = localStorage.getItem(SWARM_STORAGE_KEY);
      swarmEnabled = saved === null ? true : saved === 'true';

      let overlay = document.getElementById('swarm-cursors-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'swarm-cursors-overlay';
        document.body.appendChild(overlay);
      }

      let marquee = document.getElementById('swarm-selection-marquee');
      overlay.innerHTML = '';
      if (!marquee) {
        marquee = document.createElement('div');
        marquee.id = 'swarm-selection-marquee';
        marquee.className = 'hidden';
      }
      overlay.appendChild(marquee);

      updateSwarmToggleButton();

      if (!swarmEnabled) {
        overlay.style.display = 'none';
        return;
      }
      overlay.style.display = 'block';

      // Setup peers initial positions
      const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const h = typeof window !== 'undefined' ? window.innerHeight : 768;

      swarmPeersState = SWARM_PEERS.map((peer, idx) => {
        const startX = Math.random() * (w - 150) + 50;
        const startY = Math.random() * (h - 200) + 100;

        const cursorEl = document.createElement('div');
        cursorEl.id = \`swarm-cursor-\${peer.id}\`;
        cursorEl.className = 'swarm-cursor-item';
        cursorEl.style.transform = \`translate(\${startX}px, \${startY}px)\`;

        cursorEl.innerHTML = \`
          <svg class="swarm-cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 2L20 12L13 14L9 22L4 2Z" fill="\${peer.color}" stroke="#000000" stroke-width="2.2" stroke-linejoin="round"/>
          </svg>
          <div id="swarm-bubble-\${peer.id}" class="swarm-thought-bubble opacity-0 scale-95" style="border-color: #000000;">
            \${peer.bubbles[0]}
          </div>
          <div class="swarm-name-tag" style="background-color: \${peer.badgeColor}; color: \${peer.textColor};">
            <span>\${peer.avatar}</span>
            <span>\${peer.name}</span>
            <span class="bg-black text-[#FFE600] px-1 py-0.2 rounded text-[8px] font-mono border border-black">\${peer.grade}</span>
          </div>
          <div class="swarm-cursor-chat-bubble hidden"></div>
        \`;

        overlay.appendChild(cursorEl);

        return {
          ...peer,
          x: startX,
          y: startY,
          targetX: startX,
          targetY: startY,
          speed: 0.025 + Math.random() * 0.02,
          state: 'move', // 'move', 'pause', 'click'
          timer: Math.floor(Math.random() * 120) + 60,
          bubbleTimer: 0,
          chatTimer: null,
          el: cursorEl,
          bubbleEl: cursorEl.querySelector('.swarm-thought-bubble')
        };
      });

      // Track user mouse for social interaction
      window.addEventListener('mousemove', (e) => {
        userMouseX = e.clientX;
        userMouseY = e.clientY;
        userMouseActiveTime = Date.now();
      }, { passive: true });

      startSwarmLoop();
    }
    window.initSwarmCursors = initSwarmCursors;`;

if (!content.includes(swarmEngineTarget)) {
  console.error('[ERROR] swarmEngineTarget not found');
  process.exit(1);
}
content = content.replace(swarmEngineTarget, swarmEngineReplacement);
console.log('[OK] Swarm Engine init & chat functions injected');

// 8. Swarm Loop & Build Intro timeline
const loopTarget = `        if (dist > 3) {
          p.x += dx * p.speed;
          p.y += dy * p.speed;
        }

        p.el.style.transform = \`translate(\${p.x.toFixed(1)}px, \${p.y.toFixed(1)}px)\`;

        // State machine
        p.timer--;`;

const loopReplacement = `        if (dist > 1) {
          p.x += dx * p.speed;
          p.y += dy * p.speed;
        }

        p.el.style.transform = \`translate(\${p.x.toFixed(1)}px, \${p.y.toFixed(1)}px)\`;

        if (isSwarmBuildPlaying) return; // Build animation controls cursors directly!

        // State machine
        p.timer--;`;

if (!content.includes(loopTarget)) {
  console.error('[ERROR] loopTarget not found');
  process.exit(1);
}
content = content.replace(loopTarget, loopReplacement);
console.log('[OK] Swarm Loop build pause condition injected');

// 9. Periodic chat quotes in loop & triggerSwarmBuildIntro function
const toggleTarget = `    function toggleSwarmCursors() {`;

const toggleReplacement = `    function triggerSwarmBuildIntro(isManual = false) {
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

      const bentoHero = document.getElementById('bento-hero-banner');
      const heroTitle = document.getElementById('hero-main-title');
      const storiesContainer = document.getElementById('stories-container');
      const vibeBtn = document.getElementById('vibe-check-btn');
      const stampHot = document.getElementById('hero-stamp-cva-hot');
      const stampAura = document.getElementById('hero-stamp-aura');
      const marquee = document.getElementById('swarm-selection-marquee');

      const bentoRect = bentoHero ? bentoHero.getBoundingClientRect() : { left: 160, top: 180, width: 520, height: 240 };
      const heroLeft = bentoRect.left;
      const heroTop = bentoRect.top;
      const heroW = bentoRect.width || 520;
      const heroH = bentoRect.height || 240;

      // Act 1 (0.0s - 0.5s): Minh Trí drags selection marquee
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
        marquee.style.width = '20px';
        marquee.style.height = '20px';
        marquee.innerHTML = \`<span class="absolute bottom-1 right-1 bg-black text-[#FFE600] px-1.5 py-0.5 rounded text-[9px] font-mono font-black border border-black shadow-[1px_1px_0px_0px_#000000]">w: \${Math.round(heroW)}px  h: \${Math.round(heroH)}px</span>\`;
        setTimeout(() => {
          if (marquee) {
            marquee.style.width = \`\${heroW}px\`;
            marquee.style.height = \`\${heroH}px\`;
          }
        }, 50);
      }

      setTimeout(() => {
        if (marquee) {
          marquee.classList.add('hidden');
          marquee.style.display = 'none';
        }
        if (bentoHero) {
          bentoHero.classList.add('swarm-bento-spring');
          setTimeout(() => bentoHero.classList.remove('swarm-bento-spring'), 400);
        }
        if (p2) {
          showPeerChat(p2, 'Kéo khung Bento Hero chuẩn rồi nha! 📐', 2200);
          triggerPeerClickEffect(p2.x, p2.y, p2);
        }
      }, 500);

      // Act 2 (0.4s - 1.1s): Linh Đan types hero title
      setTimeout(() => {
        const titleRect = heroTitle ? heroTitle.getBoundingClientRect() : { left: heroLeft + 20, top: heroTop + 40, width: 300, height: 60 };
        if (p1) {
          p1.targetX = titleRect.left + 80;
          p1.targetY = titleRect.top + 20;
          p1.speed = 0.07;
        }

        if (heroTitle) {
          const badgeHTML = \`<span class="inline-block bg-[#FFE600] text-black px-2 py-0.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000000] -rotate-1 text-2xl sm:text-3xl md:text-4xl">CVA</span>\`;
          const fullText = "TRẠM HỌC ĐƯỜNG TEEN";
          let charIdx = 0;
          const typeInterval = setInterval(() => {
            charIdx += 2;
            if (charIdx <= fullText.length) {
              heroTitle.innerHTML = \`\${fullText.slice(0, charIdx)}<span class="inline-block border-r-4 border-[#FF007A] animate-pulse ml-1">&nbsp;</span>\`;
            } else {
              clearInterval(typeInterval);
              heroTitle.innerHTML = \`\${fullText} \${badgeHTML}\`;
              if (p1) {
                showPeerChat(p1, 'Set font Space Grotesk 900 cực cháy! ⚡', 2200);
                triggerPeerClickEffect(p1.x, p1.y, p1);
              }
            }
          }, 35);
        }
      }, 450);

      // Act 3 (0.9s - 1.5s): Bảo Anh staggered stories & stamp pop
      setTimeout(() => {
        const storiesRect = storiesContainer ? storiesContainer.getBoundingClientRect() : { left: heroLeft, top: heroTop - 90, width: 500, height: 70 };
        if (p3) {
          p3.targetX = storiesRect.left + 150;
          p3.targetY = storiesRect.top + 30;
          p3.speed = 0.07;
        }

        if (storiesContainer) {
          const storyNodes = storiesContainer.querySelectorAll('.group');
          storyNodes.forEach((node, idx) => {
            setTimeout(() => {
              node.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
              node.style.transform = 'scale(1.15)';
              setTimeout(() => { node.style.transform = ''; }, 180);
            }, idx * 60);
          });
        }

        setTimeout(() => {
          if (stampHot) {
            stampHot.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
            stampHot.style.transform = 'scale(1.3) rotate(-6deg)';
            setTimeout(() => { stampHot.style.transform = ''; }, 220);
          }
          if (stampAura) {
            stampAura.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
            stampAura.style.transform = 'scale(1.3) rotate(6deg)';
            setTimeout(() => { stampAura.style.transform = ''; }, 220);
          }
          if (p3) {
            const hotRect = stampHot ? stampHot.getBoundingClientRect() : { left: heroLeft + 120, top: heroTop + 30 };
            p3.targetX = hotRect.left + 20;
            p3.targetY = hotRect.top + 10;
            triggerPeerClickEffect(hotRect.left + 10, hotRect.top + 5, p3);
            showPeerChat(p3, 'Đóng dấu tem chính chủ Chu Văn An! 🏷️', 2200);
          }
        }, 350);
      }, 900);

      // Act 4 (1.4s - 2.0s): Hoàng Nam clicks Vibe Check + Confetti burst
      setTimeout(() => {
        const vibeRect = vibeBtn ? vibeBtn.getBoundingClientRect() : { left: heroLeft + heroW + 20, top: heroTop + 80, width: 180, height: 45 };
        if (p4) {
          p4.targetX = vibeRect.left + (vibeRect.width / 2);
          p4.targetY = vibeRect.top + (vibeRect.height / 2);
          p4.speed = 0.08;
        }

        setTimeout(() => {
          if (vibeBtn) {
            vibeBtn.style.transition = 'transform 0.15s ease';
            vibeBtn.style.transform = 'translate(2px, 2px)';
            setTimeout(() => { vibeBtn.style.transform = ''; }, 180);
          }
          if (p4) {
            triggerPeerClickEffect(p4.x, p4.y, p4);
            showPeerChat(p4, 'Xong kèo! Trang lên sóng toàn trường rồi anh em ơi! 🚀🎉', 2600);
          }

          if (typeof confetti === 'function') {
            try {
              confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FFE600', '#CCFF00', '#FF007A', '#00F0FF', '#000000']
              });
            } catch(e) {}
          }
        }, 250);
      }, 1400);

      setTimeout(() => {
        isSwarmBuildPlaying = false;
        if (!swarmEnabled && overlay) {
          overlay.style.display = 'none';
        }
        if (isManual && typeof showTeenToast === 'function') {
          showTeenToast("Hoàn thành dựng trang Swarm Landing Page! 🚀🎉", "⚡");
        }
      }, 2100);
    }
    window.triggerSwarmBuildIntro = triggerSwarmBuildIntro;

    function toggleSwarmCursors() {`;

if (!content.includes(toggleTarget)) {
  console.error('[ERROR] toggleTarget not found');
  process.exit(1);
}
content = content.replace(toggleTarget, toggleReplacement);
console.log('[OK] Swarm Build Intro injected');

// In updateSwarmLoop, add the periodic chat ticker
const loopEndTarget = `      if (typeof requestAnimationFrame === 'function') {
        swarmAnimId = requestAnimationFrame(updateSwarmLoop);
      }
    }

    function startSwarmLoop() {`;

const loopEndReplacement = `      // Periodic Figma Cursor Chat Quotes (~every 6-8 seconds)
      swarmChatQuotesTimer++;
      if (swarmChatQuotesTimer > 420) {
        swarmChatQuotesTimer = 0;
        if (!isSwarmBuildPlaying && swarmPeersState.length > 0) {
          const randPeer = swarmPeersState[Math.floor(Math.random() * swarmPeersState.length)];
          const quote = SWARM_CHAT_QUOTES[Math.floor(Math.random() * SWARM_CHAT_QUOTES.length)];
          showPeerChat(randPeer, quote, 3500);
        }
      }

      if (typeof requestAnimationFrame === 'function') {
        swarmAnimId = requestAnimationFrame(updateSwarmLoop);
      }
    }

    function startSwarmLoop() {`;

if (!content.includes(loopEndTarget)) {
  console.error('[ERROR] loopEndTarget not found');
  process.exit(1);
}
content = content.replace(loopEndTarget, loopEndReplacement);
console.log('[OK] Swarm periodic chat quote ticker injected');

// 10. DOMContentLoaded bindings
const dclTarget = `      safeRun(initSwarmCursors, 'initSwarmCursors');

      // Click outside to close post dropdown menus`;

const dclReplacement = `      safeRun(initSwarmCursors, 'initSwarmCursors');
      safeRun(() => {
        setTimeout(() => {
          try {
            if (!sessionStorage.getItem('cva_swarm_built')) {
              sessionStorage.setItem('cva_swarm_built', '1');
              triggerSwarmBuildIntro(false);
            }
          } catch(e) {}
        }, 600);
      }, 'triggerSwarmBuildIntroAuto');

      // Cursor Chat input enter/escape
      const chatInput = document.getElementById('user-cursor-chat-input');
      if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submitUserCursorChat(chatInput.value);
          } else if (e.key === 'Escape') {
            e.preventDefault();
            closeUserCursorChat();
          }
        });
      }

      // Click outside to close user cursor chat box
      document.addEventListener('click', (e) => {
        const chatBox = document.getElementById('user-cursor-chat-box');
        if (chatBox && !chatBox.classList.contains('hidden')) {
          if (!chatBox.contains(e.target)) {
            closeUserCursorChat();
          }
        }
      });

      // Click outside to close post dropdown menus`;

if (!content.includes(dclTarget)) {
  console.error('[ERROR] dclTarget not found');
  process.exit(1);
}
content = content.replace(dclTarget, dclReplacement);
console.log('[OK] DOMContentLoaded event bindings injected');

// Normalize line endings to Windows CRLF (\r\n)
content = content.replace(/\r?\n/g, '\r\n');

// Write to index.html and Tram_Hoc_Duong_Teen.html
fs.writeFileSync(filePath, content, 'utf8');
fs.writeFileSync(destPath, content, 'utf8');

console.log('Successfully updated both index.html and Tram_Hoc_Duong_Teen.html with 100% byte parity!');
