import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  BarChart3, 
  Grid, 
  Package, 
  ShoppingBag, 
  Settings, 
  HelpCircle, 
  Users, 
  Trash2, 
  LogOut,
  X,
  Zap,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  deletedCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  deletedCount = 0,
  isOpen = false,
  onClose = () => {},
  onLogout,
}) => {
  const mainNav = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'explore', label: 'Catalog Grid', icon: Grid },
    { id: 'shop', label: 'Products Table', icon: Package },
    { id: 'chat', label: 'Orders Feed', icon: ShoppingBag },
  ];

  const managementNav = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Support', icon: HelpCircle },
    { id: 'users', label: 'Team Access', icon: Users },
    { id: 'trash', label: 'Trash Bin', icon: Trash2, badge: deletedCount },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden"
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-[#1c202c]/95 dark:bg-[#0e1015]/95 backdrop-blur-2xl
        border-r border-slate-700/50 dark:border-white/[0.08]
        flex flex-col justify-between shrink-0 min-h-screen select-none
        transition-colors duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 space-y-6">
          {/* Executive Brand Logo Header */}
          <div className="flex items-center justify-between px-1 pt-1 mb-2">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-9 h-9 rounded-xl bg-[#12141d] dark:bg-[#08090d] border border-[#7c5cfc]/40 flex items-center justify-center shadow-[0_0_20px_rgba(124,92,252,0.35)] group-hover:scale-105 group-hover:border-[#7c5cfc]/70 transition-all duration-300">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 transform -rotate-3">
                  <path
                    d="M13 2L3 14H11.5L9.5 22L21 10H12.5L13 2Z"
                    fill="url(#zyn-bolt-gradient)"
                  />
                  <defs>
                    <linearGradient id="zyn-bolt-gradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#f472b6" />
                      <stop offset="35%" stopColor="#c084fc" />
                      <stop offset="70%" stopColor="#7c5cfc" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#1c202c] dark:border-[#0e1015] shadow-[0_0_8px_#34d399]" />
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-100 dark:text-white text-sm tracking-tight">
                    Zynboard
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#7c5cfc] bg-[#7c5cfc]/15 border border-[#7c5cfc]/30 rounded-md">
                    v2.0
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-400">
                  Store Management OS
                </span>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="space-y-6">
            {/* Main Menu */}
            <div>
              <p className="px-2 text-[10px] font-mono font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">
                Main Menu
              </p>
              <nav className="space-y-1">
                {mainNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/40 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04]'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTabGlow"
                          className="absolute inset-0 bg-gradient-to-r from-[#7c5cfc]/30 to-indigo-500/20 dark:from-[#7c5cfc]/25 dark:to-indigo-500/15 border border-[#7c5cfc]/40 rounded-xl shadow-[0_0_15px_rgba(124,92,252,0.2)]"
                          transition={{ type: "spring", stiffness: 380, damping: 28 }}
                        />
                      )}
                      
                      {isActive && (
                        <motion.span 
                          layoutId="activeTabAccent"
                          className="absolute left-0 w-1 h-5 bg-[#7c5cfc] rounded-r-full shadow-[0_0_10px_#7c5cfc]" 
                        />
                      )}

                      <Icon className={`w-4 h-4 z-10 transition-colors duration-200 ${
                        isActive ? 'text-[#7c5cfc]' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-200 dark:group-hover:text-slate-300'
                      }`} />
                      <span className="z-10 tracking-wide">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Management Section */}
            <div>
              <p className="px-2 text-[10px] font-mono font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">
                Management
              </p>
              <nav className="space-y-1">
                {managementNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/40 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04]'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTabGlow"
                          className="absolute inset-0 bg-gradient-to-r from-[#7c5cfc]/30 to-indigo-500/20 dark:from-[#7c5cfc]/25 dark:to-indigo-500/15 border border-[#7c5cfc]/40 rounded-xl shadow-[0_0_15px_rgba(124,92,252,0.2)]"
                          transition={{ type: "spring", stiffness: 380, damping: 28 }}
                        />
                      )}

                      {isActive && (
                        <motion.span 
                          layoutId="activeTabAccent"
                          className="absolute left-0 w-1 h-5 bg-[#7c5cfc] rounded-r-full shadow-[0_0_10px_#7c5cfc]" 
                        />
                      )}

                      <div className="flex items-center gap-3 z-10">
                        <Icon className={`w-4 h-4 transition-colors duration-200 ${
                          isActive ? 'text-[#7c5cfc]' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-200 dark:group-hover:text-slate-300'
                        }`} />
                        <span className="tracking-wide">{item.label}</span>
                      </div>

                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="z-10 px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.4)] animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Footer Promo & Session Control */}
        <div className="p-4 space-y-3 border-t border-slate-700/50 dark:border-white/[0.08]">
          <div className="relative overflow-hidden rounded-2xl bg-[#121520] dark:bg-[#10131e] border border-slate-700/60 dark:border-white/[0.08] p-3.5 space-y-2 group">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#7c5cfc]/15 rounded-full blur-xl group-hover:bg-[#7c5cfc]/25 transition-all duration-500" />
            <div className="flex items-center justify-between text-slate-100 dark:text-white font-bold text-xs relative z-10">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#7c5cfc]" /> Pro Sync Engine
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 relative z-10 leading-relaxed">
              Neon PostgreSQL engine online with low latency response.
            </p>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-all duration-200 cursor-pointer group border border-transparent hover:border-rose-500/20"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
              <span>Sign Out Session</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </aside>
    </>
  );
};