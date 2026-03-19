# Luồng Người dùng (User Flow) - Hệ thống QLTC

Tài liệu này mô tả các bước mà người dùng sẽ thực hiện để tương tác với hệ thống.

1. Người dùng mở App lần đầu.
2. Chọn **"Đăng nhập bằng Google"** hoặc **"Đăng ký bằng Email"**.
3. Sau khi xác thực thành công, hệ thống khởi tạo 6 hũ mặc định (nếu là user mới).
4. Nếu user cũ, hệ thống tự động tải dữ liệu từ Cloud về.

## Kịch bản 2: Nhận lương (Phân bổ)
1. Nhấn nút **"Thêm Thu nhập"**.
2. Nhập số tiền (ví dụ: 20.000.000 VNĐ).
3. Hệ thống hiển thị bảng tính "Dự kiến phân bổ":
   - Thiết yếu: 11.000.000
   - Tự do tài chính: 2.000.000
   - ...
4. Người dùng xác nhận.
5. Hệ thống cộng số dư vào các hũ và đồng bộ ngay lập tức lên Supabase.

## Kịch bản 3: Chi tiêu hàng ngày
1. Người dùng chi tiền thực tế, mở App.
2. Nhấn nút **"Chi tiêu"**, chọn hũ tương ứng.
3. Nhập số tiền, hệ thống trừ số dư và lưu lịch sử giao dịch lên Cloud.

## Kịch bản 4: Sử dụng trên thiết bị mới
1. Người dùng đăng nhập tài khoản cũ trên điện thoại mới.
2. Hệ thống nhận diện `user_id` và tải toàn bộ lịch sử giao dịch + số dư hũ về máy.
3. Người dùng tiếp tục sử dụng mà không mất dữ liệu.
