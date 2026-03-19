# Tài liệu Yêu cầu Sản phẩm (PRD) - Hệ thống QLTC

## 1. Mục tiêu (Objective)
Giải quyết vấn đề "vòng lặp hết tiền" bằng cách tạo ra một công cụ quản lý tài chính giúp người dùng:
- Có kế hoạch chi tiêu rõ ràng ngay khi nhận lương.
- Kiểm soát được số dư trong từng mục đích (hũ) trước khi quyết định chi tiêu.
- Xây dựng thói quen tiết kiệm và đầu tư (Trả cho bản thân trước).

## 2. Đối tượng người dùng (User Persona)
- Những người có thu nhập ổn định nhưng thường xuyên "cháy túi" vào cuối tháng.
- Người muốn bắt đầu hành trình tự do tài chính nhưng chưa biết cách phân bổ tiền.

## 3. Tính năng cốt lõi (Core Features)
- **Quản lý Thu nhập**: Nhập lương/thu nhập và tự động chia vào 6 hũ theo tỷ lệ định trước.
- **Quản lý Chi tiêu**: Nhập giao dịch và trừ trực tiếp vào một hũ cụ thể.
- **Xác thực người dùng**: Đăng nhập bằng Email/Mật khẩu hoặc Google để đồng bộ dữ liệu.
- **Cảnh báo Ngân sách**: Hiển thị trạng thái "An toàn", "Sắp hết" hoặc "Hết tiền" cho từng hũ.
- **Báo cáo Phân tích**: Biểu đồ cho thấy sự phân bổ thực tế so với kế hoạch.
- **Đồng bộ hóa**: Tự động sao lưu và đồng bộ đa thiết bị (Máy tính, Điện thoại).

## 4. Đặc tả Kỹ thuật (Technical Specs)
- **Công nghệ**: React, Vite, Vanilla CSS.
- **Lớp Dữ liệu**: Supabase (PostgreSQL).
- **Xác thực**: Supabase Auth (Email + Google OAuth).
- **Lưu trữ**: Row Level Security (RLS) để đảm bảo quyền riêng tư tuyệt đối trên máy chủ.

## 5. Chỉ số thành công (KPIs)
- Người dùng không tiêu quá số tiền trong hũ "Thiết yếu".
- Số dư hũ "Tự do tài chính" tăng trưởng hàng tháng.
- Người dùng tuyệt đối an tâm về quyền riêng tư.

## 6. Lộ trình tương lai (Future Roadmap)
- [ ] **End-to-End Encryption (E2EE)**: Mã hóa dữ liệu tại máy người dùng bằng Khóa bảo mật (Master Key). Đảm bảo ngay cả Admin cũng không thể xem được chi tiết thu chi của khách hàng.
- [ ] ** Mobile App (React Native)**: Mở rộng ra ứng dụng di động chính thức.
- [ ] **Báo cáo định kỳ**: Tự động gửi email tóm tắt tình hình tài chính hàng tuần.
