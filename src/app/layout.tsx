import React from 'react';
import './globals.css';

export const metadata = { title: 'SurgeCRM Engine', description: 'Live Automation Control Center' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
