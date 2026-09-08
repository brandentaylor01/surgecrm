'use client';

import React, { useState } from 'react';

interface MinerProps {
  onMinedSuccess: (newLeads: any[]) => void;
}

export default function DataAxleMinerButton({ onMinedSuccess }: MinerProps) {
  const [mining, setMining] = useState(false);

  const triggerMiningCycle = async () => {
    setMining(true);
    try {
      const response = await fetch('/api/intake/data-axle-mine', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Extraction matrix timed out');
      alert(`⚡ Data Axle Engine Burst Complete:\n${data.message}`);
      onMinedSuccess(data.leads);
    } catch (err: any) {
      alert(`Mining Core Error: ${err.message}`);
    } finally {
      setMining(false);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center justify-between my-4">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Data Axle Cloud Injector</h4>
        <p className="text-[11px] text-zinc-500 mt-0.5">Programmatic API sweep pulling 200 fresh target profiles on demand.</p>
      </div>
      <button
        onClick={triggerMiningCycle}
        disabled={mining}
        className="bg-cyan-600 hover:bg-cyan-500 text-black font-black text-xs py-2 px-4 rounded-lg tracking-wide uppercase transition duration-150 disabled:opacity-40"
      >
        {mining ? '🔄 Streaming 200 Leads...' : '📥 Pull 200 Data Axle Leads'}
      </button>
    </div>
  );
}
