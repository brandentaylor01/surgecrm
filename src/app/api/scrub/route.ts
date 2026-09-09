import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function formatTextString(text: string): string {
  if (!text) return 'N/A';
  return text.trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatPhoneLayout(phone: string): string {
  const cleanNums = phone.replace(/\D/g, '');
  if (cleanNums.length === 10) {
    return `${cleanNums.slice(0, 3)}-${cleanNums.slice(3, 6)}-${cleanNums.slice(6)}`;
  }
  return phone;
}

export async function POST(request: Request) {
  try {
    const { rawLeadsList } = await request.json();
    if (!Array.isArray(rawLeadsList)) throw new Error('Data format error');

    const refinedDataRows = rawLeadsList
      .filter(item => {
        const title = item.company_name || item.account_name || '';
        return !title.toLowerCase().includes('placeholder') && !title.includes('#');
      })
      .map(item => ({
        name: formatTextString(item.company_name || item.account_name),
        email: (item.email_address || item.contact_email || '').trim().toLowerCase(),
        contacted: false
      }))
      .filter(item => item.email && item.email.includes('@'));

    if (refinedDataRows.length > 0) {
      // Upserts the scrubbed rows straight into your live cloud table layout
      const { error } = await supabase
        .from('leads')
        .upsert(refinedDataRows, { onConflict: 'email' });

      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      count: refinedDataRows.length,
      message: 'Scrubbed rows securely pushed to database cluster.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
