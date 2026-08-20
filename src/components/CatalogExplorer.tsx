import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '../types';
import {
  Search,
  Tag,
  Eye,
  ShoppingBag,
  Star,
  X,
  Package,
  Layers
} from 'lucide-react';

interface CatalogExplorerProps {
  products: Product[];
}

export const CatalogExplorer: React.FC<CatalogExplorerProps> = ({
  products
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProductPreview, setSelectedProductPreview] = useState<Product | null>(null);

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800/60 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Catalog Grid</h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Visual grid view of live storefront merchandise and stock availability
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-zinc-300 bg-white dark:bg-[#121215] px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-zinc-800/80">
          <Layers className="w-3.5 h-3.5 text-indigo-500" />
          <span>{filteredProducts.length} items</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#121215] p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search catalog by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 border border-slate-200/80 dark:border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800/80 rounded-xl p-12 text-center text-slate-400 dark:text-zinc-500 text-xs">
          <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
          No products found matching active filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs group flex flex-col justify-between"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-zinc-900">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border backdrop-blur-md ${
                    product.stockStatus === 'In Stock'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${product.stockStatus === 'In Stock' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {product.stockStatus}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 dark:bg-zinc-900/90 text-slate-700 dark:text-zinc-300 text-[10px] font-medium border border-slate-200/80 dark:border-zinc-800 backdrop-blur-md">
                    <Tag className="w-2.5 h-2.5 text-indigo-500" /> {product.category}
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <button
                    onClick={() => setSelectedProductPreview(product)}
                    className="flex items-center gap-1.5 bg-white text-slate-900 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xl hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-500" /> Preview Item
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900 dark:text-zinc-100 text-xs line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {product.name}
                  </h3>
                  {product.featured && (
                    <span title="Featured Item">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800/60">
                  <div className="flex items-center gap-1">
                    {product.sizes?.map((sz) => (
                      <span key={sz} className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded text-[9px] font-medium text-slate-500 dark:text-zinc-400">
                        {sz}
                      </span>
                    ))}
                  </div>

                  <span className="font-bold text-xs text-slate-900 dark:text-zinc-100">
                    {product.price.toFixed(2)} MAD
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {selectedProductPreview && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 p-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/60 pb-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-indigo-500" /> Product Preview
                </h3>
                <button
                  onClick={() => setSelectedProductPreview(null)}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-zinc-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={selectedProductPreview.image}
                  alt={selectedProductPreview.name}
                  className="w-full sm:w-40 h-40 object-cover rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900"
                />
                <div className="space-y-2 flex-1">
                  <span className="inline-block px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[10px] font-medium rounded-md">
                    {selectedProductPreview.category}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-zinc-100 text-sm">{selectedProductPreview.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-3">
                    {selectedProductPreview.description || 'No item description available.'}
                  </p>
                  <p className="text-base font-bold text-slate-900 dark:text-zinc-100 pt-2">
                    {selectedProductPreview.price.toFixed(2)} MAD
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-zinc-800/60">
                <button
                  onClick={() => setSelectedProductPreview(null)}
                  className="px-4 py-2 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
