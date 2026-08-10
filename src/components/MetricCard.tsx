import React from 'react';
import { motion } from 'framer-motion';
import type { MetricCardData } from '../types';
import { Users, DollarSign, ShoppingCart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  data: MetricCardData;
}

export const MetricCard: React.FC<MetricCardProps> = ({ data }) => {
  const getIcon = () => {
    if (data.title.toLowerCase().includes('customer') || data.title.toLowerCase().includes('visitor')) return Users;
    if (data.title.toLowerCase().includes('revenue') || data.title.toLowerCase().includes('sales')) return DollarSign;
    return ShoppingCart;
  };

  const Icon = getIcon();

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative overflow-hidden glass-panel p-6 rounded-3xl shadow-sm space-y-4 group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs">
          <Icon className="w-5 h-5" />
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full border shadow-2xs ${
            data.isPositive
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-500/30'
              : 'bg-rose-50 text-rose-600 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-500/30'
          }`}
        >
          {data.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {data.change}
        </div>
      </div>

      {/* Metric Content */}
      <div className="space-y-1">
        <p className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          {data.title}
        </p>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {data.value}
          </h3>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
            {data.timeframe}
          </span>
        </div>
      </div>
    </motion.div>
  );
};