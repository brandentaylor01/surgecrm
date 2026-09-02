'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans">
      {/* Hero Control Console Scaffolding */}
      <div className="max-w-4xl mx-auto pt-20 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-bold text-indigo-600 mb-6 font-mono">
          ⚡ GLOBAL CONCURRENT B2B REGISTRY ENGINE
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 font-mono">
          SURGECRM.SITE
        </h1>
        
        <p className="text-base text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Concurrent multi-registry corporate extraction workspace. Query any local market segment, territory, or tax index securely from your central data cockpit.
        </p>

        {/* Quick Launch Console Gateway */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md max-w-2xl mx-auto">
          <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider mb-4 text-left font-mono">
            🚀 Main Cockpit Entry Panel
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter a target sector or region (e.g. 'Canton Logistics')..." 
              className="flex-1 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none text-slate-900 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
            />
            <Link 
              href="/dashboard/leads"
              className="p-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-sm transition whitespace-nowrap flex items-center justify-center gap-1.5"
            >
              📊 Enter Dashboard Workspace
            </Link>
          </div>
          
          {/* Live Network Pipeline Indicators (Cleaned of all legacy Supabase text blocks) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 text-left text-xs font-medium text-slate-500">
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 border rounded-lg">
              <span className="text-emerald-600 font-bold">✓</span> Local JSON File-Backed Storage Active
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 border rounded-lg">
              <span className="text-emerald-600 font-bold">✓</span> 88 Ohio County Auditor Map Linked
            </div>
          </div>
        </div>

        {/* Operational Footer Summary Notes */}
        <div className="mt-20 text-xs text-slate-400 font-mono">
          💼 Line of Business Administration Core Engine v1.0 • Running Securely
        </div>
      </div>
    </div>
  );
}
