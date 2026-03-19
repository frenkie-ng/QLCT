# Kế hoạch Triển khai: Điều chỉnh Tỷ lệ Hũ (với Ràng buộc Kỷ luật)

Tài liệu này tóm tắt kế hoạch thay đổi hệ thống để cho phép người dùng tùy chỉnh tỷ lệ % của 6 hũ, đồng thời áp dụng các quy tắc để duy trì kỷ luật tài chính.

## 1. Mục tiêu
- Cho phép người dùng linh hoạt điều chỉnh tỷ lệ % phân bổ thu nhập.
- Ngăn chặn việc thay đổi tùy hứng bằng cơ chế khóa thời gian (Time-lock).
- Yêu cầu người dùng tự phản hồi lý do thay đổi để tăng tính trách nhiệm.

## 2. Quy tắc Nghiệp vụ (Discipline Rules)
- **Chu kỳ 30 ngày**: Chỉ được phép lưu thay đổi tỷ lệ một lần mỗi 30 ngày.
- **Lý do bắt buộc**: Phải nhập lý do thay đổi trước khi lưu (ví dụ: "Điều chỉnh cho học kỳ mới").
- **Ràng buộc 100%**: Tổng tỷ lệ của 6 hũ phải luôn bằng chính xác 100%.

## 3. Các thay đổi Kỹ thuật

### A. Database (Supabase)
Cập nhật bảng `jars` với các cột mới:
- `percentage` (numeric): Tỷ lệ phân bổ hiện tại.
- `last_percentage_update` (timestamp): Thời điểm cập nhật cuối cùng.
- `last_update_reason` (text): Lý do của lần cập nhật cuối.

### B. Logic (FinanceContext.jsx)
- Thêm hàm `updateJarPercentages(newPercentages, reason)`.
- Kiểm tra tính hợp lệ của thời gian (30 ngày) trước khi thực hiện `upsert`.
- Cập nhật hàm `loadData` để ưu tiên lấy `percentage` từ Database thay vì code cứng.

### C. Giao diện (Dashboard & Components)
- **Settings Button**: Thêm nút cài đặt tỷ lệ vào Dashboard.
- **JarSettingsModal**: 
    - Hiển thị danh sách 6 hũ và ô nhập %.
    - Tính tổng % theo thời gian thực.
    - Hiển thị trạng thái "Bị khóa" kèm số ngày chờ nếu chưa đủ 30 ngày.
    - Ô nhập lý do thay đổi.

## 4. Kế hoạch Kiểm thử
1. Thay đổi tỷ lệ -> Lưu -> Kiểm tra xem thu nhập mới có chia đúng tỷ lệ mới không.
2. Thử thay đổi lại ngay lập tức -> Kiểm tra xem hệ thống có ngăn chặn (khóa) không.
3. Refresh trang -> Kiểm tra xem tỷ lệ đã tùy chỉnh có được giữ nguyên không.

---
*Tài liệu này được chuẩn bị bởi Antigravity phục vụ cho việc review của người dùng.*
