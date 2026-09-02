'use client';

import React, { useState, useMemo } from 'react';
import SalesforceLayout from '../../../components/SalesforceLayout';
import { 
  Sparkles, Search, Filter, Plus, DollarSign, TrendingUp, 
  Percent, Zap, Layers, Briefcase, Flame, 
  HelpCircle, Mail, Phone, Building, ChevronRight, Eye, Trash2
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  status: string;
  priority: string;
  conversion: number;
  health: string;
  source: string;
}

const INITIAL_LEADS: Lead[] = [
  { id: '1', name: 'Branden Miller', company: 'Rainmaker Sales LLC', email: 'branden@rainmaker.com', phone: '(555) 019-2834', value: 145000, status: 'Hot', priority: 'High', conversion: 92, health: 'Excellent', source: 'Inbound' },
  { id: '2', name: 'Sarah Jenkins', company: 'Acme Growth Corp', email: 'sarah.j@acme.io', phone: '(555) 014-4921', value: 82500, status: 'Warm', priority: 'Medium', conversion: 68, health: 'Fair', source: 'Outbound' },
  { id: '3', name: 'David Chen', company: 'Apex Digital Media', email: 'dchen@apex.tech', phone: '(555) 017-8822', value: 245000, status: 'In Negotiation', priority: 'High', conversion: 85, health: 'Excellent', source: 'Referral' },
  { id: '4', name: 'Elena Rostova', company: 'Surge Heavy Industries', email: 'elena@surgeind.com', phone: '(555) 012-3456', value: 64000, status: 'Cold Intake', priority: 'Low', conversion: 24, health: 'Attention', source: 'Vercel' },
  { id: '5', name: 'Marcus Vance', company: 'CloudScale Networks', email: 'marcus@cloudscale.net', phone: '(555) 015-7711', value: 118000, status: 'Hot', priority: 'Medium', conversion: 75, health: 'Excellent', source: 'LinkedIn' }
];

export default function DashboardLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
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
      <div className="min-h-screen bg-[#070a13] text-slate-100 p-6 font-sans antialiased">
        
        {/* COMMAND HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0d1527] to-[#090d1a] border border-cyan-500/10 p-8 rounded-3xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-2xl text-white"><Zap size={28} /></div>
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-black tracking-widest uppercase mb-1.5"><Sparkles size={12} /> Surge Workspace</div>
                <h1 className="text-4xl font-black text-white">Lead Pipeline Control</h1>
              </div>
            </div>
            <button type="button" className="bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-lg shadow-cyan-500/10">
              + Deploy Node
            </button>
          </div>
        </div>

        {/* METRICS PANELS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <p className="text-[11px] font-black text-slate-500 uppercase mb-1 tracking-wider">Pipeline Liquidity</p>
            <h3 className="text-3xl font-black text-white">${metrics.total.toLocaleString()}</h3>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <p className="text-[11px] font-black text-slate-500 uppercase mb-1 tracking-wider">Apex Node Strike</p>
            <h3 className="text-3xl font-black text-white">${metrics.maxDeal.toLocaleString()}</h3>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <p className="text-[11px] font-black text-slate-500 uppercase mb-1 tracking-wider">Mean Kinetic Velocity</p>
            <h3 className="text-3xl font-black text-white">{metrics.avgWin}%</h3>
          </div>
        </section>

        {/* CONTROLS */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col xl:flex-row gap-4 justify-between items-center">
          <div className="relative w-full xl:w-96">
            <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
            <input type="text" placeholder="Query active nodes..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl pl-11 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-all" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Hot', 'Warm', 'In Negotiation', 'Cold Intake'].map(t => (
              <button key={t} type="button" onClick={() => setActiveTab(t)} className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${activeTab === t ? 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' : 'text-slate-400 border-slate-800 bg-[#0a0f1d]'}`}>{t}</button>
            ))}
          </div>
        </div>

        {/* PIPELINE GRID */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-900/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="py-4 px-6">Account Interface Node</th>
                <th className="py-4 px-6">Contract Payload</th>
                <th className="py-4 px-6">Stage Status</th>
                <th className="py-4 px-6">Target Conversion</th>
                <th className="py-4 px-6">System Health</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30 text-xs">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-900/40 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 bg-[#0a0f1d] border border-slate-800 rounded-xl text-slate-400 group-hover:text-cyan-400 transition-all"><Building size={16} /></div>
                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">{lead.name}</div>
                        <div className="text-slate-400 text-xs mt-0.5">{lead.company}</div>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500 font-mono">
                          <span><Mail size={10} className="inline mr-1" />{lead.email}</span>
                          <span><Phone size={10} className="inline mr-1" />{lead.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono font-black text-slate-200 text-sm">${lead.value.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <select value={lead.status} onChange={e => updateStatus(lead.id, e.target.value)} className="text-[10px] font-black uppercase bg-[#0a0f1d] border border-slate-800 rounded-xl p-1.5 text-slate-300">
                      {['Hot', 'Warm', 'In Negotiation', 'Cold Intake'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-32">
                      <div className="flex justify-between items-center text-[10px] mb-1 font-mono text-slate-400">
                        <span>Confidence</span><span>{lead.conversion}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#0a0f1d] border border-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500" style={{ width: `${lead.conversion}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-black uppercase border px-2 py-1 rounded-lg ${
                      lead.health === 'Excellent' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
                      lead.health === 'Fair' ? 'border-amber-500/20 text-amber-400 bg-amber-500/5' : 'border-rose-500/20 text-rose-400 bg-rose-500/5'
                    }`}>{lead.health}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-1 text-slate-500">
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
