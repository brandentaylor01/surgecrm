'use client';
import React, { useState } from 'react';

export default function SurgeCRMHome() {
  const [niche, setNiche] = useState('');
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleExtractLeads = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchCriteria: niche }),
      });
      const data = await res.json();
      if (data.success) setLeads(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8 flex flex-col items-center justify-center font-sans">
      {/* Light Mode Visual Gradient Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-b from-indigo-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-xl w-full">
        <h1 className="text-4xl font-black mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
          ⚡ SURGECRM.SITE
        </h1>
        <p className="text-sm text-slate-500 mb-8 font-medium">
          Global concurrent B2B streaming multi-registry extraction engine workspace.
        </p>
        
        <form onSubmit={handleExtractLeads} className="flex gap-2 max-w-md w-full mx-auto mb-8 bg-white p-2 rounded-xl border border-slate-200 shadow-md focus-within:border-indigo-500 transition-colors">
          <input 
            type="text" 
            value={niche} 
            onChange={(e) => setNiche(e.target.value)} 
            placeholder="Enter a market sector (e.g. Contractors)..." 
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 active:scale-98 px-5 py-2 rounded-lg text-sm font-bold text-white transition-all shadow-md">
            {isLoading ? 'Extracting...' : 'Generate Leads'}
          </button>
        </form>
        
        {leads.length > 0 && (
          <div className="w-full max-w-md mx-auto bg-white border border-slate-200 rounded-xl p-5 text-left text-xs font-mono shadow-lg border-l-4 border-l-emerald-500">
            <p className="text-emerald-600 mb-3 font-bold flex items-center gap-1.5">
              <span>🎉</span> Sync Complete! Streamed {leads.length} live matching records.
            </p>
            <a 
              href="/dashboard/leads" 
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-bold tracking-tight underline transition-colors"
            >
              Open Leads CRM Dashboard Workspace →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
