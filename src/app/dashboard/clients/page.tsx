export default function ClientsPage() {
  return (
    <div style={{ padding: '30px', background: '#0f172a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>👤 Managed Clients Portal</h1>
      <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Overview of active corporate accounts and assigned prospecting configurations.</p>
      <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
        <h2 style={{ fontSize: '18px', color: '#38bdf8', marginBottom: '12px' }}>Active Workspace Accounts (14)</h2>
        <p style={{ color: '#cbd5e1' }}>• Rainmaker Sales LLC — Main Corporate Hub</p>
        <p style={{ color: '#cbd5e1', opacity: 0.7, fontSize: '14px', marginTop: '12px' }}>Client management logs loading securely from server context...</p>
      </div>
    </div>
  );
}
