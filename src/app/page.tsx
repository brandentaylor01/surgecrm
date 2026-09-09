'use client';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('all'); 
  const [actionStatus, setActionStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const URL = "https://supabase.co";
  const KEY = "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL";
  const headers = { "apikey": KEY, "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json" };

  async function refresh() {
    try {
      const res = await fetch(`${URL}?select=*`, { headers });
      if (res.ok) setLeads(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, []);

  async function runCampaign() {
    setActionStatus('🚀 Launching Outreach Campaign Sweep...');
    try {
      const res = await fetch('/api/outreach?cron=true');
      const data = await res.json();
      setActionStatus(`✅ Deployed: ${data.status || 'Tasks running.'}`);
      refresh();
    } catch (e) { setActionStatus('❌ Sweep failed to broadcast.'); }
  }

  async function forceScrape() {
    setActionStatus('🔍 Initializing Autonomous Web Harvester...');
    try {
      const res = await fetch(URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ company: `Scraper-${new Date().toLocaleTimeString()}`, name: 'Agent', value: 2500, status: 'Discovered', priority: 'High' })
      });
      if (res.ok) { setActionStatus('✅ Lead queued.'); refresh(); }
    } catch (e) { setActionStatus('❌ Scraper timeout.'); }
  }

  const filtered = leads.filter(l => {
    if (activeFilter === 'active') return l.status === 'Opened / Reviewing Pitch' || l.contacted;
    if (activeFilter === 'pipeline') return Number(l.value) > 0;
    if (activeFilter === 'forecast') return l.priority === 'High' && !l.contacted;
    return true;
  });

  const val = leads.reduce((sum, item) => sum + (Number(item.value) || 2500), 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-6 lg:p-12 font-sans">
      <div className="flex justify-between items-center mb-12">
        <div><h1 className="text-3xl font-black text-white">🚀 SURGE<span className="text-emerald-500">CRM</span></h1></div>
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"/><p className="text-xs text-zinc-500 font-mono">SYNCED</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div onClick={() => setActiveFilter('all')} className={`cursor-pointer p-6 rounded-xl border ${activeFilter === 'all' ? 'bg-zinc-900 border-white' : 'bg-zinc-900 border-zinc-800'}`}><p className="text-xs text-zinc-400 uppercase tracking-wider">Leads</p><p className="text-4xl font-black text-white mt-2 font-mono">{leads.length}</p></div>
        <div onClick={() => setActiveFilter('active')} className={`cursor-pointer p-6 rounded-xl border ${activeFilter === 'active' ? 'bg-zinc-900 border-emerald-500' : 'bg-zinc-900 border-zinc-800'}`}><p className="text-xs text-zinc-400 uppercase tracking-wider">Outreach</p><p className="text-4xl font-black text-emerald-400 mt-2 font-mono">{leads.filter(l => l.status === 'Opened / Reviewing Pitch' || l.contacted).length}</p></div>
        <div onClick={() => setActiveFilter('pipeline')} className={`cursor-pointer p-6 rounded-xl border ${activeFilter === 'pipeline' ? 'bg-zinc-900 border-blue-500' : 'bg-zinc-900 border-zinc-800'}`}><p className="text-xs text-zinc-400 uppercase tracking-wider">Pipeline</p><p className="text-4xl font-black text-blue-400 mt-2 font-mono">${val.toLocaleString()}</p></div>
        <div onClick={() => setActiveFilter('forecast')} className={`cursor-pointer p-6 rounded-xl border bg-gradient-to-br from-zinc-900 to-emerald-950/20 ${activeFilter === 'forecast' ? 'border-emerald-400' : 'border-zinc-800'}`}><p className="text-xs text-emerald-400 uppercase tracking-wider">Forecast</p><p className="text-4xl font-black text-emerald-300 mt-2 font-mono">${Math.round(val * 0.25).toLocaleString()}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h3 className="text-sm font-bold uppercase mb-4 text-white">Fast Actions</h3>
            <button onClick={runCampaign} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg text-sm mb-2 transition">⚡ Trigger Campaign</button>
            <button onClick={forceScrape} className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold py-3 rounded-lg text-sm transition">🔍 Force Web Scrape</button>
            {actionStatus && <div className="mt-4 p-2 bg-zinc-950 text-xs font-mono text-emerald-400 rounded border border-zinc-800">{actionStatus}</div>}
          </div>
        </div>
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex justify-between bg-zinc-900/50"><h3 className="text-sm font-bold text-white uppercase">Live View: <span className="text-emerald-400 font-mono">{activeFilter}</span></h3></div>
          <div className="divide-y divide-zinc-800 max-h-[400px] overflow-y-auto">
            {loading ? <div className="p-12 text-center text-zinc-500 font-mono">Streaming matrix...</div> : filtered.length === 0 ? <div className="p-12 text-center text-zinc-600 font-mono">No matching records.</div> :
              filtered.map((l: any, idx: number) => (
                <div key={l.id || idx} className="p-4 hover:bg-zinc-900 flex justify-between items-center">
                  <div><h4 className="text-sm font-bold text-white">{l.company}</h4><p className="text-xs text-zinc-400">{l.name} · <span className="text-zinc-500 font-mono">{l.email}</span></p></div>
                  <div className="flex items-center gap-4"><span className="text-sm font-bold font-mono text-blue-400">${(Number(l.value) || 2500).toLocaleString()}</span><span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded font-mono ${l.status === 'Opened / Reviewing Pitch' ? 'bg-emerald-950 text-emerald-400' : 'bg-zinc-950 text-zinc-400'}`}>{l.status || 'Discovered'}</span></div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
