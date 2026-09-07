"use client";
import React, { useState } from 'react';
import { LayoutDashboard, ShieldCheck, Sparkles, Database } from 'lucide-react';

export default function DealmakerPage() {
  const [rawInput, setRawInput] = useState('');
  const [status, setStatus] = useState('');
  const [count, setCount] = useState<number | null>(null);
  const [stagedLeads, setStagedLeads] = useState<any[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Record<string, boolean>>({});

  // Builds highly tailored executive cold emails addressing decision makers by name
  const buildEmailBody = (name: string, company: string) => {
    return `HI ${name.split(' ')[0]},\n\nCame across ${company} in Northeast Ohio. Given your focus as Owner, wanted to reach out directly. Most founders are looking to optimize operational efficiency and cut overhead right now without sacrificing pipeline output.\n\nLet me know if you have 5 mins for a brief brief review.\n\nBest,\nBranden`;
  };

  const toggleLeadApproval = (id: string) => {
    setSelectedLeads(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBulkSend = () => {
    const approved = stagedLeads.filter(l => selectedLeads[l.id]);
    if (approved.length === 0) return alert('NO LEADS CHOSEN FOR DISPATCH.');
    
    // Iterates through approved queue and opens standard mail client windows safely
    approved.forEach((lead, i) => {
      setTimeout(() => {
        const mailto = `mailto:${lead.email}?subject=${encodeURIComponent('Operational Efficiency Update - ' + lead.companyAccount)}&body=${encodeURIComponent(buildEmailBody(lead.initialContact, lead.companyAccount))}`;
        window.open(mailto, '_blank');
      }, i * 800); // 800ms human delay jitter between popups to respect system memory bounds
    });
    setStatus(`LAUNCHED DISPATCH COMPILER FOR ${approved.length} EXECUTIVE PROFILES.`);
  };

  const processLeads = async () => {
    if (!rawInput.trim()) return setStatus('INPUT EMPTY.');
    setStatus('PROCESSING STREAM...');
    
    // AUTOMATED BATCH ROTATION VECTOR: Explodes single inputs into multi-industry sector queries
    const targetNiches = ["HVAC", "ROOFING", "PLUMBING", "LOGISTICS", "ELECTRICAL"];
    let accumulatedLeads: any[] = [];
    
    setStatus('LAUNCHING BATCH ROTATION VECTOR (5 NICTHES MULTIPLIED)...');
    try {
      // 1. Convert lines into objects
      
      
      // 2. Fire backend scrubbing payload
      for (const niche of targetNiches) {
        const fullQuery = `${niche} ${rawInput.trim().toUpperCase()}`;
        const scrubRes = await fetch('/api/scrub', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword: fullQuery })
        });
        const scrubbed = await scrubRes.json();
        if (scrubbed.success) {
          accumulatedLeads = [...accumulatedLeads, ...scrubbed.data];
        }
      }
      const scrubbed = { success: true, data: accumulatedLeads };
      
      if (!scrubbed.success) throw new Error();

      // 3. Batch commit clean entries directly to database router
      let successCount = 0;
      for (const lead of scrubbed.data) {
        const res = await fetch('/api/opportunities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead)
        });
        if (res.ok) successCount++;
      }
      
      setCount(successCount);
      setStagedLeads(scrubbed.data);
      const initialApprovals = {};
      scrubbed.data.forEach(l => { initialApprovals[l.id] = true; });
      setSelectedLeads(initialApprovals);
      setStatus('DISCOVERY COMPLETELY STAGED FOR EXEC CLUSTER REVIEW.');
      setRawInput('');
    } catch {
      setStatus('PROCESSOR TIMEOUT PIPELINE FAULT.');
    }
  };

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

      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] font-mono">AUTOMATED ACQUISITION CONSOLE</span>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1 [text-shadow:0_1px_0_#999,0_2px_2px_rgba(0,0,0,0.8)]">DEALMAKER DATA INGESTION</h1>
        </div>

        <div className="bg-[#060608] border border-[#1b1b24] rounded-2xl p-6 shadow-2xl space-y-4 font-mono text-xs uppercase">
          <label className="block text-[9px] font-bold text-slate-500 flex items-center gap-2 tracking-widest"><Database className="h-3.5 w-3.5 text-indigo-400" /> ENTER AUTOMATED DISCOVERY KEYWORD</label>
          <input type="text" value={rawInput} onChange={e => setRawInput(e.target.value)} placeholder="E.G. HVAC CONTRACTORS IN OH" className="w-full bg-[#0d0d11] border border-[#20202a] p-4 rounded-xl text-white placeholder-slate-700 focus:border-slate-500 focus:outline-none font-mono" />
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/20 px-3 py-1.5 rounded border border-indigo-900/30 tracking-widest">{status || 'ENGINE IDLE / STANDBY'}</span>
            <button onClick={processLeads} className="bg-gradient-to-b from-white to-slate-300 text-slate-950 font-black px-6 py-3 rounded-xl hover:from-slate-200 hover:to-slate-400 transition-all flex items-center gap-2 cursor-pointer shadow-lg text-[10px]"><Sparkles className="h-3.5 w-3.5" /> LAUNCH CONCURRENT ENGINES (100+ THREADS)</button>
          </div>
          {count !== null && <div className="mt-4 text-emerald-400 text-[10px] font-black border border-emerald-900/30 bg-emerald-950/10 p-3 rounded-xl tracking-wider">SUCCESS: COMITTED {count} NEW DEDUPLICATED PIPELINE PROFILES.</div>}
        </div>
              {stagedLeads.length > 0 && (
          <div className="bg-[#060608] border border-[#1b1b24] rounded-2xl p-6 shadow-2xl space-y-4 font-mono text-xs uppercase">
            <div className="flex justify-between items-center border-b border-[#111115] pb-3">
              <span className="text-[10px] font-bold text-indigo-400 tracking-widest">🛡️ EXECUTIVE LEAD DISPATCH STAGING QUEUE</span>
              <button onClick={handleBulkSend} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-2 rounded-xl text-[9px] transition-all cursor-pointer">⚡ BULK APPROVE & SEND EMAIL BATCH</button>
            </div>
            {/* HIGH-VELOCITY MONITORING LAYOUT */}
            <div className="text-[8px] text-neutral-500 font-bold border-b border-[#111115] pb-2 mb-1 tracking-[0.2em]">CONCURRENT ENGINE DATA PIPELINES ACTIVE</div>
            <div className="divide-y divide-[#12121a] max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
              {stagedLeads.map((lead) => {
                const isApproved = !!selectedLeads[lead.id];
                return (
                  <div key={lead.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-[11px] truncate">{lead.companyAccount}</span>
                        <span className="text-[8px] px-2 py-0.5 rounded bg-[#111116] border border-[#1a1a24] text-neutral-400 font-bold">{lead.city}</span>
                      </div>
                      <div className="text-[9px] text-neutral-400 mt-1 font-sans font-medium capitalize">Target: <span className="text-white font-bold uppercase font-mono text-[9px]">{lead.initialContact}</span> ➔ <span className="text-indigo-400 font-bold font-mono text-[9px] lowercase">{lead.email}</span></div>
                    </div>
                    <div className="flex items-center gap-2 h-full my-auto shrink-0">
                      <button type="button" onClick={() => toggleLeadApproval(lead.id)} className={`px-3 py-1.5 rounded font-bold text-[9px] tracking-widest border transition-all cursor-pointer ${isApproved ? 'bg-indigo-950/40 text-indigo-400 border-indigo-900/60' : 'bg-zinc-900/80 text-zinc-500 border-zinc-800'}`}>
                        {isApproved ? '🟢 SEND APPROVED' : '🛑 DONT SEND'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
