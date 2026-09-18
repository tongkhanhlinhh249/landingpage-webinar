# LEGAL x REPUTATION — Webinar Landing Page

Landing page tĩnh (HTML + CSS + JS thuần, không cần build) theo NetSpace Design System.

## Cấu trúc

```
index.html                  Trang chính
assets/css/style.css        Toàn bộ style (token DS ở :root)
assets/js/main.js           Menu mobile, bàn tay AI (vẽ dây), reveal, sticky CTA, form
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

- **Nhận dữ liệu form:** điền URL vào `FORM_ENDPOINT` ở đầu `assets/js/main.js`
  (Google Apps Script / webhook / CRM). Để trống = chế độ demo, không lưu dữ liệu.
  Dữ liệu gửi đi: `ho_ten`, `so_dien_thoai`, `vai_tro`, `mong_muon`, `thoi_gian_dang_ky`, `nguon`.
- **Ảnh diễn giả / host:** đặt vào `assets/images/`
  - `speaker-nguyen-dinh-thanh.jpg` (tỉ lệ 4:5)
  - `speaker-tran-tam.jpg` (tỉ lệ 4:5)
  - `host-ngo-huyen.jpg` (tỉ lệ 1:1)
  Chưa có ảnh thì trang hiện chữ viết tắt.
- **Link profile chuyên gia:** thay `href="#"` trong `index.html` (tìm `TODO`).
- **og:image** (1200×630) khi có KV chính thức (tìm `TODO` trong `<head>`).

## Ghi chú

- Sau mỗi lần sửa CSS/JS, đổi số `?v=…` trong `index.html` để trình duyệt tải bản mới.
- Breakpoint: 640 / 768 / 1024 / 1280px · Nội dung tối đa 1280px.
