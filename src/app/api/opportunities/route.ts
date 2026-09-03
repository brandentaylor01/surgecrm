import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getLeads } from '../../../mockDb';

const fp = path.join(process.cwd(), 'leads.json');

export async function GET() { 
  return NextResponse.json(getLeads()); 
}

export async function POST(r: Request) {
  try {
    const b = await r.json();
    const processedValue = Number(b.value) || 0;
    const initialQty1 = Number(b.qty1) || 0;
    const initialQty2 = Number(b.qty2) || 0;

    const nl = { 
      id: `opp_${Date.now()}`, 
      company: b.company, 
      value: processedValue,
      status: b.status || 'qualifying',
      clientKey: b.clientKey || 'rainmaker',
      qty1: initialQty1,
      qty2: initialQty2,
      city: b.city || '',
      contact: b.contact || ''
    };

    const ls = getLeads();
    ls.unshift(nl);
    fs.writeFileSync(fp, JSON.stringify(ls, null, 2));
    return NextResponse.json({ success: true, lead: nl });
  } catch { 
    return NextResponse.json({ error: 'Failed payload assembly' }, { status: 500 }); 
  }
}

export async function PATCH(r: Request) {
  try {
    const b = await r.json();
    const { id, field, value } = b;
    
    if (!id || !field) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const ls = getLeads();
    const updated = ls.map((l: any) => {
      if (l.id === id) {
        const processedValue = (field === 'value' || field === 'qty1' || field === 'qty2') 
          ? Number(value) 
          : value;
        return { ...l, [field]: processedValue };
      }
      return l;
    });

    fs.writeFileSync(fp, JSON.stringify(updated, null, 2));
    return NextResponse.json({ success: true });
  } catch { 
    return NextResponse.json({ error: 'Failed' }, { status: 500 }); 
  }
}

export async function DELETE(r: Request) {
  try {
    const { searchParams } = new URL(r.url);
    const id = searchParams.get('id');
    const ls = getLeads();
    const filtered = ls.filter((l: any) => l.id !== id);
    fs.writeFileSync(fp, JSON.stringify(filtered, null, 2));
    return NextResponse.json({ success: true });
  } catch { 
    return NextResponse.json({ error: 'Failed' }, { status: 500 }); 
  }
}
