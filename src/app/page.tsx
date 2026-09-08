'use client';
import React, { useState, useEffect } from 'react';
import SalesforceLayout from '../components/SalesforceLayout';
import SalesforceWorkspace from '../components/SalesforceWorkspace';

export default function RootLandingPage() {
  // FIXED: Explicitly set the state allocation type container to any[] to bypass never[] checks
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/opportunities')
      .then(res => res.json())
      .then(data => {
        setOpportunities(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const purgeStatusCategory = async (targetStatus: "Verified Intake" | "In Negotiation" | "Bypassed / Unsubscribed") => {
    const targetItems = opportunities.filter((o: any) => o.status === targetStatus);
    if (targetItems.length === 0) return alert(`NO LEADS PRESENT IN [${targetStatus.toUpperCase()}] TO PURGE.`);
    if (!confirm(`⚠️ SYSTEM WARNING: PERMANENTLY ERASE ALL ${targetItems.length} LEADS INSIDE ${targetStatus.toUpperCase()}?`)) return;
    
    try {
      const res = await fetch(`/api/opportunities?status=${encodeURIComponent(targetStatus)}`, { method: 'DELETE' });
      if (res.ok) {
        setOpportunities(opportunities.filter((o: any) => o.status !== targetStatus));
        alert('Cleared successfully.');
      }
    } catch (err) {
      alert('Network processing drop.');
    }
  };

  if (loading) return <div className="p-6 font-mono text-xs text-[#10b981] bg-[#09090b]">INITIALIZING WORKSPACE ENGINE...</div>;

  return (
    <SalesforceLayout>
      <div className="flex flex-col flex-1 bg-[#0d0d0e]">
        <div className="p-3 border-b border-[#27272a] bg-[#121214] flex gap-2 font-mono">
          <button onClick={() => purgeStatusCategory("Verified Intake")} className="bg-zinc-900 border border-zinc-700 text-zinc-400 px-2 py-1 rounded text-[11px] hover:bg-zinc-800 transition">
            🗑️ Purge Intake
          </button>
          <button onClick={() => purgeStatusCategory("In Negotiation")} className="bg-zinc-900 border border-zinc-700 text-zinc-400 px-2 py-1 rounded text-[11px] hover:bg-zinc-800 transition">
            🗑️ Purge Active Cadence
          </button>
        </div>
        <SalesforceWorkspace initialLeads={opportunities} />
      </div>
    </SalesforceLayout>
  );
}
