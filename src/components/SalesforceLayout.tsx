'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SalesforceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: '📥 Lead Datacenter', path: '/dashboard/leads' },
    { name: '📊 Rev Opportunities', path: '/opportunities' },
    { name: '⚡ Dealmaker Hub', path: '/dealmaker' },
    { name: '📈 Yield Projection', path: '/projection' }
  ];

  return (
    <div className="flex flex-1 font-mono text-xs text-zinc-300 bg-[#09090b]">
      {/* Zero-Footprint Cloud Sidebar Controls */}
      <aside className="w-56 border-r border-[#27272a] bg-[#121214] flex flex-col justify-between">
        <div className="p-3">
          <div className="text-[#10b981] font-bold tracking-widest uppercase mb-6 px-2 text-[10px]">
            ⚡ Surge Workspace
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`p-2 rounded text-left transition ${
                    isActive 
                      ? 'bg-emerald-950/60 border border-emerald-800 text-[#10b981] font-bold' 
                      : 'hover:bg-zinc-900/60 text-zinc-400'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System Health Metric Anchor */}
        <div className="p-3 border-t border-[#27272a] bg-[#161619] text-[10px] text-zinc-500 flex flex-col gap-1">
          <div>🔋 Engine: <span className="text-emerald-500 font-bold">Cloud Synced</span></div>
          <div>🛡️ Infrastructure: <span className="text-zinc-400">Vercel Edge</span></div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
