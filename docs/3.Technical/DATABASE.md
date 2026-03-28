# Cấu trúc Dữ liệu (Database Schema) - Supabase

Ứng dụng chuyển đổi từ LocalStorage sang PostgreSQL (Supabase) để đảm bảo tính bền vững và bảo mật.

## 1. Sơ đồ các bảng (Tables)

### Bảng `income_projects` (Các dự án kiếm tiền)
Quản lý các ý tưởng, dự án nằm trong tính năng Income Planner.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Khóa chính (Primary Key) |
| `user_id` | uuid | FK đến `auth.users` |
| `name` | text | Tên dự án/Nguồn thu |
| `category` | text | Phân loại (đầu tư, freelance...) |
| `priority` | text | 'high', 'medium', 'low' |
| `status` | text | 'idea', 'researching', 'executing', 'active', 'paused' |
| `setup_time` | text | Thời gian triển khai dự kiến |
| `capital_required` | numeric | Vốn ước tính cần thiết |
| `capital_jar_id` | text | Hũ cung cấp vốn (FK -> `jars.jar_id`) |
| `target_jar_id` | text | Hũ nhận lợi nhuận (FK -> `jars.jar_id`) |
| `markdown_notes` | text | Ghi chú chi tiết (Markdown) |
| `created_at` | timestamp| Ngày tạo |

### Bảng `jars` (Quản lý các hũ)
Dùng để lưu số dư và mục tiêu cho từng loại hũ của mỗi người dùng.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Khóa chính (Primary Key) |
| `user_id` | uuid | FK đến `auth.users` |
| `jar_id` | text | Mã hũ ('nec', 'ffa', 'lts', 'edu', 'play', 'give') |
| `balance` | numeric | Số dư hiện tại |
| `percentage` | numeric | Tỷ lệ phân bổ hiện tại của hũ (%) |
| `target_amount` | numeric | Mục tiêu tài chính cho hũ |
| `goal_start_date`| timestamp| Ngày bắt đầu thực hiện mục tiêu |
| `last_percentage_update`| timestamp| Lần cuối cùng thay đổi tỷ lệ hũ |
| `last_update_reason`| text | Lý do thay đổi tỷ lệ gần nhất |

### Bảng `transactions` (Lịch sử giao dịch)
Lưu trữ mọi biến động số dư.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Khóa chính |
| `user_id` | uuid | FK đến `auth.users` |
| `date` | timestamp| Thời gian diễn ra giao dịch |
| `type` | text | 'in' (Thu nhập) hoặc 'out' (Chi tiêu) |
| `amount` | numeric | Số tiền |
| `jar_id` | text | Hũ tương ứng |
| `note` | text | Ghi chú của người dùng |
| `project_id` | uuid | (Optional) FK đến `income_projects.id` để track ROI lợi nhuận/chi phí của một dự án cụ thể. |

## 2. Bảo mật Row Level Security (RLS)
Mọi bảng đều phải bật RLS để đảm bảo tính riêng tư:
- **Policy**: `auth.uid() = user_id`
- **Ý nghĩa**: Người dùng chỉ có thể XEM, THÊM, SỬA, XÓA dữ liệu thuộc về chính `user_id` của họ.

## 3. Chỉ mục (Indexes)
- Tối ưu tìm kiếm giao dịch theo thời gian: `CREATE INDEX idx_transactions_date ON transactions(date);`
- Tối ưu truy vấn hũ theo người dùng: `CREATE INDEX idx_jars_user ON jars(user_id);`
