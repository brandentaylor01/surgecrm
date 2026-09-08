import React from 'react';
import SalesforceLayout from '../../components/SalesforceLayout';
import SalesforceWorkspace from '../../components/SalesforceWorkspace';

export default async function OpportunitiesPage() {
  return (
    <SalesforceLayout>
      <div className="p-3 font-mono text-xs bg-[#09090b] min-h-screen">
        <h2 className="text-[#10b981] font-bold text-sm mb-4 p-3">📊 SALESFORCE REVENUE TRACKER</h2>
        <SalesforceWorkspace initialLeads={[]} />
      </div>
    </SalesforceLayout>
  );
}
