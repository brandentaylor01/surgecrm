'use client'; 

import { useState, useEffect } from 'react';

export interface Opp {
  id: string;
  companyAccount: string;
  initialContact?: string;
  city?: string;
  address?: string;
  email?: string;
  phone?: string;
  status: "qualifying" | "proposal" | "secured";
}

export default function RainmakerDashboard() {
  const [opps, setOpps] = useState<Opp[]>([]);
  const [sel, setSel] = useState<Opp | null>(null);
  const [form, setForm] = useState({
    companyAccount: "",
    initialContact: "",
    city: "",
    address: "",
    email: "",
    phone: ""
  });

  const fetchLiveLeads = async () => {
    try {
      const res = await fetch('/api/opportunities');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setOpps(data || []);
    } catch (error) {
      console.error("Failed to fetch opportunities pipeline:", error);
    }
  };

  useEffect(() => {
    fetchLiveLeads();
    const syncLoop = setInterval(fetchLiveLeads, 30000);
    return () => {
      clearInterval(syncLoop);
    };
  }, []);

  const setField = async (id: string, f: keyof Opp, v: any) => {
    setOpps(p => p.map(o => (o.id === id ? { ...o, [f]: v } : o)));
    if (sel?.id === id) setSel(p => (p ? { ...p, [f]: v } : null));
    
    await fetch('/api/opportunities', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, field: f, value: v })
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setForm({ companyAccount: "", initialContact: "", city: "", address: "", email: "", phone: "" });
        fetchLiveLeads();
      }
    } catch (error) {
      console.error("Submission operational failure:", error);
    }
  };

  const renderColumn = (title: string, targetStatus: "qualifying" | "proposal" | "secured") => {
    const filtered = opps.filter(opp => opp.status === targetStatus);
    
    return (
      <div className="bg-[#060608] rounded-lg border border-[#131317] p-3 min-h-[320px] flex flex-col">
        <div className="flex justify-between items-center border-b border-[#141419] pb-2 mb-3">
          <span className="font-bold text-[10px] text-neutral-400 tracking-wider uppercase">{title}</span>
          <span className="bg-[#121217] px-1.5 py-0.5 rounded text-[9px] text-[#404040] font-bold">{filtered.length}</span>
        </div>
        <div className="space-y-1.5 flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-[9px] text-[#2c2c35] italic text-center pt-8 tracking-normal">EMPTY STAGE</div>
          ) : (
            filtered.map(opp => (
              <div key={opp.id} onClick={() => setSel(opp)} className="bg-[#0b0b0d] p-2.5 rounded border border-[#16161c] text-[#a3a3a3] cursor-pointer hover:border-indigo-500 transition">
                <div className="font-bold text-white text-[10px]">{opp.companyAccount}</div>
                {opp.initialContact && <div className="text-[9px] text-neutral-500 mt-0.5">{opp.initialContact}</div>}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#020202] text-[#737373] p-8 flex flex-col justify-between text-[11px] uppercase tracking-wider font-mono">
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline border-b border-[#141414] pb-4 gap-4">
          <div>
            <h1 className="text-sm font-bold tracking-[0.25em] text-[#e5e5e5]">RAINMAKER</h1>
            <p className="text-[9px] text-[#404040] mt-0.5">White-Label Management Console</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2 bg-[#060608] p-4 rounded-lg border border-[#121215]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input type="text" placeholder="COMPANY ACCOUNT *" required value={form.companyAccount} onChange={(e) => setForm({ ...form, companyAccount: e.target.value })} className="bg-[#0b0b0d] p-2.5 rounded border border-[#16161c] text-[#a3a3a3] uppercase font-mono text-[10px] w-full" />
            <input type="text" placeholder="INITIAL CONTACT" value={form.initialContact} onChange={(e) => setForm({ ...form, initialContact: e.target.value })} className="bg-[#0b0b0d] p-2.5 rounded border border-[#16161c] text-[#a3a3a3] uppercase font-mono text-[10px] w-full" />
            <input type="text" placeholder="CITY" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="bg-[#0b0b0d] p-2.5 rounded border border-[#16161c] text-[#a3a3a3] uppercase font-mono text-[10px] w-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input type="text" placeholder="COMPANY PHYSICAL ADDRESS" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="bg-[#0b0b0d] p-2.5 rounded border border-[#16161c] text-[#a3a3a3] uppercase font-mono text-[10px] w-full" />
            <input type="email" placeholder="CONTACT EMAIL" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-[#0b0b0d] p-2.5 rounded border border-[#16161c] text-[#a3a3a3] lowercase font-mono text-[10px] w-full normal-case" />
            <input type="text" placeholder="PHONE NUMBER" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-[#0b0b0d] p-2.5 rounded border border-[#16161c] text-[#a3a3a3] uppercase font-mono text-[10px] w-full" />
          </div>
          <div className="flex justify-end pt-1">
            <button type="submit" className="border border-[#22222a] bg-[#111116] text-[#e5e5e5] px-6 py-2 rounded font-bold uppercase tracking-widest text-[9px] hover:bg-[#1c1c24] hover:text-white transition cursor-pointer">SUBMIT COMPANY...</button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {renderColumn("Qualifying", "qualifying")}
          {renderColumn("Proposal", "proposal")}
          {renderColumn("Secured", "secured")}
        </div>
      </div>
    </div>
  );
}
