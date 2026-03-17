# Luồng Người dùng (User Flow) - Hệ thống QLTC

Tài liệu này mô tả các bước mà người dùng sẽ thực hiện để tương tác với hệ thống.

## Kịch bản 1: Nhận lương (Phân bổ)
1. Người dùng mở App.
2. Nhấn nút **"Thêm Thu nhập"**.
3. Nhập số tiền (ví dụ: 20.000.000 VNĐ).
4. Hệ thống hiển thị bảng tính "Dự kiến phân bổ":
   - Thiết yếu: 11.000.000
   - Tự do tài chính: 2.000.000
   - ...
5. Người dùng xác nhận hoặc điều chỉnh nhẹ.
6. Hệ thống cộng số dư vào các hũ tương ứng.

## Kịch bản 2: Chi tiêu hàng ngày
1. Người dùng chi tiền thực tế (ví dụ: mua sắm).
2. Mở App, nhấn nút **"Chi tiêu"**.
3. **Bước quan trọng**: Chọn hũ muốn tiêu (ví dụ: "Hưởng thụ").
4. Hệ thống hiện số dư hiện tại của hũ đó: "Hũ Hưởng thụ còn 1.200.000".
5. Người dùng nhập số tiền chi tiêu (ví dụ: 500.000).
6. Hệ thống cập nhật và hiển thị số dư mới: "Còn lại 700.000".

## Kịch bản 3: Xem báo cáo cuối tháng
1. Người dùng vào trang **"Báo cáo"**.
2. Xem biểu đồ so sánh giữa Phân bổ lý tưởng vs Chi tiêu thực tế.
3. Nếu chi tiêu thực tế vượt quá hũ, hệ thống sẽ gợi ý điều chỉnh cho tháng sau.
