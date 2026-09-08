import React from 'react';
import SalesforceLayout from '../../components/SalesforceLayout';

export default function ProjectionPage() {
  return (
    <SalesforceLayout>
      <div className="p-6 font-mono text-xs bg-[#09090b] min-h-screen text-zinc-400">
        <h2 className="text-[#10b981] font-bold text-sm mb-4">📈 REV YIELD PROJECTIONS</h2>
        <p>Quarterly forecast variables map straight to active opportunities rows inside your ledger.</p>
      </div>
    </SalesforceLayout>
  );
}
