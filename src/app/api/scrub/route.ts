import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface RawLeadInput {
  email?: string;
  name?: string;
  company_name?: string;
  phone?: string;
  city?: string;
  [key: string]: any;
}

// Helper: Normalize company domains down to uniform layouts
function normalizeDomain(urlStr: string): string {
  if (!urlStr) return '';
  return urlStr
    .toLowerCase()
    .trim()
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .split('/')[0];
}

export async function POST(request: Request) {
  try {
    const { leads, tenantId } = await request.json() as { leads: RawLeadInput[], tenantId: string };
    
    if (!leads || !Array.isArray(leads) || !tenantId) {
      return NextResponse.json({ error: 'Invalid payload or missing tenant workspace binding' }, { status: 400 });
    }

    console.log(`🚀 [SCRUBBER] Initializing dynamic batch scrub for Tenant: ${tenantId}. Handling ${leads.length} records...`);

    const processedEmails = new Set<string>();
    const processedComposites = new Set<string>();
    const cleanedLeads = [];

    for (const lead of leads) {
      const email = lead.email?.toLowerCase().trim() || '';
      const rawName = lead.name?.trim() || 'Business Owner';
      const company = lead.company_name?.trim() || 'Local Enterprise';
      const city = lead.city?.trim() || 'Ohio';

      // --- LAYER 1: TEXT NORMALIZATION & SYNTAX FILTERS ---
      if (!email || !email.includes('@') || email.length < 5) continue;

      // Format names to clean Title Case
      const formattedName = rawName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      const domain = email.split('@')[1] || '';

      // --- LAYER 2: STRICT COMPOSITE DEDUPLICATION ---
      const compositeKey = `${formattedName.toLowerCase()}_${domain}`;
      if (processedEmails.has(email) || processedComposites.has(compositeKey)) {
        console.log(`⏩ Dropping duplicate record node: ${email}`);
        continue;
      }
      processedEmails.add(email);
      processedComposites.add(compositeKey);

      // --- LAYER 3: MULTI-LAYER EMAIL VALIDATION SHIELDS ---
      const junkRoles = ['info@', 'support@', 'sales@', 'admin@', 'jobs@', 'careers@', 'help@', 'office@'];
      if (junkRoles.some(role => email.startsWith(role))) continue;

      const publicProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
      const isPublic = publicProviders.includes(domain);

      // --- LAYER 4: STRUCTURAL AI ENRICHMENT WATERFALL ---
      let industry = 'Commercial Trade';
      let employeeSize = 'N/A';
      let score = 50; // Starting baseline median tier metric

      if (process.env.OPENAI_API_KEY && !isPublic) {
        try {
          const aiResponse = await fetch('https://openai.com', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              response_format: { type: 'json_object' },
              messages: [{
                role: 'user',
                content: `Analyze this corporate entity: "${company}" located in "${city}, OH". Predict its industry sector and estimated employee count. Output strictly as JSON with keys exactly: "industry", "size_tier" (e.g. 1-10, 11-50, 50-200, 200+).`
              }]
            })
          });

          const aiData = await aiResponse.json();
          const parsedIntel = JSON.parse(aiData.choices[0].message.content);
          industry = parsedIntel.industry || industry;
          employeeSize = parsedIntel.size_tier || employeeSize;
        } catch (aiErr) {
          console.error('AI conversion optimization pass bypassed:', aiErr);
        }
      }

      // --- LAYER 5: ICP GRADING & LEAD SCORING ---
      if (!isPublic) score += 25; // Grants premium value weight for non-public provider business domains
      if (['50-200', '11-50'].includes(employeeSize)) score += 25; // Prioritizes mid-sized strategic sweet spots
      if (email.includes('owner') || email.includes('ceo') || email.includes('founder')) score += 10;

      cleanedLeads.append({
        tenant_id: tenantId,
        email: email,
        name: formattedName,
        company: company,
        industry: industry.toUpperCase(),
        status: score >= 75 ? 'Verified Intake' : 'Warm',
        priority: score >= 75 ? 'High' : 'Medium',
        sequences_sent: 0
      });
    }

    // --- STEP 6: BULK STREAM DIRECT TO CLOUD SUPABASE TABLES ---
    if (cleanedLeads.length > 0) {
      const { error: syncError } = await supabase
        .from('leads')
        .insert(cleanedLeads);

      if (syncError) throw syncError;
    }

    return NextResponse.json({ success: true, ingested: cleanedLeads.length });
  } catch (globalError: any) {
    return NextResponse.json({ error: globalError.message }, { status: 500 });
  }
}
