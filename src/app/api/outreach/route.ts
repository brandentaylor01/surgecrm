import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadEmail, leadName, companyName, niche, subject, emailBody } = body;

    const smtpUser = process.env.NEXT_PUBLIC_CRM_USER || 'branden@hirerainmakers.com';
    const smtpPass = process.env.CRM_SECRET_KEY || 'Dreamteam365!';

    if (!leadEmail) {
      return NextResponse.json({ success: false, error: 'Missing recipient address parameter' }, { status: 400 });
    }

    // Set up plain type parameters natively to avoid library import mismatch traps
    const transporter = nodemailer.createTransport({
      host: 'smtp.titan.email', 
      port: 465,
      secure: true, 
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 8000
    });

    const personalizedBody = (emailBody || '')
      .replace(/{{contact}}/g, leadName || 'there')
      .replace(/{{company}}/g, companyName || 'your company')
      .replace(/{{niche}}/g, niche || 'your market');

    const personalizedSubject = (subject || '')
      .replace(/{{contact}}/g, leadName || 'there')
      .replace(/{{company}}/g, companyName || 'your company')
      .replace(/{{niche}}/g, niche || 'your market');

    const mailOptions = {
      from: `"SpaceMail System" <${smtpUser}>`,
      to: leadEmail,
      subject: personalizedSubject,
      text: personalizedBody,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[🚀 SPACEMAIL SUCCESS] Message safely routed to ${leadEmail}`);

    return NextResponse.json({ success: true, message: `Automated transmission delivered to ${leadEmail}` });
  } catch (error: any) {
    console.error('[❌ SPACEMAIL RELAY CRASH]:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
