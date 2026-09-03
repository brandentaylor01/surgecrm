'use client';
import React, { useState } from 'react';
import { Folder, FileCode, Search, Terminal, Eye } from 'lucide-react';

export default function FileInspectorDashboard() {
  const [selectedFile, setSelectedFile] = useState('src/app/page.tsx');
  const [searchQuery, setSearchQuery] = useState('');

  const projectFiles = {
    'Root Configuration': [
      { path: 'package.json', type: 'json', desc: 'Project dependency manifests & build parameters' },
      { path: 'next.config.ts', type: 'typescript', desc: 'Next.js core compiler rules' },
      { path: 'tailwind.config.js', type: 'javascript', desc: 'Tailwind style content path configuration mappings' },
    ],
    'Next.js Core Views (App Engine)': [
      { path: 'src/app/page.tsx', type: 'typescript', desc: 'Main root path landing entry point framework' },
      { path: 'src/app/layout.tsx', type: 'typescript', desc: 'Global theme template wrappers and fonts' },
    ],
    'CRM Components & Data Layers': [
      { path: 'src/mockDb.js', type: 'javascript', desc: 'Salesforce-style client pipeline dataset arrays' },
      { path: 'src/components/SalesforceWorkspace.tsx', type: 'typescript', desc: 'Modular grid render templates' }
    ]
  };

  const fileContents: Record<string, string> = {
    'package.json': `{
  "name": "surgecrm",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "react": "^19.0.0",
    "next": "16.3.3",
    "lucide-react": "^0.400.0",
    "tailwindcss": "^4.0.0"
  }
}`,
    'next.config.ts': `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {}
    }
  }
};

export default nextConfig;`,
    'src/mockDb.js': `export const INITIAL_LEADS = [
  { id: 'l1', name: 'Acme Corp Deal', company: 'Acme Corp', value: 45000, stage: 'Prospecting' },
  { id: 'l2', name: 'Initech License', company: 'Initech LLC', value: 12000, stage: 'Qualification' },
  { id: 'l3', name: 'Umbrella Retainer', company: 'Umbrella Corp', value: 85000, stage: 'Proposal' }
];

export const CRM_STAGES = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation'];`,
    'src/app/page.tsx': `// Full Source Code Inspector Module Loaded Successfully. Viewing real-time application matrix layout components.`,
  };

  const getActiveCode = () => {
    return fileContents[selectedFile] || `// Code Viewport Stream\n// Content loading for file target location: ${selectedFile}`;
  };

  return (
    <div className="min-h-screen bg-[#070511] p-6 md:p-10 flex flex-col justify-start text-white font-sans">
      <div className="max-w-7xl mx-auto w-full flex flex-col space-y-8 bg-[#0e0b1a]/80 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md">
        
        {/* TOP STATUS CONTROL BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs font-bold tracking-wider text-purple-400 uppercase mb-2 w-fit">
              <Terminal className="w-3.5 h-3.5 inline mr-1" /> Repository Cockpit
            </div>
            <h1 className="text-3xl font-black tracking-tight">SOURCE CODE INSPECTOR</h1>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-3 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Filter file registry..." 
              className="w-full pl-11 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* WORKSPACE LAYOUT PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN: FILE REGISTRY MAP */}
          <div className="lg:col-span-5 bg-black/30 border border-white/5 rounded-2xl p-4 flex flex-col space-y-6">
            <div className="text-sm font-bold tracking-wider text-gray-400 uppercase flex items-center gap-2">
              <Folder className="w-4 h-4 text-yellow-500" /> System File Hierarchy
            </div>
            
            <div className="space-y-6 overflow-y-auto max-h-[500px] pr-2">
              {Object.entries(projectFiles).map(([category, files]) => {
                const visibleFiles = files.filter(f => f.path.toLowerCase().includes(searchQuery.toLowerCase()));
                if (visibleFiles.length === 0) return null;

                return (
                  <div key={category} className="space-y-2">
                    <div className="text-xs font-extrabold text-purple-400 uppercase tracking-widest pl-1">
                      {category}
                    </div>
                    <div className="space-y-1.5">
                      {visibleFiles.map(file => (
                        <button
                          key={file.path}
                          onClick={() => setSelectedFile(file.path)}
                          className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-1 group ${selectedFile === file.path ? 'bg-purple-500/10 border-purple-500/40 text-white shadow-lg' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white'}`}
                        >
                          <FileCode className={`w-4 h-4 mr-3 mt-0.5 flex-shrink-0 ${selectedFile === file.path ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                          <div>
                            <div className="font-mono text-xs font-bold tracking-wide break-all">{file.path}</div>
                            <div className="text-[11px] text-gray-500 mt-0.5 group-hover:text-gray-400 line-clamp-1">{file.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE CODE VIEWPORT */}
          <div className="lg:col-span-7 bg-[#0b0914] border border-white/10 rounded-2xl flex flex-col shadow-inner overflow-hidden min-h-[500px]">
            <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex justify-between items-center bg-gradient-to-r from-white/5 to-transparent">
              <div className="flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-500/5 px-3 py-1 rounded-md border border-purple-500/20">
                <Eye className="w-3.5 h-3.5" /> Inspecting: {selectedFile}
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
            </div>
            <div className="p-4 flex-1 font-mono text-xs text-gray-300 overflow-auto max-h-[450px] whitespace-pre-wrap bg-black/20">
              {getActiveCode()}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
