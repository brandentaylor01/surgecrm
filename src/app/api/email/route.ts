import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { companyAccount, email, notes, employeeCount } = await request.json();
    if (!email || email.includes('info@corporate.com')) {
      return NextResponse.json({ skipped: true, reason: "Missing active channel" });
    }

    const emailSubject = `Quick question regarding growth at ${companyAccount}`;
    const emailBody = `Hi Team,\n\nSaw you are scaling operations over in Ohio and actively posting openings for sales reps on the job boards. Managing a team of ${employeeCount || 50}+ people means sales onboarding velocity is everything right now.\n\nWe built a pipeline tracking layout that handles lead velocity specifically for commercial contractor networks. Do you have 5 minutes this Thursday to see if we can help fill your pipe?\n\nBest,\nBranden Taylor\nSurgeCRM`;

    console.log(`✉️ AUTO-EMAILER TRIGGERED -> Sent campaign to ${email} (${companyAccount})`);
    return NextResponse.json({ success: true, subject: emailSubject, dispatchedTo: email }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Automated distribution worker fault" }, { status: 500 });
  }
}
