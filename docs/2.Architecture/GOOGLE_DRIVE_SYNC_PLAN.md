# Kiến trúc: Dữ liệu tự quản qua Google Drive (BYOS)

Tài liệu này trình bày kế hoạch chuyển đổi hệ thống lưu trữ của QLTC từ cơ sở dữ liệu tập trung (Supabase) sang mô hình người dùng tự sở hữu dữ liệu trên Google Drive cá nhân.

## 1. Mục tiêu (Objectives)
- **Quyền riêng tư tuyệt đối**: Admin hoàn toàn không có quyền truy cập vào dữ liệu tài chính của khách hàng.
- **Dữ liệu thuộc về User**: Người dùng có toàn quyền kiểm soát, sao lưu và di chuyển dữ liệu của chính mình.
- **Không chi phí vận hành**: Loại bỏ việc duy trì Database Server, tận dụng hạ tầng của Google.

## 2. Mô hình Lưu trữ: appDataFolder
Ứng dụng sẽ sử dụng phân vùng `appDataFolder` của Google Drive:
- **Ẩn với người dùng**: Thư mục này không hiện ra khi mở Google Drive thông thường, tránh việc User vô tình xóa file.
- **Tính riêng biệt**: Mỗi ứng dụng chỉ có quyền đọc/ghi vào thư mục riêng của mình, đảm bảo an toàn.

## 3. Quy trình Kỹ thuật (Technical Flow)

### Xác thực (Authentication)
1.  Người dùng nhấn **"Đăng nhập với Google"**.
2.  App yêu cầu thêm Scope: `https://www.googleapis.com/auth/drive.appdata`.
3.  Google cấp Access Token cho App để thao tác trên Drive.

### Lưu trữ dữ liệu (Data Storage)
Dữ liệu sẽ được lưu dưới dạng một file JSON duy nhất: `qltc_storage.json`:
- **Cấu trúc**: Chứa toàn bộ mảng `jars` và `transactions`.
- **Luồng Đồng bộ**:
    - **Tải lên (Push)**: Khi có giao dịch mới -> Cập nhật React State -> Lưu LocalStorage -> Đẩy file JSON lên Drive (Background).
    - **Tải về (Pull)**: Khi mở App -> Kiểm tra phiên bản mới nhất trên Drive -> Cập nhật xuống máy local.

## 4. Kế hoạch triển khai (Step-by-step)

### Bước 1: Thiết lập Google Cloud Console
- Tạo OAuth 2.0 Client ID mới.
- Kích hoạt **Google Drive API**.
- Cấu hình màn hình Consent để yêu cầu quyền `appdata`.

### Bước 2: Xây dựng lớp Drive Service
- Cài đặt thư viện `gapi-script` hoặc dùng API REST trực tiếp.
- Viết các hàm: `getFile()`, `saveFile()`, `checkFileExists()`.

### Bước 3: Thay đổi Context (Lớp Dữ liệu)
- **FinanceContext.jsx**: Thay đổi các phương thức `select` và `upsert` của Supabase bằng các hàm `read` và `write` file JSON trên Drive.

### Bước 4: Di trú Dữ liệu (Migration)
- Nếu User đã có dữ liệu trên Supabase: App sẽ thực hiện một lần đồng bộ cuối cùng (One-time Sync) từ Supabase sang Drive, sau đó "ngắt kết nối" Database.

## 5. Đánh giá Ưu & Nhược điểm

| Tiêu chí | Trạng thái | Ghi chú |
| :--- | :--- | :--- |
| **Bảo mật** | ⭐⭐⭐⭐⭐ | Cao nhất. Không ai có thể xem dữ liệu ngoài User. |
| **Độ trễ** | ⭐⭐⭐ | Chậm hơn Database khoảng 100ms-300ms khi lưu file. |
| **Offline** | ⭐⭐⭐⭐ | Hoạt động tốt nhờ cơ chế LocalStorage dự phòng. |
| **Tin cậy** | ⭐⭐⭐⭐⭐ | Dựa trên hạ tầng lưu trữ của Google. |

---
*Tài liệu này được soạn thảo để hướng dẫn triển khai hệ thống tài chính "Không dấu vết" (Zero-Knowledge Finance).*
