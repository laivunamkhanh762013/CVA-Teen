# Đặc Tả Kỹ Thuật: Swarm Atomic Draw Cho Mục "Đài Phát Thanh CVA"

## 1. Mục Tiêu & Trải Nghiệm Người Dùng
- **Bối cảnh**: Mục "Đài Phát Thanh CVA" (Live Threads Feed) hiển thị các bài viết thất lạc, sách 0đ và tâm sự confession từ cộng đồng Chu Văn An.
- **Vấn đề trước đây**: Khi người dùng cuộn đến mục Đài Phát Thanh CVA, không có hiệu ứng Swarm Multiplayer Draw nào kích hoạt.
- **Yêu cầu cốt lõi**:
  1. Ban đầu khu vực Đài Phát Thanh CVA hoàn toàn trống trơn (100% blank, CLS = 0).
  2. Khi cuộn tới:
     - **Bước 1**: Con trỏ peer bay tới kéo viền marquee dạ quang quanh thanh header `#radio-broadcast-header` (chứa tiêu đề "📻 Đài Phát Thanh CVA", badge LIVE, và 3 nút lọc `#radio-sort-pills`) $\rightarrow$ Bung nở nảy pop! Đồng thời `drawCardButtons` kéo vẽ các nút lọc.
     - **Bước 2**: Đàn chuột kéo viền marquee neon từng thẻ bài viết `.thread-card` trong `#landing-threads-feed` $\rightarrow$ Thẻ bài viết bung nở nảy pop!
     - **Bước 3**: Bên trong mỗi thẻ bài viết, đàn chuột tiếp tục kéo vẽ vi mô các nút tương tác (Tim/Like, Trả lời/Reply, Chi tiết/Check VAR) $\rightarrow$ Bung nở hoàn tất!
  3. Khi chuyển đổi bộ lọc ("Dành cho bạn", "Mới nhất", "Thịnh hành"): Các thẻ thread mới render cũng nhận trạng thái pending và được đàn chuột kéo vẽ sinh động nếu đang trong tầm mắt.

---

## 2. Chi Tiết Kỹ Thuật & Thay Đổi Cần Triển Khai

### A. Markup HTML
Vị trí: Khoảng dòng 1883 trong `index.html` và `Tram_Hoc_Duong_Teen.html`.
- Cập nhật thẻ container bao quanh:
  ```html
  <!-- ĐÀI PHÁT THANH CVA (LIVE THREADS FEED & SOCIAL FEED SORTER) -->
  <div id="cva-radio-broadcast" class="space-y-4 pt-2">
  ```
- Cập nhật thanh tiêu đề & bộ lọc:
  ```html
  <div id="radio-broadcast-header" class="swarm-draw-target swarm-draw-pending flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FFE600] relative">
    <div class="flex items-center gap-2">
      <h3 class="text-xs sm:text-sm font-black text-black dark:text-white flex items-center gap-1.5 uppercase font-display">
        <span>📻 Đài Phát Thanh CVA</span>
        <span class="text-[9px] bg-[#FF007A] text-white px-2 py-0.5 rounded-full font-black uppercase border border-black shadow-[1px_1px_0px_0px_#000000] animate-pulse">Live</span>
      </h3>
      <span class="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 hidden sm:inline">• Bảng tin mạng xã hội</span>
    </div>

    <!-- Feed Sorter Pills -->
    <div id="radio-sort-pills" class="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 p-1.5 rounded-2xl border-2 border-black dark:border-zinc-700 text-xs font-black">
      <button id="sort-btn-foryou" onclick="setFeedSort('foryou', this)" class="feed-sort-btn active bg-black text-[#FFE600] border-2 border-black px-3 py-1.5 rounded-xl uppercase text-[10px] sm:text-xs font-black shadow-[2px_2px_0px_0px_#000000] cursor-pointer">🔥 Dành cho bạn</button>
      <button id="sort-btn-latest" onclick="setFeedSort('latest', this)" class="feed-sort-btn bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-700 hover:bg-zinc-100 px-3 py-1.5 rounded-xl uppercase text-[10px] sm:text-xs font-bold shadow-[1px_1px_0px_0px_#000000] cursor-pointer">⏱️ Mới nhất</button>
      <button id="sort-btn-popular" onclick="setFeedSort('popular', this)" class="feed-sort-btn bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-700 hover:bg-zinc-100 px-3 py-1.5 rounded-xl uppercase text-[10px] sm:text-xs font-bold shadow-[1px_1px_0px_0px_#000000] cursor-pointer">⚡ Thịnh hành</button>
    </div>
  </div>
  ```

### B. JavaScript: `buildThreadCardHTML`
- Trong hàm `buildThreadCardHTML(item, type)`:
  Thêm class `swarm-draw-target swarm-draw-pending` vào wrapper `.thread-card`:
  ```javascript
  return `
    <div class="thread-card swarm-draw-target swarm-draw-pending bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#CCFF00] space-y-3 relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000000]">
  ...
  ```

### C. JavaScript: `renderLandingFeed`
- Sau khi append các card vào container:
  ```javascript
  if (typeof window !== 'undefined' && window.__swarmDrawObserver) {
    const cards = container.querySelectorAll('.thread-card');
    cards.forEach(c => {
      if (!c.dataset || c.dataset.swarmRevealed !== 'true') {
        window.__swarmDrawObserver.observe(c);
      }
    });
  } else if (typeof IntersectionObserver === 'undefined') {
    container.querySelectorAll('.thread-card').forEach(el => {
      el.classList.remove('swarm-draw-pending');
      el.classList.add('swarm-draw-revealed');
      if (el.dataset) el.dataset.swarmRevealed = 'true';
    });
  }
  ```

### D. JavaScript: `initScrollSwarmDraw`
- Bổ sung `'#radio-broadcast-header'` và `'#landing-threads-feed .thread-card'` vào querySelectorAll array:
  ```javascript
  const targets = landingSection.querySelectorAll([
    '#bento-hero-banner',
    '#bento-vibe-card',
    '#landing-live-stats > div',
    '#quizizz-live-lobby',
    '#cva-weekly-poll',
    '#radio-broadcast-header',
    '#landing-threads-feed .thread-card',
    '#landing-faqs-accordion',
    '#landing-final-cta',
    '#landing-problem-agitation .grid > div',
    '#cva-pillars-showcase .grid > div',
    '#landing-testimonials .grid > div'
  ].join(', '));
  ```

---

## 3. Ràng Buộc & Tiêu Chuẩn Nghiệm Thu
- 100% Bitwise Parity giữa `index.html` và `Tram_Hoc_Duong_Teen.html`.
- Toàn bộ 12 test suites hiện tại vẫn phải PASS 100%.
- Viết test suite mới `verify_radio_swarm_draw.js` kiểm tra đầy đủ mọi điều kiện.
