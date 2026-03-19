# Tài liệu Bảo mật & Riêng tư (Security) - QLTC

Bảo mật dữ liệu tài chính là ưu tiên hàng đầu. Với việc chuyển sang Supabase, chúng ta sử dụng các tiêu chuẩn công nghiệp để bảo vệ người dùng.

## 1. Xác thực (Authentication)
Chúng ta sử dụng **Supabase Auth** để quản lý danh tính người dùng:
- **Passwords**: Được băm (hashed) bằng thuật toán `bcrypt` và lưu trữ an toàn bởi Supabase. Chúng ta không bao giờ nhìn thấy mật khẩu thực tế của người dùng.
- **Google OAuth**: Sử dụng chuẩn `OpenID Connect`. Dữ liệu đăng nhập được xử lý bởi Google, Supabase chỉ nhận về một `token` xác nhận.

## 2. Row Level Security (RLS) - "Lính gác" dữ liệu
Đây là lớp bảo vệ quan trọng nhất. Thay vì tin tưởng hoàn toàn vào code ở Frontend, chúng ta thiết lập quy tắc ngay tại Database.

**Nguyên lý:**
Mọi câu lệnh SQL gửi lên từ Frontend đều phải đi qua bộ lọc RLS.
- Câu lệnh: `SELECT * FROM transactions`
- Bộ lọc: `WHERE user_id = auth.uid()`
- Kết quả: User A không bao giờ có thể truy cập được dữ liệu của User B, kể cả khi họ biết ID của User B.

## 3. Bảo vệ Key API
- **Anon Key**: Được nhúng vào code Frontend. Key này chỉ có quyền thực thi các hành động bị giới hạn bởi RLS.
- **Service Role Key**: **TUYỆT ĐỐI KHÔNG** nhúng vào Frontend. Key này bỏ qua mọi lớp bảo vệ RLS.

## 4. Mã hóa Dữ liệu (Data Encryption)
- **At Rest**: Supabase (AWS) mã hóa toàn bộ ổ đĩa lưu trữ dữ liệu.
- **In Transit**: Mọi giao thức trao đổi dữ liệu giữa trình duyệt và server đều bắt buộc qua `HTTPS/TLS`.
