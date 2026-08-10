import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
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
import type { Product, Order, MetricCardData, RevenueChartPoint } from './types';
import { fetchLiveMetrics, fetchLiveOrders, updateOrderStatusInDb } from './lib/dashboardService';
import {
  fetchProducts,
  createProductInDb,
  updateProductInDb,
  deleteProductFromDb,
} from './lib/productService';
import { Search, Package } from 'lucide-react';

interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function App() {
  const [currentAdmin, setCurrentAdmin] = useState<AdminSession | null>(() => {
    const saved = localStorage.getItem('zynboard_admin_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [metrics, setMetrics] = useState<MetricCardData[]>([
    { title: 'TOTAL CUSTOMER', value: '0', change: '+0%', isPositive: true, timeframe: 'this month', bgColor: 'sky' },
    { title: 'TOTAL REVENUE', value: '0.00 MAD', change: '+0%', isPositive: true, timeframe: 'this month', bgColor: 'mint' },
    { title: 'TOTAL DEALS', value: '0', change: '+0%', isPositive: true, timeframe: 'this month', bgColor: 'white' },
  ]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(true);

  const [revenueChartData] = useState<RevenueChartPoint[]>([
    { month: 'Jan', firstHalf: 0, topGross: 0 },
    { month: 'Feb', firstHalf: 0, topGross: 0 },
    { month: 'Mar', firstHalf: 0, topGross: 0 },
    { month: 'Apr', firstHalf: 0, topGross: 0 },
    { month: 'May', firstHalf: 0, topGross: 0 },
    { month: 'Jun', firstHalf: 0, topGross: 0 },
  ]);

  const [exploreSearch, setExploreSearch] = useState<string>('');
  const [exploreCategory, setExploreCategory] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);

  const [deletedProducts, setDeletedProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('zynboard_trash_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>([]);

  const handleLogout = () => {
    localStorage.removeItem('zynboard_admin_session');
    setCurrentAdmin(null);
  };

  useEffect(() => {
    if (!currentAdmin) return;
    async function loadMetrics() {
      const liveData = await fetchLiveMetrics();
      if (liveData && liveData.length > 0) {
        setMetrics(liveData);
      }
      setIsLoadingMetrics(false);
    }
    loadMetrics();
  }, [currentAdmin]);

  useEffect(() => {
    if (!currentAdmin) return;
    async function loadProducts() {
      const dbProducts = await fetchProducts();
      setProducts(dbProducts);
    }
    loadProducts();
  }, [currentAdmin]);

  useEffect(() => {
    if (!currentAdmin) return;
    async function loadOrders() {
      try {
        const liveOrders = await fetchLiveOrders();
        setOrders(liveOrders);
      } catch (err) {
        console.error('Failed to load orders:', err);
      }
    }
    loadOrders();
  }, [currentAdmin]);

  useEffect(() => {
    localStorage.setItem('zynboard_trash_products', JSON.stringify(deletedProducts));
  }, [deletedProducts]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

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

  const handleAddProduct = async (newProdData: Omit<Product, 'id'>) => {
    try {
      const created = await createProductInDb(newProdData);
      const newProduct: Product = {
        ...newProdData,
        id: created ? String(created.id) : `prod_${Date.now()}`,
        colors: created?.colors || newProdData.colors || [],
      };
      setProducts([newProduct, ...products]);
      addToast(`"${newProduct.name}" created and synced to store!`);
    } catch {
      addToast('Failed to sync product to database.', 'error');
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      await updateProductInDb(updatedProduct);
      const freshProducts = await fetchProducts();
      setProducts(freshProducts);
      addToast(`"${updatedProduct.name}" updated successfully!`);
    } catch {
      addToast('Failed to update product in database.', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    try {
      await deleteProductFromDb(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeletedProducts([prod, ...deletedProducts]);
      addToast(`Deleted "${prod.name}" from database.`, 'info');
    } catch {
      addToast(`Failed to delete "${prod.name}" from database.`, 'error');
    }
  };

  const handleRestoreProduct = async (id: string) => {
    const prod = deletedProducts.find((p) => p.id === id);
    if (!prod) return;

    try {
      await createProductInDb({
        name: prod.name,
        category: prod.category,
        price: prod.price,
        description: prod.description || '',
        image: prod.image,
        stockCount: prod.stockCount,
        stockStatus: prod.stockStatus,
        totalSales: prod.totalSales || 0,
        colors: prod.colors || [],
      });
      setDeletedProducts(deletedProducts.filter((p) => p.id !== id));
      const freshProducts = await fetchProducts();
      setProducts(freshProducts);
      addToast(`Restored "${prod.name}" to store inventory!`);
    } catch {
      addToast(`Failed to restore "${prod.name}".`, 'error');
    }
  };

  const handlePermanentDeleteProduct = async (id: string) => {
    const prod = deletedProducts.find((p) => p.id === id);
    try {
      await deleteProductFromDb(id);
      setDeletedProducts(deletedProducts.filter((p) => p.id !== id));
      addToast(`Permanently removed "${prod?.name || 'Product'}".`, 'error');
    } catch {
      addToast('Failed to remove product.', 'error');
    }
  };

  const handleClearTrash = () => {
    setDeletedProducts([]);
    addToast('Trash bin cleared.', 'error');
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));

    try {
      await updateOrderStatusInDb(orderId, newStatus);
      addToast(`Order #${orderId.toUpperCase()} status updated to ${newStatus}.`);
    } catch {
      addToast('Failed to update order status in database.', 'error');
      const liveOrders = await fetchLiveOrders();
      setOrders(liveOrders);
    }
  };

  const exploreCategories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredExploreProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(exploreSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(exploreSearch.toLowerCase());
    const matchesCat = exploreCategory === 'All' || p.category === exploreCategory;
    return matchesSearch && matchesCat;
  });

  if (!currentAdmin) {
    return <LoginView onLoginSuccess={(admin) => setCurrentAdmin(admin)} />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0b0f17] transition-colors duration-200">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        deletedCount={deletedProducts.length}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8 overflow-y-auto w-full min-w-0">
        <div className="max-w-[1400px] mx-auto">
          <Header
            userName={currentAdmin.name}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            setActiveTab={setActiveTab}
            products={products}
            orders={orders}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            onLogout={handleLogout}
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

              <RevenueChart data={revenueChartData} />

              <div className="w-full">
                <TopProductsTable 
                  products={products} 
                  onSeeAll={() => setActiveTab('shop')} 
                />
              </div>
            </div>
          )}

          {/* TAB 2: Analytics View */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Analytics & Performance</h2>
              </div>
              <RevenueChart data={revenueChartData} />
            </div>
          )}

          {/* TAB 3: Catalog Grid */}
          {activeTab === 'explore' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search catalog products..."
                    value={exploreSearch}
                    onChange={(e) => setExploreSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100"
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
                <div className="py-16 text-center text-slate-400 dark:text-slate-500">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No products found matching filters.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {filteredExploreProducts.map((product) => (
                    <div key={product.id} className="bg-white dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                          {product.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          product.stockStatus === 'In Stock'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                            : 'bg-rose-50 text-rose-500 dark:bg-rose-950/50 dark:text-rose-400'
                        }`}>
                          {product.stockStatus}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{product.name}</h3>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-400">{product.stockCount} in stock</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Products View */}
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

          {/* TAB 9: Trash View */}
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