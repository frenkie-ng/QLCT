# Cấu trúc Thư mục Dự án QLTC (Đề xuất)

Để đảm bảo dự án gọn gàng và dễ quản lý, tôi đề xuất cấu trúc như sau:

```text
QLTC/
├── docs/               # Tài liệu dự án (Bản sao từ brain)
│   ├── PRD.md          # Yêu cầu sản phẩm
│   ├── USER_FLOW.md    # Luồng người dùng
│   ├── DESIGN_SYSTEM.md # Quy chuẩn thiết kế
│   └── DATABASE.md     # Cấu trúc dữ liệu
├── src/                # Mã nguồn ứng dụng
│   ├── assets/         # Hình ảnh, fonts, icons
│   ├── components/     # Các thành phần UI (Button, Card, Modal,...)
│   ├── context/        # Quản lý trạng thái (TransactionContext)
│   ├── hooks/          # Các logic tái sử dụng (useLocalStorage,...)
│   ├── pages/          # Các trang chính (Dashboard, Transactions, Reports)
│   ├── styles/         # CSS Variables & Global styles
│   ├── utils/          # Hàm bổ trợ (Format tiền, tính % hũ)
│   ├── App.jsx
│   └── main.jsx
├── public/             # Tài sản tĩnh
├── index.html
├── package.json
└── vite.config.js
```

**Ghi chú:**
- Thư mục `docs` trong dự án sẽ giúp bạn có thể đọc tài liệu ngay cả khi không có mạng hoặc khi trực tiếp duyệt code.
- Các component sẽ được chia nhỏ để dễ bảo trì.
