'use client';
import React from 'react';

export default function YieldPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8 font-sans">
      <div className="border-b border-zinc-800 pb-4 mb-6">
        <h1 className="text-xl font-bold uppercase tracking-tight">Yield Projections</h1>
        <p className="text-xs text-zinc-500 mt-1">Algorithmic Predictive Pipeline Model</p>
      </div>
      <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl max-w-sm">
        <span className="text-xs text-zinc-500 block uppercase">Projected Pipeline Capacity</span>
        <span className="text-2xl font-mono font-bold text-blue-400 mt-1">$47,500</span>
      </div>
    </div>
  );
}
