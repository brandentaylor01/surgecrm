"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Terminal, Shield, BarChart3, Compass, Settings, Bell, CircleDot } from 'lucide-react';

export default function SalesforceLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('Leads');
  const navItems = [
    { name: 'Cockpit', icon: Compass },
    { name: 'Leads', icon: Terminal },
    { name: 'Metrics', icon: BarChart3 },
    { name: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen text-slate-800 font-sans antialiased relative overflow-x-hidden selection:bg-blue-500/10 text-sm">
      {/* Light and Airy Background Decor */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-indigo-300/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Frosted Translucent Header */}
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-slate-200/80 h-14 px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-black text-white shadow-md shadow-blue-500/10">
              ⚡
            </div>
            <span className="font-mono font-black tracking-widest text-[11px] text-slate-900">SURGE.MATRIX</span>
          </Link>
          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />
          <span className="text-[10px] font-mono text-slate-400 tracking-wider font-bold hidden sm:inline-block">LOBS CORE DECK</span>
        </div>

        {/* Low Profile Controls */}
        <div className="flex items-center space-x-3 text-slate-500 font-medium">
          <div className="flex items-center space-x-1.5 px-2.5 py-0.5 bg-blue-50 border border-blue-100 rounded-md text-[9px] font-mono text-blue-600 font-bold uppercase tracking-wider shadow-2xs">
            <CircleDot size={10} className="text-blue-500" /> Active Registry
          </div>
          <button className="p-1.5 hover:text-slate-900 transition-colors"><Bell size={14} /></button>
          <button className="p-1.5 hover:text-slate-900 transition-colors"><Settings size={14} /></button>
          <div className="w-6 h-6 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700 font-mono flex items-center justify-center shadow-2xs">BT</div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Minimalist Left Navigation Navigation Deck */}
        <aside className="w-48 bg-white/40 border-r border-slate-200/60 p-4 hidden md:block backdrop-blur-xs">
          <div className="text-[9px] font-bold text-slate-400 tracking-widest uppercase mb-4 px-2">Navigation Matrix</div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-mono font-bold tracking-wide transition-all text-left border ${
                    isActive 
                      ? 'bg-white border-slate-200 text-blue-600 shadow-2xs' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/40 border-transparent'
                  }`}
                >
                  <Icon size={13} className={isActive ? "text-blue-500" : "text-slate-400"} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6 max-w-[1500px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
