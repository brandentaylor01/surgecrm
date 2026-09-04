import { NextResponse } from 'next/server';
import { database } from '../../../../mockDb';

export async function POST(request: Request) {
  try {
    const leads = database.getLeads();
    return NextResponse.json({ success: true, count: leads.length });
  } catch (error) {
    console.error("Vision error:", error);
    return NextResponse.json({ error: "Vision processing failure" }, { status: 500 });
  }
}
