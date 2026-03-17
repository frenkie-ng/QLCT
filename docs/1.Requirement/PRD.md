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
- **Cảnh báo Ngân sách**: Hiển thị trạng thái "An toàn", "Sắp hết" hoặc "Hết tiền" cho từng hũ.
- **Báo cáo Phân tích**: Biểu đồ hình tròn cho thấy sự phân bổ thực tế so với kế hoạch.
- **Nhắc nhở**: Thông báo nhập chi tiêu cuối ngày (tương lai).

## 4. Đặc tả Kỹ thuật (Technical Specs)
- **Công nghệ**: React, Vite, Vanilla CSS.
- **Lưu trữ**: LocalStorage (Dữ liệu nằm trên máy người dùng, đảm bảo riêng tư).
- **Trải nghiệm**: Không cần đăng nhập (Quick access), ưu tiên tốc độ nhập liệu.

## 5. Chỉ số thành công (KPIs)
- Người dùng không tiêu quá số tiền trong hũ "Thiết yếu".
- Số dư hũ "Tự do tài chính" tăng trưởng hàng tháng.
