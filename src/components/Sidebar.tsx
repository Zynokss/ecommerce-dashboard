import React from 'react';
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
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  deletedCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, deletedCount = 0 }) => {
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

  return (
    <aside className="w-64 bg-white dark:bg-[#0f1523] border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between shrink-0 min-h-screen transition-colors duration-200">
      <div>
        {/* Brand Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">
            Z
          </div>
          <div>
            <h1 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">
              Zynboard
            </h1>
            <p className="text-[10px] font-bold tracking-wider uppercase text-indigo-500">
              Studio OS
            </p>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="px-4 space-y-6">
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Menu
            </p>
            <nav className="space-y-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Management
            </p>
            <nav className="space-y-1">
              {managementNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isActive
                            ? 'bg-white text-indigo-600'
                            : 'bg-rose-500 text-white dark:bg-rose-600'
                        }`}
                      >
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

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <button
          onClick={() => alert('Signing out...')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};