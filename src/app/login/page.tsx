"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/');
      } else {
        setError(data.message || 'Access Denied.');
      }
    } catch (err) {
      setError('Connection timeout. Failed to authenticate session.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 relative font-sans">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-900 rounded-2xl p-8 shadow-2xl relative z-10">
        
        {/* Console Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl mb-4 text-blue-500">
            <ShieldCheck className="h-8 w-8 stroke-[1.5]" />
          </div>
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest font-mono block">Gateway Authorization</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">SurgeCRM Registry Admin</h1>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-xs font-mono">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Operator ID</label>
            <div className="relative flex items-center">
              <User className="absolute left-4 text-slate-500 h-4 w-4" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="branden@hirerainmakers.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500/50 pl-11 pr-4 py-3.5 rounded-xl text-sm text-slate-200 placeholder-slate-600 transition-all focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Security Access Key</label>
            </div>
            
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-slate-500 h-4 w-4" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500/50 pl-11 pr-4 py-3.5 rounded-xl text-sm text-slate-200 placeholder-slate-600 transition-all focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-900 disabled:to-slate-900 border border-transparent text-white text-sm font-semibold py-3.5 rounded-xl transition shadow-lg mt-2 flex justify-center items-center"
          >
            {isLoading ? "Validating Session Security..." : "Authorize Control Console"}
          </button>
        </form>
      </div>
    </div>
  );
}
