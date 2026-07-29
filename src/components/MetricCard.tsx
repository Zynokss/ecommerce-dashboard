import React from 'react';
import type { MetricCardData } from '../types';
import { Users, DollarSign, ShoppingCart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  data: MetricCardData;
}

export const MetricCard: React.FC<MetricCardProps> = ({ data }) => {
  const getIcon = () => {
    if (data.title.toLowerCase().includes('customer')) return Users;
    if (data.title.toLowerCase().includes('revenue')) return DollarSign;
    return ShoppingCart;
  };

  const Icon = getIcon();

  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-200 group">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
          <Icon className="w-5 h-5" />
        </div>

        <div
          className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
            data.isPositive
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
              : 'bg-rose-50 text-rose-500 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60'
          }`}
        >
          {data.isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          {data.change}
        </div>
      </div>

      {/* Metric Value */}
      <div>
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
          {data.title}
        </p>
        <div className="flex items-baseline justify-between">
          <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {data.value}
          </h3>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            vs {data.timeframe.toLowerCase()}
          </span>
        </div>
      </div>
    </div>
  );
};