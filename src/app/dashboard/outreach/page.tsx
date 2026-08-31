'use client';
import React from 'react';

export default function OutreachDashboard() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="border-b border-slate-800 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-white">🚀 SpaceMail Core Engine</h1>
        <p className="text-xs text-slate-400">Owner config: branden@hirerainmakers.com</p>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center font-mono text-xs text-slate-400">
        📬 Outbound automation engines initialized and waiting for sequence queues.
      </div>
    </div>
  );
}
