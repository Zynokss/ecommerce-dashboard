import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Bell, 
  Users, 
  Save, 
  UserPlus, 
  Check, 
  Mail, 
  Shield, 
  Trash2, 
  DollarSign, 
  Globe, 
  Tag, 
  Percent, 
  Plus, 
  Megaphone,
  X
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Fulfillment';
  avatar: string;
}

interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  active: boolean;
}

const defaultStoreDetails = {
  storeName: 'ZYN Official Store',
  supportEmail: 'contact@zynstore.ma',
  currency: 'MAD (DH)',
  timezone: 'UTC+1 (Casablanca)',
  taxRate: '0.0',
  shippingFlatRate: '35.00',
  announcementBanner: '⚡ FREE SHIPPING ACROSS MOROCCO ON ORDERS OVER 500 MAD',
  isBannerActive: true,
};

const defaultNotifications = {
  lowStockAlerts: true,
  lowStockThreshold: 5,
  newOrderAlerts: true,
  autoEmailReceipts: true,
  weeklyReportSummary: false,
};

const defaultTeamMembers: TeamMember[] = [
  {
    id: 'usr-1',
    name: 'Zynoks Admin',
    email: 'admin@zynstore.ma',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
  },
  {
    id: 'usr-2',
    name: 'Sarah Connor',
    email: 'sarah.c@zynstore.ma',
    role: 'Manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
  },
];

const defaultCoupons: Coupon[] = [
  { id: 'cp-1', code: 'STUDENTS20', discountPercentage: 20, active: true },
  { id: 'cp-2', code: 'ZYN10', discountPercentage: 10, active: true },
];

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'promos' | 'notifications' | 'team'>('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Store Details State
  const [storeDetails, setStoreDetails] = useState(() => {
    const saved = localStorage.getItem('zynboard_store_details');
    return saved ? JSON.parse(saved) : defaultStoreDetails;
  });

  // Notifications Preferences State
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('zynboard_notifications');
    return saved ? JSON.parse(saved) : defaultNotifications;
  });

  // Team Members State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('zynboard_settings_team');
    return saved ? JSON.parse(saved) : defaultTeamMembers;
  });

  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('zynboard_coupons');
    return saved ? JSON.parse(saved) : defaultCoupons;
  });

  // Modal & Form States for Team / Coupons
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newInvite, setNewInvite] = useState({ name: '', email: '', role: 'Manager' as TeamMember['role'] });

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPct, setNewCouponPct] = useState('15');

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('zynboard_store_details', JSON.stringify(storeDetails));
  }, [storeDetails]);

  useEffect(() => {
    localStorage.setItem('zynboard_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('zynboard_settings_team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('zynboard_coupons', JSON.stringify(coupons));
  }, [coupons]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvite.name || !newInvite.email) return;

    const member: TeamMember = {
      id: `usr-${Date.now()}`,
      name: newInvite.name,
      email: newInvite.email,
      role: newInvite.role,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120`,
    };

    setTeamMembers([...teamMembers, member]);
    setNewInvite({ name: '', email: '', role: 'Manager' });
    setIsInviteOpen(false);
  };

  const handleRemoveMember = (id: string) => {
    const member = teamMembers.find((m) => m.id === id);
    if (member?.role === 'Admin') return;
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const newCp: Coupon = {
      id: `cp-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      discountPercentage: Number(newCouponPct) || 10,
      active: true,
    };

    setCoupons([...coupons, newCp]);
    setNewCouponCode('');
    setNewCouponPct('15');
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons(coupons.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  };

  const deleteCoupon = (id: string) => {
    setCoupons(coupons.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/50 dark:border-white/[0.08] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-100 dark:text-white">Store Control Center</h2>
          <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">
            Manage storefront identity, promo banners, discount codes, automation rules, and staff privileges
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs">
            <Check className="w-4 h-4" />
            Changes saved!
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-700/50 dark:border-white/[0.08] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-[#7c5cfc] text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/30 dark:hover:bg-white/[0.04]'
          }`}
        >
          <Store className="w-4 h-4" /> General Identity & Regional
        </button>

        <button
          onClick={() => setActiveTab('promos')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'promos'
              ? 'bg-[#7c5cfc] text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/30 dark:hover:bg-white/[0.04]'
          }`}
        >
          <Tag className="w-4 h-4" /> Banners & Coupons
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'bg-[#7c5cfc] text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/30 dark:hover:bg-white/[0.04]'
          }`}
        >
          <Bell className="w-4 h-4" /> Automated Alerts
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'team'
              ? 'bg-[#7c5cfc] text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/30 dark:hover:bg-white/[0.04]'
          }`}
        >
          <Users className="w-4 h-4" /> Staff Access ({teamMembers.length})
        </button>
      </div>

      {/* TAB 1: General & Regional Identity */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="bg-[#1c202c]/90 dark:bg-[#0e1015]/90 rounded-2xl p-5 border border-slate-700/50 dark:border-white/[0.08] shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#7c5cfc]" /> Store Identity & Contact
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                  Public Store Name
                </label>
                <input
                  type="text"
                  value={storeDetails.storeName}
                  onChange={(e) => setStoreDetails({ ...storeDetails, storeName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                  Customer Support Email
                </label>
                <input
                  type="email"
                  value={storeDetails.supportEmail}
                  onChange={(e) => setStoreDetails({ ...storeDetails, supportEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#1c202c]/90 dark:bg-[#0e1015]/90 rounded-2xl p-5 border border-slate-700/50 dark:border-white/[0.08] shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Currency, Tax & Shipping Defaults
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                  Currency
                </label>
                <select
                  value={storeDetails.currency}
                  onChange={(e) => setStoreDetails({ ...storeDetails, currency: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none cursor-pointer font-medium"
                >
                  <option value="MAD (DH)" className="bg-[#121520]">MAD (Moroccan Dirham)</option>
                  <option value="EUR (€)" className="bg-[#121520]">EUR (€)</option>
                  <option value="USD ($)" className="bg-[#121520]">USD ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                  Timezone
                </label>
                <input
                  type="text"
                  value={storeDetails.timezone}
                  onChange={(e) => setStoreDetails({ ...storeDetails, timezone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                  Sales Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={storeDetails.taxRate}
                  onChange={(e) => setStoreDetails({ ...storeDetails, taxRate: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                  Flat Shipping Rate (MAD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={storeDetails.shippingFlatRate}
                  onChange={(e) => setStoreDetails({ ...storeDetails, shippingFlatRate: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#7c5cfc] hover:bg-[#6b4af3] text-white px-4 py-2 rounded-xl font-semibold text-xs transition-all shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Store Banners & Promo Coupon Engine */}
      {activeTab === 'promos' && (
        <div className="space-y-6">
          <div className="bg-[#1c202c]/90 dark:bg-[#0e1015]/90 rounded-2xl p-5 border border-slate-700/50 dark:border-white/[0.08] shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/50 dark:border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#7c5cfc]" /> Store Header Announcement Bar
              </h3>
              <button
                type="button"
                onClick={() => setStoreDetails({ ...storeDetails, isBannerActive: !storeDetails.isBannerActive })}
                className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                  storeDetails.isBannerActive ? 'bg-[#7c5cfc]' : 'bg-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${storeDetails.isBannerActive ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                Announcement Message Text
              </label>
              <input
                type="text"
                value={storeDetails.announcementBanner}
                onChange={(e) => setStoreDetails({ ...storeDetails, announcementBanner: e.target.value })}
                className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
              />
            </div>
          </div>

          <div className="bg-[#1c202c]/90 dark:bg-[#0e1015]/90 rounded-2xl p-5 border border-slate-700/50 dark:border-white/[0.08] shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-400" /> Promo Discount Coupons
            </h3>

            <form onSubmit={handleAddCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="PROMO CODE (e.g. SUMMER15)"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs font-mono uppercase text-white focus:outline-none focus:border-[#7c5cfc]"
              />
              <input
                type="number"
                placeholder="Discount %"
                value={newCouponPct}
                onChange={(e) => setNewCouponPct(e.target.value)}
                className="w-28 px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#7c5cfc]"
              />
              <button
                type="submit"
                className="flex items-center gap-1 bg-[#7c5cfc] hover:bg-[#6b4af3] text-white px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" /> Create
              </button>
            </form>

            <div className="divide-y divide-slate-700/40 dark:divide-white/5 pt-2">
              {coupons.map((c) => (
                <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white bg-[#121520] px-2 py-0.5 rounded-md border border-slate-700/50 dark:border-white/10">
                      {c.code}
                    </span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {c.discountPercentage}% OFF
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleCouponStatus(c.id)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold cursor-pointer border ${
                        c.active
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-[#121520] text-slate-500 border-slate-700/50'
                      }`}
                    >
                      {c.active ? 'ACTIVE' : 'DISABLED'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCoupon(c.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Automated Store Alerts */}
      {activeTab === 'notifications' && (
        <div className="bg-[#1c202c]/90 dark:bg-[#0e1015]/90 rounded-2xl p-5 border border-slate-700/50 dark:border-white/[0.08] shadow-lg space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white">Store Alert Rules & Email Receipts</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure inventory alerts and automatic order receipts
            </p>
          </div>

          <div className="divide-y divide-slate-700/40 dark:divide-white/5 text-xs">
            {/* Rule 1 */}
            <div className="py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-200">Low Stock Inventory Warnings</p>
                <p className="text-slate-400">Highlight catalog products when stock drops below threshold</p>
              </div>

              <div className="flex items-center gap-4">
                {notifications.lowStockAlerts && (
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-[11px] font-semibold">Threshold:</span>
                    <input
                      type="number"
                      value={notifications.lowStockThreshold}
                      onChange={(e) => setNotifications({ ...notifications, lowStockThreshold: parseInt(e.target.value, 10) || 1 })}
                      className="w-12 px-2 py-1 bg-[#121520] border border-slate-700/50 dark:border-white/10 rounded-lg text-xs font-bold font-mono text-center text-white"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setNotifications({ ...notifications, lowStockAlerts: !notifications.lowStockAlerts })}
                  className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                    notifications.lowStockAlerts ? 'bg-[#7c5cfc]' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications.lowStockAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-200">Real-Time Order Notifications</p>
                <p className="text-slate-400">Trigger header badge popups whenever a customer places an order</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifications({ ...notifications, newOrderAlerts: !notifications.newOrderAlerts })}
                className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                  notifications.newOrderAlerts ? 'bg-[#7c5cfc]' : 'bg-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications.newOrderAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Rule 3 */}
            <div className="py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-200">Automated Email Receipts</p>
                <p className="text-slate-400">Automatically send customer order confirmation receipts upon purchase</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifications({ ...notifications, autoEmailReceipts: !notifications.autoEmailReceipts })}
                className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                  notifications.autoEmailReceipts ? 'bg-[#7c5cfc]' : 'bg-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications.autoEmailReceipts ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Team Access & Staff Permissions */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Staff Management</h3>
              <p className="text-xs text-slate-400">
                Grant dashboard access privileges to operators and fulfillment team members
              </p>
            </div>

            <button
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-2 bg-[#7c5cfc] hover:bg-[#6b4af3] text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <UserPlus className="w-4 h-4" /> Invite Staff Member
            </button>
          </div>

          <div className="bg-[#1c202c]/90 dark:bg-[#0e1015]/90 rounded-2xl border border-slate-700/50 dark:border-white/[0.08] shadow-lg overflow-hidden">
            <div className="divide-y divide-slate-700/40 dark:divide-white/5">
              {teamMembers.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-700/30 dark:hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-700/50 dark:border-white/10"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{member.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" /> {member.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold border ${
                        member.role === 'Admin'
                          ? 'bg-[#7c5cfc]/10 text-[#7c5cfc] border-[#7c5cfc]/30'
                          : 'bg-[#121520] text-slate-300 border-slate-700/50'
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      {member.role}
                    </span>

                    {member.role !== 'Admin' && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Revoke access"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#1c202c] dark:bg-[#0e1015] rounded-2xl border border-slate-700/60 dark:border-white/[0.1] shadow-2xl w-full max-w-md p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-700/50 dark:border-white/[0.08] pb-3">
              <h3 className="text-sm font-bold text-white">Invite Staff Member</h3>
              <button onClick={() => setIsInviteOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddTeamMember} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Youssef Vance"
                  value={newInvite.name}
                  onChange={(e) => setNewInvite({ ...newInvite, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="youssef@zynstore.ma"
                  value={newInvite.email}
                  onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                  Role Permissions
                </label>
                <select
                  value={newInvite.role}
                  onChange={(e) => setNewInvite({ ...newInvite, role: e.target.value as TeamMember['role'] })}
                  className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="Manager" className="bg-[#121520]">Store Manager (Products & Orders)</option>
                  <option value="Fulfillment" className="bg-[#121520]">Fulfillment Specialist (Orders Only)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700/50 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7c5cfc] hover:bg-[#6b4af3] text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};