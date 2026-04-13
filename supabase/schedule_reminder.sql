-- 1. Kích hoạt các tiện ích cần thiết (Chạy lệnh này trong SQL Editor của Supabase)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Xoá job cũ nếu tồn tại để tránh trùng lặp
SELECT cron.unschedule('daily-reminder-job');

-- 3. Lên lịch chạy Edge Function vào lúc 21:00 hàng ngày (Giờ VN)
-- Lưu ý: Supabase server chạy giờ UTC, nên 21:00 VN tương đương 14:00 UTC
-- Công thức Cron: 'phút giờ ngày tháng thứ'
SELECT cron.schedule(
  'daily-reminder-job',
  '0 14 * * *', 
  $$
  SELECT
    net.http_post(
      url:='https://rqrewpalqdfkxeheeufh.supabase.co/functions/v1/daily-reminder',
      headers:='{
        "Content-Type": "application/json", 
        "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"
      }'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);

-- HƯỚNG DẪN:
-- Thay 'YOUR_SERVICE_ROLE_KEY' bằng Service Role Key tìm thấy trong: 
-- Project Settings -> API -> service_role (secret)
-- Tuyệt đối không để lộ key này ở phía client (frontend).
