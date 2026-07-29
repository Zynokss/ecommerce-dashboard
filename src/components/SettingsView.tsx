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
  Globe 
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Fulfillment';
  avatar: string;
}

const defaultStoreDetails = {
  storeName: 'Zynboard Official',
  supportEmail: 'support@zynboard.store',
  currency: 'USD ($)',
  timezone: 'UTC-5 (EST)',
  taxRate: '8.5',
  shippingFlatRate: '12.00',
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
    name: 'Zynoks',
    email: 'owner@zynboard.store',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
  },
  {
    id: 'usr-2',
    name: 'Sarah Connor',
    email: 'sarah.c@zynboard.store',
    role: 'Manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
  },
];

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'team'>('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // 1. General Store Settings State with LocalStorage
  const [storeDetails, setStoreDetails] = useState(() => {
    const saved = localStorage.getItem('zynboard_store_details');
    return saved ? JSON.parse(saved) : defaultStoreDetails;
  });

  // 2. Notification Preferences State with LocalStorage
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('zynboard_notifications');
    return saved ? JSON.parse(saved) : defaultNotifications;
  });

  // 3. Team Members State with LocalStorage
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('zynboard_settings_team');
    return saved ? JSON.parse(saved) : defaultTeamMembers;
  });

  // Sync to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('zynboard_store_details', JSON.stringify(storeDetails));
  }, [storeDetails]);

  useEffect(() => {
    localStorage.setItem('zynboard_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('zynboard_settings_team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newInvite, setNewInvite] = useState({ name: '', email: '', role: 'Manager' as TeamMember['role'] });

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Store Control Center</h2>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
            Manage storefront profile details, automated alerts, and staff access privileges
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 px-3.5 py-1.5 rounded-xl text-xs font-bold animate-in fade-in duration-200">
            <Check className="w-4 h-4" />
            Changes saved!
          </div>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Store className="w-4 h-4" />
          General & Regional
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Bell className="w-4 h-4" />
          Automated Alerts
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'team'
              ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-4 h-4" />
          Team Access ({teamMembers.length})
        </button>
      </div>

      {/* TAB 1: General Store Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-500" />
              Store Identity & Contact
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Public Store Name
                </label>
                <input
                  type="text"
                  value={storeDetails.storeName}
                  onChange={(e) => setStoreDetails({ ...storeDetails, storeName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Customer Support Email
                </label>
                <input
                  type="email"
                  value={storeDetails.supportEmail}
                  onChange={(e) => setStoreDetails({ ...storeDetails, supportEmail: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Currency, Tax & Shipping Defaults
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Currency
                </label>
                <select
                  value={storeDetails.currency}
                  onChange={(e) => setStoreDetails({ ...storeDetails, currency: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                  <option value="MAD (DH)">MAD (DH)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Timezone
                </label>
                <input
                  type="text"
                  value={storeDetails.timezone}
                  onChange={(e) => setStoreDetails({ ...storeDetails, timezone: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Default Sales Tax (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={storeDetails.taxRate}
                  onChange={(e) => setStoreDetails({ ...storeDetails, taxRate: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Flat Shipping Rate ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={storeDetails.shippingFlatRate}
                  onChange={(e) => setStoreDetails({ ...storeDetails, shippingFlatRate: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Preferences
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Automated Notification Toggles */}
      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Store Alerts & Email Trigger Rules</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Configure real-time dashboard notifications and customer order receipts
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
            {/* Toggle 1: Low Stock Warning */}
            <div className="py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Low Stock Inventory Warnings</p>
                <p className="text-slate-400 dark:text-slate-500">
                  Highlight products when remaining stock drops below threshold
                </p>
              </div>

              <div className="flex items-center gap-4">
                {notifications.lowStockAlerts && (
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <span className="text-[11px] font-semibold">Threshold:</span>
                    <input
                      type="number"
                      value={notifications.lowStockThreshold}
                      onChange={(e) => setNotifications({ ...notifications, lowStockThreshold: parseInt(e.target.value, 10) || 1 })}
                      className="w-14 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-center"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setNotifications({ ...notifications, lowStockAlerts: !notifications.lowStockAlerts })}
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                    notifications.lowStockAlerts ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${notifications.lowStockAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* Toggle 2: New Order Popups */}
            <div className="py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Real-time Order Alerts</p>
                <p className="text-slate-400 dark:text-slate-500">
                  Trigger header notifications when a new purchase order is placed
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNotifications({ ...notifications, newOrderAlerts: !notifications.newOrderAlerts })}
                className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                  notifications.newOrderAlerts ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${notifications.newOrderAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Toggle 3: Customer Email Receipts */}
            <div className="py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Automatic Customer Receipts</p>
                <p className="text-slate-400 dark:text-slate-500">
                  Automatically dispatch order confirmation receipts upon payment clearance
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNotifications({ ...notifications, autoEmailReceipts: !notifications.autoEmailReceipts })}
                className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                  notifications.autoEmailReceipts ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${notifications.autoEmailReceipts ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Team Members & Staff Roles */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Staff Management</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Grant dashboard access to store operators and fulfillment staff
              </p>
            </div>

            <button
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Invite Team Member
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {teamMembers.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{member.name}</h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {member.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        member.role === 'Admin'
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      {member.role}
                    </span>

                    {member.role !== 'Admin' && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
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

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Invite New Staff Member</h3>

            <form onSubmit={handleAddTeamMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Vance"
                  value={newInvite.name}
                  onChange={(e) => setNewInvite({ ...newInvite, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="marcus@zynboard.store"
                  value={newInvite.email}
                  onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Role & Permissions
                </label>
                <select
                  value={newInvite.role}
                  onChange={(e) => setNewInvite({ ...newInvite, role: e.target.value as TeamMember['role'] })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value="Manager">Store Manager (Products & Orders)</option>
                  <option value="Fulfillment">Fulfillment Specialist (Orders Only)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
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