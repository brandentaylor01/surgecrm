'use client';
import React, { useState, useEffect } from 'react';

export default function LeadsDashboard() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCRMLeads() {
      try {
        const res = await fetch('/api/metrics');
        const json = await res.json();
        if (json.success && json.data) setLeads(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCRMLeads();
  }, []); // Anchored securely with an empty array to prevent infinite 4-second loops

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">📊 CRM Pipeline Workspace</h1>
          <p className="text-xs text-slate-400">Live operational ledger for surgecrm.site</p>
        </div>
        <div className="text-xs font-mono bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">
          Total Base: {leads.length} Records
        </div>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-6 text-center text-xs font-mono text-slate-400">
        {isLoading ? 'Syncing core ledger...' : `Active operational pipeline running smooth with ${leads.length} leads.`}
      </div>
    </div>
  );
}
