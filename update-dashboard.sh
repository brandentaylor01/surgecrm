#!/bin/bash

# Configuration settings
TARGET_FILE="src/app/dashboard/leads/page.tsx"
BACKUP_FILE="src/app/dashboard/leads/page.tsx.bak"

echo "========================================="
echo "⚙️  SurgeCRM Dashboard Light Mode Migration"
echo "========================================="

# 1. Verify file exists before performing mutations
if [ ! -f "\$TARGET_FILE" ]; then
    echo "❌ Error: Target file not found at \$TARGET_FILE"
    echo "Please ensure you are running this from the repository root."
    exit 1
fi

# 2. Create an isolated fallback backup copy
cp "\(TARGET_FILE" "\)BACKUP_FILE"
echo "💾 Safety backup created at: \$BACKUP_FILE"

# 3. Stream updated component structure into target path
echo "🚀 Overwriting with updated light theme layout..."
cat << 'INNER_EOF' > "\$TARGET_FILE"
import React, { useState } from 'react';

const SyncIcon = () => (
  <svg className="w-2.5 h-2.5 text-emerald-500 fill-current animate-pulse" viewBox="0 0 20 20">
    <circle cx="10" cy="10" r="10" />
  </svg>
);

const LightningIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('LEADS');

  const metrics = {
    leads: 0,
    outreach: 0,
    pipeline: 0,
    forecast: 0,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8 font-sans selection:bg-blue-100">
      
      {/* Navigation Header */}
      <header className="flex items-center justify-between max-w-7xl mx-auto mb-8 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <LightningIcon />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            SURGE<span className="text-blue-600">CRM</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
          <SyncIcon />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Synced</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-6">
        
        {/* Metric Aggregates */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div 
            onClick={() => setActiveTab('LEADS')}
            className={`p-5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'LEADS' 
                ? 'bg-white border-blue-500 shadow-sm ring-2 ring-blue-500/10' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Leads</span>
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">{metrics.leads}</span>
          </div>

          <div 
            onClick={() => setActiveTab('OUTREACH')}
            className={`p-5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'OUTREACH' 
                ? 'bg-white border-blue-500 shadow-sm ring-2 ring-blue-500/10' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Outreach</span>
            <span className="text-3xl font-extrabold tracking-tight text-emerald-600">{metrics.outreach}</span>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Pipeline</span>
            <span className="text-3xl font-extrabold tracking-tight text-blue-600">\${metrics.pipeline}</span>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Forecast</span>
            <span className="text-3xl font-extrabold tracking-tight text-emerald-600">\${metrics.forecast}</span>
          </div>
        </section>

        {/* Dashboard Panels */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">Fast Actions</h2>
              <div className="space-y-2.5">
                <button className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 px-4 rounded-lg shadow-sm transition-colors duration-150">
                  <LightningIcon />
                  Trigger Campaign
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-sm py-2.5 px-4 rounded-lg transition-colors duration-150">
                  <SearchIcon />
                  Force Web Scrape
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Live View: <span className="text-emerald-600 font-extrabold">{activeTab}</span>
              </h2>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center min-h-[180px]">
              <p className="text-slate-400 font-medium text-sm">No matching records.</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
INNER_EOF

# 4. Final verification checks
if [ \$? -eq 0 ]; then
    echo "✅ Operation complete! File modified successfully."
    echo "💡 Note: To revert changes, execute: cp \(BACKUP_FILE\)TARGET_FILE"
else
    echo "❌ Error encountered during string writing phase."
fi
