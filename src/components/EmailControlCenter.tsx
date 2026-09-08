'use client';

import React, { useState, useEffect } from 'react';

export default function EmailControlCenter() {
  const [threads, setThreads] = useState<any[]>([]);
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch('/api/email/inbox')
      .then(res => res.json())
      .then(data => { if (data.threads) setThreads(data.threads); });
  }, []);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !body) return alert('Recipient and body are required.');
    setSending(true);
    try {
      const res = await fetch('/api/email/outbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, body })
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ ' + data.message);
        setTo(''); setSubject(''); setBody('');
      } else throw new Error(data.error);
    } catch (err: any) { alert('❌ Error: ' + err.message); }
    finally { setSending(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-zinc-950 border border-zinc-800 p-6 rounded-xl my-6">
      {/* INBOX TRACKER */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">📥 Live Inbound Threads</h3>
        <div className="space-y-3">
          {threads.map(t => (
            <div key={t.id} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs">
              <div className="flex justify-between text-zinc-400 font-medium">
                <span className="text-blue-400">{t.from}</span>
                <span className="text-[10px] text-zinc-600 font-mono">Just Now</span>
              </div>
              <div className="text-zinc-200 font-bold mt-1">{t.subject}</div>
              <div className="text-zinc-500 mt-1 italic">"{t.snippet}"</div>
            </div>
          ))}
        </div>
      </div>

      {/* OUTBOX COMPOSER */}
      <div className="border-t lg:border-t-0 lg:border-l border-zinc-800 pt-6 lg:pt-0 lg:pl-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">🚀 Outbound Spacemail Composer</h3>
        <form onSubmit={handleSendEmail} className="space-y-3 text-xs">
          <input type="email" value={to} onChange={e => setTo(e.target.value)} placeholder="To: client@company.com" className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200 focus:outline-none focus:border-zinc-700 font-mono" />
          <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject line" className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200 focus:outline-none focus:border-zinc-700" />
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Type sales copy here..." rows={4} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200 focus:outline-none focus:border-zinc-700" />
          <button type="submit" disabled={sending} className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded transition duration-150 disabled:opacity-50">
            {sending ? 'Sending...' : 'Dispatch Outbound Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
