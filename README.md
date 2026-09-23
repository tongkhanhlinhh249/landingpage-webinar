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

- **Nhận dữ liệu form:** POST tới webhook n8n — xem mục "Nhận dữ liệu đăng ký" bên dưới.
- **Ảnh diễn giả / host:** đã có (tách nền, WebP) trong `assets/images/`:
  `speaker-nguyen-dinh-thanh.webp`, `speaker-tran-tam.webp` (+ bản `-hero.webp` cắt bán thân cho hero).
  Muốn thay ảnh: giữ nguyên tên file (PNG/WebP nền trong suốt, người canh sát mép dưới).
- **Link profile chuyên gia:** thay `href="#"` trong `index.html` (tìm `TODO`).
- **og:image**: `assets/images/og-cover.jpg` (1200×630) — thay nếu có KV chính thức.

## Nhận dữ liệu đăng ký (n8n webhook)

Form POST tới webhook trong `FORM_ENDPOINT` (`assets/js/main.js`):
`https://n8n.netspace.vn/webhook/event/webinar`

Body gửi đi (JSON, `Content-Type: application/json`):

```json
{
  "name": "Lý Mạnh Hà",
  "phone": "0912345678",
  "email": "lymanhha@gmail.com",
  "role": "KOL / KOC / Content Creator",
  "value": "Giải pháp xây dựng hệ thống lá chắn bảo vệ thương hiệu 360°"
}
```

Phía n8n cần 2 thứ:

1. **Bật workflow** (toggle Active) — nếu chưa bật, webhook trả 404 `"not registered"`.
2. **Cho phép CORS** ở node Webhook (Allow Origins = `https://landingpage-webinar.vercel.app` hoặc `*`),
   vì trình duyệt phải đọc được phản hồi mới báo thành công.

Nếu hạ tầng không trả được header CORS: đặt `ALLOW_NO_CORS_FALLBACK = true` trong `assets/js/main.js`.
Khi đó form gửi lại dạng `text/plain` (không preflight) — dữ liệu vẫn tới n8n nhưng trang luôn báo
thành công vì không đọc được phản hồi; n8n phải tự `JSON.parse` phần body.

Chưa gửi được (webhook tắt / lỗi mạng) → form hiện thông báo lỗi kèm Hotline **079 2251 228** và email,
dữ liệu người dùng nhập vẫn giữ nguyên trên màn hình.

> `google-apps-script/Code.gs` (ghi vào Google Sheet) vẫn giữ lại ở máy để dự phòng, không dùng nữa.

## Ghi chú

- Sau mỗi lần sửa CSS/JS, đổi số `?v=…` trong `index.html` để trình duyệt tải bản mới.
- Breakpoint: 640 / 768 / 1024 / 1280px · Nội dung tối đa 1280px.
