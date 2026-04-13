-- 1. Tạo bảng categories
CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    type text NOT NULL CHECK (type IN ('income', 'expense')),
    icon text,
    color text DEFAULT '#00d1ff',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Bật Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 3. Tạo các Policy bảo mật
CREATE POLICY "Users can view their own categories"
ON public.categories FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
ON public.categories FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
ON public.categories FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
ON public.categories FOR DELETE
USING (auth.uid() = user_id);

-- 4. Thêm Index tối ưu tìm kiếm
CREATE INDEX idx_categories_user ON public.categories(user_id);

-- 5. Thêm dữ liệu mặc định (Tùy chọn)
-- Lương, Thưởng cho Income; Ăn uống, Di chuyển cho Expense
-- (Dòng này bạn có thể bỏ qua nếu muốn tự tạo sạch từ đầu)
INSERT INTO public.categories (user_id, name, type, color)
SELECT id, 'Lương', 'income', '#00d1ff' FROM auth.users;
INSERT INTO public.categories (user_id, name, type, color)
SELECT id, 'Thưởng', 'income', '#00ff94' FROM auth.users;
INSERT INTO public.categories (user_id, name, type, color)
SELECT id, 'Ăn uống', 'expense', '#ff3d00' FROM auth.users;
INSERT INTO public.categories (user_id, name, type, color)
SELECT id, 'Di chuyển', 'expense', '#ffb800' FROM auth.users;
