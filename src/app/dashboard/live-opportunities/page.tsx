'use client';
import React from 'react';

export default function LiveOpportunitiesPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8 font-sans">
      <div className="border-b border-zinc-800 pb-4 mb-6">
        <h1 className="text-xl font-bold uppercase tracking-tight">Live Opportunities</h1>
        <p className="text-xs text-zinc-500 mt-1">Real-Time Un-Wiped Target Stream</p>
      </div>
      <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl max-w-sm font-mono text-xs">
        <div className="text-zinc-400">Listening to changes on Supabase channel...</div>
        <div className="text-zinc-600 mt-2">&gt; Connection pool active</div>
      </div>
    </div>
  );
}
