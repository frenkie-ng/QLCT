export const PERIOD = { WEEK: 'week', MONTH: 'month' };

const pad = (n) => String(n).padStart(2, '0');
const formatDayMonth = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;

// Tuần bắt đầu từ Thứ Hai. Tất cả tính theo giờ địa phương.
export const startOfPeriod = (date, mode) => {
  const d = new Date(date);
  if (mode === PERIOD.MONTH) return new Date(d.getFullYear(), d.getMonth(), 1);
  const daysFromMonday = (d.getDay() + 6) % 7;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - daysFromMonday);
};

export const addPeriods = (start, mode, n) =>
  mode === PERIOD.MONTH
    ? new Date(start.getFullYear(), start.getMonth() + n, 1)
    : new Date(start.getFullYear(), start.getMonth(), start.getDate() + n * 7);

export const filterPeriod = (transactions, start, end) =>
  transactions.filter(t => {
    const time = new Date(t.date).getTime();
    return time >= start.getTime() && time < end.getTime();
  });

export const totals = (list) => {
  let income = 0;
  let expense = 0;
  list.forEach(t => {
    const amount = Number(t.amount) || 0;
    if (t.type === 'in') income += amount;
    else if (t.type === 'out') expense += amount;
  });
  return { income, expense, balance: income - expense, count: list.length };
};

// Gom theo khoá (danh mục, hũ...) cho một loại giao dịch, sắp xếp giảm dần.
export const groupTotals = (list, type, keyFn) => {
  const map = new Map();
  list.forEach(t => {
    if (t.type !== type) return;
    const key = keyFn(t);
    map.set(key, (map.get(key) || 0) + (Number(t.amount) || 0));
  });
  return [...map.entries()]
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value);
};

// `count` kỳ liên tiếp kết thúc ở kỳ bắt đầu tại `lastStart`, dùng cho biểu đồ cột.
export const buildTrend = (transactions, mode, lastStart, count) => {
  const points = [];
  for (let i = count - 1; i >= 0; i--) {
    const start = addPeriods(lastStart, mode, -i);
    const end = addPeriods(start, mode, 1);
    const { income, expense } = totals(filterPeriod(transactions, start, end));
    const label = mode === PERIOD.MONTH
      ? `T${start.getMonth() + 1}/${String(start.getFullYear()).slice(2)}`
      : formatDayMonth(start);
    points.push({ label, income, expense });
  }
  return points;
};

export const formatPeriodLabel = (start, mode) => {
  if (mode === PERIOD.MONTH) return `Tháng ${start.getMonth() + 1}/${start.getFullYear()}`;
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  return `${formatDayMonth(start)} – ${formatDayMonth(end)}/${end.getFullYear()}`;
};

export const formatVND = (n) => `${Math.round(n).toLocaleString('vi-VN')}đ`;

export const formatCompact = (n) => {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${+(n / 1e9).toFixed(1)}tỷ`;
  if (abs >= 1e6) return `${+(n / 1e6).toFixed(1)}tr`;
  if (abs >= 1e3) return `${+(n / 1e3).toFixed(0)}k`;
  return String(n);
};

// Phần trăm thay đổi so với kỳ trước; null nếu kỳ trước bằng 0 (không có mốc so sánh).
export const percentChange = (current, previous) =>
  previous > 0 ? Math.round(((current - previous) / previous) * 100) : null;
