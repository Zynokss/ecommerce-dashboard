import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginViewProps {
  onLoginSuccess?: (admin: AdminSession) => void;
}

const API_BASE = import.meta.env.VITE_STORE_API_URL || 'http://localhost:3000/api';

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid admin credentials.');
        return;
      }

      onLoginSuccess?.(data.admin);
    } catch {
      setError('Unable to reach the store server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0e1015] flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-3 group cursor-pointer">
            <div className="relative w-12 h-12 rounded-2xl bg-[#12141d] border border-[#7c5cfc]/40 flex items-center justify-center shadow-[0_0_30px_rgba(124,92,252,0.35)]">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 transform -rotate-3">
                <path
                  d="M13 2L3 14H11.5L9.5 22L21 10H12.5L13 2Z"
                  fill="url(#login-bolt-gradient)"
                />
                <defs>
                  <linearGradient id="login-bolt-gradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="35%" stopColor="#c084fc" />
                    <stop offset="70%" stopColor="#7c5cfc" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0e1015] shadow-[0_0_8px_#34d399]" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-black text-white tracking-tight">Zynboard</h1>
              <p className="text-[10px] font-mono text-[#7c5cfc] uppercase tracking-wider font-bold">
                Store Management OS
              </p>
            </div>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="bg-[#1c202c]/90 backdrop-blur-2xl border border-slate-700/60 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Sign In to Session <Sparkles className="w-4 h-4 text-[#7c5cfc]" />
            </h2>
            <p className="text-xs text-slate-400">
              Enter administrator credentials to access live telemetry
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@zynstore.ma"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#121520] border border-slate-700/50 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7c5cfc] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#121520] border border-slate-700/50 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7c5cfc] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-[#7c5cfc] hover:bg-[#6b4af3] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-[#7c5cfc]/25 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating Session...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Encrypted SSL Session
            </span>
            <span className="font-mono text-[10px]">Neon v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};