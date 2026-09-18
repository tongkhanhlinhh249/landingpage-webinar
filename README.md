# LEGAL x REPUTATION — Webinar Landing Page

Landing page tĩnh (HTML + CSS + JS thuần, không cần build) theo NetSpace Design System.

## Cấu trúc

```
index.html                  Trang chính
assets/css/style.css        Toàn bộ style (token DS ở :root)
assets/js/main.js           Menu mobile, bàn tay AI (vẽ dây), reveal, sticky CTA, form
google-apps-script/Code.gs  Script nhận form → ghi vào Google Sheet (dán vào Apps Script) — chỉ giữ ở máy, không đưa lên repo public
assets/images/              Hình minh hoạ 3 thẻ Lợi ích (WebP)
assets/logo-netspace*.svg   Logo NetSpace (màu / trắng)
assets/favicon.svg          Favicon
```

## Chạy thử

```bash
python3 -m http.server 8000
```

Mở http://localhost:8000

## Cần cấu hình trước khi chạy thật

- **Nhận dữ liệu form → Google Sheet:** xem mục "Kết nối Google Sheet" bên dưới.
- **Ảnh diễn giả / host:** đã có (tách nền, WebP) trong `assets/images/`:
  `speaker-nguyen-dinh-thanh.webp`, `speaker-tran-tam.webp`, `host-ngo-huyen.webp`.
  Muốn thay ảnh: giữ nguyên tên file (PNG/WebP nền trong suốt, người canh sát mép dưới).
- **Link profile chuyên gia:** thay `href="#"` trong `index.html` (tìm `TODO`).
- **og:image** (1200×630) khi có KV chính thức (tìm `TODO` trong `<head>`).

## Kết nối Google Sheet

Sheet nhận dữ liệu: đã cấu hình sẵn `SHEET_ID` trong `google-apps-script/Code.gs` (không đưa link sheet vào file public).

1. Mở Google Sheet trên → **Tiện ích mở rộng → Apps Script**.
2. Xoá code mẫu, dán toàn bộ nội dung `google-apps-script/Code.gs` → **Lưu**.
3. **Triển khai → Tùy chọn triển khai mới** → loại **Ứng dụng web**:
   - Thực thi với tư cách: **Tôi**
   - Người có quyền truy cập: **Bất kỳ ai**
4. Bấm **Triển khai**, cấp quyền cho tài khoản Google → copy **URL ứng dụng web** (kết thúc bằng `/exec`).
5. Dán URL đó vào `FORM_ENDPOINT` trong `assets/js/main.js`, đổi số `?v=` trong `index.html`, deploy lại.

Kiểm tra: mở URL `/exec` trên trình duyệt thấy `{"ok":true,...}` là script đã chạy.
Dữ liệu ghi vào tab **Đăng ký** (tự tạo): Thời gian đăng ký · Họ và tên · Số điện thoại · Vị thế & Vai trò · Giá trị mong muốn · Nguồn (URL).

> Nếu sửa `Code.gs` sau khi đã triển khai: **Triển khai → Quản lý bản triển khai → Chỉnh sửa → Phiên bản mới** để URL cũ nhận code mới.

## Ghi chú

- Sau mỗi lần sửa CSS/JS, đổi số `?v=…` trong `index.html` để trình duyệt tải bản mới.
- Breakpoint: 640 / 768 / 1024 / 1280px · Nội dung tối đa 1280px.
