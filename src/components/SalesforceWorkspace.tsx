'use client';
import React, { useState } from 'react';

interface Opportunity {
  id: string; company: string; name: string; email: string;
  phone: string; address: string; value: number; status: string;
}

export default function SalesforceWorkspace({ initialLeads = [] }) {
  const [leads, setLeads] = useState<Opportunity[]>(initialLeads);
  
  const triggerQuickSale = (id: string) => alert(`⚡ 1-Click Sale Executed for Deal Account: ${id}`);
  const issueInvoice = (id: string) => alert(`🗒 Invoice Generated & Synchronized via Vercel for Lead: ${id}`);
  const shipPackage = (id: string) => alert(`📦 Shipping Waybill dispatched to fulfillment agent for row: ${id}`);

  return (
    <div className="flex flex-col flex-1 p-3 bg-[#09090b] text-xs font-mono">
      {/* Dynamic Summary Operational Matrix Navbar */}
      <div className="flex items-center justify-between border border-[#27272a] bg-[#121214] p-3 mb-3 rounded">
        <div className="flex gap-6 text-[#10b981]">
          <span>📊 Pipeline Yield: ${leads.reduce((a, b) => a + (b.value || 0), 0).toLocaleString()}</span>
          <span>👥 Staged Accounts: {leads.length}</span>
        </div>
        <button onClick={() => setLeads([])} className="bg-red-950/40 border border-red-800 text-red-400 px-2 py-1 rounded hover:bg-red-900/50 transition">
          Wipe Active Ledger
        </button>
      </div>

      {/* High Density Content Log Layout */}
      <div className="overflow-x-auto border border-[#27272a] rounded bg-[#121214]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#27272a] bg-[#161619] text-zinc-400">
              <th className="p-2 border-r border-[#27272a]">Account Entity Info</th>
              <th className="p-2 border-r border-[#27272a]">Direct Context & Location Details</th>
              <th className="p-2 border-r border-[#27272a]">Financial Matrix</th>
              <th className="p-2 text-center text-[#10b981]">1-Click Rapid Transactions Menu</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-[#27272a] hover:bg-zinc-900/40 transition">
                <td className="p-2 border-r border-[#27272a] align-top">
                  <div className="text-zinc-200 font-bold">{lead.company}</div>
                  <div className="text-zinc-400">👤 {lead.name}</div>
                  <div className="text-zinc-500 text-[10px]">📧 {lead.email}</div>
                </td>
                <td className="p-2 border-r border-[#27272a] align-top text-zinc-400">
                  <div>📞 {lead.phone || 'N/A'}</div>
                  <div className="text-zinc-500 text-[10px] truncate max-w-[200px]">📍 {lead.address || 'Ohio Region'}</div>
                  <span className="inline-block mt-1 px-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[10px]">
                    {lead.status}
                  </span>
                </td>
                <td className="p-2 border-r border-[#27272a] align-top font-bold text-zinc-200">
                  ${(lead.value || 0).toLocaleString()}
                </td>
                <td className="p-2 align-top">
                  <div className="flex gap-1 justify-center">
                    <button onClick={() => triggerQuickSale(lead.id)} className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600 text-emerald-400 px-2 py-1 rounded text-[11px] font-bold">
                      ⚡ Closed Sale
                    </button>
                    <button onClick={() => issueInvoice(lead.id)} className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-300 px-2 py-1 rounded text-[11px]">
                      🗒 Bill/Invoice
                    </button>
                    <button onClick={() => shipPackage(lead.id)} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 px-2 py-1 rounded text-[11px]">
                      📦 Ship Items
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
