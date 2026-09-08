'use client';

import React, { useState } from 'react';

interface LeadActionsProps {
  leadId: string;
  clientEmail: string;
  amount: number;
  location: string;
  onActionComplete?: () => void;
}

export default function LeadRowActions({ leadId, clientEmail, amount, location, onActionComplete }: LeadActionsProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [isSkipped, setIsSkipped] = useState(false);

  const handleRapidAction = async (actionType: string) => {
    setLoadingAction(actionType);
    try {
      const response = await fetch('/api/leads/rapid-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, actionType, amount, clientEmail, location })
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Execution failed');
      alert(`Success: ${resData.message}`);
      if (actionType === 'CLOSED_SALE' && onActionComplete) onActionComplete();
    } catch (err: any) {
      alert(`Operation Error: ${err.message}`);
    } finally { setLoadingAction(null); }
  };

  const handleToggleAutoMail = async () => {
    setLoadingAction('TOGGLE_SKIP');
    try {
      const response = await fetch('/api/email/auto-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, actionType: 'TOGGLE_SKIP' })
      });
      if (!response.ok) throw new Error('Failed to update list rules');
      setIsSkipped(!isSkipped);
      alert(isSkipped ? '✅ Re-enrolled in automation queues' : '🚫 Removed from auto-mail streams safely');
    } catch (err: any) {
      alert(`Safety Error: ${err.message}`);
    } finally { setLoadingAction(null); }
  };

  return (
    <div className="flex items-center space-x-2 bg-zinc-950 p-2 rounded-lg border border-zinc-800">
      <button onClick={() => handleRapidAction('CLOSED_SALE')} className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-medium py-1.5 px-3 rounded text-xs transition hover:bg-emerald-900">
        ⚡ Sale
      </button>
      <button onClick={() => handleToggleAutoMail()} className={`font-medium py-1.5 px-3 rounded text-xs transition border ${
        isSkipped 
          ? 'bg-red-950/60 border-red-500/40 text-red-400 hover:bg-red-900' 
          : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
      }`}>
        {isSkipped ? '🚫 Skipped' : '🤖 Active Auto'}
      </button>
      <button onClick={() => handleRapidAction('BILL_INVOICE')} className="bg-zinc-900 text-zinc-300 border border-zinc-700 font-medium py-1.5 px-3 rounded text-xs transition hover:bg-zinc-800">
        📑 Bill
      </button>
    </div>
  );
}
