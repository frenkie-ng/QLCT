-- Migration Script cho tính năng Income Planner
-- Hãy copy toàn bộ script này và chạy trong mục SQL Editor của Supabase

-- 1. Tạo bảng income_projects
CREATE TABLE public.income_projects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    category text,
    priority text DEFAULT 'medium',
    status text DEFAULT 'idea',
    setup_time text,
    capital_required numeric DEFAULT 0,
    capital_jar_id text,
    target_jar_id text,
    markdown_notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Cập nhật bảng transactions (Thêm cột project_id)
-- Chạy lệnh này nếu bảng transactions của bạn chưa có cột project_id
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES public.income_projects(id) ON DELETE SET NULL;

-- 3. Cấu hình Row Level Security (RLS) cho bảng income_projects
ALTER TABLE public.income_projects ENABLE ROW LEVEL SECURITY;

-- 4. Tạo Policy: Cho phép người dùng xem dữ liệu của chính họ
CREATE POLICY "Users can view their own projects"
ON public.income_projects FOR SELECT
USING (auth.uid() = user_id);

-- 5. Tạo Policy: Cho phép người dùng thêm dự án
CREATE POLICY "Users can insert their own projects"
ON public.income_projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 6. Tạo Policy: Cho phép người dùng cập nhật dự án của chính họ
CREATE POLICY "Users can update their own projects"
ON public.income_projects FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 7. Tạo Policy: Cho phép người dùng xóa dự án của chính họ
CREATE POLICY "Users can delete their own projects"
ON public.income_projects FOR DELETE
USING (auth.uid() = user_id);

-- 8. Tối ưu hiệu suất bằng Index
CREATE INDEX IF NOT EXISTS idx_income_projects_user ON public.income_projects(user_id);
