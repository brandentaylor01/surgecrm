import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const transporter = nodemailer.createTransport({
  host: "smtp.spaceship.email",
  port: 587,
  secure: false, 
  auth: {
    user: "branden@hirerainmakers.com",
    pass: "Teamrain365!"
  },
  tls: { rejectUnauthorized: false }
});

export async function GET() {
  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('id, email, name')
      .eq('contacted', false)
      .limit(10);

    if (error) throw error;
    if (!leads || leads.length === 0) {
      return NextResponse.json({
        status: 'Done',
        message: 'All campaign pipelines processed successfully.'
      });
    }

    let successCount = 0;

    for (const lead of leads) {
      const email = lead.email?.toLowerCase().trim();
      if (!email || email.includes('embold') || email.includes('marketing') ||
          email.includes('design') || email.includes('agency')) {
        await supabase.from('leads').update({ contacted: true }).eq('id', lead.id);
        continue;
      }

      const options = {
        from: '"Branden Taylor" <branden@hirerainmakers.com>',
        to: lead.email,
        subject: 'operational bottleneck?',
        html: `<p>Hi ${lead.name || 'Valued Partner'},</p>
               <p>Most business owners I speak with in Ohio tell me they are completely fed up
               with the exhausting cycle of recruiting, training, and managing sales staff—only
               for them to underperform or leave right when the pipeline starts moving.</p>
               <p>We built Rainmaker Sales LLC as a white-label solution to solve that exact
               headache. We completely take over the hiring, training, marketing, and closing
               execution from start to finish, so you can just focus on operations.</p>
               <p>I have no idea if your team is currently dealing with workflow shortages right
               now, or if you already have a locked-in staff that hits their numbers every week.</p>
               <p>Either way, do you have 15 minutes next week to see if it makes sense to explore
               this further? If not, no worries at all.</p>`
      };

      try {
        await transporter.sendMail(options);
        await supabase
          .from('leads')
          .update({ contacted: true, contacted_at: new Date().toISOString() })
          .eq('id', lead.id);
        successCount++;
      } catch (sendError: any) {
        console.error(`Error delivering to ${lead.email}:`, sendError.message);
      }
    }

    return NextResponse.json({ status: 'Processing', batch_delivered: successCount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
