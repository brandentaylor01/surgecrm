"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, Search, RefreshCw, Plus, PhoneCall,
  ChevronDown, ChevronUp, MapPin, ShieldCheck, Mail, User,
  Phone, Save, MessageSquare, ClipboardList, CheckCircle2
} from 'lucide-react';

export default function AppointmentSetterDirectory() {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [actionMessage, setActionStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // Call form interaction states
  const [callStatus, setCallStatus] = useState('Pending');
  const [contactName, setContactName] = useState('');
  const [opportunityNotes, setOpportunityNotes] = useState('');

  async function syncPipelineData() {
    try {
      const res = await fetch('/api/leads/scrubbed');
      if (res.ok) {
        const data = await res.json();
        const normalized = (data.leads || []).map((l: any, idx: number) => ({
          id: l.id || `row_${idx}`,
          company: l.company || l.company_name,
          phone: l.phone || "(330) 490-4000",
          name: l.contact || "Business Executive",
          email: l.email || "ops@ohioenterprise.org",
          city: l.city || "Akron Hub",
          priority: l.priority || "High",
          callStatus: l.call_status || 'Pending',
          decisionMaker: l.decision_maker || '',
          opportunity: l.opportunity_details || ''
        }));
        setLeads(normalized);
      }
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  }

  useEffect(() => { syncPipelineData(); }, []);

  const toggleRowAccordion = (lead: any) => {
    if (expandedRowId === lead.id) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(lead.id);
      // Pre-fill the form with existing logs saved for this specific company node
      setCallStatus(lead.callStatus || 'Pending');
      setContactName(lead.decisionMaker || '');
      setOpportunityNotes(lead.opportunity || '');
    }
  };

  async function saveCallTrackingLog(leadId: string) {
    setActionStatus('Saving call log parameters to matrix registry...');
    
    // Optimistically update the UI rows instantly
    setLeads(prev => prev.map(l => l.id === leadId ? { 
      ...l, 
      callStatus, 
      decisionMaker: contactName, 
      opportunity: opportunityNotes 
    } : l));

    try {
      const response = await fetch("/api/leads/rapid-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          actionType: 'UPDATE_CALL_LOG',
          callStatus,
          decisionMaker: contactName,
          opportunityDetails: opportunityNotes
        })
      });
      if (response.ok) {
        setActionStatus('Call logging records updated successfully.');
      }
    } catch (err) {
      setActionStatus('Database transaction dropped. Staged locally.');
    }
  }

  const filteredRows = useMemo(() => {
    return leads.filter(l => {
      const targetString = `${l.company} ${l.phone} ${l.callStatus}`.toLowerCase();
      return targetString.includes(search.toLowerCase());
    });
  }, [leads, search]);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans antialiased p-6 lg:p-10">
      <div className="max-w-[1300px] mx-auto">
        
        {/* Navigation Head Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 bg-white p-6 rounded-xl border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black">S</div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">Outbound Appointment Setter Deck</h2>
              <p className="text-xs text-slate-400 font-medium">Log dial dispositions, decision maker responses, and qualified pipeline deals instantly.</p>
            </div>
          </div>
          <button onClick={syncPipelineData} className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Global Registry Controller */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-3 text-slate-400" size={13} />
              <input 
                type="text" 
                placeholder="Search by company name, telephone route, or call status..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all" 
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                  <th className="py-3.5 px-6 w-5/12">Ohio Target Account</th>
                  <th className="py-3.5 px-6 w-3/12">Direct Phone Line</th>
                  <th className="py-3.5 px-6 w-3/12">Call Log Placement</th>
                  <th className="py-3.5 px-6 w-1/12 text-center">Tray</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-700">
                {loading ? (
                  <tr><td colSpan={4} className="py-12 text-center text-slate-400 font-mono">Loading active calling queue matrices...</td></tr>
                ) : filteredRows.length === 0 ? (
                  <tr><td colSpan={4} className="py-12 text-center text-slate-400 font-mono">No matching data listings found in this hub radius.</td></tr>
                ) : (
                  filteredRows.map((lead: any) => {
                    const isExpanded = expandedRowId === lead.id;
                    return (
                      <React.Fragment key={lead.id}>
                        <tr 
                          onClick={() => toggleRowAccordion(lead)}
                          className={`cursor-pointer border-b border-slate-100 hover:bg-slate-50/40 transition-colors ${isExpanded ? 'bg-blue-50/10' : ''}`}
                        >
                          <td className="py-4 px-6 font-bold text-slate-900 text-sm tracking-tight">
                            {lead.company || "Unnamed Enterprise"}
                          </td>
                          <td className="py-4 px-6 font-mono font-bold text-blue-600">
                            {lead.phone || "(---) --- ----"}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center font-mono text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                              lead.callStatus === 'Appointment Scheduled' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              lead.callStatus === 'Talked to Decision Maker' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              lead.callStatus === 'Pending' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {lead.callStatus}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center text-slate-400">
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </td>
                        </tr>
                        
                        {/* Expanded Form Accordion Drawer Box */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={4} className="p-0 bg-slate-50/50 border-b border-slate-100">
                              <div className="px-8 py-5 grid grid-cols-1 lg:grid-cols-4 gap-4 text-xs">
                                
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1"><Phone size={11}/> Call Result</label>
                                  <select 
                                    value={callStatus} 
                                    onChange={(e) => setCallStatus(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                                  >
                                    <option value="Pending">⏳ Pending</option>
                                    <option value="No Answer">🚫 No Answer / Busy</option>
                                    <option value="Left Voicemail">📟 Left Voicemail</option>
                                    <option value="Gatekeeper Blocked">🚧 Gatekeeper Blocked</option>
                                    <option value="Talked to Decision Maker">🗣️ Talked to Decision Maker</option>
                                    <option value="Appointment Scheduled">🎯 Appointment Scheduled</option>
                                  </select>
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1"><User size={11}/> Who they talked to</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. John Doe (Owner)" 
                                    value={contactName}
                                    onChange={(e) => setContactName(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                                  />
                                </div>

                                <div className="space-y-1.5 lg:col-span-2 flex flex-col justify-between">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1"><MessageSquare size={11}/> What the opportunity is</label>
                                  <div className="flex gap-2 items-center mt-1">
                                    <input 
                                      type="text" 
                                      placeholder="Describe project, requirements, pipeline potential..." 
                                      value={opportunityNotes}
                                      onChange={(e) => setOpportunityNotes(e.target.value)}
                                      className="flex-1 bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                                    />
                                    <button 
                                      onClick={() => saveCallTrackingLog(lead.id)}
                                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
                                    >
                                      <Save size={13} /> Save Log
                                    </button>
                                  </div>
                                </div>

                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {actionMessage && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs font-mono text-blue-700">
            {actionMessage}
          </div>
        )}

      </div>
    </div>
  );
}
