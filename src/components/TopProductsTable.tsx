import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowUpRight } from 'lucide-react';

export interface RankedProduct {
  id: string;
  name: string;
  image: string;
  category: string;
  unitsSold: number;
  revenue: number;
}

interface TopProductsTableProps {
  products: RankedProduct[];
  onSeeAll?: () => void;
}

export const TopProductsTable: React.FC<TopProductsTableProps> = ({ products, onSeeAll }) => {
  const topProducts = products.slice(0, 5);

  return (
    <div className="bg-white dark:bg-[#121215] rounded-xl p-5 sm:p-6 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs space-y-4 transition-colors duration-200">
      {/* Table Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/60 pb-3.5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-indigo-500" /> Top Selling Products
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Ranked by units sold across live orders</p>
        </div>
        {onSeeAll && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSeeAll}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            See Catalog <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>

      {topProducts.length === 0 ? (
        <div className="py-10 text-center text-slate-400 dark:text-zinc-500 text-xs">
          No completed orders yet — top sellers will appear once orders come in.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-medium text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800/60">
                <th className="pb-2.5 px-3">#</th>
                <th className="pb-2.5 px-3">Product</th>
                <th className="pb-2.5 px-3">Category</th>
                <th className="pb-2.5 px-3 text-right">Units Sold</th>
                <th className="pb-2.5 px-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-xs font-medium">
              {topProducts.map((product, idx) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50 dark:hover:bg-zinc-900/60 transition-colors group"
                >
                  <td className="py-3 px-3 text-slate-400 dark:text-zinc-500 font-medium">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-8 h-8 rounded-md object-cover border border-slate-200 dark:border-zinc-800 shrink-0"
                      />
                      <span className="font-semibold text-slate-900 dark:text-zinc-100 line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-500 dark:text-zinc-400">{product.category}</td>
                  <td className="py-3 px-3 text-right text-slate-700 dark:text-zinc-300">{product.unitsSold}</td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-900 dark:text-zinc-100">
                    {product.revenue.toFixed(2)} MAD
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
