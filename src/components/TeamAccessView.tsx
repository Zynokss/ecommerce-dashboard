import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Mail, 
  Trash2, 
  Search, 
  X, 
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Fulfillment';
  avatar: string;
  lastActive?: string;
}

interface TeamAccessViewProps {
  teamMembers?: TeamMember[];
  onAddMember?: (member: Omit<TeamMember, 'id'>) => Promise<void> | void;
  onRemoveMember?: (id: string) => Promise<void> | void;
}

const defaultMembers: TeamMember[] = [
  {
    id: 'usr-1',
    name: 'Zynoks Admin',
    email: 'admin@zynstore.ma',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
    lastActive: 'Just now',
  },
  {
    id: 'usr-2',
    name: 'Sarah Connor',
    email: 'sarah.c@zynstore.ma',
    role: 'Manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    lastActive: '2 hours ago',
  },
];

export const TeamAccessView: React.FC<TeamAccessViewProps> = ({
  teamMembers = defaultMembers,
  onAddMember,
  onRemoveMember,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Manager' | 'Fulfillment'>('Manager');
  const [loading, setLoading] = useState(false);

  const filteredMembers = teamMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    const newMemberPayload = {
      name: name.trim(),
      email: email.trim(),
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      lastActive: 'Pending Invite',
    };

    try {
      if (onAddMember) {
        await onAddMember(newMemberPayload);
      }
      setName('');
      setEmail('');
      setRole('Manager');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to add team member:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/50 dark:border-white/[0.08] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-100 dark:text-white flex items-center gap-2">
            Team Access & Permissions <ShieldCheck className="w-4 h-4 text-[#7c5cfc]" />
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">
            Manage operator accounts, assign security roles, and monitor active dashboard sessions
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#7c5cfc] hover:bg-[#6b4af3] text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
        >
          <UserPlus className="w-4 h-4" /> Invite Staff Member
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1c202c]/90 dark:bg-[#0e1015]/90 p-3.5 rounded-2xl border border-slate-700/50 dark:border-white/[0.08]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search team members by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#7c5cfc]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
          <Users className="w-4 h-4 text-[#7c5cfc]" />
          <span>{filteredMembers.length} Active Accounts</span>
        </div>
      </div>

      {/* Members List Table */}
      <div className="bg-[#1c202c]/90 dark:bg-[#0e1015]/90 rounded-2xl border border-slate-700/50 dark:border-white/[0.08] shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#121520] dark:bg-[#08090d] border-b border-slate-700/50 dark:border-white/[0.08] text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Access Role</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 dark:divide-white/5 text-xs text-slate-300">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 font-mono">
                    No team members match search query.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-700/30 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-700/50 dark:border-white/10 shrink-0 bg-[#121520]"
                        />
                        <div>
                          <p className="font-bold text-slate-100 dark:text-white flex items-center gap-1.5">
                            {member.name}
                            {member.role === 'Admin' && (
                           <span title="Primary Owner">
                             <CheckCircle2 className="w-3.5 h-3.5 text-[#7c5cfc]" />
                          </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" /> {member.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold border ${
                          member.role === 'Admin'
                            ? 'bg-[#7c5cfc]/10 text-[#7c5cfc] border-[#7c5cfc]/30'
                            : member.role === 'Manager'
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {member.lastActive || 'Recently'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {member.role !== 'Admin' && onRemoveMember && (
                        <button
                          onClick={() => onRemoveMember(member.id)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition-all cursor-pointer"
                          title="Revoke Staff Access"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c202c] dark:bg-[#0e1015] border border-slate-700/60 dark:border-white/[0.1] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-700/50 dark:border-white/[0.08] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#7c5cfc]" /> Invite Staff Member
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Youssef Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                  Role Permissions
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="Manager" className="bg-[#121520]">Manager (Products & Orders Access)</option>
                  <option value="Fulfillment" className="bg-[#121520]">Fulfillment (Orders Feed Only)</option>
                  <option value="Admin" className="bg-[#121520]">Admin (Full Settings & System Access)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700/50 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#7c5cfc] hover:bg-[#6b4af3] text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Access Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};