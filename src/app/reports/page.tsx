"use client";

import React, { useState, useMemo } from "react";

interface LineItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  category: string;
}

interface ClientProposal {
  id: string;
  company: string;
  contact?: string;
  city?: string;
  status: string;
  items: LineItem[];
  updatedAt: string;
}

const MOCK_PROPOSALS: ClientProposal[] = [
  {
    id: "prop-01",
    company: "NEXUS SYSTEMS",
    status: "PROPOSAL SENT",
    updatedAt: "2026-03-01",
    items: [{ id: "li-1", name: "CORE COMPUTE", price: 4500, qty: 1, category: "INFRASTRUCTURE" }]
  },
  {
    id: "prop-02",
    company: "VERTEX LABS",
    status: "CLOSED WON",
    updatedAt: "2026-03-02",
    items: [{ id: "li-3", name: "API GATEWAY", price: 8500, qty: 1, category: "DEVELOPMENT" }]
  }
];

const STANDARD_CATEGORIES = ["INFRASTRUCTURE", "DEVELOPMENT", "CONSULTING"];
const PIPELINE_STAGES = ["LEAD GENERATION", "PROPOSAL SENT", "CLOSED WON"];

export default function ReportsPage() {
  const [proposals] = useState<ClientProposal[]>(MOCK_PROPOSALS);
  const [disabledClientIds, setDisabledClientIds] = useState<Record<string, boolean>>({});
  const [targetGoal, setTargetGoal] = useState<number>(50000);
  const [selectedHorizon, setSelectedHorizon] = useState<string>("MONTHLY");

  const telemetry = useMemo(() => {
    let totalGrossValue = 0;
    let closedWonValue = 0;
    
    proposals.filter(p => !disabledClientIds[p.id]).forEach(prop => {
      prop.items.forEach(item => {
        const itemCost = item.price * item.qty;
        totalGrossValue += itemCost;
        if (prop.status === "CLOSED WON") closedWonValue += itemCost;
      });
    });

    return { totalGrossValue, closedWonValue };
  }, [proposals, disabledClientIds]);

  return (
    <div className="bg-[#07070a] min-h-screen text-[#e5e5e5] p-6 space-y-6 font-mono antialiased">
      <div className="border-b border-[#14141c] pb-4">
        <span className="text-[9px] text-[#404040] block font-bold">SYSTEM DATA CENTER</span>
        <h1 className="text-[#e5e5e5] font-bold text-sm tracking-widest mt-0.5">ANALYTICS & GOAL PLANNER</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0c0c12] border border-[#14141f] p-4 rounded-lg">
          <span className="text-[9px] text-neutral-400 font-bold block">🎛️ DIRECTORY FILTER</span>
          {proposals.map(p => (
            <div key={p.id} onClick={() => setDisabledClientIds(prev => ({ ...prev, [p.id]: !prev[p.id] }))} className="p-2 border border-[#14141c] mt-2 cursor-pointer">
              <span className="text-[10px] block">{p.company}</span>
            </div>
          ))}
        </div>

        <div className="bg-[#0c0c12] border border-[#14141f] p-4 rounded-lg">
          <span className="text-[9px] text-indigo-400 font-bold block">🎯 METRIC BALANCE</span>
          <div className="mt-2 text-xs">
            GROSS: ${telemetry.totalGrossValue.toLocaleString()} | WON: ${telemetry.closedWonValue.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
