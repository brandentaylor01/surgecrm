"use client";

import React, { useState, useEffect } from 'react';

interface LeadRecord {
  id: string | number;
  name?: string;
  companyName?: string;
  contact?: string;
  email?: string;
  phone?: string;
  niche?: string;
  industry?: string;
  status?: string;
  crmStatus?: string;
  notes?: string;
}

interface PipelineProps {
  records: LeadRecord[];
}

export default function LeadPipelineTable({ records }: PipelineProps) {
  // Local reactive states for persistence, filtering, and custom notes
  const [localRecords, setLocalRecords] = useState<LeadRecord[]>([]);
  const [filterText, setFilterText] = useState("");
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [activeNoteText, setActiveNoteText] = useState("");

  // Sync incoming newly scraped entries with local browser storage memory maps
  useEffect(() => {
    const saved = localStorage.getItem('surge_saved_leads');
    const locallyStored: LeadRecord[] = saved ? JSON.parse(saved) : [];
    
    // Merge arrays while preventing duplicate id collisions
    const merged = [...locallyStored];
    records.forEach(rec => {
      if (!merged.some(m => String(m.id) === String(rec.id))) {
        merged.push({ ...rec, notes: rec.notes || "" });
      }
    });

    setLocalRecords(merged);
    if (merged.length > 0) {
      localStorage.setItem('surge_saved_leads', JSON.stringify(merged));
    }
  }, [records]);

  // Handle saving notes locally to the browser's persistent cache
  const saveNote = (id: string | number) => {
    const updated = localRecords.map(rec => {
      if (rec.id === id) {
        return { ...rec, notes: activeNoteText };
      }
      return rec;
    });
    setLocalRecords(updated);
    localStorage.setItem('surge_saved_leads', JSON.stringify(updated));
    setEditingId(null);
    setActiveNoteText("");
  };

  // Handle removing a lead completely from your workspace board pipeline
  const deleteLead = (id: string | number) => {
    const filtered = localRecords.filter(rec => rec.id !== id);
    setLocalRecords(filtered);
    localStorage.setItem('surge_saved_leads', JSON.stringify(filtered));
  };

  // Real-time keyword filter mechanism across names, emails, and target locations
  const filteredRecords = localRecords.filter(rec => {
    const compName = rec.companyName || rec.name || "";
    const compNiche = rec.niche || rec.industry || "";
    const compEmail = rec.email || "";
    const combinedStr = `${compName} ${compNiche} ${compEmail}`.toLowerCase();
    return combinedStr.includes(filterText.toLowerCase());
  });

  return (
    <div style={{ width: '100%', fontFamily: 'sans-serif', color: '#e2e8f0', background: '#0f172a', padding: '20px', borderRadius: '12px' }}>
      
      {/* Dynamic Search Filter Header Input Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
        <input 
          type="text" 
          placeholder="🔍 Filter records by company name, niche, location or email status..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ width: '100%', maxWidth: '480px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', outline: 'none' }}
        />
        <div style={{ fontSize: '14px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
          Showing <strong>{filteredRecords.length}</strong> of {localRecords.length} active leads
        </div>
      </div>

      {/* Main CRM Interactive Data Pipeline Frame */}
      <div style={{ width: '100%', overflowX: 'auto', borderRadius: '8px', border: '1px solid #334155' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
          <thead>
            <tr style={{ background: '#1e293b', borderBottom: '2px solid #334155' }}>
              <th style={{ padding: '12px' }}>Company Information</th>
              <th style={{ padding: '12px' }}>Email Address</th>
              <th style={{ padding: '12px' }}>Target Parameter</th>
              <th style={{ padding: '12px' }}>Status Tracker</th>
              <th style={{ padding: '12px', width: '300px' }}>Custom CRM Notes</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748b', background: '#0f172a' }}>
                  No pipeline entities found matching your current dashboard filter settings.
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec) => (
                <tr key={rec.id} style={{ borderBottom: '1px solid #334155', background: '#111827', transition: '0.2s' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: '600', color: '#f8fafc' }}>{rec.companyName || rec.name || "N/A"}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Contact: {rec.contact || "Operations Director"} • {rec.phone || "N/A"}</div>
                  </td>
                  <td style={{ padding: '12px', color: '#38bdf8' }}>{rec.email || "N/A"}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontSize: '13px', background: '#1e293b', padding: '4px 8px', borderRadius: '6px', border: '1px solid #475569' }}>
                      {rec.niche || rec.industry || "General"}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', background: '#1e3a8a', color: '#60a5fa' }}>
                      {rec.crmStatus || rec.status || "Indexed"}
                    </span>
                  </td>
                  
                  {/* Inline CRM Interactive Notes Editor Module */}
                  <td style={{ padding: '12px' }}>
                    {editingId === rec.id ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input 
                          type="text" 
                          value={activeNoteText} 
                          onChange={(e) => setActiveNoteText(e.target.value)}
                          placeholder="Type notes (e.g. Needs followup)..."
                          style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #3b82f6', background: '#1f2937', color: '#fff', fontSize: '13px' }}
                        />
                        <button onClick={() => saveNote(rec.id)} style={{ padding: '4px 10px', background: '#10b981', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                        <button onClick={() => setEditingId(null)} style={{ padding: '4px 10px', background: '#6b7280', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>X</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontStyle: rec.notes ? 'normal' : 'italic', color: rec.notes ? '#cbd5e1' : '#475569', fontSize: '13px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {rec.notes || "Click edit to add custom tags..."}
                        </span>
                        <button 
                          onClick={() => { setEditingId(rec.id); setActiveNoteText(rec.notes || ""); }}
                          style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Operational Removal Row Trigger */}
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button 
                      onClick={() => deleteLead(rec.id)}
                      style={{ padding: '6px 12px', background: '#ef4444', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '12px', opacity: 0.8 }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
