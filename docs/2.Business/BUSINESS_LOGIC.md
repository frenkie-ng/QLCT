# Tài liệu Nghiệp vụ (Business Logic) - Hệ thống QLTC

Tài liệu này tập trung vào các quy tắc vận hành và tính năng chính của hệ thống để giải quyết vấn đề tài chính của người dùng.

## 1. Triết lý Vận hành
Hệ thống dựa trên nguyên tắc **"Pay Yourself First" (Trả cho bản thân trước)**. Nghĩa là ngay khi tiền đổ về túi, bạn phải chia nó ra các mục đích cụ thể ngay lập tức, thay vì để chung một chỗ rồi tiêu đến đâu hay đến đó.

## 2. Chi tiết 6 Chiếc hũ (The 6 Jars Rule)

| Tên Hũ | Tỷ lệ | Mục đích Nghiệp vụ |
| :--- | :---: | :--- |
| **Thiết yếu (NEC)** | 55% | Chi trả các chi phí bắt buộc để duy trì cuộc sống. |
| **Tự do Tài chính (FFA)** | 10% | Tuyệt đối không tiêu. Dùng để đầu tư tạo ra tiền. |
| **Tiết kiệm dài hạn (LTS)** | 10% | Cho các mục tiêu lớn (mua xe, nhà) hoặc quỹ khẩn cấp. |
| **Giáo dục (EDU)** | 10% | Đầu tư vào trí tuệ (sách, khóa học) để tăng thu nhập. |
| **Hưởng thụ (PLAY)** | 10% | Nuôi dưỡng tâm hồn. **Phải tiêu hết** mỗi tháng để không bị áp lực. |
| **Cho đi (GIVE)** | 5% | Giúp đỡ người khác, tạo năng lượng tích cực. |

## 3. Các Tính năng Chính & Quy tắc Xử lý

### A. Quản lý Thu nhập (Income)
- **Quy tắc**: Khi có thu nhập mới, hệ thống tính toán số tiền tương ứng cho từng hũ dựa trên tỷ lệ % hiện tại.
- **Tính năng**: 
  - Nhập số tiền thu nhập.
  - Tự động cộng dồn số dư vào các hũ.

### B. Quản lý Chi tiêu (Expense)
- **Quy tắc**: Chi tiêu mục nào phải trừ đúng hũ đó.
- **Tính năng**:
  - Chọn giao dịch chi tiêu -> Chọn hũ.
  - **Kiểm tra ngăn chặn**: Nếu hũ "Hưởng thụ" chỉ còn 100k mà nhập 200k, hệ thống sẽ cảnh báo: *"Hũ này không đủ tiền, bạn có chắc chắn muốn tiêu?"*

### C. Quản lý Điều chuyển (Transfer)
- **Quy tắc**: Cho phép vay mượn giữa các hũ (trừ hũ FFA).
- **Tính năng**: Chuyển tiền từ hũ A sang hũ B kèm ghi chú lý do (ví dụ: *"Vay hũ Tiết kiệm để bù hũ Thiết yếu"*).

### D. Điều chỉnh Tỷ lệ Hũ (Adjusting Jar Percentages) - **Tính năng Kỷ luật**
- **Quy tắc 30 ngày**: Chỉ được phép thực hiện một lần điều chỉnh sau mỗi 30 ngày kể từ lần cấu hình gần nhất. Điều này ngăn chặn việc thay đổi tùy hứng để chi tiêu quá độ.
- **Yêu cầu phản hồi**: Người dùng phải cung cấp lý do ngắn gọn cho sự thay đổi (tạo sự tự thức).
- **Ràng buộc tổng**: Tổng số 6 hũ phải luôn bằng 100%.

### E. Báo cáo & Cảnh báo (Analytics & Alerts)
- **Biểu đồ sức khỏe**: Hiển thị tỷ lệ tiêu dùng thực tế.
- **Chỉ số Sống sót**: Tính toán dựa trên số dư hũ Thiết yếu, bạn có thể sống được bao nhiêu ngày nữa nếu không có thu nhập.

## 4. Xử lý các tình huống đặc biệt (Edge Cases)
- **Lương về muộn**: Hệ thống cho phép nhập âm tiền hũ Thiết yếu (ghi nợ) và tự động bù trừ khi lương về.
- **Thu nhập đột xuất**: (Tiền thưởng, quà tặng) Áp dụng đúng công thức 6 hũ để duy trì kỷ luật.
