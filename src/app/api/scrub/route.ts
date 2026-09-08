import { NextResponse } from 'next/server';

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

    // Scrapes, filters and formats incoming raw target rows cleanly
    const refinedDataRows = rawLeadsList
      .filter(item => {
        const title = item.company_name || item.account_name || '';
        return !title.toLowerCase().includes('placeholder') && !title.includes('#');
      })
      .map(item => ({
        account_name: formatTextString(item.company_name || item.account_name),
        contact_name: formatTextString(item.executive_contact || item.contact_name),
        contact_email: (item.email_address || item.contact_email || 'n/a').trim().toLowerCase(),
        phone_number: formatPhoneLayout(item.phone || item.phone_number || ''),
        location_details: item.address || item.location_details || 'N/A',
        financial_matrix: parseFloat(item.revenue || item.financial_matrix) || 0.00,
        stage: 'Verified Intake'
      }));

    return NextResponse.json({ success: true, count: refinedDataRows.length, scrubbedLeads: refinedDataRows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
