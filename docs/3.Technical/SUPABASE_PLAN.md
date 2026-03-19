# Tài liệu Kế hoạch Tích hợp Supabase (QLTC)

Tài liệu này chi tiết các bước để chuyển đổi từ `localStorage` sang Supabase nhằm lưu trữ dữ liệu bền vững, đồng bộ đa thiết bị và bảo mật Row Level Security (RLS).

## 1. Yêu cầu Tiền đề (Prerequisites)
- Một tài khoản [Supabase](https://supabase.com/).
- Project URL và Anon Key (Lấy từ Settings -> API).

## 2. Thiết lập Database (SQL)
Chạy đoạn mã sau trong **Supabase SQL Editor**:

```sql
-- 1. Bảng Profiles (Lưu thông tin người dùng)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Bảng Jars (Lưu số dư và mục tiêu các hũ)
create table jars (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  jar_id text not null, -- 'nec', 'ffa', etc.
  balance numeric default 0,
  target_amount numeric default 0,
  goal_start_date timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, jar_id)
);

-- 3. Bảng Transactions (Lưu lịch sử giao dịch)
create table transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date timestamp with time zone default timezone('utc'::text, now()),
  type text check (type in ('in', 'out')),
  amount numeric not null,
  jar_id text, -- Có thể null nếu là giao dịch tổng hợp
  note text,
  category text,
  debt_amount numeric default 0,
  remaining_amount numeric default 0,
  is_allocation boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Bật Row Level Security (Bảo mật Riêng tư)
alter table profiles enable row level security;
alter table jars enable row level security;
alter table transactions enable row level security;

-- 5. Tạo Policies (Người dùng chỉ xem/sửa được dữ liệu của chính mình)
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

create policy "Users can manage own jars" on jars 
  for all using (auth.uid() = user_id);

create policy "Users can manage own transactions" on transactions 
  for all using (auth.uid() = user_id);
```

## 3. Các thay đổi trong Code

### A. Cài đặt Thư viện
```bash
npm install @supabase/supabase-js
```

### B. Phương thức Xác thực (Authentication)
Chúng ta sẽ triển khai song song 2 phương thức:
- **Email & Password**: Truyền thống, dành cho những ai muốn quản lý tài khoản riêng biệt.
- **Google OAuth (Khuyên dùng)**: Tiện lợi, đăng nhập 1 chạm. Đây là phương thức phổ biến và nhanh chóng nhất cho người dùng.

**Lưu ý:** Để dùng Google Login, ta sẽ cần thêm bước cấu hình "Client ID" và "Secret" trên Google Cloud Console và dán vào Supabase Dashboard.

### C. Cấu trúc File mới
1. `src/lib/supabaseClient.js`: Khởi tạo kết nối.
2. `src/context/AuthContext.jsx`: Quản lý Đăng nhập/Đăng ký.
3. `src/components/AuthModal.jsx`: Giao diện Dialog đăng nhập.

### C. Cập nhật `FinanceContext.jsx`
- Thay đổi `useEffect` để ưu tiên đẩy dữ liệu lên Supabase khi `user` đã đăng nhập.
- Fetch dữ liệu từ Supabase thay vì `localStorage` khi khởi tạo.
- Thêm logic "Merge" dữ liệu từ `localStorage` lên Cloud khi người dùng đăng nhập lần đầu.

## 4. Bảo mật & Riêng tư
- **Row Level Security (RLS)**: Đảm bảo dữ liệu của User A không bao giờ bị User B nhìn thấy.
- **Client-side Encryption (Tùy chọn)**: Có thể mã hóa thêm dữ liệu nhạy cảm trước khi gửi lên Supabase nếu cần mức độ bảo mật cao hơn nữa.
