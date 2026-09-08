'use client';
import React from 'react';

export default function DealmakerPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8 font-sans">
      <div className="border-b border-zinc-800 pb-4 mb-6">
        <h1 className="text-xl font-bold uppercase tracking-tight">Dealmaker Hub</h1>
        <p className="text-xs text-zinc-500 mt-1">Campaign Playbooks & Talk-Tracks</p>
      </div>
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl max-w-xl">
        <div className="text-xs text-zinc-400 font-mono p-3 bg-zinc-900 rounded border border-zinc-800">
          Target Active Mon: Material Handling & Forklift (Leads 1-25)
        </div>
      </div>
    </div>
  );
}
