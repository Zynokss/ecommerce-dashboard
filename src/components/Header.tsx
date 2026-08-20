import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product, Order } from '../types';
import { 
  Menu as MenuIcon,
  Search, 
  Bell, 
  ChevronDown, 
  Sun, 
  Moon, 
  User, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  CheckCircle2, 
  ShoppingBag, 
  X,
  Package,
  Receipt,
  LayoutDashboard,
  BarChart3,
  Grid,
  Trash2,
  ArrowRight,
  Command,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  userName?: string;
  avatarUrl?: string;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  setActiveTab: (tab: string) => void;
  products?: Product[];
  orders?: Order[];
  onOpenMobileMenu?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Zynoks',
  avatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
  darkMode,
  setDarkMode,
  setActiveTab,
  products = [],
  orders = [],
  onOpenMobileMenu,
  onLogout,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close overlays when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Keyboard Shortcut (Cmd/Ctrl + K) to toggle search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const pagesNav = [
    { label: 'Dashboard Overview', tab: 'home', icon: LayoutDashboard },
    { label: 'Analytics & Trends', tab: 'analytics', icon: BarChart3 },
    { label: 'Catalog Visual Grid', tab: 'explore', icon: Grid },
    { label: 'Products Inventory', tab: 'shop', icon: Package },
    { label: 'Orders & Fulfillment', tab: 'chat', icon: ShoppingBag },
    { label: 'Trash Recovery Bin', tab: 'trash', icon: Trash2 },
  ];

  const searchLower = globalSearch.toLowerCase().trim();
  const matchingPages = searchLower
    ? pagesNav.filter((p) => p.label.toLowerCase().includes(searchLower))
    : [];
  const matchingProducts = searchLower
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      ).slice(0, 4)
    : [];
  const matchingOrders = searchLower
    ? orders.filter(
        (o) =>
          o.customerName.toLowerCase().includes(searchLower) ||
          o.productName.toLowerCase().includes(searchLower) ||
          o.id.toLowerCase().includes(searchLower)
      ).slice(0, 3)
    : [];

  const hasResults =
    matchingPages.length > 0 || matchingProducts.length > 0 || matchingOrders.length > 0;

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setIsSearchOpen(false);
    setGlobalSearch('');
  };

  const handleSignOut = () => {
    setIsProfileOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('zynboard_admin_session');
      window.location.reload();
    }
  };

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-700/50 dark:border-white/[0.08] relative z-30">
      {/* Left: User Title & Live Status */}
      <div className="flex items-center justify-between sm:justify-start gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl bg-[#1c202c] dark:bg-[#0e1015] border border-slate-700/50 dark:border-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Welcome Back, {userName}!
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sync
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Real-time storefront telemetry & inventory control center.
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls Bar */}
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Theme"
            className="w-10 h-10 rounded-xl bg-[#1c202c] dark:bg-[#0e1015] border border-slate-700/50 dark:border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white hover:border-[#7c5cfc]/50 transition-all duration-200 cursor-pointer group shadow-sm"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform group-hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-300 transition-transform group-hover:-rotate-12" />
            )}
          </button>

          {/* Search Trigger Button */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                setIsNotifOpen(false);
                setIsProfileOpen(false);
              }}
              aria-label="Search"
              className={`h-10 px-3 rounded-xl bg-[#1c202c] dark:bg-[#0e1015] border border-slate-700/50 dark:border-white/[0.08] flex items-center gap-2 text-slate-300 dark:text-slate-400 hover:text-white hover:border-[#7c5cfc]/50 transition-all duration-200 cursor-pointer shadow-sm ${
                isSearchOpen ? 'ring-2 ring-[#7c5cfc]/40 border-[#7c5cfc]' : ''
              }`}
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-medium hidden md:inline text-slate-400">Search...</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-400 bg-slate-800 dark:bg-white/10 rounded border border-slate-700 dark:border-white/10">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>

            {/* Live Search Modal Overlay */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="fixed left-4 right-4 sm:absolute sm:left-auto sm:right-0 mt-2 sm:w-96 bg-[#1c202c]/95 dark:bg-[#0e1015]/95 backdrop-blur-2xl rounded-2xl border border-slate-700/60 dark:border-white/[0.1] shadow-2xl p-3 z-50 space-y-3"
                >
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-[#7c5cfc] absolute left-3" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search products, orders, or pages..."
                      value={globalSearch}
                      onChange={(e) => setGlobalSearch(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#7c5cfc]"
                    />
                    {globalSearch && (
                      <button
                        onClick={() => setGlobalSearch('')}
                        className="absolute right-3 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                    {!searchLower ? (
                      <p className="text-[11px] text-slate-400 py-4 text-center font-medium">
                        Search anything in store <strong className="text-slate-200">"Analytics"</strong>, <strong className="text-slate-200">"Hoodie"</strong>, or <strong className="text-slate-200">"Trash"</strong>
                      </p>
                    ) : !hasResults ? (
                      <p className="text-[11px] text-slate-400 py-6 text-center font-medium">
                        No store results matching "{globalSearch}".
                      </p>
                    ) : (
                      <>
                        {matchingPages.length > 0 && (
                          <div>
                            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">
                              Jump To Page
                            </p>
                            <div className="space-y-1">
                              {matchingPages.map((page) => {
                                const Icon = page.icon;
                                return (
                                  <button
                                    key={page.tab}
                                    onClick={() => handleNavClick(page.tab)}
                                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-700/40 dark:hover:bg-white/[0.05] transition-colors text-left cursor-pointer group"
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <Icon className="w-4 h-4 text-[#7c5cfc]" />
                                      <span className="text-xs font-bold text-slate-200">
                                        {page.label}
                                      </span>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {matchingProducts.length > 0 && (
                          <div>
                            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2 mb-1 flex items-center gap-1">
                              <Package className="w-3 h-3 text-[#7c5cfc]" /> Products ({matchingProducts.length})
                            </p>
                            <div className="space-y-1">
                              {matchingProducts.map((product) => (
                                <button
                                  key={product.id}
                                  onClick={() => handleNavClick('shop')}
                                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-700/40 dark:hover:bg-white/[0.05] transition-colors text-left cursor-pointer"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-8 h-8 rounded-lg object-cover border border-slate-700/50 dark:border-white/10"
                                    />
                                    <div>
                                      <p className="text-xs font-bold text-slate-200 line-clamp-1">{product.name}</p>
                                      <p className="text-[10px] text-slate-400">{product.category}</p>
                                    </div>
                                  </div>
                                  <span className="text-xs font-mono font-bold text-white">
                                    {product.price.toFixed(2)} MAD
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {matchingOrders.length > 0 && (
                          <div>
                            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2 mb-1 flex items-center gap-1">
                              <Receipt className="w-3 h-3 text-[#7c5cfc]" /> Orders ({matchingOrders.length})
                            </p>
                            <div className="space-y-1">
                              {matchingOrders.map((order) => (
                                <button
                                  key={order.id}
                                  onClick={() => handleNavClick('chat')}
                                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-700/40 dark:hover:bg-white/[0.05] transition-colors text-left cursor-pointer"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <img
                                      src={order.productImage}
                                      alt={order.productName}
                                      className="w-8 h-8 rounded-lg object-cover border border-slate-700/50 dark:border-white/10"
                                    />
                                    <div>
                                      <p className="text-xs font-mono font-bold text-slate-200">
                                        #{order.id.slice(-6).toUpperCase()} — {order.customerName}
                                      </p>
                                      <p className="text-[10px] text-slate-400 line-clamp-1">{order.productName}</p>
                                    </div>
                                  </div>
                                  <span className="text-[11px] font-mono font-semibold text-emerald-400">
                                    {order.status}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications Center Trigger */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsSearchOpen(false);
                setIsProfileOpen(false);
              }}
              aria-label="Notifications"
              className={`relative w-10 h-10 rounded-xl bg-[#1c202c] dark:bg-[#0e1015] border border-slate-700/50 dark:border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white hover:border-[#7c5cfc]/50 transition-all duration-200 cursor-pointer shadow-sm ${
                isNotifOpen ? 'ring-2 ring-[#7c5cfc]/40 border-[#7c5cfc]' : ''
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#7c5cfc] rounded-full shadow-[0_0_8px_#7c5cfc]" />
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="fixed left-4 right-4 sm:absolute sm:left-auto sm:right-0 sm:w-80 mt-2 bg-[#1c202c]/95 dark:bg-[#0e1015]/95 backdrop-blur-2xl rounded-2xl border border-slate-700/60 dark:border-white/[0.1] shadow-2xl p-4 z-50 text-xs"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700/50 dark:border-white/5">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      Store Telemetry Alerts <Sparkles className="w-3.5 h-3.5 text-[#7c5cfc]" />
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#7c5cfc] bg-[#7c5cfc]/10 border border-[#7c5cfc]/20 px-2 py-0.5 rounded-full">
                      2 New
                    </span>
                  </div>
                  <div className="divide-y divide-slate-700/50 dark:divide-white/5 py-1">
                    <div className="py-2.5 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200">New Store Order Recorded</p>
                        <p className="text-[10px] text-slate-400 font-mono">190.00 MAD — 5 mins ago</p>
                      </div>
                    </div>

                    <div className="py-2.5 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#7c5cfc]/10 flex items-center justify-center text-[#7c5cfc] shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200">Database Route Verified</p>
                        <p className="text-[10px] text-slate-400">Neon client connected — Just now</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* User Profile Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsSearchOpen(false);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#1c202c]/80 dark:hover:bg-white/[0.05] transition-colors cursor-pointer group"
          >
            <img
              src={avatarUrl}
              alt={userName}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-slate-700 dark:ring-white/10 group-hover:ring-[#7c5cfc] transition-all shadow-sm"
            />
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                {userName}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isProfileOpen ? 'rotate-180 text-[#7c5cfc]' : ''
                }`}
              />
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-52 bg-[#1c202c]/95 dark:bg-[#0e1015]/95 backdrop-blur-2xl rounded-2xl border border-slate-700/60 dark:border-white/[0.1] shadow-2xl py-2 z-50 text-xs"
              >
                <div className="px-4 py-2.5 border-b border-slate-700/50 dark:border-white/5">
                  <p className="font-bold text-white">{userName}</p>
                  <p className="text-[10px] font-mono text-slate-400">Owner & Administrator</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/40 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-slate-400" /> Account Profile
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/40 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-400" /> Store Settings
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('users');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/40 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-400" /> Staff Access
                  </button>
                </div>
                <div className="border-t border-slate-700/50 dark:border-white/5 pt-1 mt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:bg-rose-500/10 transition-colors font-semibold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};