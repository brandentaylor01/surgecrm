'use client';
import { useEffect, useState } from 'react';

export default function LeadScrubberWorkbench() {
  const [leads, setLeads] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState(new Set());

  const loadData = () => {
    fetch('/api/opportunities')
      .then((res) => res.json())
      .then((data) => setLeads(data || []));
  };

  useEffect(() => { loadData(); }, []);

  const toggleSelect = (email: string) => {
    const next = new Set(selectedEmails);
    if (next.has(email)) next.delete(email) ; else next.add(email);
    setSelectedEmails(next);
  };

  return (
    <div className="p-4 min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-200">Data Axle High-Density Scrubbing Grid</h1>
          <p className="text-xs text-slate-400">Real-time Ohio records paired with autonomous background social checks</p>
        </div>
        <div className="text-xs font-mono bg-slate-900 border border-slate-800 px-4 py-2 rounded">
          Staged Count: {leads.length}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/40">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
              <th className="p-3 w-10">Select</th>
              <th className="p-3">Company / Account</th>
              <th className="p-3">Contact Person</th>
              <th className="p-3">Email Address</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Size (Emp / Rev)</th>
              <th className="p-3">Industry Line</th>
              <th className="p-3">Social Footprint</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {leads.map((lead: any) => (
              <tr key={lead.email} className="hover:bg-slate-900/60 transition-colors">
                <td className="p-3 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedEmails.has(lead.email)} 
                    onChange={() => toggleSelect(lead.email)}
                    className="rounded bg-slate-950 border-slate-700 text-emerald-500 cursor-pointer"
                  />
                </td>
                <td className="p-3 font-bold text-emerald-400">{lead.company}</td>
                <td className="p-3 font-semibold">{lead.name}</td>
                <td className="p-3 text-slate-300 font-mono">{lead.email}</td>
                <td className="p-3 text-slate-300 font-mono">{lead.phone_number}</td>
                <td className="p-3 text-slate-400">
                  {lead.employee_size} Crew / {lead.revenue}
                </td>
                <td className="p-3 text-slate-400 italic max-w-xs truncate">{lead.industry}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    {lead.linkedin && <a href={lead.linkedin} target="_blank" className="text-blue-400 font-bold hover:underline">LN</a>}
                    {lead.facebook && <a href={lead.facebook} target="_blank" className="text-blue-500 font-bold hover:underline">FB</a>}
                    {lead.twitter && <a href={lead.twitter} target="_blank" className="text-slate-400 font-bold hover:underline">X</a>}
                    {!lead.linkedin && !lead.facebook && !lead.twitter && <span className="text-slate-600">None found</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
