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
import { TrendingUp, Activity, BarChart2 } from 'lucide-react';

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
      <div className="bg-slate-900 text-white dark:bg-slate-800 px-3.5 py-2 rounded-xl shadow-xl text-center border border-slate-800 dark:border-slate-700">
        <p className="text-xs font-bold text-indigo-400">
          {payload[0].value.toLocaleString()} MAD
        </p>
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
          {label}
        </p>
      </div>
    );
  }
  return null;
};

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '12M' | 'YTD'>('12M');

  return (
    <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-6">
      
      {/* Header Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Revenue Trajectory</h2>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200/80 dark:border-emerald-800/50">
              <TrendingUp className="w-3 h-3" />
              +18.4%
            </span>
          </div>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
            Real-time revenue performance comparison over selected periods
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => setChartType('area')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartType === 'area'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
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

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs font-bold">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
          Current Period (Gross Revenue)
        </div>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
          Previous Period
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIndigoGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Previous Period Dashed Line */}
            <Area
              type="monotone"
              dataKey="firstHalf"
              stroke="#a855f7"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={0}
            />
            
            {/* Current Period Solid Gradient Area */}
            <Area
              type="monotone"
              dataKey="topGross"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorIndigoGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};