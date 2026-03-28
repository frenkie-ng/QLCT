# Thiết kế Tính năng: Kế hoạch Tăng Thu Nhập (Income Planner)

## 1. Mục đích (Mục tiêu tính năng)
Tạo ra một phân hệ chuyên biệt trong ứng dụng QLTC để người dùng (đặc biệt là bạn) có thể quản lý, theo dõi và lên kế hoạch cho các dự án kiếm tiền mới. Thay vì chỉ ghi chú nháp, tính năng này buộc người dùng phải trả lời các câu hỏi quan trọng về thời gian, thứ tự ưu tiên và lộ trình dòng tiền.

## 2. Cấu trúc Dữ liệu & UI (Các trường thông tin bắt buộc)

Mỗi một "Dự án/Nguồn thu nhập" (Income Stream Project) khi tạo mới sẽ bao gồm các vùng thông tin sau:

### A. Thông tin Tổng quan (Overview)
*   **Tên Kế hoạch/Nguồn thu:** Tên dự án (Ví dụ: "Kênh YouTube QLTC", "Freelance Upwork", "Chạy FB Ads Affiliate").
*   **Phân loại (Category):** Bán thời gian (Freelance), Kinh doanh (Business), Thu nhập thụ động (Passive), Đầu tư (Invest)...
*   **Mức độ Ưu tiên (Priority):** 
    *   🔴 Cao (Dễ làm, ra tiền nhanh -> Làm ngay)
    *   🟡 Trung bình (Cần thời gian)
    *   🟢 Thấp (Ý tưởng vĩ mô, để sau)

### B. Tiến độ & Trạng thái (Tracking)
*   **Trạng thái (Status - Kanban):** 
    *   💡 Ý tưởng (Idea) 
    *   🔍 Đang nghiên cứu (Researching)
    *   ⚙️ Đang triển khai (Executing) 
    *   💸 Đang tạo ra dòng tiền (Active) 
    *   ⏸️ Tạm dừng (Paused)
*   **Thời gian Setup / Triển khai:** Dự kiến mất bao lâu để hệ thống này bắt đầu chạy (Ví dụ: *2 tuần thiết lập Bot, 3 tháng để kênh YT bật kiếm tiền*).

### C. Lộ trình Tài chính (Financial Roadmap)
*   **Vốn khởi điểm (Initial Capital):** Cần bao nhiêu tiền để bắt đầu? Rút từ Hũ nào ra? (Thường là hũ *FFA - Đầu tư* hoặc *EDU - Học tập*).
*   **Lộ trình Thu nhập dự kiến (Income Milestones):** Bảng Timeline.
    *   *Tháng 1-2:* Nảy mầm (Kì vọng: $0)
    *   *Tháng 3-6:* Có traffic/Khách đầu tiên (Kì vọng: $50 - $100/tháng)
    *   *Tháng 6-12:* Ổn định (Kì vọng: $300+/tháng)
*   **Đích đến dòng tiền:** Toàn bộ lợi nhuận từ nguồn này sẽ được rót thẳng vào Hũ nào? (Ví dụ: 100% đập vào hũ *FFA - Tự do tài chính* để tăng tốc sinh lời).

### D. Trình soạn thảo Chi tiết (Markdown Note)
*   **Khu vực Note (Giao diện giống Notion):** Nơi bạn gạch đầu dòng các nguồn tham khảo (Link khóa học, tutorial FB Ads), các đầu việc cần làm (Checklist), hoặc ghi chú về thuật toán (đối với Bot).

---

## 3. Luồng hoạt động của Người dùng (User Flow)
1.  **Bước 1:** Nảy ra ý tưởng mới (Ví dụ: Thấy người ta chạy FB ads bán áo thun ngon) -> Bấm `[+ Ý tưởng thu nhập mới]`.
2.  **Bước 2:** Nhập Tên, chọn Ưu tiên là "Trung bình", điền Vốn cần là "$100".
3.  **Bước 3:** Chuyển trạng thái sang "Đang nghiên cứu", bắt đầu ném và dán các Link khóa học FB ads vào phần Chi tiết (Markdown Note).
4.  **Bước 4:** Bắt tay vào làm -> Chuyển trạng thái sang "Đang triển khai".
5.  **Bước 5:** Khi ra dòng tiền đầu tiên -> Chuyển sang "Active". Lúc này, mỗi khi có thu nhập từ hệ thống này, app tự động gán nguồn thu nhập đó vào lịch sử giao dịch và chia hũ.
