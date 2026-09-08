'use client';

import React from 'react';
import Link from 'next/link';

export default function DashboardHeader() {
  return (
    <header className="bg-zinc-950 border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
      <div>
        <Link href="/dashboard/leads" className="text-sm font-black tracking-wider text-white uppercase hover:opacity-80">
          SURGECRM // Agency Console
        </Link>
      </div>
      <div className="flex items-center space-x-2 text-xs font-medium">
        <Link href="/dashboard/salesforce" className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded transition">
          📊 Salesforce Rev Tracker
        </Link>
        <Link href="/dashboard/leads" className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded transition">
          📥 Data Axle Intake Workbench
        </Link>
        <Link href="/dashboard/live-opportunities" className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded transition">
          💼 Live Opportunities
        </Link>
      </div>
    </header>
  );
}
