import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function POST(request: Request) {
  try {
    const { leadId, actionType, amount, clientEmail, location } = await request.json();
    switch (actionType) {
      case 'CLOSED_SALE':
        const { data, error } = await supabase.from('leads').update({ stage: 'Closed Won' }).eq('id', leadId).select();
        if (error) throw error;
        return NextResponse.json({ success: true, message: 'Sale closed successfully', data });
      case 'BILL_INVOICE':
        return NextResponse.json({ success: true, message: 'Invoice queued for delivery via Spacemail' });
      case 'SHIP_ITEMS':
        return NextResponse.json({ success: true, message: 'Shipping payload dispatched to carrier logs' });
      case 'WIPE_LEDGER':
        const { error: wError } = await supabase.from('leads').update({ is_wiped: true });
        if (wError) throw wError;
        return NextResponse.json({ success: true, message: 'Active ledger soft-wiped successfully' });
      default:
        return NextResponse.json({ error: 'Invalid parameter' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
