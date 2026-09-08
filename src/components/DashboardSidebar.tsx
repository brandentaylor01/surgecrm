'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardSidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Lead Datacenter', href: '/dashboard/leads' },
    { name: 'Revenue Opportunities', href: '/dashboard/revenue' },
    { name: 'Email Control Center', href: '/dashboard/email' },
    { name: 'Dealmaker Hub', href: '/dashboard/dealmaker' },
    { name: 'Yield Projections', href: '/dashboard/yield' },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between p-4 min-h-screen">
      <div>
        <div className="mb-8 px-2">
          <div className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Rainmaker</div>
          <div className="text-[10px] text-zinc-600 font-mono mt-0.5">By Invitation Only</div>
        </div>
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded text-xs font-medium transition-colors ${
                  isActive 
                    ? 'bg-zinc-900 text-white border-l-2 border-blue-500 pl-2.5' 
                    : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-zinc-900 pt-4 px-2 text-[10px] text-zinc-600 font-mono">
        v1.0.0 // PRODUCTION
      </div>
    </aside>
  );
}
