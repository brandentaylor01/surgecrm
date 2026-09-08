'use client';

import React, { useState, useEffect } from 'react';

export default function ScrubbedLeadsView() {
  const [scrubbed, setScrubbed] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/leads/scrubbed')
      .then(res => res.json())
      .then(data => { if (data.leads) setScrubbed(data.leads); });
  }, []);

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl my-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Scrubbed Data Axle Vault
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">
          Total Scrubbed: {scrubbed.length}
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {scrubbed.map(lead => (
          <div key={lead.id} className="p-3 bg-zinc-900/60 border border-zinc-900 rounded-lg flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-zinc-200">{lead.company}</div>
              <div className="text-zinc-500 text-[11px] mt-0.5">{lead.industry} • {lead.contacts_found} Valid Emails Found</div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-cyan-400">${lead.matrix_value.toLocaleString()}</div>
              <div className="text-[10px] text-zinc-600 font-mono mt-0.5">{lead.scrubbed_at}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
