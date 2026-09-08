'use client';

import React, { useState } from 'react';

export default function DataAxleWorkbench() {
  const [rawPayload, setRawPayload] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleBulkIngest = async () => {
    if (!rawPayload.trim()) {
      alert('Please paste a valid data string or JSON array from Data Axle first.');
      return;
    }

    setProcessing(true);
    setStatusMessage('Parsing Data Axle payload stream...');

    try {
      let parsedData;
      try {
        parsedData = JSON.parse(rawPayload);
      } catch {
        // Fallback for simple comma/newline separation if raw text is pasted
        parsedData = rawPayload.split('\n')
          .filter(line => line.trim())
          .map(line => {
            const parts = line.split(',');
            return {
              account_name: parts[0]?.trim() || 'Unknown Entity',
              contact_name: parts[1]?.trim() || 'N/A',
              contact_email: parts[2]?.trim() || 'N/A',
              financial_matrix: parseFloat(parts[3]) || 0
            };
          });
      }

      const response = await fetch('/api/intake/data-axle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Array.isArray(parsedData) ? parsedData : [parsedData])
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Ingest cycle rejected');

      setStatusMessage(`✅ Successfully ingested ${result.count} raw accounts into the Lead Datacenter.`);
      setRawPayload('');
    } catch (err: any) {
      setStatusMessage(`❌ Error: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl max-w-3xl my-6">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-200">
          Data Axle Intake Workbench
        </h2>
      </div>
      
      <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
        Drop your exported target CSV matrices or raw JSON payloads straight from Data Axle here. 
        The processing framework will extract corporate profiles, contact information, and pipeline projections automatically.
      </p>

      <textarea
        value={rawPayload}
        onChange={(e) => setRawPayload(e.target.value)}
        placeholder='[{"account_name": "Example Corp", "contact_name": "John Doe", "contact_email": "john@example.com", "financial_matrix": 25000}]'
        rows={8}
        disabled={processing}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-mono text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 disabled:opacity-50 font-mono"
      />

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handleBulkIngest}
          disabled={processing}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2 px-5 rounded-lg transition duration-200 disabled:opacity-40"
        >
          {processing ? 'Processing Intake...' : 'Populate Active Ledger'}
        </button>
        
        {statusMessage && (
          <span className="text-xs font-medium text-zinc-300 tracking-wide animate-fade-in">
            {statusMessage}
          </span>
        )}
      </div>
    </div>
  );
}
