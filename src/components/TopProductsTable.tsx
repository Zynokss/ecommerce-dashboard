import React from 'react';
import type { Product } from '../types';

interface TopProductsTableProps {
  products: Product[];
  onSeeAll?: () => void;
}

export const TopProductsTable: React.FC<TopProductsTableProps> = ({ products, onSeeAll }) => {
  // Only display the Top 5 items on the Home view preview
  const topProducts = products.slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Top selling products</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">Performance breakdown by item</p>
        </div>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            See all
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
              <th className="pb-3">S/NO</th>
              <th className="pb-3">PRODUCT NAME</th>
              <th className="pb-3">CATEGORY</th>
              <th className="pb-3">STOCK</th>
              <th className="pb-3 text-right">TOTAL SALES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {topProducts.map((product, idx) => (
              <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3 font-semibold text-slate-400">0{idx + 1}</td>
                <td className="py-3 font-bold text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="py-3 text-slate-500 dark:text-slate-400">{product.category}</td>
                <td className="py-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      product.stockStatus === 'In Stock'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                        : 'bg-rose-50 text-rose-500 dark:bg-rose-950/50 dark:text-rose-400'
                    }`}
                  >
                    {product.stockStatus}
                  </span>
                </td>
                <td className="py-3 text-right font-bold text-slate-900 dark:text-white">
                  {(product.totalSales ? (product.totalSales / 1000).toFixed(2) : '1.20')}k
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};