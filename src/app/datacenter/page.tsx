'use client';
import React, { useState, useEffect } from 'react';

interface ScrapedLead {
  id: string; companyAccount: string; initialContact: string; city: string; email: string; status: string;
}

export default function RegionalDataCenter() {
  const [records, setRecords] = useState<ScrapedLead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVaultData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/opportunities');
      if (res.ok) {
        const rawJson = await res.json();
        // Bulletproof database un-wrapper layer targeting raw SQL array rows
        const cleanedRows = Array.isArray(rawJson) ? rawJson : (rawJson?.data || rawJson?.rows || []);
        setRecords(cleanedRows);
      }
    } catch (err) {
      console.error("Async transmission fault:", err);
    } finally { 
      setLoading(false); 
    }
  };

    useEffect(() => { fetchVaultData(); }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-[#e5e5e5] p-8 font-mono text-[11px] uppercase tracking-wider">
      <div className="flex justify-between items-center border-b border-[#141414] pb-4 mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => window.location.href = '/'} className="border border-[#22222a] bg-[#111116] px-3 py-1.5 rounded font-bold text-[9px] text-neutral-400 hover:text-white cursor-pointer">◀ BACK TO CONSOLE</button>
          <div>
            <h1 className="text-sm font-bold text-white tracking-[0.25em]">🤖 NEO MUNICIPAL DATA CENTER</h1>
            <p className="text-[9px] text-neutral-500 mt-0.5">Aggregated County Clusters Ledger — Northeast Ohio</p>
          </div>
        </div>
        <button onClick={fetchVaultData} className="border border-[#22222a] bg-[#111116] px-4 py-1.5 rounded font-bold text-[9px] hover:bg-[#1c1c24] text-neutral-300 cursor-pointer">⟳ REFRESH</button>
      </div>
      {loading ? (
        <div className="text-indigo-400 animate-pulse">STREAMING CLUSTER DATA FROM CLOUD INSTANCE...</div>
      ) : records.length === 0 ? (
        <div className="text-neutral-600 italic">No footprints captured yet. Fire the matrix scrubber first.</div>
      ) : (
        <div className="overflow-x-auto border border-[#141419] rounded-lg bg-[#060608]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#141419] text-neutral-500 bg-[#09090d]">
                <th className="p-3 text-[10px]">COMPANY ACCOUNT</th>
                <th className="p-3 text-[10px]">EXECUTIVE PROFILE</th>
                <th className="p-3 text-[10px]">MUNICIPAL SECTOR</th>
                <th className="p-3 text-[10px]">COMMUNICATION PATH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111115]">

              {records.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#0c0c10] transition">
                  <td className="p-3 text-white font-bold">{lead.companyAccount || lead.company_account || "UNTITLED CORP"}</td>
                  <td className="p-3 text-neutral-300">{lead.initialContact || lead.initial_contact || "UNKNOWN"}</td>
                  <td className="p-3 text-neutral-400">{lead.city}</td>
                  <td className="p-3 text-indigo-400 font-sans tracking-normal lowercase">{lead.email || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
