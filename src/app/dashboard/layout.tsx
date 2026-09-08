'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Dense Salesforce-Style Navigation Tab Array
  const navTabs = [
    { name: '📊 Salesforce Rev Tracker', path: '/dashboard' },
    { name: '📥 Data Axle Intake Workbench', path: '/dashboard/leads' },
    { name: '💼 Live Opportunities', path: '/opportunities' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* High-Density Global Agency Control Header Ribbon */}
      <header className="border-b border-muted bg-card px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <span className="font-display font-bold text-lg tracking-tight">SURGECRM // Agency Console</span>
        </div>
        
        {/* Navigation Switch Tabs */}
        <nav className="flex items-center bg-muted/60 p-1 rounded-md border border-muted">
          {navTabs.map((tab) => {
            const isActive = pathname === tab.path;
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all ${
                  isActive 
                    ? 'bg-card text-primary shadow-sm border border-muted' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main Panel Content Window View */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}
