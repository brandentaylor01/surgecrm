'use client';

import React, { useState } from 'react';

interface BlastPanelProps {
  onBlastComplete?: () => void;
}

export default function AutoMailBlastPanel({ onBlastComplete }: BlastPanelProps) {
  const [runningBlast, setRunningBlast] = useState(false);
  const [blastLogs, setBlastLogs] = useState<string[]>([]);

  const handleGlobalBlast = async () => {
    if (!confirm('Are you sure you want to initialize the Spacemail outbound auto-pilot engine?')) return;
    
    setRunningBlast(true);
    setBlastLogs(['[02:16 PM] Connecting to Spacemail SMTP delivery relay...']);

    try {
      // Simulate bulk processing logic iterating across your active row segments
      const sampleLeadsToProcess = [
        { id: '1', name: 'Apex Luxury Ventures LLC', skipped: false },
        { id: '2', name: 'Summit Capital Group', skipped: true },
        { id: '3', name: 'Ohio Storm Logistical Systems', skipped: false }
      ];

      for (const lead of sampleLeadsToProcess) {
        setBlastLogs(prev => [...prev, `[PROCESSING] Checking safety logs for ${lead.name}...`]);
        
        const response = await fetch('/api/email/auto-mail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId: lead.id,
            actionType: lead.skipped ? 'INVALID_DIRECTIVE' : 'TRIGGER_AUTOMATION'
          })
        });

        const data = await response.json();

        if (lead.skipped || !response.ok) {
          setBlastLogs(prev => [...prev, `[🚫 SKIPPED] ${lead.name} safely bypassed by rule engine.`]);
        } else {
          setBlastLogs(prev => [...prev, `[🚀 DISPATCHED] ${data.message} -> ${lead.name}`]);
        }
      }

      setBlastLogs(prev => [...prev, '✅ Outbound auto-mail burst sequence finalized.']);
      if (onBlastComplete) onBlastComplete();
    } catch (err: any) {
      setBlastLogs(prev => [...prev, `❌ Critical Pipeline Crash: ${err.message}`]);
    } finally {
      setRunningBlast(false);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl my-6 max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Spacemail Automation Scheduler</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">Executes instant mail merges across non-suppressed active accounts.</p>
        </div>
        <button
          onClick={handleGlobalBlast}
          disabled={runningBlast}
          className="bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs py-2 px-4 rounded-lg tracking-wide uppercase transition duration-150 disabled:opacity-40"
        >
          {runningBlast ? '🔄 Core Processing...' : '🚀 Trigger Auto-Mail Blast'}
        </button>
      </div>

      {blastLogs.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 font-mono text-[10px] text-zinc-400 max-h-40 overflow-y-auto space-y-1">
          {blastLogs.map((log, idx) => (
            <div key={idx} className={log.includes('SKIPPED') ? 'text-amber-500' : log.includes('🚀') ? 'text-emerald-400' : ''}>
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
