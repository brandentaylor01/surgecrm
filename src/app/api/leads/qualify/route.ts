import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const leadData = await request.json();
    
    // Insert and qualify the lead directly into the live Postgres instance
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        account_name: leadData.account_name,
        contact_name: leadData.contact_name,
        contact_email: leadData.contact_email,
        phone_number: leadData.phone_number,
        location_details: leadData.location_details,
        financial_matrix: leadData.financial_matrix,
        stage: 'Verified Intake'
      }])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Lead qualified and stored', data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
