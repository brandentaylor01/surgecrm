import { NextResponse } from 'next/server';

const SUPABASE_URL = "https://supabase.co";
const SUPABASE_KEY = "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const action = searchParams.get('action');

  if (!email) return NextResponse.json({ error: 'Missing target email parameters' }, { status: 400 });

  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  };

  // IF THE USER CLICKED UNSUBSCRIBE: Lock them out of future campaign distributions
  if (action === 'unsubscribe') {
    try {
      await fetch(`${SUPABASE_URL}?email=eq.${encodeURIComponent(email)}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ unsubscribed: true, status: 'Bypassed / Unsubscribed' })
      });
      return new NextResponse('<h1>You have been successfully removed from our outreach ledger.</h1>', {
        headers: { 'Content-Type': 'text/html' }
      });
    } catch (err) {
      return NextResponse.json({ error: 'Database update exception' }, { status: 500 });
    }
  }

  // OTHERWISE, IT IS A PIXEL OPEN: Track interaction safely
  try {
    await fetch(`${SUPABASE_URL}?email=eq.${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify({ status: 'Opened / Reviewing Pitch' })
    });
  } catch (err) {}

  // Return invisible 1x1 base64 tracking pixel buffer back to email application
  const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  return new NextResponse(pixel, { headers: { 'Content-Type': 'image/gif' } });
}
