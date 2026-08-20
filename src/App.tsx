import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { RevenueChart } from './components/RevenueChart';
import { TopProductsTable } from './components/TopProductsTable';
import { AnalyticsView } from './components/AnalyticsView';
import { CatalogExplorer } from './components/CatalogExplorer';
import { ProductsView } from './components/ProductsView';
import { OrdersView } from './components/OrdersView';
import { SettingsView } from './components/SettingsView';
import { SupportView } from './components/SupportView';
import { TeamAccessView } from './components/TeamAccessView';
import { TrashView } from './components/TrashView';
import { ToastContainer, type ToastMessage } from './components/Toast';
import type { Product, Order, MetricCardData, RevenueChartPoint } from './types';
import {
  fetchLiveStats,
  fetchLiveOrders,
  updateOrderStatusInDb,
  type CategoryBreakdown,
} from './lib/dashboardService';
import {
  fetchProducts,
  createProductInDb,
  updateProductInDb,
  deleteProductFromDb
} from './lib/productService';
import {
  Package,
  AlertTriangle,
  ArrowUpRight,
  Zap,
  Activity,
  Plus,
  Tag,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';

interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const;

const STATUS_COLORS: Record<Order['status'], string> = {
  Pending: 'bg-amber-500',
  Processing: 'bg-indigo-500',
  Shipped: 'bg-sky-500',
  Delivered: 'bg-emerald-500',
  Cancelled: 'bg-rose-500',
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop';

export function App() {
  const [currentAdmin, setCurrentAdmin] = useState<AdminSession | null>(() => {
    const saved = localStorage.getItem('zynboard_admin_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<string>('home');

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('zynboard_theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [metrics, setMetrics] = useState<MetricCardData[]>([
    { title: 'Total Sales', value: '0.00 MAD', change: '+0%', isPositive: true, timeframe: 'all time', bgColor: 'mint' },
    { title: 'Total Orders', value: '0', change: '+0%', isPositive: true, timeframe: 'all time', bgColor: 'sky' },
    { title: 'Registered Users', value: '0', change: '+0%', isPositive: true, timeframe: 'all time', bgColor: 'white' },
  ]);

  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [revenueChartData, setRevenueChartData] = useState<RevenueChartPoint[]>([]);
  const [topCategories, setTopCategories] = useState<CategoryBreakdown[]>([]);
  const [conversionRate, setConversionRate] = useState<string>('0%');

  const [products, setProducts] = useState<Product[]>([]);
  const [deletedProducts, setDeletedProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('zynboard_trash_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('zynboard_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('zynboard_theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('zynboard_admin_session');
    setCurrentAdmin(null);
  };

  // Poll stats and orders every 10 seconds for real-time order updates
  useEffect(() => {
    if (!currentAdmin) return;
    async function loadStats() {
      const liveStats = await fetchLiveStats();
      setMetrics(liveStats.metrics);
      setTopCategories(liveStats.topCategories);
      setRevenueChartData(liveStats.chartData);
      setConversionRate(liveStats.conversionRate);
      setIsLoadingMetrics(false);
    }

    loadStats();
    const statsInterval = setInterval(loadStats, 10000);
    return () => clearInterval(statsInterval);
  }, [currentAdmin]);

  useEffect(() => {
    if (!currentAdmin) return;
    async function loadProducts() {
      const dbProducts = await fetchProducts();
      setProducts(dbProducts);
      setIsLoadingProducts(false);
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
      } finally {
        setIsLoadingOrders(false);
      }
    }

    loadOrders();
    const ordersInterval = setInterval(loadOrders, 10000);
    return () => clearInterval(ordersInterval);
  }, [currentAdmin]);

  useEffect(() => {
    localStorage.setItem('zynboard_trash_products', JSON.stringify(deletedProducts));
  }, [deletedProducts]);

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
        brand: prod.brand || 'ZYN',
        price: prod.price,
        description: prod.description || '',
        image: prod.image,
        stockCount: prod.stockCount,
        stockStatus: prod.stockStatus,
        totalSales: prod.totalSales || 0,
        sizes: prod.sizes || ['S', 'M', 'L', 'XL'],
        colors: prod.colors || [],
        featured: prod.featured || false,
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

  const handleCreateManualOrder = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
    addToast(`Manual Order #${newOrder.id.slice(-6).toUpperCase()} created!`);
  };

  const lowStockItems = products.filter((p) => p.stockStatus === 'Low Stock' || p.stockCount < 5);

  const featuredProducts = products.filter((p) => p.featured);
  const featuredDisplay = featuredProducts.length > 0 ? featuredProducts.slice(0, 3) : products.slice(0, 3);

  const avgOrderValue = orders.length > 0
    ? orders.reduce((sum, o) => sum + o.amount, 0) / orders.length
    : 0;

  const homeKpis = [
    { title: metrics[0]?.title || 'Total Sales', val: metrics[0]?.value || '0.00 MAD' },
    { title: metrics[1]?.title || 'Total Orders', val: metrics[1]?.value || String(orders.length) },
    { title: metrics[2]?.title || 'Registered Users', val: metrics[2]?.value || '0' },
    { title: 'Avg Order Value', val: `${avgOrderValue.toFixed(2)} MAD` },
    { title: 'Conversion Rate', val: conversionRate },
  ];

  const orderStatusCounts = useMemo(() => {
    const counts: Record<Order['status'], number> = {
      Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0,
    };
    orders.forEach((o) => { counts[o.status] = (counts[o.status] || 0) + 1; });
    return counts;
  }, [orders]);

  const rankedTopProducts = useMemo(() => {
    const agg = new Map<string, { name: string; image: string; category: string; unitsSold: number; revenue: number }>();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.productId || item.id;
        const existing = agg.get(key);
        const product = products.find((p) => p.id === item.productId);
        agg.set(key, {
          name: product?.name || item.product?.name || 'Product',
          image: product?.image || item.product?.image || FALLBACK_IMAGE,
          category: product?.category || item.product?.category || 'Streetwear',
          unitsSold: (existing?.unitsSold || 0) + item.quantity,
          revenue: (existing?.revenue || 0) + item.price * item.quantity,
        });
      });
    });
    return Array.from(agg.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.unitsSold - a.unitsSold);
  }, [orders, products]);

  if (!currentAdmin) {
    return (
      <LoginView
        onLoginSuccess={(admin) => {
          const sessionObj: AdminSession = {
            id: admin.id,
            name: admin.name || admin.email.split('@')[0],
            email: admin.email,
            role: admin.role || 'Admin',
          };
          localStorage.setItem('zynboard_admin_session', JSON.stringify(sessionObj));
          setCurrentAdmin(sessionObj);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 font-sans antialiased selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-300">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        deletedCount={deletedProducts.length}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

      <main className="flex-1 px-4 sm:px-8 py-6 overflow-y-auto w-full min-w-0 bg-slate-50 dark:bg-[#09090b]">
        <div className="max-w-[1600px] mx-auto space-y-6">
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
            {/* TAB 1: HOME DASHBOARD */}
            {activeTab === 'home' && (
              <motion.div
                key="home-tab"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* Metric Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {homeKpis.map((kpi, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between shadow-xs transition-all hover:border-slate-300 dark:hover:border-zinc-700/80"
                    >
                      <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">{kpi.title}</span>
                      {isLoadingMetrics ? (
                        <div className="h-6 w-24 bg-slate-100 dark:bg-zinc-800 rounded-md animate-pulse mt-2.5" />
                      ) : (
                        <div className="text-xl font-bold text-slate-900 dark:text-zinc-100 mt-2 tracking-tight">{kpi.val}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column */}
                  <div className="lg:col-span-8 space-y-6">
                    <RevenueChart data={revenueChartData} />

                    {/* Split Telemetry Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* Recent Orders Feed */}
                      <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800/80 rounded-xl p-5 space-y-4 shadow-xs">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/60 pb-3">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-indigo-500" />
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Recent Orders</h3>
                          </div>
                          <button
                            onClick={() => setActiveTab('chat')}
                            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            All Orders <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {isLoadingOrders ? (
                            [...Array(3)].map((_, i) => (
                              <div key={i} className="h-14 rounded-lg bg-slate-100 dark:bg-zinc-900/60 animate-pulse" />
                            ))
                          ) : orders.length === 0 ? (
                            <div className="py-8 text-center text-xs text-slate-400 dark:text-zinc-500 flex flex-col items-center justify-center gap-1.5">
                              <Clock className="w-5 h-5 opacity-40" />
                              <span>No live orders recorded yet</span>
                            </div>
                          ) : (
                            orders.slice(0, 4).map((ord) => (
                              <div
                                key={ord.id}
                                className="group flex items-center justify-between p-3 rounded-lg bg-slate-50/70 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/60 hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={ord.productImage}
                                    alt={ord.productName}
                                    className="w-9 h-9 rounded-md object-cover border border-slate-200 dark:border-zinc-800 shrink-0 group-hover:scale-105 transition-transform"
                                  />
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-slate-900 dark:text-zinc-100 text-xs">#{ord.id.slice(-5).toUpperCase()}</span>
                                      <span className={`px-1.5 py-0.2 text-[10px] rounded-md font-medium border ${
                                        ord.status === 'Delivered'
                                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                          : ord.status === 'Processing'
                                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                      }`}>
                                        {ord.status}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1">{ord.customerName} • {ord.productName}</p>
                                  </div>
                                </div>
                                <span className="font-semibold text-slate-900 dark:text-zinc-100 text-xs shrink-0 ml-2">
                                  {ord.amount.toFixed(2)} MAD
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Top Categories by Revenue */}
                      <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800/80 rounded-xl p-5 space-y-4 shadow-xs">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/60 pb-3">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-indigo-500" />
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Top Categories</h3>
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500">By revenue</span>
                        </div>

                        {topCategories.length === 0 ? (
                          <div className="py-8 text-center text-xs text-slate-400 dark:text-zinc-500">
                            No category sales yet.
                          </div>
                        ) : (
                          <div className="space-y-2.5 pt-1">
                            {(() => {
                              const maxTotal = Math.max(...topCategories.map((c) => c.numericTotal), 1);
                              return topCategories
                                .slice()
                                .sort((a, b) => b.numericTotal - a.numericTotal)
                                .slice(0, 5)
                                .map((cat) => (
                                  <div key={cat.name} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs font-medium">
                                      <span className="text-slate-700 dark:text-zinc-300">{cat.name}</span>
                                      <span className="font-semibold text-slate-900 dark:text-zinc-100">{cat.amount}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                        style={{ width: `${(cat.numericTotal / maxTotal) * 100}%` }}
                                      />
                                    </div>
                                  </div>
                                ));
                            })()}
                          </div>
                        )}
                      </div>

                    </div>

                    <TopProductsTable
                      products={rankedTopProducts}
                      onSeeAll={() => setActiveTab('shop')}
                    />
                  </div>

                  {/* Right Column */}
                  <div className="lg:col-span-4 space-y-6">

                    {/* Store Quick Operations */}
                    <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800/80 rounded-xl p-5 space-y-3 shadow-xs">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-500" /> Quick Operations
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setActiveTab('shop')}
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/60 hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-xs font-medium text-slate-800 dark:text-zinc-200 transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4 text-indigo-500" /> Add Product
                        </button>
                        <button
                          onClick={() => setActiveTab('chat')}
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/60 hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-xs font-medium text-slate-800 dark:text-zinc-200 transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4 text-emerald-500" /> Create Order
                        </button>
                      </div>
                    </div>

                    {/* Featured Items Widget */}
                    <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800/80 rounded-xl p-5 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/60 pb-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                          {featuredProducts.length > 0 ? 'Featured Items' : 'Catalog Preview'}
                        </h3>
                        <button onClick={() => setActiveTab('explore')} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-0.5">
                          Catalog <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {isLoadingProducts ? (
                          [...Array(3)].map((_, i) => (
                            <div key={i} className="h-12 rounded-lg bg-slate-100 dark:bg-zinc-900/60 animate-pulse" />
                          ))
                        ) : featuredDisplay.length === 0 ? (
                          <div className="py-6 text-center text-xs text-slate-400 dark:text-zinc-500">
                            No catalog items available.
                          </div>
                        ) : (
                          featuredDisplay.map((prod, idx) => (
                            <div
                              key={prod.id}
                              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/70 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/60 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-md object-cover border border-slate-200 dark:border-zinc-800 shrink-0" />
                                  <span className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-[9px] font-bold flex items-center justify-center">
                                    #{idx + 1}
                                  </span>
                                </div>
                                <div className="space-y-0.5">
                                  <p className="font-semibold text-slate-900 dark:text-zinc-100 text-xs line-clamp-1">{prod.name}</p>
                                  <span className="text-[10px] text-slate-500 dark:text-zinc-400">{prod.category}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-slate-900 dark:text-zinc-100 text-xs">{prod.price.toFixed(2)} MAD</p>
                                <p className="text-[10px] text-slate-500 dark:text-zinc-400">{prod.stockCount} in stock</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Inventory Warning Box */}
                    <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800/80 rounded-xl p-5 space-y-3.5 shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/60 pb-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" /> Low Stock Alerts
                        </h3>
                        <button onClick={() => setActiveTab('shop')} className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline cursor-pointer flex items-center gap-0.5">
                          Manage <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      {isLoadingProducts ? (
                        <div className="h-10 rounded-lg bg-slate-100 dark:bg-zinc-900/60 animate-pulse" />
                      ) : lowStockItems.length === 0 ? (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>All inventory levels are currently healthy!</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {lowStockItems.slice(0, 3).map((item) => (
                            <div key={item.id} className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                <span className="font-medium text-slate-800 dark:text-zinc-200 line-clamp-1">{item.name}</span>
                              </div>
                              <span className="font-semibold text-amber-600 dark:text-amber-400 shrink-0 ml-2">
                                {item.stockCount} left
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Order Status Breakdown */}
                    <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800/80 rounded-xl p-5 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/60 pb-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-400 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-indigo-500" /> Order Status
                        </h3>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500">{orders.length} total</span>
                      </div>

                      {orders.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400 dark:text-zinc-500">
                          No orders yet.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {ORDER_STATUSES.map((status) => {
                            const count = orderStatusCounts[status];
                            const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
                            return (
                              <div key={status} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-medium">
                                  <span className="text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[status]}`} /> {status}
                                  </span>
                                  <span className="text-slate-500 dark:text-zinc-400">{count}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                                  <div className={`h-full ${STATUS_COLORS[status]} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: ANALYTICS */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics-tab"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <AnalyticsView
                  revenueData={revenueChartData}
                  topCategories={topCategories}
                  orders={orders}
                />
              </motion.div>
            )}

            {/* TAB 3: CATALOG GRID */}
            {activeTab === 'explore' && (
              <motion.div
                key="explore-tab"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {isLoadingProducts ? (
                  <div className="py-16 text-center text-slate-400 dark:text-zinc-500 text-xs">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40 animate-pulse" />
                    Loading catalog…
                  </div>
                ) : (
                  <CatalogExplorer products={products} />
                )}
              </motion.div>
            )}

            {/* TAB 4: PRODUCTS TABLE */}
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

            {/* TAB 5: ORDERS FEED */}
            {activeTab === 'chat' && (
              <motion.div key="orders-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <OrdersView
                  orders={orders}
                  products={products}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onCreateOrder={handleCreateManualOrder}
                />
              </motion.div>
            )}

            {/* TAB 6: SETTINGS */}
            {activeTab === 'settings' && <SettingsView />}

            {/* TAB 7: SUPPORT */}
            {activeTab === 'help' && <SupportView />}

            {/* TAB 8: TEAM ACCESS */}
            {activeTab === 'users' && <TeamAccessView />}

            {/* TAB 9: TRASH BIN */}
            {activeTab === 'trash' && (
              <TrashView
                deletedProducts={deletedProducts}
                onRestoreProduct={handleRestoreProduct}
                onPermanentDeleteProduct={handlePermanentDeleteProduct}
                onEmptyTrash={handleClearTrash}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
