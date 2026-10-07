"use client";
import React, { useState, useMemo } from 'react';
import { 
  Building2, Search, Filter, Sparkles, ArrowUpRight, 
  TrendingUp, Percent, DollarSign, BarChart3, User, ShieldCheck
} from 'lucide-react';

const INITIAL_LEADS = [
  { id: '1', name: 'Branden Miller', company: 'Rainmaker Sales LLC', email: 'branden@rainmaker.com', phone: '(555) 019-2834', value: 145000, status: 'Hot', conversion: 92 },
  { id: '2', name: 'Sarah Jenkins', company: 'Acme Growth Corp', email: 'sarah.j@acme.io', phone: '(555) 014-4921', value: 82500, status: 'Warm', conversion: 68 },
  { id: '3', name: 'David Chen', company: 'Apex Digital Media', email: 'dchen@apex.tech', phone: '(555) 017-2822', value: 245000, status: 'In Negotiation', conversion: 85 },
  { id: '4', name: 'Elena Rostova', company: 'Surge Heavy Industries', email: 'elena@surgeind.com', phone: '(555) 012-3456', value: 64000, status: 'Cold Intake', conversion: 24 },
  { id: '5', name: 'Marcus Vance', company: 'CloudScale Networks', email: 'marcus@cloudscale.net', phone: '(555) 015-7711', value: 118000, status: 'Hot', conversion: 75 }
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
                            l.company.toLowerCase().includes(search.toLowerCase());
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-800 p-8 lg:p-12">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-lg shadow-sm">
              <Building2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-blue-600 text-[10px] font-bold tracking-wider uppercase mb-0.5 font-mono">
                <Sparkles size={11} /> Live Pipeline Matrix
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Sales Operations</h1>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pipeline Volume</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">\${metrics.total.toLocaleString()}</h3>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Apex Deal Size</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">\${metrics.maxDeal.toLocaleString()}</h3>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Kinetic Conversion Ratio</span>
            <h3 className="text-2xl font-black text-blue-600 mt-1 font-mono">{metrics.avgWin}%</h3>
          </div>
        </section>

        {/* Search Filter Bar */}
        <div className="bg-white border border-slate-200 p-4 mb-6 rounded-xl flex flex-col xl:flex-row gap-4 justify-between items-center shadow-sm">
          <div className="relative w-full xl:w-96">
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search prospects..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500/40 transition-colors" 
            />
          </div>
          <div className="flex flex-wrap items-center gap-1 w-full xl:w-auto">
            {['All', 'Hot', 'Warm', 'In Negotiation', 'Cold Intake'].map((t) => (
              <button 
                key={t} 
                onClick={() => setActiveTab(t)} 
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${activeTab === t ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-slate-500 border-transparent hover:bg-slate-50'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                <th className="py-3.5 px-6">Company Account / Contact</th>
                <th className="py-3.5 px-6">Contract Value</th>
                <th className="py-3.5 px-6">Pipeline Stage</th>
                <th className="py-3.5 px-6">Confidence Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-bold text-slate-900 text-sm tracking-tight">{lead.name}</div>
                      <div className="text-slate-400 text-xs mt-0.5 font-medium">{lead.company} • <span className="font-mono text-slate-400">{lead.email}</span></div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-slate-900 text-sm">
                    \${lead.value.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <select 
                      value={lead.status} 
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className="text-[10px] font-bold uppercase bg-white border border-slate-200 rounded-lg p-1.5 text-slate-700 focus:outline-none focus:border-blue-500/40 font-mono"
                    >
                      {['Hot', 'Warm', 'In Negotiation', 'Cold Intake'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${lead.conversion}%` }} />
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 font-bold">{lead.conversion}%</span>
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
