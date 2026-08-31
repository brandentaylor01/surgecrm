'use client';
import React, { useState, useEffect } from 'react';

interface Lead {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  niche: string;
  status: string;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ managedClients: 14, leadsFound: 4820, emailsSent: 32150, callsQueued: 187 });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const syncDashboardStats = async () => {
    try {
      const res = await fetch('/api/metrics');
      const json = await res.json();
      if (json.success) {
        setMetrics(json.data);
        setLeads(json.leads || []);
      }
    } catch (err) {
      console.warn("Synchronizing live global context maps...");
    }
  };

  useEffect(() => {
    syncDashboardStats();
    const interval = setInterval(syncDashboardStats, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLaunchSequence = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setStatusMessage('Initializing scraping & matrix sequence...');
    try {
      const res = await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchCriteria: searchQuery })
      });
      const json = await res.json();
      if (json.success) {
        setStatusMessage(json.message);
        setMetrics(json.updatedMetrics);
        setLeads(json.leads || []);
        setSearchQuery('');
      } else {
        setStatusMessage('Automation sequence failed.');
      }
    } catch (err) {
      setStatusMessage('Error contacting SurgeCRM core backend engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#38bdf8', margin: 0 }}>⚡ SurgeCRM Engine</h1>
        <p style={{ color: '#94a3b8', margin: '5px 0 0 0' }}>Live Automation Control Center</p>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ padding: '20px', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Managed Clients</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0 0 0' }}>{metrics.managedClients}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Leads Found</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0 0 0', color: '#4ade80' }}>{metrics.leadsFound.toLocaleString()}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Emails Sent</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0 0 0', color: '#60a5fa' }}>{metrics.emailsSent.toLocaleString()}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Calls Queued</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0 0 0', color: '#f59e0b' }}>{metrics.callsQueued}</p>
        </div>
      </div>
      <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '12px', border: '1px solid #334155', maxWidth: '600px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', margin: '0 0 15px 0' }}>Launch New Scraper & Sequence</h2>
        <form onSubmit={handleLaunchSequence} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="e.g. Real Estate Agents in Miami" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} disabled={loading} style={{ flex: 1, minWidth: '200px', padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '16px', outline: 'none' }} />
          <button type="submit" disabled={loading} style={{ padding: '12px 24px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>{loading ? 'Launching...' : 'Launch Matrix'}</button>
        </form>
        {statusMessage && <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#334155', borderRadius: '6px', fontSize: '14px', color: '#38bdf8' }}>{statusMessage}</div>}
      </div>
      <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '12px', border: '1px solid #334155' }}>
        <h2 style={{ fontSize: '20px', margin: '0 0 20px 0' }}>📋 Active Lead Database Pipeline</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #334155', color: '#94a3b8', fontSize: '14px' }}>
                <th style={{ padding: '12px' }}>Company Name</th>
                <th style={{ padding: '12px' }}>Decision Maker</th>
                <th style={{ padding: '12px' }}>Email Address</th>
                <th style={{ padding: '12px' }}>Phone String</th>
                <th style={{ padding: '12px' }}>Target Parameter</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>Establishing secure cloud sync framework...</td></tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid #334155', fontSize: '15px' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{lead.name}</td>
                    <td style={{ padding: '12px' }}>{lead.contact}</td>
                    <td style={{ padding: '12px', color: '#38bdf8' }}>{lead.email}</td>
                    <td style={{ padding: '12px', color: '#94a3b8' }}>{lead.phone}</td>
                    <td style={{ padding: '12px', color: '#94a3b8' }}>{lead.niche}</td>
                    <td style={{ padding: '12px' }}><span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', backgroundColor: lead.status === 'Email Found' ? '#1e3a8a' : '#065f46', color: '#fff' }}>{lead.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
