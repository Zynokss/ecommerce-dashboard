import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, X, AlertCircle, Star, FolderPlus, Tag } from 'lucide-react';
import type { Product } from '../types';

interface ProductsViewProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => Promise<void> | void;
  onUpdateProduct: (product: Product) => Promise<void> | void;
  onDeleteProduct: (id: string) => Promise<void> | void;
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function ProductsView({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}: ProductsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>([
    'Streetwear',
    'Hoodies',
    'Tees',
    'Accessories',
    'Footwear',
  ]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Streetwear');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [brand, setBrand] = useState('ZYN');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [stockStatus, setStockStatus] = useState<'In Stock' | 'Low Stock' | 'Out of Stock'>('In Stock');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [colorInput, setColorInput] = useState('');
  const [featured, setFeatured] = useState(false);

  React.useEffect(() => {
    const categoriesFromProducts = products.map((p) => p.category).filter(Boolean);
    setCustomCategories((prev) => Array.from(new Set([...prev, ...categoriesFromProducts])));
  }, [products]);

  const handleOpenModal = (product?: Product) => {
    setError('');
    setIsAddingNewCategory(false);
    setNewCategoryInput('');
    if (product) {
      setEditingProduct(product);
      setName(product.name);
      setCategory(product.category);
      setBrand(product.brand || 'ZYN');
      setPrice(String(product.price));
      setDescription(product.description || '');
      setImage(product.image);
      setStockStatus(product.stockStatus);
      setSelectedSizes(product.sizes || ['S', 'M', 'L', 'XL']);
      setFeatured(Boolean(product.featured));
      setColorInput(
        Array.isArray(product.colors)
          ? product.colors.map((c) => (typeof c === 'string' ? c : c.name)).join(', ')
          : ''
      );
    } else {
      setEditingProduct(null);
      setName('');
      setCategory(customCategories[0] || 'Streetwear');
      setBrand('ZYN');
      setPrice('');
      setDescription('');
      setImage('');
      setStockStatus('In Stock');
      setSelectedSizes(['S', 'M', 'L', 'XL']);
      setFeatured(false);
      setColorInput('');
    }
    setIsModalOpen(true);
  };

  const handleCreateCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    if (!customCategories.includes(trimmed)) {
      setCustomCategories((prev) => [...prev, trimmed]);
    }
    setCategory(trimmed);
    setIsAddingNewCategory(false);
    setNewCategoryInput('');
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');

    const parsedColors = colorInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const activeCategory = isAddingNewCategory && newCategoryInput.trim() 
      ? newCategoryInput.trim() 
      : category;

    if (isAddingNewCategory && newCategoryInput.trim() && !customCategories.includes(newCategoryInput.trim())) {
      setCustomCategories((prev) => [...prev, newCategoryInput.trim()]);
    }

    const productPayload = {
      name,
      category: activeCategory,
      brand,
      price: Number(price) || 0,
      description: description || name,
      image: image || 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=500&auto=format&fit=crop',
      stockStatus,
      stockCount: stockStatus === 'In Stock' ? 50 : 0,
      sizes: selectedSizes,
      colors: parsedColors,
      featured,
      totalSales: editingProduct ? editingProduct.totalSales : 0,
    };

    try {
      if (editingProduct) {
        await onUpdateProduct({ ...editingProduct, ...productPayload });
      } else {
        await onAddProduct(productPayload);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to sync product to database.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/50 dark:border-white/[0.08] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-100 dark:text-white">Inventory & Products</h2>
          <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">Manage live store catalog items, variants, and stock status</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#7c5cfc] hover:bg-[#6b4af3] text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#1c202c]/90 dark:bg-[#0e1015]/90 border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-slate-100 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#7c5cfc]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-[#1c202c]/90 dark:bg-[#0e1015]/90 border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-slate-100 dark:text-slate-100 focus:outline-none cursor-pointer font-medium"
          >
            <option value="All" className="bg-[#121520]">All Categories ({products.length})</option>
            {customCategories.map((cat) => (
              <option key={cat} value={cat} className="bg-[#121520]">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#1c202c]/90 dark:bg-[#0e1015]/90 border border-slate-700/50 dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/50 dark:border-white/[0.08] bg-[#121520] dark:bg-[#08090d] text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Item Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Variants</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 dark:divide-white/5 text-xs text-slate-300">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-700/30 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-9 w-9 object-cover rounded-lg border border-slate-700/50 dark:border-white/10 shrink-0 bg-[#121520]"
                      />
                      <div>
                        <p className="font-bold text-slate-100 dark:text-white flex items-center gap-1.5">
                          {product.name}
                         {product.featured && (
            <span title="Featured on Storefront">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </span>
                    )}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: #{product.id.slice(-6)}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#121520] text-slate-300 text-[11px] font-medium border border-slate-700/50 dark:border-white/10">
                        <Tag className="w-2.5 h-2.5 text-slate-400" /> {product.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-100 dark:text-white">
                      {product.price.toFixed(2)} MAD
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {product.sizes?.map((sz) => (
                          <span key={sz} className="px-1.5 py-0.5 bg-[#121520] border border-slate-700/50 dark:border-white/10 rounded text-[10px] font-mono font-bold text-slate-300">
                            {sz}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          product.stockStatus === 'In Stock'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {product.stockStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-1.5 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-[#7c5cfc] transition-colors cursor-pointer"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(product.id)}
                          className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c202c] dark:bg-[#0e1015] border border-slate-700/60 dark:border-white/[0.1] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 p-6 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-700/50 dark:border-white/[0.08] pb-3">
              <h3 className="text-sm font-bold text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1 block">Product Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. ZYN Heavyweight Oversized Hoodie"
                  className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Category</label>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                    className="text-[11px] font-semibold text-[#7c5cfc] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FolderPlus className="w-3 h-3" />
                    {isAddingNewCategory ? 'Select Existing' : '+ New Category'}
                  </button>
                </div>
                {isAddingNewCategory ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter new category (e.g. Jackets)"
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                    />
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      className="px-3 py-2 bg-slate-700 text-white text-xs font-semibold rounded-xl hover:bg-slate-600 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {customCategories.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#121520]">
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1 block">Brand / Line</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1 block">Price (MAD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1 block">Sizes Available</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {AVAILABLE_SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer border ${
                        selectedSizes.includes(sz)
                          ? 'bg-[#7c5cfc] text-white border-[#7c5cfc]'
                          : 'bg-[#121520] text-slate-400 border-slate-700/50'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1 block">Color Variants</label>
                <input
                  type="text"
                  placeholder="Pitch Black, Studio Gray, Earth Brown"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1 block">Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#121520] border border-slate-700/50 dark:border-white/[0.08] rounded-xl">
                <span className="text-xs font-semibold text-slate-200">Spotlight on Store Front Page</span>
                <button
                  type="button"
                  onClick={() => setFeatured(!featured)}
                  className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                    featured ? 'bg-[#7c5cfc]' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${featured ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-700/50 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#7c5cfc] hover:bg-[#6b4af3] text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}