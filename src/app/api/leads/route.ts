import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'leads.json');

// In-memory data store fallback for Vercel production
let memoryLeads = [
  {
    "id": "lead_1",
    "company": "Buckeye Roofing Group",
    "city": "Columbus",
    "niche": "Roofing Services",
    "email": "contact@buckeyeroofingcolumbus.com",
    "status": "New",
    "value": 15000,
    "assignedClientId": "client_1"
  },
  {
    "id": "lead_2",
    "company": "Apex Marketing Experts",
    "city": "Cleveland",
    "niche": "Marketing Services",
    "email": "contact@apexmarketingcleveland.com",
    "status": "Working",
    "value": 8500,
    "assignedClientId": "client_1"
  },
  {
    "id": "lead_3",
    "company": "Midwest Logistics Hub",
    "city": "Dayton",
    "niche": "Logistics 3PL Services",
    "email": "info@midwestlogisticsdayton.com",
    "status": "Closed",
    "value": 32000,
    "assignedClientId": "client_1"
  }
];

export async function GET() {
  try {
    // Try local file system first (works on your Mac)
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return NextResponse.json(JSON.parse(data || '[]'));
    }
  } catch (e) {
    // Catch read errors silently on production environments
  }
  // Return memory baseline if file access fails or is blocked on Vercel
  return NextResponse.json(memoryLeads);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company, city, niche, email, status, value, assignedClientId } = body;

    const newLead = {
      id: `lead_${Date.now()}`,
      company: company || 'Unnamed Corporation',
      city: city || 'Unknown',
      niche: niche || 'General',
      email: email || '',
      status: status || 'New',
      value: Number(value) || 0,
      assignedClientId: assignedClientId || 'client_1'
    };

    // Attempt file-based tracking locally
    try {
      let currentLeads = [];
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        currentLeads = JSON.parse(data || '[]');
      }
      currentLeads.push(newLead);
      fs.writeFileSync(filePath, JSON.stringify(currentLeads, null, 2), 'utf8');
      return NextResponse.json({ success: true, lead: newLead });
    } catch (fsError) {
      // Fallback: update in-memory variable on cloud serverless environment
      memoryLeads.push(newLead);
      return NextResponse.json({ success: true, lead: newLead });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process lead request' }, { status: 500 });
  }
}
