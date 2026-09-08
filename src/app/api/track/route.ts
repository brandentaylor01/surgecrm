import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get('id');
  const clientName = searchParams.get('client') || 'unknown';

  if (leadId) {
    console.log(`🔔 NOTIFICATION: Lead ${leadId} just opened your email for ${clientName}!`);
    // Here you can add code to update your Supabase 'leads' or 'opportunities' table status
  }

  # Transparent 1x1 tracking pixel GIF buffer
  const pixel = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
  );

  return new NextResponse(pixel, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  });
}
