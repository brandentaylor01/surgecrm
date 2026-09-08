import React from 'react';
import SalesforceLayout from '../../../components/SalesforceLayout';
import SalesforceWorkspace from '../../../components/SalesforceWorkspace';

export const revalidate = 0;

export default async function LeadsDashboardPage() {
  // FIXED: Hardcoded high-density mock data vector to immediately preview the sleek UI
  const mockPremiumLeads = [
    {
      id: "1",
      company: "Apex Luxury Ventures LLC",
      name: "Marcus Sterling",
      email: "m.sterling@apexluxury.com",
      phone: "216-555-0182",
      address: "Tower City Center, Cleveland, OH",
      value: 15000,
      status: "In Negotiation",
      priority: "High"
    },
    {
      id: "2",
      company: "Summit Capital Group",
      name: "Helena Vance",
      email: "vance@summitcap.io",
      phone: "330-555-0143",
      address: "S Main St, Akron, OH",
      value: 8500,
      status: "Verified Intake",
      priority: "High"
    },
    {
      id: "3",
      company: "Ohio Storm Logistical Systems",
      name: "Darian Vance",
      email: "darian@ohiostorm.com",
      phone: "614-555-0199",
      address: "N High St, Columbus, OH",
      value: 24000,
      status: "ALERT: 21 Drops Executed",
      priority: "High"
    }
  ];

  return (
    <SalesforceLayout>
      <div className="flex flex-col flex-1 bg-[#0d0d0e] min-h-screen">
        <header className="border-b border-[#1f1f23] bg-[#131316] p-6 flex justify-between items-center font-mono text-[10px] tracking-wider uppercase text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
            <span className="text-zinc-200 font-light">Lead Datacenter Ledger</span>
          </div>
          <div>Operator // Branden Taylor</div>
        </header>

        <main className="flex-1 flex flex-col">
          <SalesforceWorkspace initialLeads={mockPremiumLeads} />
        </main>
      </div>
    </SalesforceLayout>
  );
}
