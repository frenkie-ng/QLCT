# Hướng dẫn Cấu hình Đăng nhập Google (Google OAuth)

Để tính năng "Đăng nhập với Google" hoạt động, bạn cần thực hiện 2 bước cấu hình bên ngoài mã nguồn.

## Bước 1: Cấu hình trên Google Cloud Console

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Tạo một Project mới (ví dụ: `QLTC-App`).
3. Vào mục **APIs & Services** > **OAuth consent screen**:
   - Chọn **External**.
   - Điền các thông tin bắt buộc (App name, User support email, Developer contact info).
   - Nhấn **Save and Continue** đến hết.
4. Vào mục **APIs & Services** > **Credentials**:
   - Nhấn **Create Credentials** > **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `QLTC Supabase`.
   - **Authorized redirect URIs**: Bạn cần lấy URL này từ Supabase (xem Bước 2 bên dưới). Nó thường có dạng: `https://<project-id>.supabase.co/auth/v1/callback`
5. Sau khi tạo, bạn sẽ nhận được **Client ID** và **Client Secret**. Hãy giữ chúng để dùng cho Bước 2.

## Bước 2: Cấu hình trên Supabase Dashboard

1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard) > Chọn Project của bạn.
2. Vào mục **Authentication** > **Providers** > **Google**:
   - Bật (Enable) Google.
   - Dán **Client ID** và **Client Secret** lấy từ Google Cloud ở Bước 1 vào đây.
   - Lưu lại (Save).
3. (Quan trọng) Trong bảng cấu hình Google này, Supabase sẽ hiển thị một dòng gọi là **Callback URL**. Hãy Copy nó và dán ngược lại vào mục **Authorized redirect URIs** của Google Cloud (Bước 1.4).
4. Vào mục **Authentication** > **URL Configuration**:
   - **Site URL**: Điền `http://localhost:5173` (hoặc URL trang web của bạn).
   - **Redirect URLs**: Thêm `http://localhost:5173/**`.

## Kiểm tra

Sau khi hoàn thành, bạn chỉ cần nhấn nút "Đăng nhập với Google" trên màn hình Login. Hệ thống sẽ tự động xử lý phần còn lại!

> [!TIP]
> Nếu bạn gặp lỗi "Redirect URI mismatch", hãy kiểm tra kỹ xem URL trong Supabase và Google Cloud đã khớp chính xác từng ký tự chưa.
