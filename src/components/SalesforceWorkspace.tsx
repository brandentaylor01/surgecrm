"use client";
import React, { useState, useEffect } from "react";
import { Users, Layers, TrendingUp, Plus, RefreshCw, Briefcase, MapPin } from "lucide-react";
// Import clean Opp type to ensure interface uniformity
import DetailPanel, { Opp } from "@/app/DetailPanel";

export default function SalesforceWorkspace() {
  const [opportunities, setOpportunities] = useState<Opp[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<Opp | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/opportunities');
      const data = await res.json();
      setOpportunities(data);
    } catch (err) {
      console.error("Failed fetching pipeline registry:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSetField = async (id: string, field: keyof Opp, value: any) => {
    const updatedOpps = opportunities.map(opp => 
      opp.id === id ? { ...opp, [field]: value } : opp
    );
    setOpportunities(updatedOpps);
    
    if (selectedOpp && selectedOpp.id === id) {
      setSelectedOpp({ ...selectedOpp, [field]: value });
    }

    try {
      await fetch('/api/opportunities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, field, value })
      });
    } catch (err) {
      console.error("Failed persisting updates:", err);
    }
  };

  const totalLeads = opportunities.length;
  const grossPipeline = opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);
  
  const securedPipeline = opportunities
    .filter(opp => opp.status === 'secured')
    .reduce((sum, opp) => sum + (opp.value || 0), 0);
  const winRate = grossPipeline > 0 ? ((securedPipeline / grossPipeline) * 100).toFixed(1) : "0.0";

  const stages = ['qualifying', 'proposal', 'secured', 'lost'];
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans relative overflow-hidden">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-900 mb-10">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-wide">⚡ Pipeline Control Registry</h1>
          <p className="text-slate-500 text-xs mt-1 font-mono">operational dashboard & proposal builder context matrix</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            className="p-2 text-slate-400 hover:text-white border border-slate-800 rounded-lg hover:bg-slate-900 transition"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition">
            <Plus className="h-3.5 w-3.5" /> New Pipeline Account
          </button>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="relative pl-5 border-l border-blue-500/30">
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest flex items-center gap-1.5"><Users className="h-3 w-3" /> Total Pipeline Records</span>
          <div className="text-3xl font-light text-white mt-1 font-mono">{totalLeads}</div>
        </div>
        <div className="relative pl-5 border-l border-emerald-500/30">
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest flex items-center gap-1.5"><Layers className="h-3 w-3" /> Gross Contract Value</span>
          <div className="text-3xl font-light text-emerald-400 mt-1 font-mono">
            ${grossPipeline.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="relative pl-5 border-l border-indigo-500/30">
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest flex items-center gap-1.5"><TrendingUp className="h-3 w-3" /> Current Closed Win-Rate</span>
          <div className="text-3xl font-light text-white mt-1 font-mono">{winRate}%</div>
        </div>
      </div>

      <div className="relative z-10 border border-slate-900 rounded-xl bg-slate-950/50 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-900/20 text-slate-500 uppercase text-[10px] tracking-wider">
                <th className="p-4 font-semibold">Company Account</th>
                <th className="p-4 font-semibold">Profile Model</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Pipeline State</th>
                <th className="p-4 font-semibold text-right">Computed Proposal Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {opportunities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-600 italic">No operational pipeline items mapped in registry.</td>
                </tr>
              ) : (
                opportunities.map((opp) => (
                  <tr 
                    key={opp.id} 
                    onClick={() => setSelectedOpp(opp)}
                    className={`hover:bg-slate-900/40 cursor-pointer transition ${selectedOpp?.id === opp.id ? 'bg-blue-500/5 border-l-2 border-l-blue-500' : ''}`}
                  >
                    <td className="p-4 font-medium text-white max-w-[200px] truncate">{opp.company || "Unnamed Contract"}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide bg-slate-900 border border-slate-800 text-slate-400">
                        <Briefcase className="h-2.5 w-2.5" /> {opp.clientKey || "default"}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-600" /> {opp.city || "Not Assigned"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        opp.status === 'secured' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        opp.status === 'proposal' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        opp.status === 'lost' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {opp.status || 'qualifying'}
                      </span>
                    </td>
                    <td className="p-4 text-right font-semibold text-slate-200">
                      ${(opp.value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOpp && (
        <DetailPanel 
          sel={selectedOpp} 
          stages={stages} 
          setField={handleSetField} 
          setSel={setSelectedOpp} 
        />
      )}
    </div>
  );
}
