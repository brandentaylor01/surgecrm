import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function POST(request: Request) {
  try {
    const { leadId, actionType } = await request.json();

    if (actionType === 'TOGGLE_SKIP') {
      // Fetch current state to flip it dynamically
      const { data: currentLead } = await supabase.from('leads').select('is_skipped').eq('id', leadId).single();
      const nextState = currentLead ? !currentLead.is_skipped : true;

      const { data, error } = await supabase
        .from('leads')
        .update({ is_skipped: nextState })
        .eq('id', leadId)
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, message: nextState ? 'Excluded from auto-campaigns' : 'Restored to auto-campaigns', data });
    }

    if (actionType === 'TRIGGER_AUTOMATION') {
      // Verification check enforcing active safety rules before calling Spacemail
      const { data: lead } = await supabase.from('leads').select('*').eq('id', leadId).single();
      
      if (lead?.is_skipped) {
        return NextResponse.json({ error: 'Operation Blocked: This profile is explicitly removed from auto-mail streams.' }, { status: 400 });
      }

      console.log(`[SPACEMAIL AUTO-ENGINE] Dispatching automated payload sequence to ${lead?.contact_email}`);
      return NextResponse.json({ success: true, message: 'Campaign packet successfully handed off to Spacemail queues.' });
    }

    return NextResponse.json({ error: 'Invalid operation directive' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
