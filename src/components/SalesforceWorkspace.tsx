
"use client";
import React, { useState, useEffect } from "react";
import { Users, Layers, TrendingUp, Plus, RefreshCw, Briefcase, MapPin, Search, LayoutDashboard, BarChart3, ShieldCheck, AlertCircle } from "lucide-react";
import DetailPanel, { Opp } from "@/app/DetailPanel";

export default function SalesforceWorkspace() {
  const [opportunities, setOpportunities] = useState<Opp[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<Opp | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Form states for the new lead modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formCompany, setFormCompany] = useState("");
  const [formValue, setFormValue] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formContact, setFormContact] = useState("");
  const [formError, setFormError] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/opportunities');
      const data = await res.json();
      setOpportunities(data);
    } catch (err) {
      console.error("Failed fetching pipeline registry:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSetField = async (id: string, field: keyof Opp, value: any) => {
    const updatedOpps = opportunities.map(opp => 
      opp.id === id ? { ...opp, [field]: value } : opp
    );
    setOpportunities(updatedOpps);
    
    if (selectedOpp && selectedOpp.id === id) {
      setSelectedOpp({ ...selectedOpp, [field]: value });
    }

    try {
      await fetch('/api/opportunities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, field, value })
      });
    } catch (err) {
      console.error("Failed persisting updates:", err);
    }
  };

  // 🛡️ Handles Form Submissions & Prevents Duplicate Company Profiles
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formCompany.trim()) return;

    // Check if company already exists in current local records
    const isDuplicate = opportunities.some(
      (opp) => opp.company?.toLowerCase().trim() === formCompany.toLowerCase().trim()
    );

    if (isDuplicate) {
      setFormError("An account registry matching this company name already exists.");
      return;
    }

    const newLead: Partial<Opp> = {
      id: 'lead_' + Date.now(),
      company: formCompany.trim(),
      value: Number(formValue) || 0,
      status: 'qualifying',
      city: formCity.trim() || 'Not Assigned',
      contact: formContact.trim() || 'Not Assigned',
      clientKey: 'default'
    };

    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      });
      
      if (res.ok) {
        await fetchData(); // Re-fetch updated list
        setIsModalOpen(false); // Close Modal
        setFormCompany("");
        setFormValue("");
        setFormCity("");
        setFormContact("");
      } else {
        setFormError("Failed to initialize deal parameters on server router.");
      }
    } catch (err) {
      setFormError("Network timeout persisting data attributes.");
    }
  };

  const totalLeads = opportunities.length;
  const grossPipeline = opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);
  const securedPipeline = opportunities
    .filter(opp => opp.status === 'secured')
    .reduce((sum, opp) => sum + (opp.value || 0), 0);
  const winRate = grossPipeline > 0 ? ((securedPipeline / grossPipeline) * 100).toFixed(1) : "0.0";

  const stages = ['qualifying', 'proposal', 'secured', 'lost'];

  const filteredOpps = opportunities.filter(opp => 
    opp.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.contact?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-[#09090b] text-[#e4e4e7] p-8 md:p-16 font-sans tracking-wide selection:bg-slate-800 antialiased selection:text-white">
      
      {/* 🧭 GLOBAL PLATINUM NAVIGATION HEADER */}
      <nav className="relative z-20 flex flex-col sm:flex-row items-center justify-between bg-gradient-to-b from-[#14141a] to-[#0c0c0f] border border-[#1f1f2a] rounded-2xl px-6 py-4 mb-12 shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.02)]">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-white">
            <ShieldCheck className="h-5 w-5 stroke-[1.5]" />
          </div>
          <span className="text-xs font-black text-white uppercase tracking-[0.2em] font-mono [text-shadow:0_1px_0_rgba(255,255,255,0.1)]">
            SURGECRM
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.12em]">
          <a href="/" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-gradient-to-b from-white to-slate-300 text-slate-950 shadow-[0_2px_8px_rgba(255,255,255,0.05)] transition-all">
            <LayoutDashboard className="h-3.5 w-3.5 stroke-[2.5]" /> Registry
          </a>
          <a href="/reports" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-transparent text-slate-400 hover:text-white hover:border-[#22222d] hover:bg-[#111116] transition-all">
            <BarChart3 className="h-3.5 w-3.5" /> Commission Reports
          </a>
          <a href="/login" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-transparent text-slate-400 hover:text-white hover:border-[#22222d] hover:bg-[#111116] transition-all">
            Gate Authorization
          </a>
        </div>
      </nav>

      {/* 🌟 PREMIUM LOGO HEADER SECTION */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8 pb-10 border-b border-[#1c1c24] mb-16">
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] font-mono [text-shadow:0_1px_0_rgba(255,255,255,0.15)]">
            RAINMAKER CONSOLE v2.0
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mt-2 [text-shadow:0_1px_0_#ccc,0_2px_0_#c5c5c5,0_3px_0_#bbb,0_4px_1px_rgba(0,0,0,0.6)]">
            Pipeline Control Registry
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-4 max-w-2xl font-light leading-relaxed border-l-2 border-slate-700 pl-4 italic">
            White-label management console, deal validation matrix, and custom proposal generation tool configured for <span className="text-white font-semibold tracking-wide">Rainmaker Sales LLC</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-4 self-start md:self-center">
          <button 
            onClick={fetchData}
            className="p-3.5 text-slate-400 hover:text-white border border-[#27273a] rounded-xl bg-gradient-to-b from-[#18181f] to-[#0f0f13] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_6px_-1px_rgba(0,0,0,0.5)] active:translate-y-0.5 active:shadow-inner transition-all duration-150"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          {/* Button re-labeled to Submit Company and triggers overlay modal */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-b from-white to-slate-300 text-slate-950 text-xs font-black uppercase tracking-[0.15em] px-8 py-4 rounded-xl flex items-center gap-3 shadow-[0_4px_12px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.4)] hover:from-white hover:to-white transition-all duration-200 active:translate-y-0.5"
          >
            <Plus className="h-4 w-4" /> Submit Company
          </button>
        </div>
      </div>

      {/* 📊 DATA SUMMARY CARDS */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="relative p-8 rounded-2xl bg-gradient-to-b from-[#13131a] to-[#0b0b0e] border border-[#1e1e26] shadow-[0_10px_20px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.02)]">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2 [text-shadow:0_1px_0_rgba(255,255,255,0.1)]">
            <Users className="h-4 w-4 text-slate-400" /> Total Active Pipeline
          </span>
          <div className="text-5xl font-black text-white mt-4 font-mono tracking-tighter [text-shadow:0_1px_0_#999,0_2px_0_#888,0_3px_2px_rgba(0,0,0,0.8)]">
            {totalLeads}
          </div>
          <span className="text-[10px] text-slate-500 block mt-3 font-mono">ASSIGNED ACTIVE REGISTRY PROFILES</span>
        </div>
        
        <div className="relative p-8 rounded-2xl bg-gradient-to-b from-[#13131a] to-[#0b0b0e] border border-[#1e1e26] shadow-[0_10px_20px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.02)]">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2 [text-shadow:0_1px_0_rgba(255,255,255,0.1)]">
            <Layers className="h-4 w-4 text-slate-400" /> Gross Contract Value
          </span>
          <div className="text-4xl lg:text-5xl font-black text-slate-200 mt-4 font-mono tracking-tight [text-shadow:0_1px_0_#999,0_2px_0_#888,0_3px_2px_rgba(0,0,0,0.8)]">
            ${grossPipeline.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-500 block mt-3 font-mono">AGGREGATE CONTRACT VALUE</span>
        </div>
        
        <div className="relative p-8 rounded-2xl bg-gradient-to-b from-[#13131a] to-[#0b0b0e] border border-[#1e1e26] shadow-[0_10px_20px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.02)]">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2 [text-shadow:0_1px_0_rgba(255,255,255,0.1)]">
            <TrendingUp className="h-4 w-4 text-slate-400" /> Win Ratio Metric
          </span>
          <div className="text-5xl font-black text-white mt-4 font-mono tracking-tighter [text-shadow:0_1px_0_#999,0_2px_0_#888,0_3px_2px_rgba(0,0,0,0.8)]">
            {winRate}%
          </div>
          <span className="text-[10px] text-slate-500 block mt-3 font-mono">BASED ON CAPTURED & CLOSED DEALS</span>
        </div>
      </div>

      {/* FILTER SEARCH PANEL */}
      <div className="relative z-10 mb-8 flex max-w-md items-center">
        <Search className="absolute left-4 text-slate-500 h-4 w-4 z-20" />
        <input 
          type="text" 
          placeholder="Search accounts by company, contact, or region..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-[#0d0d11] border border-[#20202a] focus:border-slate-500 pl-11 pr-4 py-4 rounded-xl text-xs uppercase tracking-wider text-slate-200 placeholder-slate-600 shadow-inner focus:outline-none transition-all font-mono"
        />
      </div>{/* HEAVY EMBOSSED DATA SHEET */}
      <div className="relative z-10 border border-[#1b1b24] rounded-2xl bg-gradient-to-b from-[#0d0d12] to-[#07070a] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs uppercase tracking-wider font-mono">
            <thead>
              <tr className="border-b border-[#1f1f2a] bg-[#121218] text-slate-400 font-black text-[10px] tracking-[0.15em]">
                <th className="p-6">Company Account</th>
                <th className="p-6">Profile Key</th>
                <th className="p-6">Location</th>
                <th className="p-6">Pipeline State</th>
                <th className="p-6 text-right">Computed Proposal Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#15151e]">
              {filteredOpps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-slate-600 italic font-medium text-sm normal-case">
                    No active pipeline profiles matched your filters.
                  </td>
                </tr>
              ) : (
                filteredOpps.map((opp) => (
                  <tr 
                    key={opp.id} 
                    onClick={() => setSelectedOpp(opp)}
                    className={`hover:bg-[#14141d]/50 cursor-pointer transition-all duration-150 group ${selectedOpp?.id === opp.id ? 'bg-[#181826] border-l-4 border-l-white' : ''}`}
                  >
                    <td className="p-6 font-black text-white group-hover:text-slate-300 transition-colors text-sm tracking-wide">
                      {opp.company || "Unnamed Contract"}
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[9px] font-extrabold bg-[#131319] border border-[#22222d] text-slate-400">
                        <Briefcase className="h-3 w-3 text-slate-500" /> {opp.clientKey || "default"}
                      </span>
                    </td>
                    <td className="p-6 text-slate-300 font-bold">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-600" /> {opp.city || "Not Assigned"}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`inline-block px-3 py-1 rounded border font-black text-[9px] tracking-widest ${
                        opp.status === 'secured' ? 'bg-slate-900 text-white border-slate-700' :
                        opp.status === 'proposal' ? 'bg-slate-950 text-slate-400 border-slate-800' :
                        opp.status === 'lost' ? 'bg-zinc-950 text-zinc-600 border-zinc-900/60' :
                        'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}>
                        {opp.status || 'qualifying'}
                      </span>
                    </td>
                    <td className="p-6 text-right font-black text-white text-sm tracking-wider">
                      ${(opp.value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🏛️ ULTRA-PREMIUM SUBMIT COMPANY MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-gradient-to-b from-[#14141a] to-[#0c0c0f] border border-[#1f1f2a] rounded-2xl p-8 shadow-2xl font-mono text-xs uppercase tracking-wider text-[#a3a3a3]">
            
            <div className="flex justify-between items-center border-b border-[#1f1f2a] pb-4 mb-6">
              <div>
                <span className="text-[9px] text-slate-500 font-bold">REGISTRY INITIALIZATION</span>
                <h3 className="text-white text-sm font-black tracking-widest mt-1">SUBMIT COMPANY PROFILE</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-600 hover:text-white border border-[#22222d] px-2 py-1 rounded bg-[#0d0d11] transition"
              >
                ESC
              </button>
            </div>

            {formError && (
              <div className="mb-6 flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-[10px]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 mb-1.5">COMPANY ACCOUNT NAME</label>
                <input 
                  type="text" 
                  required
                  value={formCompany}
                  onChange={e => setFormCompany(e.target.value)}
                  placeholder="E.G. ACME CONGLOMERATE" 
                  className="w-full bg-[#0d0d11] border border-[#20202a] p-3 rounded-xl text-white placeholder-slate-700 focus:border-slate-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 mb-1.5">PRIMARY CONTACT</label>
                  <input 
                    type="text" 
                    value={formContact}
                    onChange={e => setFormContact(e.target.value)}
                    placeholder="JOHN DOE" 
                    className="w-full bg-[#0d0d11] border border-[#20202a] p-3 rounded-xl text-white placeholder-slate-700 focus:border-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 mb-1.5">INITIAL DEAL VALUE ($)</label>
                  <input 
                    type="number" 
                    value={formValue}
                    onChange={e => setFormValue(e.target.value)}
                    placeholder="5000" 
                    className="w-full bg-[#0d0d11] border border-[#20202a] p-3 rounded-xl text-white placeholder-slate-700 focus:border-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 mb-1.5">TARGET REGION / CITY</label>
                <input 
                  type="text" 
                  value={formCity}
                  onChange={e => setFormCity(e.target.value)}
                  placeholder="NEW YORK, NY" 
                  className="w-full bg-[#0d0d11] border border-[#20202a] p-3 rounded-xl text-white placeholder-slate-700 focus:border-slate-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#1f1f2a] flex items-center justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 border border-[#22222d] rounded-xl hover:bg-neutral-900 transition"
                >
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  className="bg-gradient-to-b from-white to-slate-300 text-slate-950 font-black px-6 py-3 rounded-xl hover:from-white hover:to-white shadow-lg transition active:translate-y-0.5"
                >
                  INITIALIZE DEAL
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {selectedOpp && (
        <DetailPanel 
          sel={selectedOpp} 
          stages={stages} 
          setField={handleSetField} 
          setSel={setSelectedOpp} 
        />
      )}
    </div>
  );
}