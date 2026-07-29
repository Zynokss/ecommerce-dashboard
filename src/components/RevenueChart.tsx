import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { RevenueChartPoint } from '../types';
import { TrendingUp, BarChart2, Activity } from 'lucide-react';

interface RevenueChartProps {
  data: RevenueChartPoint[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white dark:bg-slate-800 px-4 py-2.5 rounded-xl shadow-xl text-center border border-slate-700">
        <p className="text-xs font-bold text-indigo-400">
          ${(payload[0].value * 1.2).toFixed(1)}K Gross
        </p>
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
          {label} 2026
        </p>
      </div>
    );
  }
  return null;
};

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '12M' | 'YTD'>('12M');

  // Dynamic datasets for timeframe switching
  const getDisplayData = () => {
    switch (timeframe) {
      case '7D':
        return [
          { month: 'MON', firstHalf: 12, topGross: 18 },
          { month: 'TUE', firstHalf: 19, topGross: 24 },
          { month: 'WED', firstHalf: 15, topGross: 22 },
          { month: 'THU', firstHalf: 28, topGross: 35 },
          { month: 'FRI', firstHalf: 32, topGross: 42 },
          { month: 'SAT', firstHalf: 45, topGross: 58 },
          { month: 'SUN', firstHalf: 38, topGross: 48 },
        ];
      case '30D':
        return [
          { month: 'W1', firstHalf: 42, topGross: 65 },
          { month: 'W2', firstHalf: 58, topGross: 82 },
          { month: 'W3', firstHalf: 72, topGross: 98 },
          { month: 'W4', firstHalf: 88, topGross: 125 },
        ];
      case 'YTD':
        return data.slice(0, 7);
      case '12M':
      default:
        return data;
    }
  };

  const chartPoints = getDisplayData();
  const maxVal = Math.max(...chartPoints.map((d) => Math.max(d.firstHalf, d.topGross)), 1);

  return (
    <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
      {/* Header Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Revenue Trajectory</h2>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
              <TrendingUp className="w-3 h-3" />
              +18.4%
            </span>
          </div>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
            Real-time revenue performance comparison over selected periods
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          {/* Chart Style Switcher (Area vs Bar) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => setChartType('area')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartType === 'area'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Area Wave Chart View"
            >
              <Activity className="w-3.5 h-3.5" />
              Area
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartType === 'bar'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Comparative Bar Chart View"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Bar
            </button>
          </div>

          {/* Timeframe Selector Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            {(['7D', '30D', '12M', 'YTD'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex items-center gap-6 text-xs font-bold">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-xs"></span>
          Current Period (Gross Revenue)
        </div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-xs"></span>
          {chartType === 'area' ? 'Previous Period' : 'Target Benchmark'}
        </div>
      </div>

      {/* LAYOUT 1: Recharts Area Chart */}
      {chartType === 'area' ? (
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIndigo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorViolet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                domain={[0, 'dataMax + 20']}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="topGross"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorIndigo)"
              />

              <Area
                type="monotone"
                dataKey="firstHalf"
                stroke="#a855f7"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorViolet)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        /* LAYOUT 2: Comparative Bar Chart with Top Tooltip Popups */
        <div className="h-72 flex items-end justify-between gap-2 pt-8 pb-2">
          {chartPoints.map((point, idx) => {
            const heightNet = Math.round((point.topGross / maxVal) * 100);
            const heightTarget = Math.round((point.firstHalf / maxVal) * 100);

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end relative group">
                {/* Floating Top Tooltip Badge */}
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 whitespace-nowrap bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg border border-slate-700/80">
                  Gross: ${point.topGross}k | Target: ${point.firstHalf}k
                </div>

                <div className="w-full flex items-end justify-center gap-1 h-full px-0.5">
                  {/* Target Bar */}
                  <div
                    style={{ height: `${heightTarget}%` }}
                    className="w-1/2 bg-violet-200 dark:bg-violet-950/80 rounded-t-sm transition-all duration-300 group-hover:bg-violet-300 dark:group-hover:bg-violet-900 cursor-pointer"
                  />
                  {/* Net Bar */}
                  <div
                    style={{ height: `${heightNet}%` }}
                    className="w-1/2 bg-indigo-600 rounded-t-sm transition-all duration-300 group-hover:bg-indigo-500 cursor-pointer"
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {point.month}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};