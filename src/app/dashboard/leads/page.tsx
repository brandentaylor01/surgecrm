'use client';

import React, { useState, useMemo } from 'react';
import SalesforceLayout from '../../../components/SalesforceLayout';
import { 
  Sparkles, Search, Plus, DollarSign, TrendingUp, Percent, 
  Zap, Building, ChevronRight, Eye, Trash2, Mail, Users, Globe 
} from 'lucide-react';

const INITIAL_LEADS = [
  { id: '1', name: 'Branden Miller', company: 'Rainmaker Sales LLC', email: 'branden@rainmaker.com', value: 145000, status: 'Hot', priority: 'High', conversion: 92, health: 'Excellent', sector: 'HVAC Mechanical' },
  { id: '2', name: 'Sarah Jenkins', company: 'Acme Growth Corp', email: 'sarah.j@acme.io', value: 82500, status: 'Warm', priority: 'Medium', conversion: 68, health: 'Fair', sector: 'Commercial Plumbing' },
  { id: '3', name: 'David Chen', company: 'Apex Digital Media', email: 'dchen@apex.tech', value: 245000, status: 'In Negotiation', priority: 'High', conversion: 85, health: 'Excellent', sector: 'Warehousing Logistics' },
  { id: '4', name: 'Elena Rostova', company: 'Surge Heavy Industries', email: 'elena@surgeind.com', value: 64000, status: 'Cold Intake', priority: 'Low', conversion: 24, health: 'Attention', sector: 'Metal Fabrication' },
  { id: '5', name: 'Marcus Vance', company: 'CloudScale Networks', email: 'marcus@cloudscale.net', value: 118000, status: 'Hot', priority: 'Medium', conversion: 75, health: 'Excellent', sector: 'Machine Shop Industrial' }
];

export default function DashboardLeadsPage() {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const updateStatus = (id: string, s: string) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: s } : l));
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || 
                            l.company.toLowerCase().includes(search.toLowerCase()) ||
                            l.sector.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === 'All' || l.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [leads, search, activeTab]);

  const metrics = useMemo(() => {
    const total = filteredLeads.reduce((acc, l) => acc + l.value, 0);
    const maxDeal = filteredLeads.length ? Math.max(...filteredLeads.map(l => l.value)) : 0;
    const avgWin = filteredLeads.length ? Math.round(filteredLeads.reduce((acc, l) => acc + l.conversion, 0) / filteredLeads.length) : 0;
    return { total, maxDeal, avgWin };
  }, [filteredLeads]);

  return (
    <SalesforceLayout>
      <div className="min-h-screen bg-[#0a0f1d] text-slate-100 p-6 font-sans antialiased">
        
        {/* Dynamic SaaS Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0d1527] to-[#090d1a] border border-cyan-500/10 p-8 rounded-3xl mb-8 shadow-[0_0_50px_-12px_rgba(6,182,212,0.15)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-2xl text-white">
                <Zap size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-black tracking-widest uppercase mb-1.5">
                  <Sparkles size={12} /> Surge Workspace Tenant Control
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight">Lead Pipeline Control</h1>
              </div>
            </div>
            <button className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm px-6 py-3 rounded-2xl transition-all shadow-lg shadow-cyan-500/20">
              + Deploy Outreach Node
            </button>
          </div>
        </div>

        {/* Global Pipeline Statistics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-xl">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Pipeline Liquidity</p>
            <h3 className="text-3xl font-black text-white">\${metrics.total.toLocaleString()}</h3>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-xl">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Apex Node Strike</p>
            <h3 className="text-3xl font-black text-white">\${metrics.maxDeal.toLocaleString()}</h3>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-xl">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Mean Kinetic Velocity</p>
            <h3 className="text-3xl font-black text-white">{metrics.avgWin}%</h3>
          </div>
        </section>

        {/* Search Matrix & Interactive Filter Controls */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-4 mb-6 rounded-2xl flex flex-col xl:flex-row gap-4 justify-between items-center backdrop-blur-xl">
          <div className="relative w-full xl:w-96">
            <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Query corporate records or trade sectors..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl pl-11 pr-4 py-2 text-xs focus:outline-none focus:border-cyan-500/50 text-slate-200 transition-colors" 
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
            {['All', 'Hot', 'Warm', 'In Negotiation', 'Cold Intake'].map((t) => (
              <button 
                key={t} 
                onClick={() => setActiveTab(t)} 
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${activeTab === t ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' : 'text-slate-400 border-slate-800 bg-[#0a0f1d] hover:border-slate-700'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Lead Master Datatable Panel */}
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-900/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="py-4 px-6">Account Node & Sector</th>
                <th className="py-4 px-6">Contract Value</th>
                <th className="py-4 px-6">Stage Status</th>
                <th className="py-4 px-6">Match Optimization</th>
                <th className="py-4 px-6">System Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30 text-xs">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-900/40 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 bg-[#0a0f1d] border border-slate-800 text-slate-400 rounded-xl group-hover:border-slate-700 transition-colors">
                        <Building size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">{lead.name}</div>
                        <div className="text-slate-400 text-xs mt-0.5">{lead.company} • <span className="text-slate-500 italic">{lead.sector}</span></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono font-black text-slate-200 text-sm tracking-tight">
                    \${lead.value.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <select 
                      value={lead.status} 
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className="text-[10px] font-black uppercase bg-[#0a0f1d] border border-slate-800 rounded-xl p-1.5 text-slate-300 focus:outline-none focus:border-cyan-500/50"
                    >
                      {['Hot', 'Warm', 'In Negotiation', 'Cold Intake'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-32">
                      <div className="w-full h-1.5 bg-[#0a0f1d] border border-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500" 
                          style={{ width: `${lead.conversion}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-black uppercase border px-2.5 py-1 rounded-lg ${
                      lead.health === 'Excellent' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 'border-amber-500/20 text-amber-400 bg-amber-500/5'
                    }`}>
                      {lead.health}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </SalesforceLayout>
);
}
