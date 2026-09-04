"use client";
import React, { useState, useEffect } from "react";
import { Users, Layers, TrendingUp, Plus, RefreshCw, Briefcase, MapPin, Search } from "lucide-react";
import DetailPanel, { Opp } from "@/app/DetailPanel";

export default function SalesforceWorkspace() {
  const [opportunities, setOpportunities] = useState<Opp[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<Opp | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredOpps = opportunities.filter(opp => 
    opp.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.contact?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans relative overflow-hidden tracking-normal selection:bg-blue-500/30">
      
      {/* HEADER HERO */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8 pb-8 border-b border-slate-900/80 mb-12">
        <div>
          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest font-mono">RAINMAKER CONSOLE v2.0</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1">Pipeline Control Registry</h1>
          <p className="text-slate-400 text-sm md:text-base mt-2 max-w-2xl font-normal leading-relaxed">
            Operational workspace, deal validation system, and high-impact custom proposal generator for <span className="text-slate-200 font-semibold underline decoration-blue-500 decoration-2">Rainmaker Sales LLC</span>.
          </p>
        </div>
        <div className="flex items-center gap-4 self-start md:self-center">
          <button 
            onClick={fetchData}
            className="p-3 text-slate-400 hover:text-white border border-slate-800 rounded-xl hover:bg-slate-900 hover:border-slate-700 transition-all duration-200 bg-slate-950 shadow-sm"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-xl flex items-center gap-2.5 shadow-lg shadow-blue-500/10 transition-all duration-200 hover:-translate-y-0.5">
            <Plus className="h-5 w-5 stroke-[2.5]" /> Add Client Record
          </button>
        </div>
      </div>

      {/* CLEAN METRICS BANNER (Projections successfully removed) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
        <div className="relative p-6 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950/20 border border-slate-900 hover:border-slate-800/80 transition-colors">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-2"><Users className="h-4 w-4 text-blue-400" /> Total Active Pipeline</span>
          <div className="text-4xl lg:text-5xl font-bold text-white mt-3 font-mono tracking-tight">{totalLeads}</div>
          <span className="text-[11px] text-slate-500 block mt-2 font-mono">Assigned company registry cards</span>
        </div>
        
        <div className="relative p-6 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950/20 border border-slate-900 hover:border-slate-800/80 transition-colors">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-2"><Layers className="h-4 w-4 text-emerald-400" /> Gross Contract Value</span>
          <div className="text-4xl lg:text-5xl font-bold text-emerald-400 mt-3 font-mono tracking-tight">
            ${grossPipeline.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500 block mt-2 font-mono">Total volume under evaluation</span>
        </div>
        
        <div className="relative p-6 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950/20 border border-slate-900 hover:border-slate-800/80 transition-colors">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-2"><TrendingUp className="h-4 w-4 text-indigo-400" /> Win Ratio Metric</span>
          <div className="text-4xl lg:text-5xl font-bold text-indigo-400 mt-3 font-mono tracking-tight">{winRate}%</div>
          <span className="text-[11px] text-slate-500 block mt-2 font-mono">Based on closed & secured records</span>
        </div>
      </div>

      {/* FILTER SEARCH PANEL */}
      <div className="relative z-10 mb-6 flex max-w-md items-center">
        <Search className="absolute left-4 text-slate-500 h-4 w-4 z-20" />
        <input 
          type="text" 
          placeholder="Search accounts by company, contact, or region..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/40 hover:bg-slate-900/70 focus:bg-slate-900 border border-slate-900 focus:border-blue-500/50 pl-11 pr-4 py-3 rounded-xl text-sm text-slate-200 placeholder-slate-500 transition-all focus:outline-none"
        />
      </div>
      {/* IMMERSIVE DATA GRID VIEW */}
      <div className="relative z-10 border border-slate-900 rounded-2xl bg-slate-950/40 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-900/80 bg-slate-900/30 text-slate-400 uppercase text-xs tracking-wider font-semibold">
                <th className="p-5">Company Account</th>
                <th className="p-5">Profile Key</th>
                <th className="p-5">Location</th>
                <th className="p-5">Pipeline State</th>
                <th className="p-5 text-right">Computed Proposal Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60">
              {filteredOpps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500 font-medium italic text-base">
                    No active pipeline profiles matched your filters.
                  </td>
                </tr>
              ) : (
                filteredOpps.map((opp) => (
                  <tr 
                    key={opp.id} 
                    onClick={() => setSelectedOpp(opp)}
                    className={`hover:bg-slate-900/30 cursor-pointer transition-all duration-150 group ${selectedOpp?.id === opp.id ? 'bg-blue-600/5 border-l-4 border-l-blue-500' : ''}`}
                  >
                    <td className="p-5 font-semibold text-white group-hover:text-blue-400 transition-colors text-base max-w-[240px] truncate">
                      {opp.company || "Unnamed Contract"}
                    </td>
                    <td className="p-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold tracking-wide bg-slate-900/80 border border-slate-800 text-slate-300">
                        <Briefcase className="h-3.5 w-3.5 text-slate-500" /> {opp.clientKey || "default"}
                      </span>
                    </td>
                    <td className="p-5 text-slate-300 font-medium text-sm">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-slate-500" /> {opp.city || "Not Assigned"}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                        opp.status === 'secured' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        opp.status === 'proposal' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        opp.status === 'lost' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        'bg-slate-800 text-slate-400 border border-slate-700/50'
                      }`}>
                        {opp.status || 'qualifying'}
                      </span>
                    </td>
                    <td className="p-5 text-right font-bold text-white text-base font-mono">
                      ${(opp.value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED CONTROLS INJECTOR */}
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
