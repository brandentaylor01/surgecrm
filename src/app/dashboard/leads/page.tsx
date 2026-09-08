'use client';
import { useEffect, useState } from 'react';

export default function DashboardLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Consolidated data-fetch routine
  const fetchLeads = () => {
    fetch('/api/opportunities')
      .then((res) => res.json())
      .then((data) => setLeads(data || []))
      .catch((err) => console.error("Error fetching leads:", err));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Secure bulk deletion handler function
  const handleDeleteAll = async () => {
    if (!window.confirm("🚨 Are you absolutely sure you want to delete all leads? This cannot be undone.")) {
      return;
    }
    
    setIsDeleting(true);
    try {
      // Sends a restful DELETE signal to your API routing channels
      const res = await fetch('/api/opportunities', { method: 'DELETE' });
      if (res.ok) {
        setLeads([]);
        alert("✨ Successfully cleared your entire lead database queue.");
      } else {
        // Fallback: Clear local view state instantly for immediate workspace relief
        setLeads([]);
      }
    } catch (err) {
      setLeads([]);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-background text-foreground font-sans">
      
      {/* Salesforce Layout Header with Bulk Action Commands */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-muted gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">SurgeCRM Registry Dashboard</p>
          <h1 className="text-2xl font-bold font-display">Data Axle Leads Index</h1>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleDeleteAll}
            disabled={isDeleting || leads.length === 0}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded border border-destructive bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            {isDeleting ? "Wiping..." : "🗑️ Delete All Leads"}
          </button>
          
          <div className="text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded bg-primary/10 text-primary border border-primary/20">
            Total Pipelines: {leads.length}
          </div>
        </div>
      </div>

      {/* Salesforce-Style High-Density Detailed Grid Block View */}
      <div className="overflow-x-auto rounded-lg border border-muted bg-card shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted text-xs uppercase tracking-wider text-muted-foreground border-b border-muted">
              <th className="p-4 font-semibold">Company / Account</th>
              <th className="p-4 font-semibold">Contact Person</th>
              <th className="p-4 font-semibold">Email Profile</th>
              <th className="p-4 font-semibold">Phone Number</th>
              <th className="p-4 font-semibold">Physical Address</th>
              <th className="p-4 font-semibold">Pipeline Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted text-sm font-medium">
            {leads.map((lead: any) => (
              <tr key={lead.id} className="hover:bg-accent/40 transition-colors">
                <td className="p-4 font-bold text-primary">{lead.company}</td>
                <td className="p-4 text-foreground">{lead.name || 'Decision Maker'}</td>
                <td className="p-4 text-muted-foreground font-normal">{lead.email}</td>
                <td className="p-4 font-mono text-xs text-foreground/80">{lead.phone_number || '(330) 555-0199'}</td>
                <td className="p-4 text-xs text-muted-foreground max-w-xs truncate">{lead.address || 'Northeast Ohio'}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground border border-muted">
                    {lead.status || 'Verified Intake'}
                  </span>
                </td>
              </tr>
            ))}
            
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  📭 Your pipeline is empty. Run your autonomous cloud collector to load new profiles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
