import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, X, AlertCircle } from 'lucide-react';
import type { Product } from '../types';
import { createProductInDb, updateProductInDb, deleteProductFromDb } from '../lib/productService';

interface ProductsViewProps {
  products: Product[];
  setProducts?: React.Dispatch<React.SetStateAction<Product[]>>;
  onAddProduct?: (product: Omit<Product, 'id'>) => Promise<void> | void;
  onUpdateProduct?: (product: Product) => Promise<void> | void;
  onDeleteProduct?: (id: string) => Promise<void> | void;
}

export function ProductsView({
  products,
  setProducts,
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

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Streetwear');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [stockStatus, setStockStatus] = useState<'In Stock' | 'Low Stock' | 'Out of Stock'>('In Stock');
  const [hasColors, setHasColors] = useState(false);
  const [colorInput, setColorInput] = useState('');

  const handleOpenModal = (product?: Product) => {
    setError('');
    if (product) {
      setEditingProduct(product);
      setName(product.name);
      setCategory(product.category);
      setPrice(String(product.price));
      setDescription(product.description || '');
      setImage(product.image);
      setStockStatus(product.stockStatus);
      if (product.colors && product.colors.length > 0) {
        setHasColors(true);
        setColorInput(product.colors.join(', '));
      } else {
        setHasColors(false);
        setColorInput('');
      }
    } else {
      setEditingProduct(null);
      setName('');
      setCategory('Streetwear');
      setPrice('');
      setDescription('');
      setImage('');
      setStockStatus('In Stock');
      setHasColors(false);
      setColorInput('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');

    const parsedColors = hasColors
      ? colorInput
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

    const productPayload = {
      name,
      category,
      price: Number(price) || 0,
      description: description || name,
      image: image || 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=500&auto=format&fit=crop',
      stockStatus,
      stockCount: stockStatus === 'In Stock' ? 50 : 0,
      colors: parsedColors,
    };

    try {
      if (editingProduct) {
        const fullUpdatedProduct: Product = {
          ...editingProduct,
          ...productPayload,
          totalSales: editingProduct.totalSales || 0,
        };

        if (onUpdateProduct) {
          await onUpdateProduct(fullUpdatedProduct);
        } else {
          const updated = await updateProductInDb(fullUpdatedProduct);
          if (setProducts) {
            setProducts((prev) =>
              prev.map((p) =>
                p.id === editingProduct.id
                  ? {
                      ...p,
                      ...productPayload,
                      id: String(updated.id || editingProduct.id),
                    }
                  : p
              )
            );
          }
        }
      } else {
        if (onAddProduct) {
          await onAddProduct({
            ...productPayload,
            totalSales: 0,
          });
        } else {
          const created = await createProductInDb(productPayload as any);

          const newProdObj: Product = {
            id: String(created.id || Date.now()),
            name: created.name || name,
            category: created.category || category,
            price: Number(created.price) || Number(price) || 0,
            description: created.description || description,
            image: created.image || productPayload.image,
            stockStatus: created.inStock ? 'In Stock' : 'Out of Stock',
            stockCount: created.inStock ? 50 : 0,
            totalSales: 0,
            colors: parsedColors,
          };

          if (setProducts) {
            setProducts((prev) => [newProdObj, ...prev]);
          }
        }
      }

      handleCloseModal();
    } catch (err: any) {
      console.error('Failed to save product:', err);
      setError(err.message || 'Failed to sync product to database.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      if (onDeleteProduct) {
        await onDeleteProduct(id);
      } else {
        await deleteProductFromDb(id);
        if (setProducts) {
          setProducts((prev) => prev.filter((p) => p.id !== id));
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete product.');
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
    <div className="p-6 space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Products Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage store inventory and product variants</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer w-fit"
        >
          <Plus className="h-4 w-4" /> Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
          >
            <option value="All">All Categories</option>
            <option value="Streetwear">Streetwear</option>
            <option value="Apparel">Apparel</option>
            <option value="Jerseys">Jerseys</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Colors</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-10 w-10 object-cover rounded-lg bg-slate-100 dark:bg-slate-800"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{product.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">ID: {product.id}</p>
                  </div>
                </td>
                <td className="p-4 font-medium">{product.category}</td>
                <td className="p-4 font-semibold text-slate-900 dark:text-white">{product.price.toFixed(2)} MAD</td>
                <td className="p-4">
                  {product.colors && product.colors.length > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                      {product.colors.length} Variant(s)
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">None</span>
                  )}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      product.stockStatus === 'In Stock'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                    }`}
                  >
                    {product.stockStatus}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-xl space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Streetwear">Streetwear</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Jerseys">Jerseys</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Price (MAD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Color Options Activation Toggle */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Color Variants
                  </label>
                  <button
                    type="button"
                    onClick={() => setHasColors(!hasColors)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                      hasColors
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {hasColors ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                {hasColors && (
                  <div>
                    <input
                      type="text"
                      placeholder="Pitch Black, Studio Gray, Earth Brown (comma-separated)"
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Enter names or hex values separated by commas.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs disabled:opacity-50"
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