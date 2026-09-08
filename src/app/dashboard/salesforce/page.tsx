'use client';
import React, { useState, useEffect } from 'react';

export default function SalesforcePage() {
  const [syncStatus, setSyncStatus] = useState('Checking connection...');

  useEffect(() => {
    fetch('/api/integrations/salesforce')
      .then(res => res.json())
      .then(data => setSyncStatus(data.status || 'Connected'))
      .catch(() => setSyncStatus('Sync Pipeline Offline'));
  }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8 font-sans">
      <div className="border-b border-zinc-800 pb-4 mb-6">
        <h1 className="text-xl font-bold uppercase tracking-tight">Salesforce Revenue Tracker</h1>
        <p className="text-xs text-zinc-500 mt-1">External Client Sync Platform</p>
      </div>
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl max-w-md">
        <div className="flex items-center space-x-2 text-xs font-mono mb-4 text-zinc-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Status: {syncStatus}</span>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          This system endpoint processes cross-platform OAuth data updates. Closed deals sync automatically with your central ledger matrix profiles.
        </p>
      </div>
    </div>
  );
}
