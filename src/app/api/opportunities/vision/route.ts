import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simulated internal database reference payload map
    const databaseTask = Promise.resolve([
      { id: 1, companyAccount: "Mock Corp", initialContact: "Branden", city: "Akron", address: "Main St", email: "b@test.com", phone: "N/A", status: "Verified", clientWorkspace: "Active", notes: "None", proposals: [] }
    ]);

    // FIXED: Properly await the promise execution context before processing length properties
    const activeLedgerRows = await databaseTask;
    
    return NextResponse.json({ 
      activeCount: activeLedgerRows.length, 
      status: "Operational" 
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal compilation failure" }, { status: 500 });
  }
}
