import React from 'react';
import { Trash2, RotateCcw, AlertTriangle, PackageX } from 'lucide-react';
import type { Product } from '../types';

interface TrashViewProps {
  deletedProducts: Product[];
  onRestoreProduct: (id: string) => void;
  onPermanentDeleteProduct: (id: string) => void;
  onClearTrash: () => void;
}

export const TrashView: React.FC<TrashViewProps> = ({
  deletedProducts,
  onRestoreProduct,
  onPermanentDeleteProduct,
  onClearTrash,
}) => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Deleted Items Recovery
          </h2>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
            Review soft-deleted products. Restore them back to active inventory or delete them permanently.
          </p>
        </div>

        {deletedProducts.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to permanently empty the trash?')) {
                onClearTrash();
              }
            }}
            className="flex items-center gap-2 bg-rose-600/10 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 dark:border-rose-900/50 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            Empty Trash Bin
          </button>
        )}
      </div>

      {/* Main Table / Empty State */}
      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
        {deletedProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
              <PackageX className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Trash bin is empty</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Any products you delete from the catalog table will show up here for safekeeping.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Product Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Original Price</th>
                  <th className="py-3.5 px-4">Stock Level</th>
                  <th className="py-3.5 px-6 text-right">Recovery Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {deletedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 grayscale"
                        />
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{product.name}</p>
                          <p className="text-[10px] text-slate-400">ID: #{product.id.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-medium">
                      {product.category}
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </td>

                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                      {product.stockCount} units
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onRestoreProduct(product.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all font-bold text-[11px] cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Restore
                        </button>

                        <button
                          onClick={() => onPermanentDeleteProduct(product.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Delete permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deletedProducts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Restoring an item puts it back into your active catalog and inventory count immediately.</span>
        </div>
      )}
    </div>
  );
};