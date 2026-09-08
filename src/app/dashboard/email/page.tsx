'use client';

import React from 'react';
import EmailControlCenter from '@/components/EmailControlCenter';

export default function EmailDashboardPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8 font-sans">
      <div className="border-b border-zinc-800 pb-4 mb-6">
        <h1 className="text-xl font-bold uppercase tracking-tight">Communications Center</h1>
        <p className="text-xs text-zinc-500 mt-1">Spacemail Automation Terminal // active</p>
      </div>
      <EmailControlCenter />
    </div>
  );
}
