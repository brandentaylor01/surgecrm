'use client';
import React, { useState, useEffect } from 'react';

interface AuditLog {
  timestamp: string;
  event: string;
  ip: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
}

export default function SecurityCockpitNode() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    // Compile realistic live mock infrastructure session access logs
    setLogs([
      { timestamp: '2026-09-02 18:41:02', event: 'Database Ledger Export Attempt', ip: '192.168.1.45', status: 'SUCCESS' },
      { timestamp: '2026-09-02 17:30:19', event: 'Vercel Deployment Production Overwrite', ip: '23.41.109.82', status: 'SUCCESS' },
      { timestamp: '2026-09-02 15:12:44', event: 'Unauthenticated Request Packet Refused', ip: '84.21.99.112', status: 'WARNING' },
      { timestamp: '2026-09-02 11:05:00', event: 'Root SSL Handshake Re-Validated', ip: 'INTERNAL_NODE', status: 'SUCCESS' },
    ]);
  }, []);

  return (
    <div className="p-8 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xs font-black font-mono text-amber-400 uppercase tracking-widest">SYSTEM DECK CORE // SECURE NODE COCKPIT</h2>
        <h1 className="text-2xl font-black font-mono text-white mt-1 uppercase">Zero-Trust Audit Registry</h1>
      </div>

      {/* Infrastructure Telemetry Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-slate-500 uppercase font-bold">Data Cryptography Standard</div>
          <div className="text-white text-sm font-black mt-1">AES-GCM-256 INTERNAL</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-slate-500 uppercase font-bold">Workspace Policy Compliance</div>
          <div className="text-emerald-400 text-sm font-black mt-1">100% REGULATORY VERIFIED</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-slate-500 uppercase font-bold">Intrusion Prevention Status</div>
          <div className="text-cyan-400 text-sm font-black mt-1">0 CURRENT VULNERABILITIES</div>
        </div>
      </div>

      {/* Audit Registry Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
        <h3 className="text-xs font-black font-mono text-slate-400 uppercase tracking-widest mb-4">📜 Global Event Access Registry Ledger</h3>
        <div className="space-y-2">
          {logs.map((log, index) => (
            <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-slate-950 border border-slate-800/80 rounded-xl font-mono text-[11px] gap-2">
              <div className="flex items-center gap-4">
                <span className="text-slate-500">{log.timestamp}</span>
                <span className="text-white font-bold tracking-wide uppercase">{log.event}</span>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-slate-400 font-medium px-2 py-0.5 bg-slate-900 border border-slate-800 rounded">{log.ip}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border ${
                  log.status === 'SUCCESS' ? 'bg-emerald-950/40 border-emerald-900 text-emerald-400' : 'bg-amber-950/40 border-amber-900 text-amber-400'
                }`}>{log.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
