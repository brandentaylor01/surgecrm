"use client";
import React, { useState } from 'react';
import { LayoutDashboard, ShieldCheck, Target, TrendingUp, DollarSign, Users } from 'lucide-react';

export default function ProjectionPage() {
  const [retainer, setRetainer] = useState(2500);
  const [dealsPerMonth, setDealsPerMonth] = useState(2);
  const [targetMRR, setTargetMRR] = useState(25000);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const mrrTimeline = months.map(m => m * dealsPerMonth * retainer);
  const currentYearEndMRR = mrrTimeline[11];
  const annualizedRunRate = currentYearEndMRR * 12;
  const monthsToTarget = Math.ceil(targetMRR / (dealsPerMonth * retainer));

  return (
    <div className="min-h-screen bg-[#09090b] text-[#e4e4e7] p-8 font-sans tracking-wide antialiased">
      <nav className="flex items-center justify-between bg-gradient-to-b from-[#14141a] to-[#0c0c0f] border border-[#1f1f2a] rounded-2xl px-6 py-4 mb-12 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-white"><ShieldCheck className="h-5 w-5" /></div>
          <span className="text-xs font-black text-white uppercase tracking-[0.2em] font-mono">SURGECRM</span>
        </div>
        <a href="/" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-transparent font-mono text-[10px] font-black uppercase text-slate-400 hover:text-white hover:border-[#22222d] hover:bg-[#111116] transition-all">
          <LayoutDashboard className="h-3.5 w-3.5" /> Return to Registry
        </a>
      </nav>

      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] font-mono">FORECAST & METRICS MATRIX</span>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1 [text-shadow:0_1px_0_#999,0_2px_2px_rgba(0,0,0,0.8)]">PROJECTIONS & GOALS</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#060608] border border-[#131317] p-4 rounded-lg">
            <span className="text-neutral-500 text-[9px] font-bold block uppercase tracking-wider flex items-center gap-1.5"><DollarSign className="h-3 w-3 text-indigo-400" /> MONTH 12 MRR RUN-RATE</span>
            <div className="text-indigo-400 font-sans text-xl font-bold mt-1">${currentYearEndMRR.toLocaleString()}.00</div>
          </div>
          <div className="bg-[#060608] border border-[#131317] p-4 rounded-lg">
            <span className="text-neutral-500 text-[9px] font-bold block uppercase tracking-wider flex items-center gap-1.5"><TrendingUp className="h-3 w-3 text-emerald-400" /> ANNUALIZED RETENTION VALUE</span>
            <div className="text-emerald-400 font-sans text-xl font-bold mt-1">${annualizedRunRate.toLocaleString()}.00</div>
          </div>
          <div className="bg-[#060608] border border-[#131317] p-4 rounded-lg">
            <span className="text-neutral-500 text-[9px] font-bold block uppercase tracking-wider flex items-center gap-1.5"><Target className="h-3 w-3 text-white" /> TIME TO TARGET MRR</span>
            <div className="text-white font-sans text-xl font-bold mt-1">{monthsToTarget <= 0 ? 'GOAL MET' : `${monthsToTarget} MONTHS`}</div>
          </div>
        </div>

        <div className="bg-[#060608] border border-[#1b1b24] rounded-2xl p-6 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs uppercase">
          <div className="space-y-4">
            <span className="text-[10px] font-black text-indigo-400 tracking-widest block border-b border-[#111115] pb-2">🎛️ VELOCITY CONTROLS</span>
            <div>
              <label className="block text-[9px] font-bold text-slate-500 mb-1.5">MONTHLY CLIENT RETAINER ($)</label>
              <input type="number" value={retainer} onChange={e => setRetainer(Number(e.target.value) || 0)} className="w-full bg-[#0d0d11] border border-[#20202a] p-3 rounded-xl text-white focus:border-slate-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-500 mb-1.5">CLOSED RETAINERS PER MONTH</label>
              <input type="number" value={dealsPerMonth} onChange={e => setDealsPerMonth(Number(e.target.value) || 0)} className="w-full bg-[#0d0d11] border border-[#20202a] p-3 rounded-xl text-white focus:border-slate-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-500 mb-1.5">TARGET MRR GOAL ($)</label>
              <input type="number" value={targetMRR} onChange={e => setTargetMRR(Number(e.target.value) || 0)} className="w-full bg-[#0d0d11] border border-[#20202a] p-3 rounded-xl text-white focus:border-slate-500 focus:outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black text-emerald-400 tracking-widest block border-b border-[#111115] pb-2">📊 COMPOUND TIMELINE BREAKDOWN</span>
            <div className="divide-y divide-[#12121a] max-h-[220px] overflow-y-auto pr-1">
              {mrrTimeline.map((val, idx) => (
                <div key={idx} className="py-2 flex justify-between items-center text-[10px]">
                  <span className="text-neutral-500 font-bold">MONTH 0{idx + 1}:</span>
                  <span className="text-white font-black">${val.toLocaleString()}.00 /MO</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
