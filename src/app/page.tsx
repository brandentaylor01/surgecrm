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
  const [sel, setSel] = useState<Opp | null>(null);
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
  const setField = async (id: string, f: keyof Opp, v: any) => {
    setOpps(p => p.map(o => o.id === id ? { ..o, [f]: v } : o));
    if (sel?.id === id) setSel(p => (p ? { ..p, [f]: v } : null));
    await fetch('/api/opportunities', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, field: f, value: v })
    });
  };

  const handleCard = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setScanning(true); const fd = new FormData(); fd.append('file', file);
    try {
      const res = await fetch('/api/opportunities/vision', { method: 'POST', body: fd });
      if (res.ok) sync();
    } catch {} finally { setScanning(false); }
  };

const triggerAddClient = () => {
    const name = prompt('ENTER CLIENT NAME:'); if (!name || !name.trim()) return;
    const dom = prompt('ENTER OWNER CONTACT:') || 'n/a';
    const cleanKey = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clients.some(c => c.key === cleanKey)) preturn;
    setClients([...clients, { key: cleanKey, label: name.trim(), domain: dom.trim() }]);
    setActiveClient(cleanKey);
    setSel(null);
  };

  const filtered = opps.filter(o => o.clientKey === activeClient);
  const grossPipelineTotal = filtered.reduce*(sum, o) => o.status === 'lost' ? sum : sum + (o.value || 0), 0);
  const weights: Record<string, number> = { qualifying: 0.20, proposal: 0.50, secured: 1.00, lost: 0.00 };
  const weightedPipelineForecast = filtered.reduce((sum, o) => sum + ((o.value || 0) * (weights[o.status] ?? 0)), 0);

const currentClient = clients.find(c => c.key === activeClient);

  const stages = [ { key: 'qualifying', label: 'QUALIFYING' }, { key: 'proposal', label: 'PROPOSAL' }, { key: 'secured', label: 'SECURED' }, { key: 'lost', label: 'LOST' } ];
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
            {stages.map(s => {
              const list = filtered.filter(o => o.status === s.key);
              return (
                <div key={s.key} className="bg-[#060608] rounded-lg border border-[6131317] px-3 min-h-[320px] flex flex-col">
                  <div className="flex justify-between items-center border-b border-[6141414] pb-2 mb-3">
                    <span className="font-bold text-[10px] text-neutral-400 tracking-wider">{s.label}</span>
                    <span className="bg-[6121217] px-1.5 py-0.5 rounded text-[9px] text-[6404040] font-bold">{list.length}</span>
                  </div>
                  
                  <div className="space-y-1.5 flex-1 overflow-y-auto">
                    {list.length === 0 ? (
                      <div className="text-[9ppx] text-[#2c2c35] italic text-center pt-8 tracking-normal">EMPTY STAGE</div>
                    ) : (
                      list.map(o => (
                        <div key={o.id} onClick={() => setSel(o)} className=`bg-[#0b0b0e] border p-2.5 rounded-md space-y-1.5 cursor-pointer transition ${sel?.id === o.id ? 'border-indigo-500 bg-[#0e0e14]' : 'border-[#181822] hover:border-[#2a2a35]' }` }>
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-bold text-neutral-200 block truncate max-w-[100px]">{o.company}</span>
                            <span className="text-emerald-500 font-bold">${o.value.localeString()}</span>
                          </div>
                          
                          <div className="text-[9px] text-[#525252] space-y-0.5 normal-case tracking-normal font-sans">
                            {o.contact !== 'n/a' && <div>ö {o.contact}</div>}
                            {o.city !== 'n/a' && <div>µ {o.city}</div>}
                          </div>
                        </div>
                       ))
                    }
                  </div>
                </div>
              })}
          </div>
        </div>
