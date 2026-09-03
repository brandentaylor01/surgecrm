'use client';
import React, { useState, useEffect } from 'react';
import './globals.css';
import DetailPanel, { Opp } from './DetailPanel';

interface ClientFirm { key: string; label: string; domain: string; }

export default function RainmakerWhiteLabelCRM() {
  const [opps, setOpps] = useState<Opp[]>([]);
  const [activeClient, setActiveClient] = useState<string>('rainmaker');
  const [form, setForm] = useState({ company: '', city: '', contact: '' });
  const [sel, setSel] = useState<Opp | null>(null);
  const [scanning, setScanning] = useState(false);
  const stages = ['qualifying', 'proposal', 'secured', 'lost'];
  
  const [clients, setClients] = useState<ClientFirm[]>([
    { key: 'rainmaker', label: 'Rainmaker Sales LLC', domain: 'hirerainmakers.com' },
    { key: 'televoi', label: 'Televoi', domain: 'Charlie Myers' },
    { key: 'aim', label: 'Aim Restoration', domain: 'Kyle Ackerman' }
  ]);

  const sync = async () => {
    const res = await fetch('/api/opportunities');
    if (res.ok) {
      const data = await res.json();
      const mapped = data.map((o: any) => ({
        ...o,
        status: o.status || 'qualifying',
        city: o.city || 'n/a',
        contact: o.contact || 'n/a',
        clientKey: o.clientKey || 'rainmaker',
        qty1: o.qty1 || 0,
        qty2: o.qty2 || 0
      }));
      setOpps(mapped);
      if (sel) {
        const freshSel = mapped.find((item: Opp) => item.id === sel.id);
        if (freshSel) setSel(freshSel);
      }
    }
  };
  useEffect(() => { sync(); }, []);
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); if (!form.company.trim()) return;
    const initialQty = activeClient === 'rainmaker' ? 40 : 0;
    
    const payload = { 
      ...form, 
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
      setForm({ company: '', city: '', contact: '' });
      sync();
    }
  };

  const handleCard = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setScanning(true); const fd = new FormData(); fd.append('file', file);
    try {
      await fetch('/api/opportunities/vision', { method: 'POST', body: fd });
      sync();
    } catch {} finally { setScanning(false); }
  };

  const setField = async (id: string, f: keyof Opp, v: any) => {
    setOpps(p => p.map(o => o.id === id ? { ...o, [f]: v } : o));
    if (sel?.id === id) setSel(p => p ? { ...p, [f]: v } : null);
    await fetch('/api/opportunities', { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ id, field: f, value: v }) 
    });
  };

  const triggerAddClient = () => {
    const name = prompt('ENTER CLIENT NAME:'); if (!name || !name.trim()) return;
    const dom = prompt('ENTER OWNER CONTACT:') || 'n/a';
    const cleanKey = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clients.some(c => c.key === cleanKey)) return;
    setClients([...clients, { key: cleanKey, label: name.trim(), domain: dom.trim() }]);
    setActiveClient(cleanKey); setSel(null);
  };

  const filtered = opps.filter(o => o.clientKey === activeClient);
  const weights: Record<string, number> = { qualifying: 0.20, proposal: 0.50, secured: 1.00, lost: 0.00 };
  const grossPipelineTotal = filtered.reduce((sum, o) => o.status === 'lost' ? sum : sum + (o.value || 0), 0);
  
  const weightedPipelineForecast = filtered.reduce((sum, o) => {
    const subtotal = o.value || 0;
    const tax = o.clientKey === 'televoi' ? ((o.qty1 || 0) * 150 * 0.065) : 0;
    return sum + ((subtotal + tax) * (weights[o.status] ?? 0));
  }, 0);

  const securedRevenueSum = filtered.filter(o => o.status === 'secured').reduce((sum, o) => sum + (o.value || 0), 0);
  
  let projectedCommissionCheck = 0;
  if (activeClient === 'televoi') {
    projectedCommissionCheck = 2500 + (securedRevenueSum * 0.10);
  } else if (activeClient === 'aim') {
    projectedCommissionCheck = securedRevenueSum * 0.10;
  } else {
    projectedCommissionCheck = securedRevenueSum * 0.15;
  }

  const currentClient = clients.find(c => c.key === activeClient);
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#737373] p-8 flex flex-col justify-between overflow-hidden text-[11px] uppercase tracking-wider font-mono">
      <div className={`w-full space-y-8 transition-all duration-500 ${sel ? 'max-w-xl' : 'max-w-5xl'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline border-b border-[#171717] pb-4 gap-4">
          <div>
            <h1 className="text-base font-bold tracking-[0.25em] text-[#e5e5e5]">RAINMAKER</h1>
            <p className="text-[9px] text-[#404040] mt-0.5">White-Label Management Console</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-[#09090c] p-1 rounded-lg border border-[#14141a]">
              {clients.map(c => (
                <button 
                  key={c.key} 
                  onClick={() => { setActiveClient(c.key); setSel(null); }} 
                  className={`px-3 py-1.5 rounded-md cursor-pointer font-bold text-[10px] ${activeClient === c.key ? 'bg-[#141419] text-white border border-[#22222a]' : 'text-[#404040] hover:text-[#a3a3a3]'}`}
                >
                  {c.key === 'rainmaker' ? 'MINE' : c.label.split(' ')[0]}
                </button>
              ))}
            </div>
            <button onClick={triggerAddClient} className="border border-[#262626] bg-[#0c0c0f] px-3 py-2 rounded-lg font-bold text-[10px] text-neutral-400 hover:text-white transition">+ ADD CLIENT</button>
          </div>
          <div className="text-right text-[10px] space-y-0.5">
            <div><span className="text-[#404040]">GROSS VALUE:</span> <span className="text-neutral-400 font-bold">${grossPipelineTotal.toLocaleString()}</span></div>
            <div><span className="text-[#404040]">FORECAST WEIGHT:</span> <span className="text-indigo-400 font-bold">${weightedPipelineForecast.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
          </div>
        </div>
        
        <div className="text-[10px] text-neutral-600 font-sans tracking-normal flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#09090c] p-3 rounded-lg border border-[#121216] gap-3 normal-case italic">
          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse" />Active Workspace: <strong className="text-neutral-400 font-mono uppercase">{currentClient?.label}</strong>
            <div className="ml-4 pl-4 border-l border-neutral-800 text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              💰 PROJECTED TAKE-HOME PAYOUT (MONTH 1): ${projectedCommissionCheck.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-neutral-600 text-[9px] ml-1 lowercase font-sans font-normal italic text-[#444]">
                {activeClient === 'televoi' ? '($2,500 subscription base + 10% upfront applied)' : 
                 activeClient === 'aim' ? '(10% total structural contract value applied)' : '(15% standard consulting applied)'}
              </span>
            </div>
          </div>
          <label className="border border-[#1a1a1a] bg-[#14141a] px-2 py-1 rounded cursor-pointer text-[#737373] hover:text-[#a3a3a3] uppercase font-bold text-[9px] transition">
            <span>{scanning ? 'SCANNING...' : '📷 CAPTURE CARD'}</span>
            <input type="file" accept="image/*" capture="environment" onChange={handleCard} className="hidden" disabled={scanning} />
          </label>
        </div>

        <form onSubmit={handleAdd} className="grid grid-cols-2 md:grid-cols-4 gap-1.5 max-w-xl">
          <input type="text" placeholder="COMPANY ACCOUNT *" required value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="bg-[#0f0f0f] p-2 rounded border border-[#171717] text-[#a3a3a3] uppercase font-mono text-[10px] focus:outline-none" />
          <input type="text" placeholder="INITIAL CONTACT" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} className="bg-[#0f0f0f] p-2 rounded border border-[#171717] text-[#a3a3a3] uppercase font-mono text-[10px] focus:outline-none" />
          <input type="text" placeholder="CITY" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="bg-[#0f0f0f] p-2 rounded border border-[#171717] text-[#a3a3a3] uppercase font-mono text-[10px] focus:outline-none" />
          <button type="submit" className="bg-[#121212] hover:bg-[#171717] border border-[#1a1a1a] rounded text-[10px] font-bold uppercase cursor-pointer text-white tracking-widest transition">INITIALIZE DEAL</button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((st: string) => {
            const list = filtered.filter(o => o.status === st);
            return (
              <div key={st} className="bg-[#070709] border border-[#141419] p-4 rounded-xl min-h-[250px] flex flex-col">
                <div className="border-b border-[#14141a] pb-2 mb-3 flex justify-between items-center">
                  <span className="text-white font-bold text-[10px]">{st}</span>
                  <span className="text-[#404040] bg-[#111115] px-1.5 py-0.5 rounded text-[9px]">{list.length}</span>
                </div>
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {list.map((o: Opp) => (
                    <div 
                      key={o.id} 
                      onClick={() => setSel(o)}
                      className={`p-3 bg-[#0c0c0f] border rounded-lg cursor-pointer transition-all hover:border-[#22222a] ${sel?.id === o.id ? 'border-indigo-500 bg-[#0f0f14]' : 'border-[#17171d]'}`}
                    >
                      <div className="text-[#e5e5e5] font-bold text-[10px] truncate">{o.company}</div>
                      <div className="text-[#404040] text-[9px] mt-1 flex justify-between">
                        <span>{o.city !== 'n/a' ? o.city : 'no loc'}</span>
                        <span className="text-emerald-500/80 font-bold">${(o.value || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                  {list.length === 0 && (
                    <div className="text-[#333333] text-[9px] italic pt-4 text-center">empty stage</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {sel && (
        <DetailPanel 
          sel={sel} 
          stages={stages} 
          setField={setField} 
          setSel={setSel} 
        />
      )}
    </div>
  );
}
