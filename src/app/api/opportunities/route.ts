import { NextResponse } from 'next/server';
import { database } from '../../../mockDb';

export async function GET() {
  try {
    const leads = database.getLeads();
    return NextResponse.json(leads, { status: 200 });
  } catch (error) {
    console.error("Database query exception:", error);
    return NextResponse.json({ error: "Internal Database Exception" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyAccount, initialContact, city, address, email, phone, notes, clientWorkspace } = body;

    if (!companyAccount || companyAccount.trim() === "") {
      return NextResponse.json({ error: "Missing required property: companyAccount" }, { status: 400 });
    }
    if (!clientWorkspace) {
      return NextResponse.json({ error: "Missing identity tenant boundary mapping" }, { status: 400 });
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
    console.error("Failed to persist payload object structure:", error);
    return NextResponse.json({ error: "Pipeline processing failure" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, field, value } = await request.json();
    const updated = database.updateLead(id, field, value);

    if (updated) {
      return NextResponse.json({ success: true, updated }, { status: 200 });
    }
    return NextResponse.json({ error: "No corresponding workspace parameters discovered" }, { status: 404 });
  } catch (error) {
    console.error("Transactional transformation breakdown:", error);
    return NextResponse.json({ error: "Mutation failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const deleted = database.deleteLead(id);

    if (deleted) {
      return NextResponse.json({ success: true }, { status: 200 });
    }
    return NextResponse.json({ error: "Record to delete not found" }, { status: 404 });
  } catch (error) {
    console.error("Deletion interface failure:", error);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}
