import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '://gmail.com', // Fixed syntax fallback string
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, 
  auth: {
    user: process.env.SMTP_USER || 'branden@hirerainmakers.com',
    pass: process.env.SMTP_PASS || ''
  }
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const targetLeads = body.leads || [];

    if (targetLeads.length === 0) {
      return NextResponse.json({ success: false, message: 'No target leads provided for transmission arrays.' }, { status: 400 });
    }

    const dispatchSummary: string[] = [];

    for (let lead of targetLeads) {
      const emailSubject = `Outsourced sales operations for ${lead.name || lead.companyName}`;
      const emailBody = `Hi there,\n\nI was looking over some prominent businesses and came across ${lead.name || lead.companyName}.\n\nWe run a sales agency called Rainmaker Sales LLC (hirerainmakers.com). Companies hire our team to completely take over and run their entire sales operations.\n\nAre you open to a brief chat this week to see how we can handle your pipeline generation?\n\nBest,\nBranden Taylor\nRainmaker Sales LLC`;

      try {
        await transporter.sendMail({
          from: `"Branden Taylor" <branden@hirerainmakers.com>`,
          replyTo: 'branden@hirerainmakers.com',
          to: lead.email,
          subject: emailSubject,
          text: emailBody
        });
        dispatchSummary.push(`[SUCCESS] Email sent cleanly to ${lead.email}`);
      } catch (err: any) {
        dispatchSummary.push(`[FAILURE] Email dropped for ${lead.email}: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Outbound communication sweep processing run complete.",
      summary: dispatchSummary
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
