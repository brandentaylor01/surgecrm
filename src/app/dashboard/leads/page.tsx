'use client';

import React, { useState, useMemo } from 'react';
import SalesforceLayout from '../../../components/SalesforceLayout';
import { 
  Sparkles, Search, Plus, DollarSign, TrendingUp, Percent, 
  Building, ChevronRight, Mail, Phone, Clock, ArrowUpRight, BarChart3
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
    <SalesforceLayout>
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-8 font-sans antialiased">
        
        {/* Bright White Salesforce Premium Header */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/10">
              <Building size={26} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold tracking-wider uppercase mb-0.5">
                <Sparkles size={12} /> Live Revenue Workspace
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sales Operations</h1>
            </div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all shadow-sm">
            + New Opportunity
          </button>
        </div>

        {/* High-Impact Executive KPI Analytics Board */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pipeline Volume</span>
              <span className="text-emerald-600 bg-emerald-50 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowUpRight size={10} /> +12.4%
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-900">${metrics.total.toLocaleString()}</h3>
            <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '74%' }} />
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Apex Cap Strike</span>
              <span className="text-slate-400 text-[10px] font-medium">Active Pass</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900">${metrics.maxDeal.toLocaleString()}</h3>
            <p className="text-[11px] text-slate-400 mt-3 font-medium">Highest structural contract value</p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kinetic Win Ratio</span>
              <span className="text-blue-600 bg-blue-50 text-[10px] font-bold px-2 py-0.5 rounded-full">Target ICP</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900">{metrics.avgWin}%</h3>
            <p className="text-[11px] text-slate-400 mt-3 font-medium">Average conversion path probability</p>
          </div>
        </section>

        {/* Visual Charts and Distribution Graphs Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 size={16} className="text-blue-600" /> Pipeline Revenue Distribution Graph
              </h4>
              <span className="text-xs text-slate-400 font-medium">By Account Value</span>
            </div>
            {/* High-Fidelity Custom Pure CSS Chart Graph Visualization */}
            <div className="h-44 flex items-end justify-between gap-4 pt-4 px-2 border-b border-slate-100">
              {filteredLeads.map((l) => {
                const heightPercentage = Math.max(15, Math.min(100, (l.value / 250000) * 100));
                return (
                  <div key={l.id} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded absolute -translate-y-6 font-mono shadow-sm">
                      \${Math.round(l.value/1000)}k
                    </span>
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 rounded-t-lg transition-all duration-500 shadow-sm"
                      style={{ height: `${heightPercentage}%` }}
                    />
                    <span className="text-[10px] text-slate-400 font-bold max-w-full truncate text-center font-sans tracking-tight">
                      {l.company.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <h4 className="text-sm font-bold text-slate-800 mb-4">Stage Segmentation Metric</h4>
            <div className="space-y-3.5">
              {['Hot', 'Warm', 'In Negotiation', 'Cold Intake'].map((st) => {
                const count = leads.filter(l => l.status === st).length;
                const pct = leads.length ? Math.round((count / leads.length) * 100) : 0;
                return (
                  <div key={st} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>{st}</span>
                      <span className="font-mono text-slate-400">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Filters and Ledger Data Matrix */}
        <div className="bg-white border border-slate-200 p-4 mb-6 rounded-2xl flex flex-col xl:flex-row gap-4 justify-between items-center shadow-sm">
          <div className="relative w-full xl:w-80">
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={15} />
            <input 
              type="text" 
              placeholder="Search prospects..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500 text-slate-700 transition-colors placeholder-slate-400" 
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

        {/* Clear White Enterprise Account Board */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                <th className="py-3.5 px-6">Company Account / Contact</th>
                <th className="py-3.5 px-6">Contract Value</th>
                <th className="py-3.5 px-6">Pipeline Stage</th>
                <th className="py-3.5 px-6">Confidence Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{lead.name}</div>
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
                      className="text-[10px] font-bold uppercase bg-white border border-slate-200 rounded-lg p-1.5 text-slate-700 focus:outline-none focus:border-blue-500"
                    >
                      {['Hot', 'Warm', 'In Negotiation', 'Cold Intake'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: \`\${lead.conversion}%\` }} />
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
    </SalesforceLayout>
  );
}
