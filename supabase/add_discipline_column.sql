-- Thêm cột last_config_change vào bảng jars nếu chưa có
ALTER TABLE public.jars 
ADD COLUMN IF NOT EXISTS last_config_change timestamp with time zone;

-- Khởi tạo giá trị mặc định là một ngày rất xa trong quá khứ để người dùng có thể sửa ngay lần đầu
UPDATE public.jars SET last_config_change = '2000-01-01 00:00:00+00' WHERE last_config_change IS NULL;
