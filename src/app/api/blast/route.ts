import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET() {
  try {
    console.log('[🌐 CRON] Waking Outbound Campaign Dispatch Core...');

    // Poll fresh leads awaiting outreach configuration
    const { data: leads, error: dbError } = await supabase
      .from('leads')
      .select('*')
      .eq('status', 'Verified Intake')
      .limit(3);

    if (dbError || !leads || leads.length === 0) {
      return NextResponse.json({ message: 'Pipeline processed, no fresh intakes pending.' });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.spaceship.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'branden@hirerainmakers.com',
        pass: process.env.SMTP_PASS || 'Teamrain365!'
      }
    });

    let successfullyDispatched = 0;

    for (const lead of leads) {
      const emailHtml = `
        <div style="font-family:sans-serif;font-size:13px;color:#111;line-height:1.6;">
          <p>Hi ${lead.name || 'Partner'},</p>
          <p>Most growth groups pass off generic spreadsheets and vanish. We think that structure is completely broken.</p>
          <p>We do the opposite—we build your outbound workflows and take real accountability for your conversion velocity.</p>
          <p>Would you be open to exploring a short, 3-sentence breakdown of our localized pipeline strategies later this week?</p>
          <p>Best,<br><br><strong>Outbound Desk Control</strong></p>
        </div>
      `;

      try {
        await transporter.sendMail({
          from: `"Outbound Desk" <${process.env.SMTP_USER || 'branden@hirerainmakers.com'}>`,
          to: lead.email,
          subject: 'operational bottleneck?',
          html: emailHtml
        });

        await supabase
          .from('leads')
          .update({ 
            status: 'In Negotiation', 
            sequences_sent: (lead.sequences_sent || 0) + 1,
            last_contacted_at: new Date().toISOString()
          })
          .eq('email', lead.email);

        successfullyDispatched++;
      } catch (mailError) {
        console.error(`⚠️ Delivery dropped for target node: ${lead.email}`, mailError);
      }
    }

    return NextResponse.json({ status: 'Success', dispatched: successfullyDispatched });
  } catch (globalError: any) {
    return NextResponse.json({ error: globalError.message }, { status: 500 });
  }
}
