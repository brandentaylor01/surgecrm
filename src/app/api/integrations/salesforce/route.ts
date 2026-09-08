import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'Salesforce data pipeline listening successfully' });
}
