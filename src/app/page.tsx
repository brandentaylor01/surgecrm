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
  clientWorkspace: "rainmaker" | "aim" | "televoi";
  notes?: string;
  proposals?: ProposalItem[];
}

export interface GlobalProduct {
  id: string;
  name: string;
  basePrice: number;
}

export default function RainmakerDashboard() {
  const [activeWorkspace, setActiveWorkspace] = useState<"rainmaker" | "aim" | "televoi">("rainmaker");
  const [opps, setOpps] = useState<Opp[]>([]);
  const [sel, setSel] = useState<Opp | null>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState("");
  
  const [globalProducts, setGlobalProducts] = useState<GlobalProduct[]>([
    { id: 'p1', name: 'VoIP Seat License', basePrice: 24.99 },
    { id: 'p2', name: 'CRM Automation Seat', basePrice: 49.00 }
  ]);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");

  const [form, setForm] = useState({
    companyAccount: "", initialContact: "", city: "", address: "", email: "", phone: "", notes: ""
  });

  const [proposalForm, setProposalForm] = useState({
    productId: "", quantity: 1, billingCycle: 'one-time' as ProposalItem['billingCycle'], contractYears: 1
  });

  const fetchLiveLeads = async () => {
    try {
      const res = await fetch('/api/opportunities');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setOpps(data || []);
      
      if (sel) {
        const updatedSel = (data || []).find((o: Opp) => o.id === sel.id);
        if (updatedSel) {
          setSel(updatedSel);
        } else {
          setSel(null);
        }
      }
    } catch (error) {
      console.error("Data synchronization fault:", error);
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
  const totalGrossValue = currentWorkspaceOpps.reduce((acc, curr) => acc + computeOppTotal(curr), 0);

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
      console.error("Lead submission crash:", error);
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
      console.error("Deletion execution fault:", error);
    }
  };

  const attachProposalItem = async (oppId: string) => {
    const matchProd = globalProducts.find(p => p.id === proposalForm.productId);
    if (!matchProd) return;

    const newItem: ProposalItem = {
      id: `line_${Date.now()}`,
      name: matchProd.name,
      price: matchProd.basePrice,
      quantity: proposalForm.quantity,
      billingCycle: proposalForm.billingCycle,
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
                onChange={(e) => {
                  setActiveWorkspace(e.target.value as any);
                  setSel(null);
                }}
                className="bg-[#0c0c0f] border border-[#22222a] text-white px-3 py-2 rounded-lg font-bold text-[10px] focus:outline-none cursor-pointer"
              >
                <option value="rainmaker">Rainmaker (Internal Agency)</option>
                <option value="aim">Aim Restoration (Client Pipeline)</option>
                <option value="televoi">Televoi (Client Pipeline)</option>
              </select>
            </div>
            <div className="text-right text-[10px] space-y-0.5">
              <div><span className="text-[#404040]">PIPELINE REVENUE:</span> <span className="text-indigo-400 font-bold">${totalGrossValue.toFixed(2)}</span></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-2 bg-[#060608] p-4 rounded-lg border border-[#121215]">
              <span className="text-[9px] text-neutral-500 block mb-1">Create New Opportunity Entry ({activeWorkspace})</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input type="text" placeholder="COMPANY ACCOUNT *" required value={form.companyAccount} onChange={(e) => setForm({ ...form, companyAccount: e.target.value })} className="bg-[#0b0b0d] p-2.5 rounded border border-[#16161c] text-[#a3a3a3] uppercase font-mono text-[10px] w-full focus:outline-none" />
                <input type="text" placeholder="INITIAL CONTACT" value={form.initialContact} onChange={(e) => setForm({ ...form, initialContact: e.target.value })} className="bg-[#0b0b0d] p-2.5 rounded border border-[#16161c] text-[#a3a3a3] uppercase font-mono text-[10px] w-full focus:outline-none" />
                <input type="text" placeholder="CITY" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="bg-[#0b0b0d] p-2.5 rounded border border-[#16161c] text-[#a3a3a3] uppercase font-mono text-[10px] w-full focus:outline-none" />
              </div>
              <textarea 
                placeholder="ADD ENTRY MEMO / ACTIONABLE NOTE DETAILS HERE..." 
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="bg-[#0b0b0d] p-2.5 rounded border border-[#16161c] text-[#a3a3a3] uppercase font-mono text-[10px] w-full h-16 resize-none focus:outline-none"
              />
              <div className="flex justify-end"><button type="submit" className="border border-[#22222a] bg-[#111116] text-[#e5e5e5] px-6 py-2 rounded font-bold text-[9px] hover:bg-[#1c1c24] transition cursor-pointer">SUBMIT TO QUALIFYING...</button></div>
            </form>

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
                    <textarea 
                      value={editedNotes} 
                      onChange={(e) => setEditedNotes(e.target.value)}
                      className="bg-[#121217] text-white p-2 rounded border border-neutral-800 text-[10px] w-full h-20 resize-none uppercase font-mono focus:outline-none"
                    />
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
                  <select 
                    value={proposalForm.productId} 
                    onChange={e => setProposalForm({...proposalForm, productId: e.target.value})}
