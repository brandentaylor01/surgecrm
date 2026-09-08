import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get('id') || 'Unknown ID';
  const clientName = searchParams.get('client') || 'General';

  console.log(`🔔 Open Track Triggered for Lead: ${leadId}`);

  # Trigger a silent cloud alert directly to your inbox
  try {
    # Replace this webhook URL with any simple notification channel or email api
    await fetch('https://resend.com', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer re_your_free_key',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'alerts@hirerainmakers.com',
        to: 'branden@hirerainmakers.com',
        subject: `🔥 EMAIL OPENED: ${clientName} Campaign`,
        html: `<p>Good news! Lead ID <strong>${leadId}</strong> just opened your outbound email.</p>`
      })
    });
  } catch (err) {
    console.log('Notification relay skipped.');
  }

  # Return 1x1 transparent tracking pixel GIF
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
