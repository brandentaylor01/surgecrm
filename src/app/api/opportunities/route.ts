import { NextResponse } from 'next/server';

let mockDbLeads: any[] = [];

export async function GET() {
  try {
    return NextResponse.json(mockDbLeads, { status: 200 });
  } catch (error) {
    console.error("Database query exception:", error);
    return NextResponse.json({ error: "Internal Database Exception" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyAccount, initialContact, city, address, email, phone } = body;

    if (!companyAccount || companyAccount.trim() === "") {
      return NextResponse.json(
        { error: "Entity Constraint Error: Missing structural required parameter 'companyAccount'" }, 
        { status: 400 }
      );
    }

    const newOpportunity = {
      id: `opp_${Date.now()}`,
      companyAccount: companyAccount.trim(),
      initialContact: initialContact || "",
      city: city || "",
      address: address || "",
      email: email || "",
      phone: phone || "",
      status: "qualifying"
    };

    mockDbLeads.push(newOpportunity);
    return NextResponse.json(newOpportunity, { status: 201 });

  } catch (error) {
    console.error("Pipeline processing failure:", error);
    return NextResponse.json({ error: "Pipeline processing failure" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, field, value } = await request.json();
    const match = mockDbLeads.find(o => o.id === id);
    
    if (match) {
      match[field] = value;
      return NextResponse.json({ success: true, updated: match }, { status: 200 });
    }
    return NextResponse.json({ error: "Record not matched" }, { status: 404 });
  } catch (error) {
    console.error("Mutation failed:", error);
    return NextResponse.json({ error: "Mutation failed" }, { status: 500 });
  }
}
