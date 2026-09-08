'use client';

import React, { useState, useEffect } from 'react';
import LeadRowActions from '@/components/LeadRowActions';
import DataAxleWorkbench from '@/components/DataAxleWorkbench';
import DataAxleMinerButton from '@/components/DataAxleMinerButton';
import AutoMailBlastPanel from '@/components/AutoMailBlastPanel';

interface Lead {
  id: string;
  account_name: string;
  contact_name: string;
  contact_email: string;
  phone_number: string;
  location_details: string;
  financial_matrix: number;
  stage: string;
}

export default function LeadsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showWorkbench, setShowWorkbench] = useState(false);
  const [qualifyingIds, setQualifyingIds] = useState<string[]>([]);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads/rapid-action?action=GET_ACTIVE');
      if (!res.ok) throw new Error();
      setLeads(await res.json());
    } catch {
      setLeads([
        { id: '1', account_name: 'Apex Luxury Ventures LLC', contact_name: 'Marcus Sterling', contact_email: 'm.sterling@apexluxury.com', phone_number: '216-555-0182', location_details: 'Tower City Center, Cleveland, OH', financial_matrix: 15000, stage: 'In Negotiation' },
        { id: '2', account_name: 'Summit Capital Group', contact_name: 'Helena Vance', contact_email: 'vance@summitcap.io', phone_number: '330-555-0143', location_details: 'S Main St, Akron, OH', financial_matrix: 8500, stage: 'Verified Intake' }
      ]);
    }
  };

  useEffect(() => { fetchLeads(); }, []);
  const handleBulkMinedLeads = (newL: Lead[]) => { setLeads(prev => [...prev, ...newL]); };
  const handleQualifyRow = async (lead: Lead) => { alert(`Qualified: ${lead.account_name}`); };
  const absoluteYield = leads.reduce((acc, curr) => acc + curr.financial_matrix, 0);

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8 font-sans">
      {/* GLOBAL HEADER PANEL */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6 mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">SURGECRM // Agency Console</h1>
          <p className="text-xs text-zinc-500 mt-1">OPERATOR // BRANDEN TAYLOR</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setShowWorkbench(!showWorkbench)} className="bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-200 font-medium text-xs py-2 px-4 rounded-lg transition">
            ⚙️ Workbench
          </button>
          <button onClick={fetchLeads} className="bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600/20 text-blue-400 font-medium text-xs py-2 px-4 rounded-lg transition">
            🔄 Sync Ledger
          </button>
        </div>
      </div>

      {showWorkbench && <div className="mb-6"><DataAxleWorkbench /></div>}

      {/* PIPELINE METRIC BLOCKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Pipeline Yield</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">${absoluteYield.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Staged Accounts</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{leads.length}</p>
        </div>
      </div>

      {/* CLOUD INJECTOR MINER & AUTO-MAIL RUNNERS */}
      <DataAxleMinerButton onMinedSuccess={handleBulkMinedLeads} />
      <AutoMailBlastPanel onBlastComplete={fetchLeads} />

      {/* ACTIVE MASTER TRANSACTION LEDGER TABLE */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider bg-zinc-900/20">
                <th className="p-4 font-semibold">Account Entity Info</th>
                <th className="p-4 font-semibold">Direct Context & Location</th>
                <th className="p-4 font-semibold">Financial Matrix</th>
                <th className="p-4 text-center font-semibold">1-Click Transactions Menu</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-zinc-900 hover:bg-zinc-900/30 transition duration-100">
                  <td className="p-4">
                    <div className="font-bold text-zinc-200">{lead.account_name}</div>
                    <div className="text-zinc-500 mt-0.5">{lead.contact_name}</div>
                    <div className="text-zinc-600 font-mono mt-0.5">{lead.contact_email}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-zinc-300 font-mono">{lead.phone_number}</div>
                    <div className="text-zinc-500 mt-1">{lead.location_details}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-zinc-300">${lead.financial_matrix.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <LeadRowActions leadId={lead.id} clientEmail={lead.contact_email} amount={lead.financial_matrix} location={lead.location_details} onActionComplete={fetchLeads} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
