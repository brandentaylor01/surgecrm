import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'leads.json');
    if (!fs.existsSync(filePath)) return NextResponse.json([]);
    const data = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data || '[]'));
  } catch (err) {
    return NextResponse.json({ error: "Read failure" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filePath = path.join(process.cwd(), 'leads.json');
    let currentLeads = [];
    if (fs.existsSync(filePath)) {
      currentLeads = JSON.parse(fs.readFileSync(filePath, 'utf-8') || '[]');
    }
    currentLeads.push(body);
    fs.writeFileSync(filePath, JSON.stringify(currentLeads, null, 2));
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Write error" }, { status: 400 });
  }
}

export async function DELETE() {
  try {
    const filePath = path.join(process.cwd(), 'leads.json');
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    return NextResponse.json({ message: "Wiped successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Wipe error" }, { status: 500 });
  }
}
