'use client';
import { useEffect, useState } from 'react';

export default function OpportunitiesDashboard() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    fetch('/api/opportunities')
      .then((res) => res.json())
      .then((data) => setDeals(data || []));
  }, []);

  return (
    <div className="p-6 min-h-screen font-sans bg-background text-foreground">
      {/* Salesforce Header Layout Style */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-muted">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">SurgeCRM Dashboard</p>
          <h1 className="text-2xl font-bold font-display">Opportunities Pool</h1>
        </div>
        <div className="text-sm font-semibold px-4 py-2 rounded bg-primary text-primary-foreground">
          Total Pipelines: {deals.length}
        </div>
      </div>

      {/* High-Density Structural Table Layout Grid */}
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
            {deals.map((deal: any) => (
              <tr key={deal.id} className="hover:bg-accent/40 transition-colors">
                <td className="p-4 font-bold text-primary">{deal.company}</td>
                <td className="p-4">{deal.name || 'Decision Maker'}</td>
                <td className="p-4 text-muted-foreground">{deal.email}</td>
                <td className="p-4 font-mono text-xs">{deal.phone_number || '(330) 555-0199'}</td>
                <td className="p-4 text-xs max-w-xs truncate">{deal.address || 'Northeast Ohio Hub'}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                    {deal.status || 'Verified Intake'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
