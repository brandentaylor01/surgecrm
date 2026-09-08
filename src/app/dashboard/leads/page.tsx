import React from 'react';
import SalesforceWorkspace from '../../../components/SalesforceWorkspace';

// Enforces server-side data extraction loops on every fresh workspace load
export const revalidate = 0;

async function getSupabaseOpportunities() {
  const SUPABASE_URL = "https://supabase.co";
  const SUPABASE_KEY = "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL";

  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  };

  try {
    const response = await fetch(SUPABASE_URL, {
      method: 'GET',
      headers: headers,
      next: { revalidate: 0 } // Bypasses cache to protect local memory
    });

    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("❌ Data retrieval thread error:", error);
    return [];
  }
}

export default async function LeadsDashboardPage() {
  // Pulls live records directly from your Supabase cloud tables
  const opportunities = await getSupabaseOpportunities();

  return (
    <div className="flex flex-col flex-1 bg-[#09090b] min-h-screen">
      {/* Structural Neon Top Bar Navigation layout Header */}
      <header className="border-b border-[#27272a] bg-[#121214] p-3 flex justify-between items-center font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          <span className="text-zinc-200 font-bold uppercase tracking-wider">SurgeCRM Framework Workspace</span>
        </div>
        <div className="text-zinc-500">
          Operator Account: <span className="text-[#10b981]">Branden Taylor</span>
        </div>
    </header>

      {/* Renders the high-density spreadsheet transaction container component */}
      <main className="flex-1 flex flex-col">
        <SalesforceWorkspace initialLeads={opportunities} />
      </main>
    </div>
  );
}
