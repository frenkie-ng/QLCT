import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, PieChart, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import LoadingScreen from '../components/LoadingScreen';
import {
  PERIOD, startOfPeriod, addPeriods, filterPeriod, totals, groupTotals, buildTrend,
  formatPeriodLabel, formatVND, formatCompact, percentChange
} from '../lib/reportUtils';
import '../styles/reports.css';

const FALLBACK_COLORS = ['#00d1ff', '#7000ff', '#00ff94', '#ffb800', '#ff00c8', '#ff3d00', '#a1a1aa'];
const TREND_POINTS = { [PERIOD.WEEK]: 8, [PERIOD.MONTH]: 6 };

const DeltaBadge = ({ change, goodWhenUp }) => {
  if (change === null) return null;
  if (change === 0) return <span className="rp-delta">không đổi so với kỳ trước</span>;
  const up = change > 0;
  const good = up === goodWhenUp;
  return (
    <span className={`rp-delta ${good ? 'good' : 'bad'}`}>
      {up ? '▲' : '▼'} {Math.abs(change)}% so với kỳ trước
    </span>
  );
};

const SummaryCard = ({ icon, label, value, color, children }) => (
  <div className="rp-summary glass-card">
    <div className="rp-summary-icon" style={{ background: `${color}22`, color }}>{icon}</div>
    <div>
      <span className="rp-summary-label">{label}</span>
      <strong className="rp-summary-value" style={{ color }}>{value}</strong>
      {children}
    </div>
  </div>
);

const Breakdown = ({ title, rows, emptyText }) => {
  const sum = rows.reduce((s, r) => s + r.value, 0);
  return (
    <div className="rp-card glass-card">
      <h3>{title}</h3>
      {rows.length === 0 ? (
        <p className="rp-empty">{emptyText}</p>
      ) : rows.map(r => {
        const pct = sum > 0 ? (r.value / sum) * 100 : 0;
        return (
          <div className="rp-row" key={r.key}>
            <div className="rp-row-head">
              <span className="rp-dot" style={{ background: r.color }} />
              <span className="rp-row-name">{r.name}</span>
              <span className="rp-row-value">{formatVND(r.value)}</span>
              <span className="rp-row-pct">{Math.round(pct)}%</span>
            </div>
            <div className="rp-bar-bg">
              <div className="rp-bar-fill" style={{ width: `${pct}%`, background: r.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Reports = () => {
  const { transactions, jars, categories, isLoading } = useFinance();
  const [mode, setMode] = useState(PERIOD.WEEK);
  const [refDate, setRefDate] = useState(() => new Date());

  const report = useMemo(() => {
    const start = startOfPeriod(refDate, mode);
    const end = addPeriods(start, mode, 1);
    const prevStart = addPeriods(start, mode, -1);
    const list = filterPeriod(transactions, start, end);

    const categoryColor = (type, name) =>
      categories.find(c => c.type === type && c.name === name)?.color;
    const byCategory = (type, catType) =>
      groupTotals(list, type, t => t.category || 'Khác').map((r, i) => ({
        ...r,
        name: r.key,
        color: categoryColor(catType, r.key) || FALLBACK_COLORS[i % FALLBACK_COLORS.length]
      }));
    const byJar = groupTotals(list, 'out', t => t.jar_id || t.jarId || 'unknown').map((r, i) => {
      const jar = jars.find(j => j.id === r.key);
      return { ...r, name: jar?.name || 'Không xác định', color: jar?.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length] };
    });

    return {
      start,
      isCurrent: start.getTime() >= startOfPeriod(new Date(), mode).getTime(),
      current: totals(list),
      previous: totals(filterPeriod(transactions, prevStart, start)),
      trend: buildTrend(transactions, mode, start, TREND_POINTS[mode]),
      incomeByCategory: byCategory('in', 'income'),
      expenseByCategory: byCategory('out', 'expense'),
      expenseByJar: byJar
    };
  }, [transactions, jars, categories, mode, refDate]);

  const shift = (n) => setRefDate(addPeriods(report.start, mode, n));
  const { current, previous } = report;

  if (isLoading) return <LoadingScreen message="Đang tải báo cáo..." />;

  return (
    <div className="rp-page">
      <Link to="/" className="rp-back"><ArrowLeft size={18} /> Quay lại Dashboard</Link>

      <header className="rp-header">
        <div className="rp-title">
          <PieChart size={32} color="var(--accent-cyan)" />
          <div>
            <h1>Báo cáo Thu Chi</h1>
            <p className="rp-muted">Tổng hợp theo tuần (Thứ Hai – Chủ Nhật) và theo tháng</p>
          </div>
        </div>
        <div className="rp-toggle">
          <button className={mode === PERIOD.WEEK ? 'active' : ''} onClick={() => setMode(PERIOD.WEEK)}>Tuần</button>
          <button className={mode === PERIOD.MONTH ? 'active' : ''} onClick={() => setMode(PERIOD.MONTH)}>Tháng</button>
        </div>
      </header>

      <div className="rp-nav">
        <button onClick={() => shift(-1)} aria-label="Kỳ trước"><ChevronLeft size={20} /></button>
        <span className="rp-nav-label">
          {formatPeriodLabel(report.start, mode)}
          {report.isCurrent && <em>{mode === PERIOD.WEEK ? 'Tuần này' : 'Tháng này'}</em>}
        </span>
        <button onClick={() => shift(1)} disabled={report.isCurrent} aria-label="Kỳ sau"><ChevronRight size={20} /></button>
      </div>

      <section className="rp-summary-grid">
        <SummaryCard icon={<TrendingUp size={22} />} label="Tổng thu" value={formatVND(current.income)} color="var(--accent-success)">
          <DeltaBadge change={percentChange(current.income, previous.income)} goodWhenUp />
        </SummaryCard>
        <SummaryCard icon={<TrendingDown size={22} />} label="Tổng chi" value={formatVND(current.expense)} color="var(--accent-danger)">
          <DeltaBadge change={percentChange(current.expense, previous.expense)} goodWhenUp={false} />
        </SummaryCard>
        <SummaryCard
          icon={<Scale size={22} />}
          label="Chênh lệch (thu − chi)"
          value={`${current.balance > 0 ? '+' : ''}${formatVND(current.balance)}`}
          color={current.balance >= 0 ? 'var(--accent-cyan)' : 'var(--accent-warning)'}
        >
          <span className="rp-delta">{current.count} giao dịch</span>
        </SummaryCard>
      </section>

      <section className="rp-card glass-card">
        <h3>Thu và chi {TREND_POINTS[mode]} {mode === PERIOD.WEEK ? 'tuần' : 'tháng'} gần nhất</h3>
        <div className="rp-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={report.trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="label" stroke="#71717a" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="#71717a" tickLine={false} axisLine={false} fontSize={12} tickFormatter={formatCompact} width={48} />
              <Tooltip
                formatter={(value) => formatVND(value)}
                contentStyle={{ background: '#1c1c1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelStyle={{ color: '#a1a1aa' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Legend />
              <Bar dataKey="income" name="Thu" fill="#00ff94" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Chi" fill="#ff3d00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rp-breakdowns">
        <Breakdown title="Chi theo danh mục" rows={report.expenseByCategory} emptyText="Chưa có khoản chi trong kỳ này." />
        <Breakdown title="Chi theo hũ" rows={report.expenseByJar} emptyText="Chưa có khoản chi trong kỳ này." />
        <Breakdown title="Thu theo danh mục" rows={report.incomeByCategory} emptyText="Chưa có khoản thu trong kỳ này." />
      </section>
    </div>
  );
};

export default Reports;
