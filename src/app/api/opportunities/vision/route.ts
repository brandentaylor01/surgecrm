import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getLeads } from '../../../../mockDb';

const fp = path.join(process.cwd(), 'leads.json');

export async function POST(r: Request) {
  try {
    const formData = await r.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No asset transferred' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const mockExtractedCompanyName = `${file.name.toUpperCase().split('.')[0] || 'Captured Account'} Corp`;
    const mockExtractedCity = "Cleveland";
    const mockExtractedContact = "Operational Lead";

    const newOpportunity = {
      id: `opp_${Date.now()}`,
      company: mockExtractedCompanyName,
      city: mockExtractedCity,
      contact: mockExtractedContact,
      status: 'qualifying',
      clientKey: 'rainmaker',
      value: 2560,
      qty1: 40,
      qty2: 0
    };

    const databaseCollection = getLeads();
    databaseCollection.unshift(newOpportunity);
    fs.writeFileSync(fp, JSON.stringify(databaseCollection, null, 2));

    return NextResponse.json({ success: true, lead: newOpportunity });
  } catch {
    return NextResponse.json({ error: 'Vision system error' }, { status: 500 });
  }
}
