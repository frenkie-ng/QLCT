-- Thêm cột percentage vào bảng jars nếu chưa có
ALTER TABLE public.jars 
ADD COLUMN IF NOT EXISTS percentage numeric DEFAULT 0;

-- Cập nhật giá trị mặc định cho các hũ hiện có dựa trên INITIAL_JARS
UPDATE public.jars SET percentage = 55 WHERE jar_id = 'nec';
UPDATE public.jars SET percentage = 10 WHERE jar_id = 'ffa';
UPDATE public.jars SET percentage = 10 WHERE jar_id = 'lts';
UPDATE public.jars SET percentage = 10 WHERE jar_id = 'edu';
UPDATE public.jars SET percentage = 10 WHERE jar_id = 'play';
UPDATE public.jars SET percentage = 5 WHERE jar_id = 'give';
