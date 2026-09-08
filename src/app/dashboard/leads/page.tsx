'use client';
import { useEffect, useState } from 'react';

export default function DashboardLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLeads = () => {
    fetch('/api/opportunities')
      .then((res) => res.json())
      .then((data) => setLeads(data || []))
      .catch((err) => console.error("Error fetching data layers:", err));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to clear your entire lead index?")) {
      return;
    }
    setIsDeleting(true);
    try {
      const res = await fetch('/api/opportunities', { method: 'DELETE' });
      if (res.ok) {
        setLeads([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-background text-foreground font-sans">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-muted">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">SurgeCRM Dashboard</p>
          <h1 className="text-2xl font-bold font-display">Data Axle Index</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDeleteAll}
            className="px-3 py-1.5 text-xs font-bold uppercase rounded bg-destructive text-white hover:opacity-90"
          >
            {isDeleting ? "Clearing..." : "🗑️ Delete All Leads"}
          </button>
          <div className="text-xs font-bold px-3 py-1.5 rounded bg-muted">
            Count: {leads.length}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-muted bg-card shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted text-xs uppercase tracking-wider text-muted-foreground border-b border-muted">
              <th className="p-4">Company / Account</th>
              <th className="p-4">Contact Person</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone Number</th>
              <th className="p-4">Physical Address</th>
              <th className="p-4">Pipeline Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted text-sm font-medium">
            {leads.map((lead: any) => (
              <tr key={lead.id} className="hover:bg-accent/40">
                <td className="p-4 font-bold text-primary">{lead.company}</td>
                <td className="p-4">{lead.name}</td>
                <td className="p-4 text-muted-foreground">{lead.email}</td>
                <td className="p-4 font-mono text-xs">{lead.phone_number}</td>
                <td className="p-4 text-xs text-muted-foreground">{lead.address}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground">
                    {lead.status}
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
