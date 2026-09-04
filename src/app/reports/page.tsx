"use client";

import React, { useState, useEffect } from 'react';

interface Opp {
  id: string;
  clientKey: string;
  status: 'qualifying' | 'proposal' | 'secured' | 'lost';
  value: number;
}

export default function ReportsPage() {
  const [opps, setOpps] = useState<Opp[]>([]);
  const [activeClient, setActiveClient] = useState<string>('rainmaker');

  useEffect(() => {
    async function fetchReportsData() {
      const res = await fetch('/api/opportunities');
      if (res.ok) {
        const data = await res.json();
        setOpps(data);
      }
    }
    fetchReportsData();
  }, []);

  const filtered = opps.filter(o => o.clientKey === activeClient);
  const securedRevenueSum = filtered.filter(o => o.status === 'secured').reduce((sum, o) => sum + (Number(o.value) || 0), 0);
  
  let projectedCommissionCheck = 0;
  if (activeClient === 'televoi') {
    projectedCommissionCheck = 2500 + (securedRevenueSum * 0.10);
  } else if (activeClient === 'aim') {
    projectedCommissionCheck = securedRevenueSum * 0.10;
  } else {
    projectedCommissionCheck = securedRevenueSum * 0.15;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#737373] p-8 font-mono text-[11px] uppercase tracking-wider flex flex-col items-center justify-start">
      <div className="w-full max-w-5xl space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline border-b border-[#171717] pb-4 gap-4">
          <div>
            <h1 className="text-base font-bold text-[#e5e5e5] tracking-[0.25em]">REPORTS & PAYOUTS</h1>
            <p className="text-[9px] text-[#404040] mt-0.5">Financial Auditing Console</p>
          </div>
          
          {/* Workspace Filter Toggles */}
          <div className="flex gap-1 bg-[#09090c] p-1 rounded-lg border border-[#14141a]">
            {['rainmaker', 'televoi', 'aim'].map(key => (
              <button 
                key={key} 
                onClick={() => setActiveClient(key)} 
                className={`px-3 py-1.5 rounded-md cursor-pointer font-bold text-[10px] ${activeClient === key ? 'bg-[#141419] text-white border border-[#22222a]' : 'text-[#404040] hover:text-[#a3a3a3]'}`}
              >
                {key === 'rainmaker' ? 'MINE' : key}
              </button>
            ))}
          </div>
        </div>

        {/* 💰 Restored Take-Home Payout Banner */}
        <div className="text-[10px] bg-[#09090c] p-3 rounded-lg border border-[#121216] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px]">💰</span>
            <span className="text-emerald-400 font-bold tracking-wider">
              PROJECTED TAKE-HOME PAYOUT (MONTH 1): ${projectedCommissionCheck.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-neutral-600 text-[9px] lowercase font-sans font-normal italic ml-2">
              {activeClient === 'televoi' ? '($2,500 subscription base + 10% upfront applied)' : 
               activeClient === 'aim' ? '(10% total structural contract value applied)' : '(15% standard consulting applied)'}
            </span>
          </div>
        </div>

        {/* Summary Meta Deck */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px]">
          <div className="bg-[#07070a] border border-[#14141a] p-4 rounded-lg">
            <span className="text-[#404040]">TOTAL SECURED VALUE:</span>
            <div className="text-base font-bold text-neutral-200 mt-1">${securedRevenueSum.toLocaleString()}</div>
          </div>
          <div className="bg-[#07070a] border border-[#14141a] p-4 rounded-lg">
            <span className="text-[#404040]">ACTIVE SYSTEM WORKSPACE:</span>
            <div className="text-base font-bold text-indigo-400 mt-1 uppercase">{activeClient}</div>
          </div>
        </div>

      </div>
    </div>
  );
}
