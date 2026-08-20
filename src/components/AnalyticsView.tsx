import React from 'react';
import {
  ShoppingBag,
  DollarSign,
  Zap,
  Activity,
  PieChart,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';
import type { RevenueChartPoint, Order } from '../types';
import type { CategoryBreakdown } from '../lib/dashboardService';

interface AnalyticsViewProps {
  revenueData?: RevenueChartPoint[];
  topCategories?: CategoryBreakdown[];
  orders?: Order[];
}

const PALETTE = ['#6366f1', '#38bdf8', '#34d399', '#f59e0b', '#f43f5e', '#a855f7'];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  revenueData = [],
  topCategories = [],
  orders = []
}) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const categoryTotal = topCategories.reduce((sum, c) => sum + c.numericTotal, 0);
  const categorySlices = topCategories
    .slice(0, 6)
    .map((c, i) => ({
      name: c.name,
      value: categoryTotal > 0 ? Number(((c.numericTotal / categoryTotal) * 100).toFixed(1)) : 0,
      amount: c.amount,
      color: PALETTE[i % PALETTE.length],
    }));

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="border-b border-slate-200 dark:border-zinc-800/60 pb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
          Store Analytics <Activity className="w-4 h-4 text-indigo-500" />
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Revenue trajectory, category share, and order economics — computed from live store data
        </p>
      </div>

      {/* Metric Summary Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Total Revenue</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
            {totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })} MAD
          </p>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500">Across {totalOrders} order{totalOrders === 1 ? '' : 's'}</p>
        </div>

        <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Total Orders</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">{totalOrders}</p>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500">All statuses combined</p>
        </div>

        <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Avg Order Value</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
            {avgOrderValue.toFixed(2)} MAD
          </p>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500">Revenue ÷ order count</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800/80 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/60 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-500" /> Revenue Trajectory
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Revenue across your most recent orders</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            {revenueData.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-xs text-slate-400 dark:text-zinc-500">
                No orders yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="analyticsIndigo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-zinc-800/80" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    formatter={(value) => [`${Number(value).toFixed(2)} MAD`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#analyticsIndigo)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Share Donut */}
        <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800/80 rounded-xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-zinc-800/60 pb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-500" /> Category Revenue Share
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Real merchandise revenue breakdown</p>
          </div>

          {categorySlices.length === 0 ? (
            <div className="h-48 w-full flex items-center justify-center text-xs text-slate-400 dark:text-zinc-500">
              No category sales yet.
            </div>
          ) : (
            <>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={categorySlices}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categorySlices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, _name, item) => [`${value}% (${(item.payload as { amount: string }).amount})`, (item.payload as { name: string }).name]}
                      contentStyle={{
                        backgroundColor: '#18181b',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800/60">
                {categorySlices.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 dark:text-zinc-300 font-medium">{item.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-zinc-100">{item.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
