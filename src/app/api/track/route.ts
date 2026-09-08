import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const SUPABASE_URL = "https://supabase.co";
const SUPABASE_KEY = "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL";

// Setup secure email transport bridge using your Spacemail credentials
const emailTransport = nodemailer.createTransport({
  host: "://spacemail.com",
  port: 465,
  secure: true,
  auth: {
    user: "branden@hirerainmakers.com",
    pass: "Teamrain365!"
  }
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const action = searchParams.get('action');

  if (!email) return NextResponse.json({ error: 'Missing target parameters' }, { status: 400 });

  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  };

  // 1. HANDOFF UNSUBSCRIBE REQUESTS
  if (action === 'unsubscribe') {
    try {
      await fetch(`${SUPABASE_URL}?email=eq.${encodeURIComponent(email)}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ unsubscribed: true, status: 'Bypassed / Unsubscribed' })
      });
      return new NextResponse('<h1>Removed successfully.</h1>', { headers: { 'Content-Type': 'text/html' } });
    } catch (err) {
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }
  }

  // 2. TRIGGER TRACKING INTERACTION ROW EVENT
  try {
    // Read previous status metrics to pull company names dynamically if available
    const leadCheck = await fetch(`${SUPABASE_URL}?email=eq.${encodeURIComponent(email)}`, { method: 'GET', headers: headers });
    const leadData = await leadCheck.json();
    const companyName = leadData?.[0]?.company || "Target Prospect Entity";

    // Update database activity track matrix
    await fetch(`${SUPABASE_URL}?email=eq.${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify({ status: 'Opened / Reviewing Pitch' })
    });

    // 3. AUTOMATICALLY NOTIFY YOUR INBOX INSTANTLY VIA SPACEMAIL
    await emailTransport.sendMail({
      from: "branden@hirerainmakers.com",
      to: "branden@hirerainmakers.com",
      subject: `⚡ EMAIL OPENED: ${companyName}`,
      html: `
        <div style="font-family:monospace;background:#09090b;color:#f4f4f5;padding:20px;border:1px solid #27272a;max-width:500px;">
          <h2 style="color:#10b981;margin-top:0;font-size:16px;">🔥 LIVE ENGAGEMENT DETECTED</h2>
          <hr style="border:0;border-top:1px solid #27272a;margin:15px 0;" />
          <p><strong>Account Entity:</strong> ${companyName}</p>
          <p><strong>Contact Email:</strong> ${email.toLowerCase()}</p>
          <p><strong>Action Track:</strong> Viewed Outbound Pitch HTML Frame</p>
          <hr style="border:0;border-top:1px solid #27272a;margin:15px 0;" />
          <p style="font-size:11px;color:#555;margin-bottom:0;">SurgeCRM Cloud Workspace Notification Node</p>
        </div>
      `
    });
  } catch (err) {
    console.error("Vercel internal pipeline bypass:", err);
  }

  // Return base64 1x1 tracking pixel buffer cleanly to client
  const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  return new NextResponse(pixel, { headers: { 'Content-Type': 'image/gif' } });
}
