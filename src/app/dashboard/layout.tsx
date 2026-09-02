'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard Board', href: '/dashboard', icon: '🎚️' },
    { name: 'Telemetry Metrics', href: '/dashboard/reports', icon: '📊' },
    { name: 'Security Panel', href: '/dashboard/security', icon: '🛡️' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Dynamic Sidebar Control Node */}
      <aside className="w-64 bg-slate-900/40 border-r border-slate-800 p-4 flex flex-col justify-between select-none">
        <div className="space-y-6">
          <div className="px-3 py-2 border-b border-slate-800">
            <span className="text-xs font-black font-mono tracking-widest text-indigo-400">SURGECRM // SYSTEM DECK</span>
          </div>
          <nav className="space-y-1 font-mono text-xs">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition font-bold ${
                    isActive
                      ? 'bg-slate-800 text-white border border-slate-700/60 shadow-lg'
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name.toUpperCase()}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-2 border-t border-slate-800/60 flex items-center gap-2 font-mono text-[10px] text-slate-500">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>NODE CLUSTER: ACTIVE</span>
        </div>
      </aside>

      {/* Main View Screen Container Wrapper */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
