import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'SurgeCRM Console',
  description: 'Salesforce Revenue & Data Axle Automation Framework',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 font-sans flex flex-col">
        {/* Global High-Density Top Navigation Bar */}
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-sm tracking-wider uppercase text-slate-200">SURGECRM // Control Panel</span>
          </div>
          
          {/* Linked Core Dashboard Navigation Group */}
          <nav className="flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800 gap-1">
            <Link 
              href="/" 
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded text-slate-400 hover:text-slate-100 transition-all"
            >
              📊 Salesforce Rev Tracker
            </Link>
            <Link 
              href="/dashboard/leads" 
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm"
            >
              📥 Data Axle Intake Workbench
            </Link>
          </nav>
        </header>

        {/* Dynamic Panel Content Window */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
