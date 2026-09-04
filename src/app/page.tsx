'use client';

import React, { useState, useEffect } from 'react';

export interface ProposalItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  billingCycle: 'one-time' | 'monthly_1yr' | 'monthly_multi';
  contractYears?: number;
}

export interface Opp {
  id: string;
  companyAccount: string;
  initialContact?: string;
  city?: string;
  address?: string;
  email?: string;
  phone?: string;
  status: "qualifying" | "proposal" | "secured";
  clientWorkspace: string;
  notes?: string;
  proposals?: ProposalItem[];
}

export interface GlobalProduct {
  id: string;
  name: string;
  basePrice: number;
}

export default function RainmakerProductionDashboard() {
  const [currentTab, setCurrentTab] = useState<"pipeline" | "analytics">("pipeline");
  const [workspaces, setWorkspaces] = useState<string[]>(["rainmaker", "aim", "televoi"]);
  const [activeWorkspace, setActiveWorkspace] = useState<string>("rainmaker");
  const [opps, setOpps] = useState<Opp[]>([]);
  const [sel, setSel] = useState<Opp | null>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState("");
  
  const [globalProducts, setGlobalProducts] = useState<GlobalProduct[]>([
    { id: 'p1', name: 'VoIP Seat License', basePrice: 24.99 },
    { id: 'p2', name: 'CRM Automation Seat', basePrice: 49.00 },
    { id: 'p3', name: 'Restoration Retainer', basePrice: 300.00 }
  ]);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");

  const [form, setForm] = useState({
    companyAccount: "", initialContact: "", city: "", address: "", email: "", phone: "", notes: ""
  });

  const [proposalForm, setProposalForm] = useState({
    productId: "", quantity: 1, billingCycle: 'one-time' as ProposalItem['billingCycle'], contractYears: 1
  });

  const handleWorkspaceChange = (val: string) => {
    if (val === "ADD_NEW_CLIENT_PROMPT") {
      const name = prompt("ENTER NEW CLIENT BUSINESS NAME:");
      if (name && name.trim() !== "") {
        const cleanName = name.trim().toLowerCase();
        if (!workspaces.includes(cleanName)) {
          setWorkspaces([...workspaces, cleanName]);
          setActiveWorkspace(cleanName);
        } else {
          setActiveWorkspace(cleanName);
        }
      }
    } else {
      setActiveWorkspace(val);
      setSel(null);
    }
  };

  const fetchLiveLeads = async () => {
    try {
      const res = await fetch('/api/opportunities');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setOpps(data || []);
      if (sel) {
        const updatedSel = (data || []).find((o: Opp) => o.id === sel.id);
        setSel(updatedSel || null);
      }
    } catch (error) {
      console.error("Sync error:", error);
    }
  };

  useEffect(() => {
    fetchLiveLeads();
    const ticker = setInterval(fetchLiveLeads, 30000);
    return () => clearInterval(ticker);
  }, [sel?.id]);

  const computeItemTotal = (item: ProposalItem) => {
    const baseVal = item.price * item.quantity;
    if (item.billingCycle === 'monthly_1yr') return baseVal * 12;
    if (item.billingCycle === 'monthly_multi') return baseVal * 12 * (item.contractYears || 2);
    return baseVal;
  };

  const computeOppTotal = (opp: Opp) => {
    return (opp.proposals || []).reduce((acc, curr) => acc + computeItemTotal(curr), 0);
  };

  const currentWorkspaceOpps = opps.filter(o => o.clientWorkspace === activeWorkspace);

  const computeTimeframeMetrics = () => {
    const closedWon = currentWorkspaceOpps.filter(o => o.status === "secured");
    const securedTotal = closedWon.reduce((acc, curr) => acc + computeOppTotal(curr), 0);
    return {
      weekly: securedTotal / 52,
      monthly: securedTotal / 12,
      quarterly: securedTotal / 4,
      yearly: securedTotal
    };
  };

  const metrics = computeTimeframeMetrics();

  const calculatePipelineVelocity = () => {
    const totalCount = currentWorkspaceOpps.length || 1;
    const wonCount = currentWorkspaceOpps.filter(o => o.status === "secured").length;
    const winRate = (wonCount / totalCount) * 100;
    const totalPipelineValue = currentWorkspaceOpps.reduce((acc, curr) => acc + computeOppTotal(curr), 0);
    const avgDealSize = totalPipelineValue / totalCount;
    return { winRate, avgDealSize };
  };

  const salesforceTelemetry = calculatePipelineVelocity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, clientWorkspace: activeWorkspace })
      });
      if (res.ok) {
        setForm({ companyAccount: "", initialContact: "", city: "", address: "", email: "", phone: "", notes: "" });
        fetchLiveLeads();
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const addProductToRegistry = () => {
    if (!newProdName || !newProdPrice) return;
    const item: GlobalProduct = { id: `p_${Date.now()}`, name: newProdName, basePrice: parseFloat(newProdPrice) };
    setGlobalProducts([...globalProducts, item]);
    setNewProdName(""); setNewProdPrice("");
  };

  const updateStage = async (oppId: string, nextStatus: "qualifying" | "proposal" | "secured") => {
    setOpps(prev => prev.map(o => o.id === oppId ? { ...o, status: nextStatus } : o));
    if (sel?.id === oppId) setSel(p => p ? { ...p, status: nextStatus } : null);
    await fetch('/api/opportunities', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: oppId, field: 'status', value: nextStatus })
    });
  };

  const saveNotesUpdate = async () => {
    if (!sel) return;
    await fetch('/api/opportunities', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: sel.id, field: 'notes', value: editedNotes })
    });
    setIsEditingNotes(false);
    fetchLiveLeads();
  };

  const deleteOpportunity = async (oppId: string) => {
    if (!confirm("Are you sure you want to permanently delete this record?")) return;
    try {
      const res = await fetch('/api/opportunities', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: oppId })
      });
      if (res.ok) {
        if (sel?.id === oppId) setSel(null);
        fetchLiveLeads();
      }
    } catch (error) {
      console.error("Deletion error:", error);
    }
  };

  const attachProposalItem = async (oppId: string) => {
    const matchProd = globalProducts.find(p => p.id === proposalForm.productId);
    if (!matchProd) return;
    const newItem: ProposalItem = {
      id: `line_${Date.now()}`, name: matchProd.name, price: matchProd.basePrice,
      quantity: proposalForm.quantity, billingCycle: proposalForm.billingCycle,
      contractYears: proposalForm.billingCycle === 'monthly_multi' ? proposalForm.contractYears : undefined
    };
    const targetOpp = opps.find(o => o.id === oppId);
    if (!targetOpp) return;
    const modernProposals = [...(targetOpp.proposals || []), newItem];
    setOpps(prev => prev.map(o => o.id === oppId ? { ...o, proposals: modernProposals } : o));
    if (sel?.id === oppId) setSel(p => p ? { ...p, proposals: modernProposals } : null);
    await fetch('/api/opportunities', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: oppId, field: 'proposals', value: modernProposals })
    });
  };

  return (
    <div className="min-h-screen bg-[#020202] text-[#737373] p-8 text-[11px] uppercase tracking-wider font-mono flex flex-col justify-between">
      <div className="w-full space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline border-b border-[#141414] pb-4 gap-4">
          <div>
            <h1 className="text-sm font-bold tracking-[0.25em] text-[#e5e5e5]">RAINMAKER ENGINE</h1>
            <p className="text-[9px] text-[#404040] mt-0.5">White-Label Management Console</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[8px] text-neutral-600 mb-1">SELECT ACTIVE WORKSPACE</span>
              <select 
                value={activeWorkspace} 
                onChange={(e) => handleWorkspaceChange(e.target.value)}
                className="bg-[#0c0c0f] border border-[#22222a] text-white px-3 py-2 rounded-lg font-bold text-[10px] focus:outline-none cursor-pointer"
              >
                {workspaces.map(w => (
                  <option key={w} value={w}>{w === 'rainmaker' ? 'Rainmaker (Internal Agency)' : `${w} (Client Pipeline)`}</option>
                ))}
                <option value="ADD_NEW_CLIENT_PROMPT" className="text-indigo-400 font-bold">+ ADD CLIENT...</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-b border-[#111115] pb-2">
          <button onClick={() => setCurrentTab("pipeline")} className={`px-4 py-1.5 rounded transition cursor-pointer font-bold ${currentTab === "pipeline" ? "bg-[#121217] text-white border border-[#22222a]" : "text-neutral-500 hover:text-neutral-300"}`}>
            📋 Pipeline CRM Board
          </button>
          <button onClick={() => setCurrentTab("analytics")} className={`px-4 py-1.5 rounded transition cursor-pointer font-bold ${currentTab === "analytics" ? "bg-[#121217] text-white border border-[#22222a]" : "text-neutral-500 hover:text-neutral-300"}`}>
            📊 Salesforce Revenue Analytics
          </button>
        </div>

        {currentTab === "analytics" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="bg-[#060608] border border-[#131317] p-4 rounded-lg">
                <div className="text-neutral-500 text-[9px] font-bold">WEEKLY TARGET INCOME</div>
                <div className="text-white font-sans text-lg font-bold mt-1">${metrics.weekly.toFixed(2)}</div>
                <div className="text-neutral-600 text-[8px] mt-1">GOAL PROJECTIONS CALIBRATED</div>
              </div>
              <div className="bg-[#060608] border border-[#131317] p-4 rounded-lg">
                <div className="text-neutral-500 text-[9px] font-bold">MONTHLY PROJECTED ACV</div>
                <div className="text-indigo-400 font-sans text-lg font-bold mt-1">${metrics.monthly.toFixed(2)}</div>
                <div className="text-neutral-600 text-[8px] mt-1">MONTHLY RUN RATE RECURRING</div>
              </div>
              <div className="bg-[#060608] border border-[#131317] p-4 rounded-lg">
                <div className="text-neutral-500 text-[9px] font-bold">QUARTERLY ARR SCHEDULE</div>
                <div className="text-emerald-400 font-sans text-lg font-bold mt-1">${metrics.quarterly.toFixed(2)}</div>
                <div className="text-neutral-600 text-[8px] mt-1">REVENUE VELOCITY BENCHMARK</div>
              </div>
              <div className="bg-[#060608] border border-[#131317] p-4 rounded-lg">
                <div className="text-neutral-500 text-[9px] font-bold">YEARLY CONTRACT VALUES</div>
                <div className="text-white font-sans text-lg font-bold mt-1">${metrics.yearly.toFixed(2)}</div>
                <div className="text-neutral-600 text-[8px] mt-1">TOTAL CLOSED SECURED ARR</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#060608] border border-[#121215] p-4 rounded-lg space-y-3">
                <span className="text-neutral-400 font-bold block">📈 PIPELINE VELOCITY MATRIX</span>
                <div className="space-y-2 font-sans tracking-normal">
                  <div className="flex justify-between border-b border-[#111115] pb-1.5"><span className="text-neutral-500 uppercase font-mono text-[10px]">WIN RATE RATIO:</span><span className="text-white font-bold">{salesforceTelemetry.winRate.toFixed(1)}%</span></div>
                  <div className="flex justify-between border-b border-[#111115] pb-1.5"><span className="text-neutral-500 uppercase font-mono text-[10px]">AVERAGE DEAL SIZE:</span><span className="text-indigo-400 font-bold">${salesforceTelemetry.avgDealSize.toFixed(2)}</span></div>
                  <div className="flex justify-between pb-0.5"><span className="text-neutral-500 uppercase font-mono text-[10px]">TOTAL OPPORTUNITIES:</span><span className="text-white font-bold">{currentWorkspaceOpps.length}</span></div>
                </div>
              </div>
              <div className="bg-[#060608] border border-[#121215] p-4 rounded-lg flex flex-col justify-center items-center text-center">
                <span className="text-neutral-500 text-[9px] tracking-widest font-mono uppercase mb-2">QUARTERLY REVENUE GOAL PROGRESS</span>
                <div className="w-full bg-[#111115] rounded-full h-2.5 overflow-hidden border border-[#16161c]">
                  <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${Math.min(salesforceTelemetry.winRate * 1.5, 100)}%` }}></div>
                </div>
                <span className="text-[9px] text-neutral-400 font-bold uppercase mt-2">PERFORMANCE TRACKING CONTINUOUS LOGS</span>
              </div>
            </div>
          </div>
        ) : (

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(["qualifying", "proposal", "secured"] as const).map((statusKey) => {
                  const stepItems = currentWorkspaceOpps.filter(o => o.status === statusKey);
                  return (
                    <div key={statusKey} className="bg-[#060608] rounded-lg border border-[#131317] p-3 min-h-[320px]">
                      <div className="border-b border-[#141419] pb-2 mb-3 flex justify-between"><span className="font-bold text-neutral-400">{statusKey}</span><span className="text-[#404040] font-bold">{stepItems.length}</span></div>
                      <div className="space-y-2">
                        {stepItems.map(opp => (
                          <div key={opp.id} onClick={() => { setSel(opp); setEditedNotes(opp.notes || ""); setIsEditingNotes(false); }} className={`p-2.5 rounded border transition cursor-pointer relative group ${sel?.id === opp.id ? 'border-indigo-500 bg-[#0d0d14]' : 'border-[#16161c] bg-[#0b0b0d]'}`}>
                            <button onClick={(e) => { e.stopPropagation(); deleteOpportunity(opp.id); }} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[8px] bg-red-950/40 border border-red-900/60 px-1 py-0.5 rounded text-red-400 hover:bg-red-900 hover:text-white transition cursor-pointer">DEL</button>
                            <div className="font-bold text-white pr-6">{opp.companyAccount}</div>
                            <div className="text-[9px] text-neutral-500 mt-1">Value: ${computeOppTotal(opp).toFixed(2)}</div>
                            <div className="mt-2 flex gap-1 justify-end">
                              {statusKey !== 'qualifying' && <button onClick={(e) => { e.stopPropagation(); updateStage(opp.id, 'qualifying'); }} className="text-[8px] bg-neutral-900 border border-neutral-800 px-1 py-0.5 rounded text-neutral-400 hover:text-white cursor-pointer">◀</button>}
                              {statusKey !== 'secured' && <button onClick={(e) => { e.stopPropagation(); updateStage(opp.id, statusKey === 'qualifying' ? 'proposal' : 'secured'); }} className="text-[8px] bg-neutral-900 border border-neutral-800 px-1 py-0.5 rounded text-neutral-400 hover:text-white cursor-pointer">▶</button>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#060608] border border-[#121215] p-4 rounded-lg space-y-4">
              {sel ? (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-white font-bold text-xs">{sel.companyAccount}</h2>
                      <p className="text-neutral-500 text-[9px] mt-0.5">Workspace: {sel.clientWorkspace}</p>
                    </div>
                    <button onClick={() => deleteOpportunity(sel.id)} className="border border-red-900 text-red-500 hover:bg-red-950/40 text-[9px] px-2 py-1 rounded transition cursor-pointer">REMOVE LEAD</button>
                  </div>

                  <div className="bg-[#0b0b0d] p-2.5 rounded border border-[#16161c] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-neutral-500 block font-bold">INTERACTION MEMO</span>
                      {!isEditingNotes ? (
                        <button onClick={() => { setIsEditingNotes(true); setEditedNotes(sel.notes || ""); }} className="text-[8px] text-indigo-400 hover:underline cursor-pointer">EDIT MEMO</button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={saveNotesUpdate} className="text-[8px] text-green-400 hover:underline cursor-pointer">SAVE</button>
                        <button onClick={() => setIsEditingNotes(false)} className="text-[8px] text-neutral-500 hover:underline cursor-pointer">CANCEL</button>
                      </div>
                    )}
                  </div>
                  {!isEditingNotes ? (
                    <p className="text-neutral-300 normal-case">{sel.notes || "NO STRATEGIC LOGS CAPTURED YET."}</p>
                  ) : (
                    <textarea value={editedNotes} onChange={(e) => setEditedNotes(e.target.value)} className="bg-[#121217] text-white p-2 rounded border border-neutral-800 text-[10px] w-full h-20 resize-none uppercase font-mono focus:outline-none" />
                  )}
                </div>

                <div className="space-y-1.5 border-t border-[#141419] pt-3">
                  <span className="text-[9px] text-neutral-400 block font-bold">PROPOSAL SUMMARY</span>
                  {(sel.proposals || []).length === 0 ? (
                    <p className="text-[9px] text-neutral-600 italic">No products provisioned yet.</p>
                  ) : (
                    (sel.proposals || []).map(item => (
                      <div key={item.id} className="flex justify-between items-center text-[9px] bg-[#0b0b0d] p-2 border border-[#16161c] rounded">
                        <div>
                          <span className="text-white block font-bold">{item.name} (x{item.quantity})</span>
                          <span className="text-neutral-500 font-sans tracking-normal normal-case">{item.billingCycle}</span>
                        </div>
                        <span className="text-indigo-400 font-bold">${computeItemTotal(item).toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>

                  <div className="border-t border-[#141419] pt-3 space-y-2">
                    <span className="text-[9px] text-neutral-400 block font-bold">ATTACH LINE ITEMS</span>
                    <select value={proposalForm.productId} onChange={e => setProposalForm({...proposalForm, productId: e.target.value})} className="bg-[#0b0b0d] border border-[#16161c] w-full text-white p-2 text-[10px] rounded focus:outline-none cursor-pointer" >
                      <option value="">-- CHOOSE PRODUCT --</option>
                      {globalProducts.map(p => <option key={p.id} value={p.id}>{p.name} (${p.basePrice})</option>)}
                    </select>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" min="1" placeholder="QTY" value={proposalForm.quantity} onChange={e => setProposalForm({...proposalForm, quantity: parseInt(e.target.value) || 1})} className="bg-[#0b0b0d] border border-[#16161c] text-white p-2 rounded w-full text-[10px] focus:outline-none" />
                      <select value={proposalForm.billingCycle} onChange={e => setProposalForm({...proposalForm, billingCycle: e.target.value as any})} className="bg-[#0b0b0d] border border-[#16161c] text-white p-2 rounded w-full text-[10px] cursor-pointer focus:outline-none">
                        <option value="one-time">One-Time Fee</option>
                        <option value="monthly_1yr">Monthly (1 Yr Contract)</option>
                        <option value="monthly_multi">Monthly (Multi-Yr Contract)</option>
                      </select>
                    </div>
                    {proposalForm.billingCycle === 'monthly_multi' && (
                      <input type="number" min="2" placeholder="CONTRACT YEARS" value={proposalForm.contractYears} onChange={e => setProposalForm({...proposalForm, contractYears: parseInt(e.target.value) || 2})} className="bg-[#0b0b0d] border border-[#16161c] text-white p-2 rounded w-full text-[10px] focus:outline-none" />
                    )}
                    <button type="button" onClick={() => attachProposalItem(sel.id)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 rounded transition cursor-pointer">
                      + APPEND TO PROPOSAL
                    </button>
                  </div>

                  <div className="border-t border-[#141419] pt-3 space-y-2">
                    <span className="text-[9px] text-neutral-500 block">PROVISION PRODUCT INTO REGISTRY (ON THE FLY)</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="PRODUCT NAME" value={newProdName} onChange={e => setNewProdName(e.target.value)} className="bg-[#0b0b0d] border border-[#16161c] p-2 text-white text-[9px] rounded focus:outline-none" />
                      <input type="number" placeholder="UNIT PRICE" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} className="bg-[#0b0b0d] border border-[#16161c] p-2 text-white text-[9px] rounded focus:outline-none" />
                    </div>
                    <button type="button" onClick={addProductToRegistry} className="w-full border border-neutral-700 hover:border-white text-neutral-400 hover:text-white p-1.5 text-[9px] transition cursor-pointer">
                      INJECT INTO PRODUCT REGISTRY
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-neutral-600 text-center italic py-12">Select an active card to configure proposals and evaluate logs.</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
