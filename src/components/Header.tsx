import React, { useState, useRef, useEffect } from 'react';
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
  ArrowRight
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
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close overlays on click outside
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

  // Quick Navigation options for Command Palette searching
  const pagesNav = [
    { label: 'Dashboard Overview', tab: 'home', icon: LayoutDashboard },
    { label: 'Analytics & Trends', tab: 'analytics', icon: BarChart3 },
    { label: 'Catalog Visual Grid', tab: 'explore', icon: Grid },
    { label: 'Products Inventory', tab: 'shop', icon: Package },
    { label: 'Orders & Fulfillment', tab: 'chat', icon: ShoppingBag },
    { label: 'Trash Recovery Bin', tab: 'trash', icon: Trash2 },
  ];

  const searchLower = globalSearch.toLowerCase().trim();

  // Search matching logic
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

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 relative">
      {/* Title & Mobile Toggle */}
      <div className="flex items-center justify-between sm:justify-start gap-3">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Drawer Trigger */}
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <MenuIcon className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Welcome Back, {userName}!
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Live Store
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
              Here is your store's real-time performance summary.
            </p>
          </div>
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          {/* Dark/Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Theme"
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all shadow-xs cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Global Search Button & Responsive Live Search Overlay */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                setIsNotifOpen(false);
                setIsProfileOpen(false);
              }}
              aria-label="Search"
              className={`w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all shadow-xs cursor-pointer ${
                isSearchOpen ? 'ring-2 ring-indigo-500/20' : ''
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            {isSearchOpen && (
      <div className="fixed left-4 right-4 sm:absolute sm:left-auto sm:right-0 mt-2 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search products, orders, or pages..."
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  {globalSearch && (
                    <button
                      onClick={() => setGlobalSearch('')}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Dynamic Live Search Results */}
                <div className="mt-3 max-h-80 overflow-y-auto space-y-3 pr-1">
                  {!searchLower ? (
                    <p className="text-[11px] text-slate-400 py-3 px-1 text-center font-medium">
                      Try searching <strong className="text-slate-700 dark:text-slate-300">"Analytics"</strong>, <strong className="text-slate-700 dark:text-slate-300">"Hoodie"</strong>, or <strong className="text-slate-700 dark:text-slate-300">"Trash"</strong>
                    </p>
                  ) : !hasResults ? (
                    <p className="text-[11px] text-slate-400 py-4 text-center font-medium">
                      No matching products, orders, or pages found for "{globalSearch}".
                    </p>
                  ) : (
                    <>
                      {/* Matching Pages */}
                      {matchingPages.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1.5 flex items-center gap-1">
                            Jump To Page
                          </p>
                          <div className="space-y-1">
                            {matchingPages.map((page) => {
                              const Icon = page.icon;
                              return (
                                <button
                                  key={page.tab}
                                  onClick={() => handleNavClick(page.tab)}
                                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer group"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <Icon className="w-4 h-4 text-indigo-500" />
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
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

                      {/* Matching Products */}
                      {matchingProducts.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1.5 flex items-center gap-1">
                            <Package className="w-3 h-3" /> Products ({matchingProducts.length})
                          </p>
                          <div className="space-y-1">
                            {matchingProducts.map((product) => (
                              <button
                                key={product.id}
                                onClick={() => handleNavClick('shop')}
                                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer group"
                              >
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                                  />
                                  <div>
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 transition-colors">
                                      {product.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400">{product.category}</p>
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                  ${product.price.toFixed(2)}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Matching Orders */}
                      {matchingOrders.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1.5 flex items-center gap-1">
                            <Receipt className="w-3 h-3" /> Orders ({matchingOrders.length})
                          </p>
                          <div className="space-y-1">
                            {matchingOrders.map((order) => (
                              <button
                                key={order.id}
                                onClick={() => handleNavClick('chat')}
                                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer group"
                              >
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={order.productImage}
                                    alt={order.productName}
                                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                                  />
                                  <div>
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 transition-colors">
                                      #{order.id.toUpperCase()} — {order.customerName}
                                    </p>
                                    <p className="text-[10px] text-slate-400">{order.productName}</p>
                                  </div>
                                </div>
                                <span className="text-[11px] font-semibold text-emerald-500">
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
              </div>
            )}
          </div>

          {/* Notifications Button & Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsSearchOpen(false);
                setIsProfileOpen(false);
              }}
              aria-label="Notifications"
              className={`relative w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all shadow-xs cursor-pointer ${
                isNotifOpen ? 'ring-2 ring-indigo-500/20' : ''
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
            </button>

           {isNotifOpen && (
              <div className="fixed left-4 right-4 sm:absolute sm:left-auto sm:right-0 sm:w-80 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white">Store Alerts</span>
                  <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                    2 New
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 py-1">
                  <div className="py-2.5 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-500 mt-0.5">
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        New Order #ORD-101 Received
                      </p>
                      <p className="text-[10px] text-slate-400">$190.00 • 5 mins ago</p>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Shopify Auto-Sync Success
                      </p>
                      <p className="text-[10px] text-slate-400">Inventory updated • Just now</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsSearchOpen(false);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-3 pl-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
          >
            <img
              src={avatarUrl}
              alt={userName}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 shadow-xs"
            />
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {userName}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform ${
                  isProfileOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">{userName}</p>
                <p className="text-[11px] text-slate-400">Owner & Admin</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Account Profile
                </button>
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Store Settings
                </button>
                <button
                  onClick={() => {
                    setActiveTab('users');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  Security & Roles
                </button>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                <button
                  onClick={() => alert('Logging out...')}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-semibold cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};