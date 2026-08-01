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
import { fetchLiveMetrics } from './lib/dashboardService';
import {
  fetchProducts,
  createProductInDb,
  updateProductInDb,
  deleteProductFromDb,
} from './lib/productService';
import { Search } from 'lucide-react';

interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function App() {
  // 🔐 ADMIN AUTH STATE
  const [currentAdmin, setCurrentAdmin] = useState<AdminSession | null>(() => {
    const saved = localStorage.getItem('zynboard_admin_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Supabase Live Metrics State
  const [metrics, setMetrics] = useState<MetricCardData[]>([
    { title: 'TOTAL CUSTOMER', value: '0', change: '+0%', isPositive: true, timeframe: 'this month', bgColor: 'sky' },
    { title: 'TOTAL REVENUE', value: '$0.00', change: '+0%', isPositive: true, timeframe: 'this month', bgColor: 'mint' },
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

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('zynboard_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('zynboard_admin_session');
    setCurrentAdmin(null);
  };

  // Fetch Live Metrics
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

  // Fetch Products
  useEffect(() => {
    if (!currentAdmin) return;
    async function loadProducts() {
      const dbProducts = await fetchProducts();
      setProducts(dbProducts);
    }
    loadProducts();
  }, [currentAdmin]);

  useEffect(() => {
    localStorage.setItem('zynboard_trash_products', JSON.stringify(deletedProducts));
  }, [deletedProducts]);

  useEffect(() => {
    localStorage.setItem('zynboard_orders', JSON.stringify(orders));
  }, [orders]);

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
      const newProduct: Product = { ...newProdData, id: created.id };
      setProducts([newProduct, ...products]);
      addToast(`"${newProduct.name}" created and synced to store!`);
    } catch {
      addToast('Failed to sync product to database.', 'error');
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      await updateProductInDb(updatedProduct);
      setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
      addToast(`"${updatedProduct.name}" updated successfully!`);
    } catch {
      addToast('Failed to update product in database.', 'error');
    }
  };

  const handleDeleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    setProducts(products.filter((p) => p.id !== id));
    setDeletedProducts([prod, ...deletedProducts]);
    addToast(`Moved "${prod.name}" to Trash Bin.`, 'info');
  };

  const handleRestoreProduct = (id: string) => {
    const prod = deletedProducts.find((p) => p.id === id);
    if (!prod) return;

    setDeletedProducts(deletedProducts.filter((p) => p.id !== id));
    setProducts([prod, ...products]);
    addToast(`Restored "${prod.name}" to inventory!`);
  };

  const handlePermanentDeleteProduct = async (id: string) => {
    const prod = deletedProducts.find((p) => p.id === id);
    try {
      await deleteProductFromDb(id);
      setDeletedProducts(deletedProducts.filter((p) => p.id !== id));
      addToast(`Permanently deleted "${prod?.name || 'Product'}".`, 'error');
    } catch {
      addToast('Failed to delete product from database.', 'error');
    }
  };

  const handleClearTrash = () => {
    setDeletedProducts([]);
    addToast('Trash bin cleared permanently.', 'error');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    addToast(`Order #${orderId.toUpperCase()} status updated to ${newStatus}.`);
  };

  const exploreCategories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredExploreProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(exploreSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(exploreSearch.toLowerCase());
    const matchesCat = exploreCategory === 'All' || p.category === exploreCategory;
    return matchesSearch && matchesCat;
  });

  // 🔒 IF NOT LOGGED IN, RENDER LOGIN VIEW
  if (!currentAdmin) {
    return <LoginView onLoginSuccess={(admin) => setCurrentAdmin(admin)} />;
  }

  // 🔓 LOGGED IN DASHBOARD
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0b0f17] transition-colors duration-200">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        deletedCount={deletedProducts.length}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
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

                {/* Category Pills */}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredExploreProducts.map((product) => (
                  <div key={product.id} className="bg-white dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800/80">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{product.name}</h3>
                  </div>
                ))}
              </div>
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