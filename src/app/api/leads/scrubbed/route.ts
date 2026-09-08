import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Structural data snapshot representing freshly scrubbed leads from Data Axle
    const scrubbedLeads = [
      { id: 'scrub_01', company: 'Ohio Forklift & Material Experts', industry: 'Material Handling', contacts_found: 3, matrix_value: 30000, scrubbed_at: '2026-09-08' },
      { id: 'scrub_02', company: 'Midwest Shipping Containers Co', industry: 'Packaging Machinery', contacts_found: 2, matrix_value: 12500, scrubbed_at: '2026-09-08' },
      { id: 'scrub_03', company: 'Buckeye Industrial Security Corp', industry: 'Commercial Security', contacts_found: 5, matrix_value: 45000, scrubbed_at: '2026-09-07' }
    ];

    return NextResponse.json({ success: true, leads: scrubbedLeads });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
