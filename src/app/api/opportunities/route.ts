import { NextResponse } from 'next/server';
import { database } from '../../../mockDb';

export async function GET() {
  try {
    // Directly pull down the real pre-populated Supabase rows we built in the editor
    const leads = await database.getLeads();
    return NextResponse.json(leads, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Cloud database read error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyAccount, initialContact, city, address, email, phone, notes, clientWorkspace } = body;
    if (!companyAccount || !clientWorkspace) {
      return NextResponse.json({ error: "Missing required properties" }, { status: 400 });
    }
    const newRecord = {
      id: body.id || `opp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      companyAccount: companyAccount.trim(),
      initialContact: initialContact || "",
      city: city || "",
      address: address || "",
      email: email || "",
      phone: phone || "",
      notes: notes || "",
      clientWorkspace,
      status: body.status || "qualifying",
      proposals: []
    };
    await database.saveLead(newRecord);
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Save fault" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, field, value } = await request.json();
    const updated = await database.updateLead(id, field, value);
    return NextResponse.json({ success: true, updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Patch fault" }, { status: 500 });
  }
}
