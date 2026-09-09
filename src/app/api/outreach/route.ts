export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const isCron = searchParams.get('cron');

  if (!isCron) {
    return NextResponse.json({ error: 'Unauthorized request node' }, { status: 401 });
  }

  return new Promise<NextResponse>((resolve) => {
    const scriptPath = path.join(process.cwd(), 'agent_workflow.py');
    
    exec(`python3 ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Cron operational error: ${error.message}`);
        resolve(NextResponse.json({ status: 'Error processing automated outreach pipeline' }, { status: 500 }));
        return;
      }
      console.log(`Cron execution trace:\n${stdout}`);
      resolve(NextResponse.json({ status: 'Campaign outreach batch deployed successfully', executed: true }));
    });
  });
}
