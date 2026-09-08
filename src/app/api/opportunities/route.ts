import { NextResponse } from 'next/server';

// Mock temporary data memory sync block (Replaces with direct database rows)
let leadsDatabase = [
  {
    id: 1,
    company: "Canton Precision Manufacturing",
    name: "Branden Taylor",
    email: "branden@hirerainmakers.com",
    phone_number: "(330) 451-2300",
    address: "1200 Market Ave N, Canton, OH 44702",
    status: "In Negotiation"
  }
];

export async function GET() {
  return NextResponse.json(leadsDatabase);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newLead = {
      id: Date.now(),
      company: body.company || "Ohio Enterprise",
      name: body.name || "Business Owner",
      email: body.email || "",
      phone_number: body.phone_number || "(330) 555-0199",
      address: body.address || "Northeast Ohio Hub",
      status: body.status || "Verified Intake"
    };
    leadsDatabase.push(newLead);
    return NextResponse.json(newLead, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to insert" }, { status: 400 });
  }
}

// THIS METHOD LOGIC PERMITS THE DELETE ALL BUTTON TO WIPE YOUR TABLES LIVE
export async function DELETE() {
  leadsDatabase = [];
  return NextResponse.json({ message: "All leads cleared successfully" });
}
