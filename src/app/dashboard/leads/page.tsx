'use client';
import { useEffect, useState } from 'react';

// Explicit default export layout component satisfies Next.js structure
export default function DashboardLeadsPage() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    // Safely reads your database rows from your secure api path
    fetch('/api/opportunities')
      .then((res) => res.json())
      .then((data) => setLeads(data || []));
  }, []);

  return (
    <div className="p-6 min-h-screen bg-background text-foreground font-sans">
      {/* High-Density Header Segment */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-muted">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">SurgeCRM Dashboard</p>
          <h1 className="text-2xl font-bold font-display">Northeast Ohio / Data Axle Leads Pool</h1>
        </div>
        <div className="text-sm font-semibold px-4 py-2 rounded bg-primary text-primary-foreground">
          Total Pipelines: {leads.length}
        </div>
      </div>

      {/* Salesforce-Style High-Density Data Grid View */}
      <div className="overflow-x-auto rounded-lg border border-muted bg-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted text-xs uppercase tracking-wider text-muted-foreground border-b border-muted">
              <th className="p-4 font-semibold">Company / Account</th>
              <th className="p-4 font-semibold">Contact Person</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Phone Number</th>
              <th className="p-4 font-semibold">Physical Address</th>
              <th className="p-4 font-semibold">Pipeline Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted text-sm font-medium">
            {leads.map((lead: any) => (
              <tr key={lead.id} className="hover:bg-accent/40 transition-colors">
                <td className="p-4 font-bold text-primary">{lead.company}</td>
                <td className="p-4">{lead.name || 'Decision Maker'}</td>
                <td className="p-4 text-muted-foreground">{lead.email}</td>
                <td className="p-4 font-mono text-xs">{lead.phone_number || '(330) 555-0199'}</td>
                <td className="p-4 text-xs max-w-xs truncate">{lead.address || 'Northeast Ohio Hub'}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                    {lead.status || 'Verified Intake'}
                  </span>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No automated leads loaded yet. Run your auto-collector script to populate data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
