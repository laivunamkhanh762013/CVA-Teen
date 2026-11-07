# 🌿 Hướng Dẫn Git Worktree & GitHub Actions Cho Antigravity

Dự án đã được cấu hình đầy đủ để bạn có thể:
1. **Làm việc đa nhánh song song (Git Worktree)**: Bạn và trợ lý Antigravity có thể code trên 2 nhánh khác nhau cùng một lúc trên máy mà không bị xung đột.
2. **Tự động hóa trên GitHub (GitHub Actions Workflow)**: File workflow tự động kiểm tra và deploy lên GitHub Pages mỗi khi bạn push code.

---

## 1. Kết Nối Repository Với GitHub (Bước Đầu Tiên)

Nếu dự án của bạn chưa được liên kết với GitHub, hãy mở Terminal trong Antigravity và chạy:

```bash
# Đổi tên nhánh chính sang main (nếu muốn chuẩn GitHub) hoặc giữ nguyên master
git branch -M main

# Thêm remote GitHub của bạn (thay username và repo của bạn vào)
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# Push mã nguồn lên GitHub
git push -u origin main
```

---

## 2. Quản Lý Git Worktree (Cho Bạn & Antigravity)

Chúng tôi đã tạo sẵn script PowerShell tiện ích tại [`scripts/worktree.ps1`](file:///c:/Users/ADMIN/Desktop/CVA%20Thất%20lạc/scripts/worktree.ps1):

### 🔹 Tạo Worktree mới (để Antigravity làm tính năng riêng):
```powershell
.\scripts\worktree.ps1 add feature-ten-tinh-nang
```
> Thư mục mới sẽ được tạo trong `.worktrees/feature-ten-tinh-nang/`. Antigravity có thể mở thư mục này để code độc lập với nhánh chính!

### 🔹 Xem danh sách các Worktree đang chạy:
```powershell
.\scripts\worktree.ps1 list
```

### 🔹 Đẩy nhánh Worktree lên GitHub:
```powershell
.\scripts\worktree.ps1 push feature-ten-tinh-nang
```

### 🔹 Gỡ bỏ Worktree sau khi merge xong:
```powershell
.\scripts\worktree.ps1 remove feature-ten-tinh-nang
```

---

## 3. GitHub Actions Workflow

File workflow tự động đã được tạo tại [`.github/workflows/ci-deploy.yml`](file:///c:/Users/ADMIN/Desktop/CVA%20Thất%20lạc/.github/workflows/ci-deploy.yml):
- Tự động kiểm tra file HTML khi tạo Pull Request hoặc Push.
- Tự động build và deploy lên **GitHub Pages** miễn phí.
- Để bật GitHub Pages: Vào repo trên GitHub -> **Settings** -> **Pages** -> Tại mục **Source**, chọn **GitHub Actions**.
