import React, { useState } from 'react';
import type { Product } from '../types';
import { 
  Trash2, 
  RotateCcw, 
  AlertTriangle, 
  Search, 
  ShieldAlert, 
  Sparkles,
  Package,
  X
} from 'lucide-react';

interface TrashViewProps {
  deletedProducts?: Product[];
  onRestoreProduct?: (id: string) => Promise<void> | void;
  onPermanentDeleteProduct?: (id: string) => Promise<void> | void;
  onEmptyTrash?: () => Promise<void> | void;
}

export const TrashView: React.FC<TrashViewProps> = ({
  deletedProducts = [],
  onRestoreProduct,
  onPermanentDeleteProduct,
  onEmptyTrash,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmEmptyOpen, setConfirmEmptyOpen] = useState(false);

  const filteredItems = deletedProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmptyAll = async () => {
    if (onEmptyTrash) {
      await onEmptyTrash();
    }
    setConfirmEmptyOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/50 dark:border-white/[0.08] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-100 dark:text-white flex items-center gap-2">
            Trash & Recovery Bin <Trash2 className="w-4 h-4 text-rose-400" />
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">
            Restore soft-deleted products to live inventory or permanently purge database records
          </p>
        </div>

        {deletedProducts.length > 0 && (
          <button
            onClick={() => setConfirmEmptyOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Trash2 className="w-4 h-4" /> Empty Trash Bin ({deletedProducts.length})
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1c202c]/90 dark:bg-[#0e1015]/90 p-3.5 rounded-2xl border border-slate-700/50 dark:border-white/[0.08]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search deleted items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#7c5cfc]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
          <Package className="w-4 h-4 text-[#7c5cfc]" />
          <span>{deletedProducts.length} Items Archived</span>
        </div>
      </div>

      {/* Deleted Items Table */}
      <div className="bg-[#1c202c]/90 dark:bg-[#0e1015]/90 rounded-2xl border border-slate-700/50 dark:border-white/[0.08] shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#121520] dark:bg-[#08090d] border-b border-slate-700/50 dark:border-white/[0.08] text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Deleted Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-right">Recovery Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 dark:divide-white/5 text-xs text-slate-300">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 font-mono">
                    <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-30 text-[#7c5cfc]" />
                    Trash bin is clean. No deleted products found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-700/30 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-9 h-9 rounded-lg object-cover border border-slate-700/50 dark:border-white/10 shrink-0 bg-[#121520]"
                        />
                        <div>
                          <p className="font-bold text-slate-100 dark:text-white">{product.name}</p>
                          <p className="text-[10px] font-mono text-slate-400">ID: #{product.id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-medium">
                      {product.category}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-100 dark:text-white">
                      {product.price.toFixed(2)} MAD
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onRestoreProduct && (
                          <button
                            onClick={() => onRestoreProduct(product.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Restore
                          </button>
                        )}
                        {onPermanentDeleteProduct && (
                          <button
                            onClick={() => onPermanentDeleteProduct(product.id)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition-all cursor-pointer"
                            title="Permanently Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Permanent Clear */}
      {confirmEmptyOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c202c] dark:bg-[#0e1015] border border-slate-700/60 dark:border-white/[0.1] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-700/50 dark:border-white/[0.08] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Confirm Permanent Empty
              </h3>
              <button onClick={() => setConfirmEmptyOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-200">
                Are you sure you want to permanently delete all <strong>{deletedProducts.length}</strong> items in trash? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-700/50 dark:border-white/[0.08]">
              <button
                onClick={() => setConfirmEmptyOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleEmptyAll}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
              >
                Purge All Items
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};