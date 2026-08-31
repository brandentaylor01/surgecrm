"use client";

import React from 'react';

interface LeadRecord {
  id: string | number;
  name?: string;
  companyName?: string;
  contact?: string;
  email?: string;
  phone?: string;
  niche?: string;
  industry?: string;
  status?: string;
  crmStatus?: string;
}

interface PipelineProps {
  records: LeadRecord[];
}

export default function LeadPipelineTable({ records }: PipelineProps) {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #2d3748' }}>
            <th style={{ padding: '10px' }}>Company Name</th>
            <th style={{ padding: '10px' }}>Contact</th>
            <th style={{ padding: '10px' }}>Email Address</th>
            <th style={{ padding: '10px' }}>Phone String</th>
            <th style={{ padding: '10px' }}>Target Parameter</th>
            <th style={{ padding: '10px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#718096' }}>
                Establishing secure cloud sync framework...
              </td>
            </tr>
          ) : (
            records.map((rec) => (
              <tr key={rec.id} style={{ borderBottom: '1px solid #1a202c' }}>
                <td style={{ padding: '10px' }}>{rec.companyName || rec.name || "N/A"}</td>
                <td style={{ padding: '10px' }}>{rec.contact || "Operations Director"}</td>
                <td style={{ padding: '10px' }}>{rec.email || "N/A"}</td>
                <td style={{ padding: '10px' }}>{rec.phone || "N/A"}</td>
                <td style={{ padding: '10px' }}>{rec.niche || rec.industry || "General"}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', background: '#2d3748', fontSize: '12px' }}>
                    {rec.crmStatus || rec.status || "Indexed"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
