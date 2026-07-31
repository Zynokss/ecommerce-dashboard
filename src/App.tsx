import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCard } from './components/MetricCard';
import { RevenueChart } from './components/RevenueChart';
import { TopProductsTable } from './components/TopProductsTable';
import { ProductsView } from './components/ProductsView';
import { OrdersView } from './components/OrdersView';
import { SettingsView } from './components/SettingsView';
import { SupportView } from './components/SupportView';
import { TeamAccessView } from './components/TeamAccessView';
import { TrashView } from './components/TrashView';
import { ToastContainer, type ToastMessage } from './components/Toast';
import type { Product, Order, MetricCardData } from './types';
import { fetchLiveMetrics } from './lib/dashboardService';
import {
  fetchProducts,
  createProductInDb,
  updateProductInDb,
  deleteProductFromDb,
} from './lib/productService';
import {
  mockMetrics,
  mockRevenueChart,
  mockCountries,
  mockTopCustomers,
  mockRecentOrders,
} from './mockData';
import { ArrowUpRight, ArrowDownRight, Globe2, Users2, TrendingUp, BarChart2, Search, Package } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Supabase Live Metrics State
  const [metrics, setMetrics] = useState<MetricCardData[]>(mockMetrics);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(true);

  // Filter States for Explore (Catalog Grid) Tab
  const [exploreSearch, setExploreSearch] = useState<string>('');
  const [exploreCategory, setExploreCategory] = useState<string>('All');

  // Products State (Loaded from Supabase)
  const [products, setProducts] = useState<Product[]>([]);

  // Deleted Trash Bin with LocalStorage
  const [deletedProducts, setDeletedProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('zynboard_trash_products');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders State with LocalStorage fallback
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('zynboard_orders');
    return saved ? JSON.parse(saved) : mockRecentOrders;
  });

  // Fetch Live Metrics from Supabase
  useEffect(() => {
    async function loadMetrics() {
      const liveData = await fetchLiveMetrics();
      if (liveData && liveData.length > 0) {
        setMetrics(liveData);
      }
      setIsLoadingMetrics(false);
    }
    loadMetrics();
  }, []);

  // Fetch Products from Supabase Database
  useEffect(() => {
    async function loadProducts() {
      const dbProducts = await fetchProducts();
      setProducts(dbProducts);
    }
    loadProducts();
  }, []);

  // Sync Trash & Orders to LocalStorage
  useEffect(() => {
    localStorage.setItem('zynboard_trash_products', JSON.stringify(deletedProducts));
  }, [deletedProducts]);

  useEffect(() => {
    localStorage.setItem('zynboard_orders', JSON.stringify(orders));
  }, [orders]);

  // Sync Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Toast Handler
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}`,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Async Product Actions connected to Supabase
  const handleAddProduct = async (newProdData: Omit<Product, 'id'>) => {
    try {
      const created = await createProductInDb(newProdData);
      const newProduct: Product = { ...newProdData, id: created.id };
      setProducts([newProduct, ...products]);
      addToast(`"${newProduct.name}" created and synced to store!`);
    } catch (err) {
      addToast('Failed to sync product to database.', 'error');
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      await updateProductInDb(updatedProduct);
      setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
      addToast(`"${updatedProduct.name}" updated successfully!`);
    } catch (err) {
      addToast('Failed to update product in database.', 'error');
    }
  };

  // Soft Delete
  const handleDeleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    setProducts(products.filter((p) => p.id !== id));
    setDeletedProducts([prod, ...deletedProducts]);
    addToast(`Moved "${prod.name}" to Trash Bin.`, 'info');
  };

  // Restore Product
  const handleRestoreProduct = (id: string) => {
    const prod = deletedProducts.find((p) => p.id === id);
    if (!prod) return;

    setDeletedProducts(deletedProducts.filter((p) => p.id !== id));
    setProducts([prod, ...products]);
    addToast(`Restored "${prod.name}" to inventory!`);
  };

  // Permanent Delete
  const handlePermanentDeleteProduct = async (id: string) => {
    const prod = deletedProducts.find((p) => p.id === id);
    try {
      await deleteProductFromDb(id);
      setDeletedProducts(deletedProducts.filter((p) => p.id !== id));
      addToast(`Permanently deleted "${prod?.name || 'Product'}".`, 'error');
    } catch (err) {
      addToast('Failed to delete product from database.', 'error');
    }
  };

  // Clear Trash
  const handleClearTrash = () => {
    setDeletedProducts([]);
    addToast('Trash bin cleared permanently.', 'error');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    addToast(`Order #${orderId.toUpperCase()} status updated to ${newStatus}.`);
  };

  // Filter products for Catalog Grid
  const exploreCategories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredExploreProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(exploreSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(exploreSearch.toLowerCase());
    const matchesCat = exploreCategory === 'All' || p.category === exploreCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0b0f17] transition-colors duration-200">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        deletedCount={deletedProducts.length}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8 overflow-y-auto w-full min-w-0">
        <div className="max-w-[1400px] mx-auto">
          <Header
            userName="Zynoks"
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            setActiveTab={setActiveTab}
            products={products}
            orders={orders}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />

          {/* TAB 1: Dashboard View */}
          {activeTab === 'home' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {metrics.map((metric, idx) => (
                  <MetricCard
                    key={idx}
                    data={{
                      ...metric,
                      value: isLoadingMetrics ? '...' : metric.value,
                    }}
                  />
                ))}
              </div>

              <RevenueChart data={mockRevenueChart} />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                <div className="lg:col-span-7">
                  <TopProductsTable 
                    products={products} 
                    onSeeAll={() => setActiveTab('shop')} 
                  />
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Globe2 className="w-4 h-4 text-indigo-500" />
                        Regional Sales Breakdown
                      </h3>
                      <span className="text-[11px] font-bold text-emerald-500">+14.2% overall</span>
                    </div>

                    <div className="space-y-3">
                      {mockCountries.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={`https://flagcdn.com/24x18/${item.code}.png`}
                              alt={item.country}
                              className="w-4 h-3 rounded-xs object-cover"
                            />
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {item.country}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.trend === 'up' ? (
                              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                            )}
                            <span className="font-bold text-slate-900 dark:text-white">
                              {item.salesCount}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users2 className="w-4 h-4 text-indigo-500" />
                        Top VIP Customers
                      </h3>
                    </div>

                    <div className="space-y-3.5">
                      {mockTopCustomers.map((customer) => (
                        <div key={customer.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={customer.avatar}
                              alt={customer.name}
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {customer.name}
                              </h4>
                              <p className="text-[10px] font-medium text-slate-400">
                                {customer.purchasesCount} orders placed
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            ${(customer.totalSpent / 1000).toFixed(2)}K
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Analytics View */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Analytics & Performance</h2>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
                  Deep-dive revenue streams, customer conversion metrics, and growth indicators.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-500" /> Conversion Funnel Rate
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between font-semibold mb-1 text-slate-700 dark:text-slate-300">
                        <span>Store Visits</span>
                        <span>142.8K</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-indigo-600 h-2 rounded-full w-[85%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-semibold mb-1 text-slate-700 dark:text-slate-300">
                        <span>Added to Cart</span>
                        <span>38.4K</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-indigo-500 h-2 rounded-full w-[55%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-semibold mb-1 text-slate-700 dark:text-slate-300">
                        <span>Completed Checkout</span>
                        <span>12.9K</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-emerald-500 h-2 rounded-full w-[32%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-indigo-500" /> Average Order Value (AOV)
                  </h3>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">$148.50</span>
                    <span className="text-xs font-bold text-emerald-500">+8.4% vs last month</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Higher conversion driven primarily by bundled Streetwear & Cyberpunk apparel collections.
                  </p>
                </div>
              </div>

              <RevenueChart data={mockRevenueChart} />
            </div>
          )}

          {/* TAB 3: Catalog Grid */}
          {activeTab === 'explore' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Catalog Visual Grid</h2>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
                  Explore storefront inventory items in visual card grid layout.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search catalog products..."
                    value={exploreSearch}
                    onChange={(e) => setExploreSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  {exploreCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setExploreCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        exploreCategory === cat
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {filteredExploreProducts.length === 0 ? (
                <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 sm:p-12 text-center text-slate-400 border border-slate-200/80 dark:border-slate-800/80">
                  <Package className="w-10 h-10 mx-auto mb-3 opacity-50 text-slate-400" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No catalog products found</p>
                  <p className="text-xs text-slate-400 mt-1">Try resetting your search or category filter criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {filteredExploreProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xs hover:border-indigo-500/40 transition-all group"
                    >
                      <div className="h-44 sm:h-48 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                          {product.category}
                        </span>
                      </div>

                      <div className="p-4 sm:p-5 space-y-3">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                          {product.name}
                        </h3>

                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-slate-900 dark:text-white text-base">
                            ${product.price.toFixed(2)}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              product.stockStatus === 'In Stock'
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                                : 'bg-rose-50 text-rose-500 dark:bg-rose-950/50 dark:text-rose-400'
                            }`}
                          >
                            {product.stockCount} left
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Products Table View */}
          {activeTab === 'shop' && (
            <ProductsView
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {/* TAB 5: Orders View */}
          {activeTab === 'chat' && (
            <OrdersView orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />
          )}

          {/* TAB 6: Settings View */}
          {activeTab === 'settings' && <SettingsView />}

          {/* TAB 7: Support View */}
          {activeTab === 'help' && <SupportView />}

          {/* TAB 8: Team Access View */}
          {activeTab === 'users' && <TeamAccessView />}

          {/* TAB 9: Trash Recovery View */}
          {activeTab === 'trash' && (
            <TrashView
              deletedProducts={deletedProducts}
              onRestoreProduct={handleRestoreProduct}
              onPermanentDeleteProduct={handlePermanentDeleteProduct}
              onClearTrash={handleClearTrash}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;