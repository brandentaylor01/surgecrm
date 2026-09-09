export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';

const SUPABASE_URL = "https://supabase.co";
const SUPABASE_KEY = "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company, name, email, value, status, priority, city, niche } = body;

    if (!company) {
      return NextResponse.json({ error: 'Missing core tracking metric: company' }, { status: 400 });
    }

    // Direct network bridge into your live Supabase table matrix
    const res = await fetch(SUPABASE_URL, {
      method: 'POST',
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
      body: JSON.stringify({
        company: company,
        name: name || 'Founder',
        email: email || null,
        value: Number(value) || 2500,
        status: status || 'Discovered',
        priority: priority || 'High',
        city: city || null,
        niche: niche || null,
        contacted: false
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: 'Database rejected record injection', details: errText }, { status: res.status });
    }

    const insertedData = await res.json();
    return NextResponse.json({ success: true, message: 'Lead added to matrix successfully', data: insertedData });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal pipeline connection bypass', details: err.message }, { status: 500 });
  }
}
