-- Thêm cột name và description vào bảng jars nếu chưa có
ALTER TABLE public.jars 
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS description text;

-- Cập nhật tên và mô tả mặc định cho các hũ hiện có
UPDATE public.jars SET name = 'Thiết yếu', description = 'Chi trả các chi phí bắt buộc để duy trì cuộc sống hàng ngày.' WHERE jar_id = 'nec';
UPDATE public.jars SET name = 'Tự do Tài chính', description = 'Dùng để đầu tư tạo ra tiền. Tuyệt đối không tiêu vào việc khác.' WHERE jar_id = 'ffa';
UPDATE public.jars SET name = 'Tiết kiệm dài hạn', description = 'Cho các mục tiêu lớn (xe, nhà) hoặc quỹ dự phòng khẩn cấp.' WHERE jar_id = 'lts';
UPDATE public.jars SET name = 'Giáo dục', description = 'Đầu tư vào tri thức, sách vở, khóa học để tăng giá trị bản thân.' WHERE jar_id = 'edu';
UPDATE public.jars SET name = 'Hưởng thụ', description = 'Phải tiêu hết mỗi tháng để nuôi dưỡng tâm hồn và giảm áp lực.' WHERE jar_id = 'play';
UPDATE public.jars SET name = 'Cho đi', description = 'Giúp đỡ người khác, làm từ thiện, tạo năng lượng tích cực.' WHERE jar_id = 'give';
