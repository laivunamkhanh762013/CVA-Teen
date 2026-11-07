# TÀI LIỆU KỸ THUẬT & MASTER PROMPT: "TRẠM HỌC ĐƯỜNG TEEN - THREADS EDITION" (ALL-IN-ONE CẤP 2)
> **Dành cho:** AI Coding Assistant (Cursor, Antigravity, Claude, ChatGPT, v0...) và Lập trình viên.  
> **Mục đích:** Đọc hiểu toàn bộ bối cảnh dự án, kiến trúc dữ liệu và phát triển/mở rộng ứng dụng web học đường chuẩn giao diện Threads dành riêng cho lứa tuổi Trung học cơ sở (THCS Chu Văn An).

---

## 1. TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)
- **Tên dự án:** Trạm Tuổi Teen CVA (TeenStation - Threads Edition)
- **Đối tượng người dùng chính:** Học sinh THCS (Lớp 6 đến Lớp 9, độ tuổi từ 11 đến 15), đặc biệt là học sinh trường THCS Chu Văn An.
- **Concept thiết kế:** **Modern Threads Social UI** tinh tế kết hợp điểm nhấn Gen Z học đường: đường nét thanh thoát (`border-slate-200/90`), bóng mờ đa tầng (`shadow-card`, `shadow-float`), font chữ hiện đại (`Plus Jakarta Sans`), thẻ căn cước thông hành kính mờ (Frosted Glass Student Pass), cùng cấu trúc **Mạng xã hội Threads** (dòng thời gian dọc, đường chỉ nối chuỗi `thread-line-connector`, thả tim ❤️, trả lời nối tiếp 💬, Repost đẩy bài 🔁, chia sẻ ✈️). Loại bỏ hoàn toàn viền đen 4px thô cứng để đem lại trải nghiệm sang, sạch, cuốn hút và đậm chất Gen Z.
- **Mục tiêu sản phẩm:** Giải quyết 3 vấn đề học đường cấp 2 trong **1 ứng dụng web duy nhất**:
  1. **Đồ Ơi Về Đi:** Tìm kiếm đồ đạc thất lạc (Casio 580, khăn quàng đỏ, áo thể dục...) với cơ chế Check VAR Câu hỏi bí mật.
  2. **Chợ Phiên Học Trò:** Pass, đổi sách giáo khoa mới (KNTT, Cánh Diều, Chân Trời), truyện tranh và đồ dùng học tập (ưu tiên tặng 0đ cho đàn em).
  3. **Bồ Câu Đưa Thư & Trợ lý AI Khóa Trên:** Hộp thư tâm sự 100% ẩn danh, phản hồi như một comment ghim đầu tiên trong thread, tích hợp Smart GenZ AI Fallback + Gemini 2.5 Flash.
  4. **Bento Grid Landing Page & Intro Mở Cổng:**
     - Hoạt cảnh 2 cánh cổng trường mở ra với chuông trường học tự sinh (Web Audio Chime) và pháo hoa rực rỡ.
     - Thanh chạy chữ nóng hổi **Marquee Ticker**.
     - Mini-game **Bốc Quẻ Học Đường / Vibe Check Hôm Nay** (+10 Aura).
     - **Đài Phát Thanh CVA (Live Threads Feed)** tổng hợp bài đăng sôi động nhất.
- **Ngôn ngữ & Vibe:** Đậm chất Gen Z học đường ("Check VAR", "+1000 Aura", "Đỉnh nóc kịch trần", "Cứu giá", "Slay", "No Cap").
- **Tối ưu Mobile-First 100%:** Bottom Navigation Bar 5 tabs (Trang Chủ, Tìm Đồ, Đổi Sách, Hộp Thư, Góc Của Em).

---

## 2. KIẾN TRÚC 3 MODULE TÍNH NĂNG CỐT LÕI

### Module 1: "Đồ Ơi Về Đi" (Smart Lost & Found)
- **Đặc thù đồ vật cấp 2:**
  - Máy tính cầm tay Casio FX 580VN X / 570.
  - Khăn quàng đỏ, huy hiệu Đội.
  - Áo khoác đồng phục, áo thể dục.
  - Hộp bút, bình nước giữ nhiệt.
  - Chìa khóa xe đạp, thẻ học sinh.
- **Tính năng độc lạ:**
  - *Hậu tạ kiểu học trò:* Người mất đồ chọn quà cảm ơn dễ thương (1 cốc trà sữa, 1 que kem căn-tin, 1 gói bim bim, 1 lời cảm ơn siêu to khổng lồ).
  - *Xác thực chính chủ bằng Câu hỏi bí mật:* Người nhặt được quyền đặt câu hỏi (VD: *"Mặt sau dán sticker gì?"*). Chỉ người trả lời đúng mới được hẹn nhận đồ.
  - Trạng thái món đồ: `open` (Đang tìm/chờ nhận) -> `solved` (Đã trao trả cho bạn).

### Module 2: "Chợ Phiên Học Trò" (Book & Item Exchange)
- **Cơ chế giao dịch phù hợp lứa tuổi 11-15:**
  - **Tặng 0đ (Tặng đàn em):** Anh chị lớp 9 đỗ cấp 3 tặng lại tài liệu ôn thi, sách cũ cho các em lớp dưới.
  - **Đổi đồ (Trade):** Đổi sách lấy truyện, đổi truyện lấy rubik/đồ chơi.
  - **Pass giá hạt dẻ (5k - 20k):** Thanh toán trực tiếp bằng tiền mặt khi gặp nhau vào giờ ra chơi ở trường.
- **Bộ lọc chuyên biệt:**
  - Lọc theo khối lớp: Lớp 6, 7, 8, 9 (Ôn thi vào 10).
  - Lọc theo bộ sách giáo khoa mới: *Kết nối tri thức*, *Cánh diều*, *Chân trời sáng tạo*, *Manga/Conan*.

### Module 3: "Bồ Câu Đưa Thư" (Anonymous Mental Health & AI Counseling)
- **Chủ đề tâm sự:**
  - Áp lực thi vào lớp 10, thi học kỳ.
  - Bố mẹ không hiểu, so sánh với "con nhà người ta".
  - Tình cảm gà bông (crush bạn cùng bàn/khác lớp).
  - Bạn bè cô lập, xích mích nhóm.
  - Lời cảm ơn / xin lỗi ẩn danh gửi thầy cô, bạn bè.
- **Trợ lý AI "Chị Bồ Câu" (Khóa Trên):**
  - Tự động phân tích ngữ cảnh và phản hồi ngay lập tức với giọng văn dịu dàng, đồng cảm sâu sắc, không giáo điều, hướng dẫn cách tự chữa lành.
- **Phòng thở 4-4-4 giảm căng thẳng (Breathe Room):**
  - Bộ đếm thời gian thực tế: *Hít vào 4 giây -> Giữ hơi 4 giây -> Thở ra 4 giây* kết hợp bong bóng trực quan.
- **Cơ chế An toàn Học đường (Safety Filter):**
  - Tự động chặn từ ngữ thô tục, phát hiện từ khóa nguy hiểm (tự hại, bạo lực học đường) để kích hoạt thông tin hỗ trợ khẩn cấp: **Tổng đài Quốc gia Bảo vệ Trẻ em 111**.

---

## 3. CƠ CHẾ GAMIFICATION: "ĐIỂM TỬ TẾ" (KARMA POINTS ⭐)
- Khuyến khích tinh thần tương thân tương ái giữa học sinh:
  - Đăng tin báo nhặt được đồ: `+10 điểm`
  - Xác nhận trao trả đồ thành công cho bạn: `+20 điểm`
  - Đăng sách/tài liệu tặng miễn phí 0đ: `+15 điểm`
  - Gửi nút "Ôm một cái" động viên bạn đang buồn: `+2 điểm`
- Huy hiệu hiển thị tự động trên thẻ học sinh cá nhân.

---

## 4. DATA MODELS (JSON SCHEMA)

```typescript
// 1. Thông tin học sinh & Thẻ cá nhân
interface UserProfile {
  name: string;        // "Minh Anh"
  class: string;       // "8A3"
  grade: "6" | "7" | "8" | "9";
  nickname: string;    // "Mèo Mướp Chăm Học"
  avatar: string;      // Emoji "🐱" HOẶC Data URL ảnh tải lên (base64 JPEG tự nén 256x256)
  school: string;      // "Trường THCS Chu Văn An"
  aura: number;        // Điểm Aura / Tử tế ⚡
}

// 2. Tin Tìm / Nhặt đồ
interface LostFoundItem {
  id: string;
  type: "lost" | "found";
  title: string;
  category: "casio" | "scarf" | "uniform" | "pencil" | "key" | "other";
  location: string;
  desc: string;
  reward?: string;
  secretQuestion?: string;
  author: string;
  authorClass: string;
  time: string;
  status: "open" | "solved";
}

// 3. Sách & Đồ dùng học tập
interface BookItem {
  id: string;
  title: string;
  deal: "free" | "trade" | "cheap";
  grade: "6" | "7" | "8" | "9" | "all";
  curriculum: "kntt" | "canhdieu" | "chantroi" | "manga" | "exam";
  condition: string;
  tradeWant?: string;
  meetPlace: string;
  author: string;
  authorClass: string;
  time: string;
}

// 4. Hộp thư ẩn danh
interface MailboxLetter {
  id: string;
  anonNick: string;    // "Sóc Nâu Ôn Thi 🐿️"
  topic: "exam" | "parents" | "crush" | "friends" | "thanks";
  title: string;
  content: string;
  time: string;
  cheers: number;      // Số lượt ôm động viên
  aiResponse?: string; // Lời phản hồi ấm áp từ AI Khóa Trên
}
```

---

## 5. TÍNH NĂNG MỞ RỘNG ĐÃ TÍCH HỢP TOÀN DIỆN (FULL FEATURES)
1. **Google Gemini 2.5 Flash API:**
   - Đã tích hợp trực tiếp endpoint `models/gemini-2.5-flash:generateContent` cùng khóa API chính thức.
   - Trợ lý "Chị Bồ Câu Khóa Trên" tự động phản hồi tâm sự bằng ngôn ngữ GenZ ngọt ngào, tích cực, không phán xét, kèm hỗ trợ hội thoại tương tác tiếp nối (Follow-up Chat).
   - Tự động fallback sang offline advice nếu mất kết nối mạng.
2. **Intro Mở Cổng Trường CVA (Cinematic Gate Portal):**
   - Hoạt cảnh 2 cánh cổng sắt trường Chu Văn An mở ra mượt mà, tấm thẻ học sinh vé thông hành phát sáng, tiếng chuông trường học tự sinh (Web Audio Chime) và pháo hoa rực rỡ. Có nút xem lại mọi lúc trên thanh Header.
3. **Landing Page Đỉnh Nóc Kịch Trần:**
   - Tab Trang Chủ độc lập giới thiệu toàn cảnh dự án, bảng đếm số liệu tương tác thực tế, 4 thẻ tính năng Neo-Brutalism, góc "Tiếng lòng thần dân CVA" và FAQ GenZ.
4. **Mascot Bồ Câu CVA & Âm thanh Web Audio Synth:**
   - Linh vật tương tác nổi góc màn hình phát ngôn các câu thoại học trò hài hước.
   - Nút bật/tắt âm thanh giao diện trên Header.
5. **Bảo mật học sinh:**
   - Không yêu cầu cung cấp số điện thoại hay địa chỉ nhà; chỉ sử dụng Tên + Tên Lớp trong phạm vi trường học. An toàn tuyệt đối với bộ lọc từ khóa kích hoạt Tổng đài Trẻ em 111.
