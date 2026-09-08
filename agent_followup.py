import requests, json, time, random
from datetime import datetime, timedelta
from spacemail_sender import send_spacemail

SUPABASE_URL = "https://supabase.co"
SUPABASE_KEY = "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL"

def get_followup_body(client, name, company, step, unsubscribe_link):
    """Generates localized value-driven industry insights based on the current sequence step."""
    
    if client == 'televoi':
        if step <= 5:
            headline = "Hidden line loss metric"
            text = f"We ran an analysis on communication desks around your sector. Close to 18% of call attempts drop off silently due to misconfigured carrier SIP trunks. It impacts client retention before a word is spoken."
        elif step <= 12:
            headline = "The network audio footprint"
            text = f"Standard copper networks compress call packets, leading to choppy audio. Shifting to an optimized jitter-buffered cloud workspace instantly improves client conversion metrics on outbound desks."
        else:
            headline = "SaaS overhead optimizations"
            text = f"Most providers bundle heavy seat compliance fees you don't use. We look at lean trunk routing models that clear up to 30% of standard operational budget overhead out completely."
        brand = "TELEVOI"

    elif client == 'roofing':
        if step <= 5:
            headline = "Hidden structural degradation"
            text = f"Recent high-wind weather patterns across Ohio caused unnoticeable micro-fissures in commercial roofs. Moisture pockets build beneath industrial seams long before an active ceiling leak shows inside your facility."
        elif step <= 12:
            headline = "Insurance window limitations"
            text = f"Most property groups miss out on storm coverage lines because claims aren't filed within structural timelines. A simple 10-minute visual inspection catalog protects your asset equity."
        else:
            headline = "Facility protection protocols"
            text = f"Thermal changes cause industrial roofing membranes to expand and tear at weak seams. Catching exposure early completely clears out emergency restoration and asset downtime overhead."
        brand = "AIM RESTORATION"

    else: # Default: rainmaker
        if step <= 5:
            headline = "The pipeline conversion bottleneck"
            text = f"Our internal benchmarks show that 74% of cold outreach drops off because teams push for a calendar block too quickly. Shifting to an interest-based format yields a significant lift in positive replies."
        elif step <= 12:
            headline = "Data saturation factors"
            text = f"Relying on standard generic databases means you are messaging the same profiles as your competition. Building highly isolated, custom-targeted intent sweeps gives you an clean pipeline footprint."
        else:
            headline = "Outbound team infrastructure"
            text = f"Managing internal operations carries massive overhead in software licenses, data cleaning, and ramp-up hours. Scaling with an automated, accountable data workspace gives you results without the typical drag."
        brand = "RAINMAKER"

    # Sleek, Slender Minimalist Typography Frame matching your premium card design style
    return (
        f"<div style='font-family:sans-serif;font-size:13px;color:#111;line-height:1.6;max-width:550px;'>"
        f"<p>Hi {name},</p>"
        f"<p>Following up with a brief data metric on your industry environment — <strong>{headline}</strong>.</p>"
        f"<p>{text}</p>"
        f"<p>Worth a short check to see how this impacts operations at {company} this month?</p>"
        f"<p>Best,<br><br>Branden Taylor<br><strong>{brand}</strong></p>"
        f"<br><br><hr style='border:0;border-top:1px solid #eee;' />"
        f"<p style='font-size:10px;color:#aaa;'><a href='{unsubscribe_link}' style='color:#888;'>Unsubscribe</a> from future industry insight updates.</p>"
        f"</div>"
    )

def run_automated_followup_cadence():
    print("🔄 Initializing 24/7 Smart Follow-Up Drip Matrix Engine...")
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}", "Content-Type": "application/json"}
    
    # Extract entries currently in workflow cadence who have NOT unsubscribed
    url = f"{SUPABASE_URL}?unsubscribed=eq.false&status=eq.In+Negotiation"
    try:
        res = requests.get(url, headers=headers, timeout=5)
        if res.status_code != 200: return
        leads = res.json()
    except Exception: return

    for lead in leads:
        email = lead.get("email")
        name = lead.get("name", "Founder")
        company = lead.get("company", "your facility")
        sent_count = lead.get("sequences_sent", 1) # Defaults to step 1 after initial touch
        last_date_str = lead.get("last_contacted_at")
        client_tag = lead.get("client_workspace", "rainmaker") # Defaults to core engine path

        if not email or sent_count >= 21: continue

        # ENFORCE 3-DAY BOUNDARY: Ensure cloud server spaces messages exactly 72 hours apart
        if last_date_str:
            try:
                last_date = datetime.fromisoformat(last_date_str.replace('Z', '+00:00'))
                if datetime.now(last_date.tzinfo) < last_date + timedelta(days=3):
                    continue
            except Exception: pass

        next_step = sent_count + 1
        unsubscribe_url = f"https://surgecrm.site{requests.utils.quote(email)}&action=unsubscribe"
        
        subject = f"industry data pass // sequence {next_step}"
        body_content = get_followup_body(client_tag, name, company, next_step, unsubscribe_url)

        print(f"✉️ Dispensing automated follow-up step {next_step} to {email}...")
        if send_spacemail(email, subject, body_content, is_html=True):
            update_payload = {
                "sequences_sent": next_step,
                "last_contacted_at": datetime.now().isoformat()
            }
            # LOCK OUT GATES AT STEP 21: Change status badge indicator to alert state immediately
            if next_step == 21:
                update_payload["status"] = "ALERT: 21 Drops Executed"
                print(f"🚨 ALARM: 21 unique outreaches hit maximum threshold bounds for {email}!")

            requests.patch(f"{SUPABASE_URL}?email=eq.{requests.utils.quote(email)}", headers=headers, json=update_payload, timeout=5)
            time.sleep(random.randint(60, 180)) # Safe pipeline pacing delay

if __name__ == "__main__":
    run_automated_followup_cadence()
