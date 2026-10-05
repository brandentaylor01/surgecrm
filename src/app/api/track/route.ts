import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || '';
  const tenantId = searchParams.get('tenant') || '';

  if (email && tenantId) {
    console.log(`🔥 [ALERT] Prospect Open Log Recieved: ${email} inside Tenant workspace: ${tenantId}`);
    try {
      await supabase
        .from('leads')
        .update({ status: 'Hot', health: 'Excellent' })
        .eq('email', email.toLowerCase())
        .eq('tenant_id', tenantId);
    } catch (err) {
      console.error('Database telemetry failure:', err);
    }
  }

  const transparentGif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  return new NextResponse(transparentGif, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
