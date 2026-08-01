import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (admin: { id: string; name: string; email: string; role: string }) => void;
}

export function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Query specifically from AdminUser table (Separated from storefront User table)
      const { data: admin, error: dbError } = await supabase
        .from('AdminUser')
        .select('id, name, email, password, role')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (dbError || !admin) {
        setError('Invalid admin credentials.');
        setIsLoading(false);
        return;
      }

      // Check password (In production, use bcrypt verification)
      if (admin.password !== password) {
        setError('Invalid admin credentials.');
        setIsLoading(false);
        return;
      }

      // Success
      const sessionData = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      };

      localStorage.setItem('zynboard_admin_session', JSON.stringify(sessionData));
      onLoginSuccess(sessionData);
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center mx-auto mb-3 text-indigo-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Zynboard Staff Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Authorized admin access only</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@zynbrand.com"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}