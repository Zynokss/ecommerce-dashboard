import React from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../types';
import { ShoppingBag, ArrowUpRight } from 'lucide-react';

interface TopProductsTableProps {
  products: Product[];
  onSeeAll?: () => void;
}

export const TopProductsTable: React.FC<TopProductsTableProps> = ({ products, onSeeAll }) => {
  const topProducts = products.slice(0, 5);

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-indigo-500" /> Top Selling Products
          </h3>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Inventory performance analysis</p>
        </div>
        {onSeeAll && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSeeAll}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 cursor-pointer"
          >
            See Catalog <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>

      {topProducts.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs font-medium">
          No live products recorded in store yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200/80 dark:border-white/5">
                <th className="pb-3 px-3">Rank</th>
                <th className="pb-3 px-3">Product Item</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Stock Status</th>
                <th className="pb-3 px-3 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs font-medium">
              {topProducts.map((product, idx) => (
                <tr 
                  key={product.id} 
                  className="hover:bg-indigo-500/5 transition-colors rounded-2xl group"
                >
                  <td className="py-3.5 px-3 font-extrabold text-slate-400">0{idx + 1}</td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200/80 dark:border-white/10 group-hover:scale-105 transition-transform"
                      />
                      <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">{product.category}</td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      product.stockStatus === 'In Stock'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-500/30'
                        : 'bg-rose-50 text-rose-600 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-500/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                        product.stockStatus === 'In Stock' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`} />
                      {product.stockStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-black text-slate-900 dark:text-white">
                    {product.price ? product.price.toFixed(2) : '0.00'} MAD
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};