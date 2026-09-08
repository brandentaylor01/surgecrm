import { NextResponse } from 'next/server';

const SUPABASE_URL = "https://supabase.co";
const SUPABASE_KEY = "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Dynamically extract the prospect's email from standard calendar webhook formats (Calendly/HubSpott/TidyCal)
    const inviteeEmail = payload?.invitee?.email || payload?.email || payload?.data?.email;

    if (!inviteeEmail) {
      return NextResponse.json({ error: 'No target email detected in webhook packet' }, { status: 400 });
    }

    const headers = {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json"
    };

    // SMART LOCKDOWN: Update status row to pull them out of all automated loops instantly
    const res = await fetch(`${SUPABASE_URL}?email=eq.${encodeURIComponent(inviteeEmail.toLowerCase().strip())}`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify({ 
        status: 'Appointment Scheduled',
        priority: 'High'
      })
    });

    if (!res.ok) throw new Error('Database patch rejected');

    console.log(`🔒 SAFEGUARD TRIGGERED: Locked outreach execution loops for ${inviteeEmail}`);
    return NextResponse.json({ success: true, message: 'Cadence locked successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
