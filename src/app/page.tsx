"use client";

import React, { useState, useEffect } from 'react';

interface Opp {
  id: string;
  company: string;
  contact: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  clientKey: string;
  status: 'qualifying' | 'proposal' | 'secured' | 'lost';
  value: number;
  qty1: number;
  qty2: number;
}

interface Client {
  key: string;
  label: string;
  domain: string;
}

export default function RainmakerDashboard() {
  const [opps, setOpps] = useState<Opp[]>([]);
  const [activeClient, setActiveClient] = useState<string>('rainmaker');
  const [scanning, setScanning] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>([
    { key: 'rainmaker', label: 'Rainmaker Sales LLC', domain: 'Internal' },
    { key: 'televoi', label: 'Televoi', domain: 'Charlie Myers' },
    { key: 'aim', label: 'Aim Restoration', domain: 'Kyle Ackerman' }
  ]);

  const [form, setForm] = useState({
    company: '',
    contact: '',
    city: '',
    address: '',
    email: '',
    phone: ''
  });

  const sync = async () => {
    const res = await fetch('/api/opportunities');
    if (res.ok) {
      const data = await res.json();
      const mapped = data.map((o: any) => ({
        id: o.id,
        company: o.company || 'Unnamed Company',
        status: o.status || 'qualifying',
        city: o.city || 'n/a',
        contact: o.contact || 'n/a',
        address: o.address || 'n/a',
        email: o.email || 'n/a',
        phone: o.phone || 'n/a',
        clientKey: o.clientKey || 'rainmaker',
        value: Number(o.value) || 0,
        qty1: Number(o.qty1) || 0,
        qty2: Number(o.qty2) || 0
      }));
      setOpps(mapped);
    }
  };

  useEffect(() => { sync(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!form.company.trim()) return;
    
    const initialQty = activeClient === 'rainmaker' ? 40 : 0;
    
    const payload = { 
      company: form.company.trim(),
      contact: form.contact.trim() || 'n/a',
      city: form.city.trim() || 'n/a',
      address: form.address.trim() || 'n/a',
      email: form.email.trim() || 'n/a',
      phone: form.phone.trim() || 'n/a',
      value: activeClient === 'rainmaker' ? (40 * 64) : 0,
      clientKey: activeClient, 
      status: 'qualifying', 
      qty1: initialQty,
      qty2: 0 
    };
    
    const res = await fetch('/api/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setForm({ company: '', contact: '', city: '', address: '', email: '', phone: '' });
      sync();
    }
  };

  const setField = async (id: string, f: keyof Opp, v: any) => {
    setOpps(p => p.map(o => o.id === id ? { ...o, [f]: v } : o));
    await fetch('/api/opportunities', { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ id, field: f, value: v }) 
    });
  };

  const handleCard = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setScanning(true); 
    const fd = new FormData(); 
    fd.append('file', file);
    try {
      const res = await fetch('/api/opportunities/vision', { method: 'POST', body: fd });
      if (res.ok) sync();
    } catch {} finally { setScanning(false); }
  };

  const triggerAddClient = () => {
    const name = prompt('ENTER CLIENT NAME:'); if (!name || !name.trim()) return;
    const dom = prompt('ENTER OWNER CONTACT:') || 'n/a';
    const cleanKey = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clients.some(c => c.key === cleanKey)) return;
    setClients([...clients, { key: cleanKey, label: name.trim(), domain: dom.trim() }]);
    setActiveClient(cleanKey);
  };

  const filtered = opps.filter(o => o.clientKey === activeClient);
  const grossPipelineTotal = filtered.reduce((sum, o) => o.status === 'lost' ? sum : sum + (o.value || 0), 0);
  const weights: Record<string, number> = { qualifying: 0.20, proposal: 0.50, secured: 1.00, lost: 0.00 };
  const weightedPipelineForecast = filtered.reduce((sum, o) => sum + ((o.value || 0) * (weights[o.status] ?? 0)), 0);

  const currentClient = clients.find(c => c.key === activeClient);

  const stages: { key: Opp['status']; label: string }[] = [
    { key: 'qualifying', label: 'QUALIFYING' },
    { key: 'proposal', label: 'PROPOSAL' },
    { key: 'secured', label: 'SECURED' },
    { key: 'lost', label: 'LOST' }
  ];
  return (
    <div className="min-h-screen bg-[#020202] text-[#737373] p-8 flex flex-col justify-between text-[11px] uppercase tracking-wider font-mono">
      <div className="w-full space-y-6">
        
        {/* Top Header Metrics Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline border-b border-[#141414] pb-4 gap-4">
          <div>
            <h1 className="text-sm font-bold tracking-[0.25em] text-[#e5e5e5]">RAINMAKER</h1>
            <p className="text-[9px] text-[#404040] mt-0.5">White-Label Management Console</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-[#09090c] p-1 rounded-lg border border-[#14141a]">
              {clients.map(c => (
                <button 
                  key={c.key} 
                  onClick={() => setActiveClient(c.key)} 
                  className={`px-3 py-1.5 rounded-md cursor-pointer font-bold text-[10px] ${activeClient === c.key ? 'bg-[#141419] text-white border border-[#22222a]' : 'text-[#404040] hover:text-[#a3a3a3]'}`}
                >
                  {c.key === 'rainmaker' ? 'MINE' : c.label.split(' ')[0]}
                </button>
              ))}
            </div>
            <button onClick={triggerAddClient} className="border border-[#262626] bg-[#0c0c0f] px-3 py-2 rounded-lg font-bold text-[10px] text-neutral-400 hover:text-white transition">+ ADD CLIENT</button>
          </div>
          <div className="text-right text-[10px] space-y-0.5">
            <div><span className="text-[#404040]">GROSS VALUE:</span> <span className="text-neutral-400 font-bold">${grossPipelineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
            <div><span className="text-[#404040]">FORECAST WEIGHT:</span> <span className="text-indigo-400 font-bold">${weightedPipelineForecast.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
          </div>
        </div>
        
        {/* Workspace Title Strip */}
        <div className="text-[10px] text-neutral-600 font-sans tracking-normal flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#08080a] p-3 rounded-lg border border-[#121215] gap-3 normal-case italic">
          <div className="flex items-center gap-2 font-mono uppercase tracking-wider not-italic">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Active Workspace: <strong className="text-neutral-400 font-bold">{currentClient?.label}</strong>
          </div>
          <label className="border border-[#1a1a1a] bg-[#14141a] px-2 py-1 rounded cursor-pointer text-[#737373] hover:text-[#a3a3a3] uppercase font-bold text-[9px] font-mono tracking-wider not-italic transition">
            <span>{scanning ? 'SCANNING...' : '📷 CAPTURE CARD'}</span>
            <input type="file" accept="image/*" capture="environment" onChange={handleCard} className="hidden" disabled={scanning} />
          </label>
        </div>

        {/* 📋 Expanded Form Input Architecture */}
        <form onSubmit={handleAdd} className="space-y-2 bg-[#060608] p-4 rounded-lg border border-[#121215]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input type="text" placeholder="COMPANY ACCOUNT *" required value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="bg-[#0b0b0d] p-2.5 rounded border border-[#16161c] text-[#a3a3a3] uppercase font-mono text-[10px] focus:outline-none w-full" />
            <input type="text" placeholder="INITIAL CONTACT" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} className="bg-[#0b0b0d] p-2.5 rounded border border-[#16161c] text-[#a3a3a3] uppercase font-mono text-[10px] focus:outline-none w-full" />
            <input type="text" placeholder="CITY" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="bg-[#0b0b0d] p-2.5 rounded border border-[#16161c] text-[#a3a3a3] uppercase font-mono text-[10px] focus:outline-none w-full" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input type="text" placeholder="COMPANY PHYSICAL ADDRESS" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="bg-[#0b0b0d] p-2.5 rounded border border-[#16161c] text-[#a3a3a3] uppercase font-mono text-[10px] focus:outline-none w-full" />
            <input type="email" placeholder="CONTACT EMAIL" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="bg-[#0b0b0d] p-2.5 rounded border border-[#16161c] text-[#a3a3a3] lowercase font-mono text-[10px] focus:outline-none w-full normal-case" />
            <input type="text" placeholder="PHONE NUMBER" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="bg-[#0b0b0d] p-2.5 rounded border border-[#16161c] text-[#a3a3a3] uppercase font-mono text-[10px] focus:outline-none w-full" />
          </div>

          <div className="flex justify-end pt-1">
            <button type="submit" className="border border-[#22222a] bg-[#111116] text-[#e5e5e5] px-6 py-2 rounded font-bold uppercase tracking-widest text-[9px] hover:bg-[#1c1c24] hover:text-white transition cursor-pointer">
              SUBMIT COMPANY...
            </button>
          </div>
        </form>

        {/* 🎴 Responsive Kanban Deal Columns Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          {stages.map(s => {
            const list = filtered.filter(o => o.status === s.key);
            return (
              <div key={s.key} className="bg-[#060608] rounded-lg border border-[#131317] p-3 min-h-[320px] flex flex-col">
                <div className="flex justify-between items-center border-b border-[#141419] pb-2 mb-3">
                  <span className="font-bold text-[10px] text-neutral-400 tracking-wider">{s.label}</span>
                  <span className="bg-[#121217] px-1.5 py-0.5 rounded text-[9px] text-[#404040] font-bold">{list.length}</span>
                </div>
                
                <div className="space-y-1.5 flex-1 overflow-y-auto">
                  {list.length === 0 ? (
                    <div className="text-[9px] text-[#2c2c35] italic text-center pt-8 tracking-normal">EMPTY STAGE</div>
                  ) : (
                    list.map(o => (
                      <div key={o.id} className="bg-[#0b0b0e] border border-[#181822] p-2.5 rounded-md space-y-1.5">
                        <div className="flex justify-between items-start gap-1">
                          <span className="font-bold text-neutral-200 block truncate max-w-[120px]">{o.company}</span>
                          <span className="text-emerald-500 font-bold">${o.value.toLocaleString()}</span>
                        </div>
                        
                        <div className="text-[9px] text-[#525252] space-y-0.5 normal-case tracking-normal font-sans">
                          {o.contact !== 'n/a' && <div>👤 {o.contact}</div>}
                          {o.city !== 'n/a' && <div>📍 {o.city}</div>}
                          {o.address !== 'n/a' && <div className="truncate max-w-[180px]">🏠 {o.address}</div>}
                          {o.email !== 'n/a' && <div className="lowercase truncate max-w-[180px]">✉️ {o.email}</div>}
                          {o.phone !== 'n/a' && <div>📞 {o.phone}</div>}
                        </div>

                        <div className="pt-1 border-t border-[#13131a] flex justify-end">
                          <select 
                            value={o.status} 
                            onChange={(e) => setField(o.id, 'status', e.target.value as any)}
                            className="bg-[#111116] border border-[#1c1c24] text-[#62626e] rounded px-1 py-0.5 text-[8px] font-mono outline-none uppercase cursor-pointer"
                          >
                            <option value="qualifying">Qualify</option>
                            <option value="proposal">Proposal</option>
                            <option value="secured">Secured</option>
                            <option value="lost">Lost</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
