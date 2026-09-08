'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SalesforceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Lead Datacenter', path: '/dashboard/leads' },
    { name: 'Revenue Opportunities', path: '/opportunities' },
    { name: 'Dealmaker Hub', path: '/dealmaker' },
    { name: 'Yield Projections', path: '/projection' }
  ];

  return (
    <div className="flex flex-1 min-h-screen text-xs text-zinc-300 bg-[#0d0d0e]">
      {/* Sleek Minimalist Luxury Navigation Column */}
      <aside className="w-60 border-r border-[#1f1f23] bg-[#131316] flex flex-col justify-between p-6">
        <div>
          <div className="text-white tracking-[0.25em] font-light uppercase mb-10 text-[11px]">
            RAINMAKER
            <span className="block text-[8px] tracking-[0.1em] text-zinc-500 font-normal normal-case mt-0.5">By Invitation Only</span>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`py-2 px-3 rounded text-left tracking-wide transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#1f1f23] text-white font-medium shadow-sm' 
                      : 'hover:text-white text-zinc-400'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Slender status display cluster */}
        <div className="text-[9px] tracking-wider text-zinc-600 flex flex-col gap-1 uppercase">
          <div>Network Status // <span className="text-zinc-400 font-medium">Synced</span></div>
          <div>Node Protocol // <span className="text-zinc-400 font-medium">Vercel Edge</span></div>
        </div>
      </aside>

      {/* Primary content grid context */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-[#0d0d0e]">
        {children}
      </div>
    </div>
  );
}
