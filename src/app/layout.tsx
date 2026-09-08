import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SurgeCRM Workbench',
  description: 'Enterprise Outbound Agency Automation Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-emerald-500/30 selection:text-emerald-400">
        <div className="relative min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
