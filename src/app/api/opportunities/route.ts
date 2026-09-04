import { NextResponse } from 'next/server';
import { database } from '../../../mockDb';

export async function GET() {
  try {
    return NextResponse.json(database.getLeads(), { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal DB Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyAccount, initialContact, city, address, email, phone, notes, clientWorkspace } = body;
    if (!companyAccount || !clientWorkspace) {
      return NextResponse.json({ error: "Missing Parameters" }, { status: 400 });
    }
    const newRecord = {
      id: `opp_${Date.now()}`,
      companyAccount: companyAccount.trim(),
      initialContact: initialContact || "",
      city: city || "",
      address: address || "",
      email: email || "",
      phone: phone || "",
      notes: notes || "",
      clientWorkspace,
      status: "qualifying",
      proposals: []
    };
    database.saveLead(newRecord);
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "POST Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, field, value } = await request.json();
    const updated = database.updateLead(id, field, value);
    if (updated) return NextResponse.json({ success: true, updated }, { status: 200 });
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "PATCH Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (database.deleteLead(id)) return NextResponse.json({ success: true }, { status: 200 });
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "DELETE Error" }, { status: 500 });
  }
}
