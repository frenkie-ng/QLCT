import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const FRONTEND_URL = Deno.env.get('FRONTEND_URL') || 'http://localhost:5173'

serve(async (req) => {
  try {
    // Khởi tạo Supabase Client với Service Role Key để có quyền admin
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // 1. Lấy danh sách tất cả người dùng từ Auth
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
    if (authError) throw authError

    const results = []

    for (const user of users) {
      if (!user.email) continue;

      // 2. Kiểm tra xem người dùng đã có giao dịch nào hôm nay chưa (theo giờ VN +7)
      // Chỉnh múi giờ để khớp với ngày hiện tại của người dùng
      const now = new Date();
      const vnTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
      const today = vnTime.toISOString().split('T')[0];

      const { count, error: transError } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('date', today)

      if (transError) {
        results.push({ email: user.email, status: 'error', error: transError })
        continue
      }

      // 3. Nếu chưa có giao dịch (count === 0), gửi email qua Resend
      if (count === 0) {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'QLTC Reminders <onboarding@resend.dev>',
            to: [user.email],
            subject: '🔔 Đừng quên cập nhật chi tiêu hôm nay!',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #0b1120; color: #fff;">
                <h2 style="color: #00d1ff; text-align: center;">Quản lý Tài chính</h2>
                <p>Xin chào,</p>
                <p>Hệ thống nhận thấy bạn chưa ghi lại giao dịch tài chính nào trong ngày hôm nay.</p>
                <p>Việc cập nhật chi tiêu đều đặn giúp bạn kiểm soát dòng tiền tốt hơn và sớm đạt được các mục tiêu tài chính.</p>
                <div style="margin: 30px 0; text-align: center;">
                  <a href="${FRONTEND_URL}" style="background-color: #00d1ff; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Cập nhật ngay</a>
                </div>
                <hr style="border: 0; border-top: 1px solid #333;" />
                <p style="font-size: 12px; color: #888; text-align: center;">Đây là email tự động từ ứng dụng QLTC của bạn.</p>
              </div>
            `,
          }),
        })

        const data = await res.json()
        results.push({ email: user.email, status: 'sent', data })
      } else {
        results.push({ email: user.email, status: 'skipped', message: 'User already updated today' })
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
