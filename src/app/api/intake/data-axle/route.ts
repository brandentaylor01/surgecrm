import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const bulkLeads = await request.json();
    return NextResponse.json({ success: true, count: Array.isArray(bulkLeads) ? bulkLeads.length : 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
