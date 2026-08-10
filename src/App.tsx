import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { fetchLiveStats, fetchLiveOrders, updateOrderStatusInDb, type CategoryBreakdown } from './lib/dashboardService';
import { 
  fetchProducts, 
  createProductInDb, 
  updateProductInDb, 
  deleteProductFromDb 
} from './lib/productService';
import { 
  Search, 
  Package, 
  Target, 
  Globe, 
  PieChart as PieIcon,
  ChevronRight,
  MoreHorizontal,
  Activity,
  Zap,
  TrendingUp
} from 'lucide-react';

interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

const parseCurrencyValue = (valStr: string): number => {
  if (!valStr) return 0;
  const cleaned = valStr.replace(/\s+/g, '').replace(',', '.');
  const match = cleaned.match(/-?\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
};

export function App() {
  const [currentAdmin, setCurrentAdmin] = useState<AdminSession | null>(() => {
    const saved = localStorage.getItem('zynboard_admin_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [metrics, setMetrics] = useState<MetricCardData[]>([
    { title: 'TOTAL SALES', value: '0.00 MAD', change: '+0%', isPositive: true, timeframe: 'vs last week', bgColor: 'mint' },
    { title: 'TOTAL ORDERS', value: '0', change: '+0%', isPositive: true, timeframe: 'vs last week', bgColor: 'sky' },
    { title: 'TOTAL VISITORS', value: '0', change: '+0%', isPositive: true, timeframe: 'vs last week', bgColor: 'white' },
  ]);

  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(true);
  const [revenueChartData, setRevenueChartData] = useState<RevenueChartPoint[]>([]);
  const [topCategories, setTopCategories] = useState<CategoryBreakdown[]>([]);
  const [totalSalesNumeric, setTotalSalesNumeric] = useState<number>(0);

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
    async function loadStats() {
      setIsLoadingMetrics(true);
      const liveStats = await fetchLiveStats();
      if (liveStats) {
        setMetrics(liveStats.metrics);
        setTopCategories(liveStats.topCategories);
        if (liveStats.chartData && liveStats.chartData.length > 0) {
          setRevenueChartData(liveStats.chartData);
        }
        const salesCard = liveStats.metrics.find((m) => m.title === 'TOTAL SALES');
        if (salesCard) {
          setTotalSalesNumeric(parseCurrencyValue(salesCard.value));
        }
      }
      setIsLoadingMetrics(false);
    }
    loadStats();
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

  const monthlyTargetGoal = 10000;
  const targetPct = Math.min(Math.round((totalSalesNumeric / monthlyTargetGoal) * 100), 100);

  if (!currentAdmin) {
    return <LoginView onLoginSuccess={(admin) => setCurrentAdmin(admin)} />;
  }

  return (
    <div className="min-h-screen flex font-sans antialiased selection:bg-indigo-500 selection:text-white">
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
        <div className="max-w-[1600px] mx-auto space-y-8">
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

          <AnimatePresence mode="wait">
            {/* TAB 1: Bento Modular Dashboard Layout */}
            {activeTab === 'home' && (
              <motion.div
                key="home-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Primary Column */}
                <div className="lg:col-span-9 space-y-6">
                  {/* Metric Cards Bento Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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

                  {/* Revenue Trajectory & Monthly Target Bento Container */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8">
                      <RevenueChart data={revenueChartData} />
                    </div>

                    {/* Monthly Target Radial Card */}
                    <div className="lg:col-span-4 glass-panel rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
                      <div className="flex items-center justify-between z-10">
                        <h3 className="font-extrabold text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                          <Target className="w-4 h-4 text-indigo-500" />
                          Target Progress
                        </h3>
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="my-6 flex flex-col items-center justify-center relative z-10">
                        <div className="relative w-44 h-22 overflow-hidden flex items-end justify-center">
                          <div 
                            className="w-44 h-44 rounded-full border-[14px] border-slate-200 dark:border-slate-800 border-t-indigo-500 border-r-indigo-500 transform -rotate-45 transition-all duration-1000 ease-out"
                            style={{ opacity: targetPct > 0 ? 1 : 0.2 }}
                          />
                        </div>
                        <div className="text-center mt-3">
                          <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{targetPct}%</span>
                          <p className="text-[11px] font-bold text-emerald-500 flex items-center justify-center gap-1 mt-1">
                            <TrendingUp className="w-3.5 h-3.5" /> Synchronized DB
                          </p>
                        </div>
                      </div>

                      <div className="glass-panel p-4 rounded-2xl text-center z-10">
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Goal: <span className="text-slate-900 dark:text-white font-black">{monthlyTargetGoal.toLocaleString()} MAD</span>
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                          Current: <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{totalSalesNumeric.toFixed(2)} MAD</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Metrics Bento Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Active Visitors */}
                    <div className="glass-panel rounded-3xl p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Sessions</span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Activity className="w-3 h-3 animate-pulse" /> Live Tracking
                        </span>
                      </div>
                      <div>
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                          {metrics.find((m) => m.title === 'TOTAL VISITORS')?.value || '0'}
                        </h4>
                        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">Active storefront connections</p>
                      </div>
                      <div className="space-y-2.5 pt-2 border-t border-slate-200/80 dark:border-white/5">
                        {[
                          { country: 'Morocco', pct: '85%' },
                          { country: 'France', pct: '10%' },
                          { country: 'Other', pct: '5%' },
                        ].map((c) => (
                          <div key={c.country} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-slate-500 dark:text-slate-400">{c.country}</span>
                              <span className="text-slate-900 dark:text-white">{c.pct}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: c.pct }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fulfillment Pipeline */}
                    <div className="glass-panel rounded-3xl p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Order Pipeline</span>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                          Real-time
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5 pt-1 text-center">
                        <div className="p-3 glass-panel rounded-2xl">
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold">Pending</p>
                          <p className="text-lg font-black text-amber-500 mt-1">
                            {orders.filter((o) => o.status === 'Pending').length}
                          </p>
                        </div>
                        <div className="p-3 glass-panel rounded-2xl">
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold">Processing</p>
                          <p className="text-lg font-black text-indigo-500 mt-1">
                            {orders.filter((o) => o.status === 'Processing').length}
                          </p>
                        </div>
                        <div className="p-3 glass-panel rounded-2xl">
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold">Shipped</p>
                          <p className="text-lg font-black text-sky-500 mt-1">
                            {orders.filter((o) => o.status === 'Shipped').length}
                          </p>
                        </div>
                        <div className="p-3 glass-panel rounded-2xl">
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold">Delivered</p>
                          <p className="text-lg font-black text-emerald-500 mt-1">
                            {orders.filter((o) => o.status === 'Delivered').length}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Traffic Source */}
                    <div className="glass-panel rounded-3xl p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Traffic Source</span>
                        <Globe className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div className="space-y-3 pt-1">
                        {[
                          { source: 'Direct Store Visits', val: '70%' },
                          { source: 'Organic Search', val: '20%' },
                          { source: 'Social Referrals', val: '10%' },
                        ].map((t) => (
                          <div key={t.source} className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-semibold">{t.source}</span>
                            <span className="font-black text-slate-900 dark:text-white">{t.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Top Selling Products */}
                  <TopProductsTable 
                    products={products} 
                    onSeeAll={() => setActiveTab('shop')} 
                  />
                </div>

                {/* Sidebar Column: Categories Breakdown & Live Feed */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Category Sales Donut Bento */}
                  <div className="glass-panel rounded-3xl p-6 shadow-sm space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                        <PieIcon className="w-4 h-4 text-indigo-500" />
                        Categories
                      </h3>
                      <button 
                        onClick={() => setActiveTab('explore')}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors flex items-center gap-0.5"
                      >
                        View <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex flex-col items-center justify-center my-4">
                      <div className="w-36 h-36 rounded-full border-[12px] border-indigo-500 border-t-purple-500 border-r-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                        <div className="text-center">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest block">Gross Total</span>
                          <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{totalSalesNumeric.toFixed(2)} MAD</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-3 border-t border-slate-200/80 dark:border-white/5">
                      {topCategories.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-2">No category sales recorded yet.</p>
                      ) : (
                        topCategories.map((cat, idx) => (
                          <div key={cat.name} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${idx % 2 === 0 ? 'bg-indigo-500' : 'bg-purple-400'}`} />
                              <span className="text-slate-500 dark:text-slate-400 font-semibold">{cat.name}</span>
                            </div>
                            <span className="font-black text-slate-900 dark:text-white">{cat.amount}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Real-Time Live Order Stream */}
                  <div className="glass-panel rounded-3xl p-6 shadow-sm space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-indigo-500" /> Live Stream
                      </h3>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded-full">
                        Realtime
                      </span>
                    </div>

                    <div className="space-y-3">
                      {orders.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">No recent orders recorded.</p>
                      ) : (
                        orders.slice(0, 5).map((ord) => (
                          <div key={ord.id} className="flex items-center justify-between text-xs p-3 rounded-2xl glass-panel-interactive">
                            <div className="flex items-center gap-3">
                              <img 
                                src={ord.productImage} 
                                alt={ord.productName} 
                                className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-white/10 shrink-0"
                              />
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{ord.customerName}</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1">{ord.productName}</p>
                              </div>
                            </div>
                            <span className="font-black text-indigo-600 dark:text-indigo-400 shrink-0 ml-2">{ord.amount} MAD</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: Analytics View */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Analytics & Revenue Trajectory</h2>
                <RevenueChart data={revenueChartData} />
              </motion.div>
            )}

            {/* TAB 3: Catalog Grid */}
            {activeTab === 'explore' && (
              <motion.div
                key="explore-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-3xl">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search catalog products..."
                      value={exploreSearch}
                      onChange={(e) => setExploreSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {exploreCategories.map((cat) => (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        key={cat}
                        onClick={() => setExploreCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          exploreCategory === cat
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                            : 'glass-panel text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {cat}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {filteredExploreProducts.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No products found matching filters.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredExploreProducts.map((product) => (
                      <motion.div 
                        whileHover={{ y: -4 }}
                        key={product.id} 
                        className="glass-panel rounded-3xl p-4 space-y-3 shadow-sm"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 rounded-2xl object-cover border border-slate-200/80 dark:border-white/10"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            {product.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            product.stockStatus === 'In Stock'
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                          }`}>
                            {product.stockStatus}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{product.name}</h3>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-white/5">
                          <span className="text-xs text-slate-400">{product.stockCount} in stock</span>
                          <span className="text-sm font-black text-slate-900 dark:text-white">{product.price.toFixed(2)} MAD</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 4: Products Table View */}
            {activeTab === 'shop' && (
              <motion.div key="shop-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ProductsView
                  products={products}
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              </motion.div>
            )}

            {/* TAB 5: Orders View */}
            {activeTab === 'chat' && (
              <motion.div key="orders-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <OrdersView orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />
              </motion.div>
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
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;