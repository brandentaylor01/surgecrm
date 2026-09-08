import React from 'react';
import SalesforceLayout from '../../../components/SalesforceLayout';
import SalesforceWorkspace from '../../../components/SalesforceWorkspace';

export const revalidate = 0;

async function getSupabaseOpportunities() {
  // IMPORTANT: Replace this with your unique project reference ID (e.g., https://supabase.co)
  const SUPABASE_URL = "https://supabase.co";
  const SUPABASE_KEY = "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL";

  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  };

  try {
    const response = await fetch("http://localhost:3000/api/opportunities", {
      method: 'GET',
      headers: headers,
      next: { revalidate: 0 }
    });

    const contentType = response.headers.get("content-type") || "";
    
    // FIXED: Safety gate protects against HTML crashes by checking the data type first
    if (!response.ok || !contentType.includes("application/json")) {
      console.error("⚠️ Database did not return valid JSON matrix data.");
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error("❌ Data retrieval thread error:", error);
    return [];
  }
}

export default async function LeadsDashboardPage() {
  const opportunities = await getSupabaseOpportunities();

  return (
    <SalesforceLayout>
      <div className="flex flex-col flex-1 bg-[#0d0d0e] min-h-screen">
        <header className="border-b border-[#1f1f23] bg-[#131316] p-6 flex justify-between items-center font-mono text-[10px] tracking-wider uppercase text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
            <span className="text-zinc-200 font-light">Lead Datacenter Ledger</span>
          </div>
          <div>Operator // Branden Taylor</div>
        </header>

        <main className="flex-1 flex flex-col">
          <SalesforceWorkspace initialLeads={opportunities} />
        </main>
      </div>
    </SalesforceLayout>
  );
}
