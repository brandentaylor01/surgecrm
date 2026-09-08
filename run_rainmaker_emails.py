import requests
import json
import time
import random
from spacemail_sender import send_spacemail

SUPABASE_URL = "https://supabase.co"
SUPABASE_KEY = "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL"
DAILY_MAX_CAP = 45

def fetch_fresh_targets():
    """Pulls only verified, uncontacted leads straight from the Supabase cloud ledger."""
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    # Standard URL query logic to filter for target matching profiles
    url = f"{SUPABASE_URL}?status=eq.Verified+Intake&limit={DAILY_MAX_CAP}"
    try:
        res = requests.get(url, headers=headers, timeout=5)
        if res.status_code == 200:
            return res.json()
    except Exception as e:
        print(f"❌ Failed to extract target queue from cloud: {e}")
    return []

def mark_as_contacted_in_cloud(company_name, email):
    """Updates lead records inside your database to protect against duplicate spam loops."""
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    url = f"{SUPABASE_URL}?email=eq.{requests.utils.quote(email.lower())}"
    payload = {"status": "In Negotiation", "priority": "High"}
    try:
        requests.patch(url, headers=headers, json=payload, timeout=5)
    except Exception as e:
        print(f"⚠️ Cloud record update delay: {e}")

def execute_autonomous_campaign():
    print("🚀 Rainmaker Cloud Mail Worker initialized...")
    targets = fetch_fresh_targets()
    if not targets:
        print("📭 No fresh target accounts found in database. Staging queue idle.")
        return

    print(f"💼 Extracted {len(targets)} verified enterprise targets for outbound loop.")
    sent_count = 0

    for lead in targets:
        company = lead.get("company", "your enterprise")
        name = lead.get("name", "Founder")
        email = lead.get("email")
        
        if not email:
            continue

        print(f"✉️ Processing outreach to: {name} @ {company}...")
        subject = "quick question about your outbound pipeline"
        
        # FIXED: Encodes valid tracking paths for your Vercel tracking endpoint
        tracking_url = f"https://vercel.app{requests.utils.quote(email)}&client=rainmaker"
        
        body = (
            f"<p>Hi {name},</p>"
            f"<p>Most growth agencies promise you the world, send a massive "
            f"list of generic leads, and vanish. It's a headache to deal with.</p>"
            f"<p>We're a team of actual sales professionals, and we handle things "
            f"differently. We do the heavy lifting for you—building real outbound "
            f"pipelines and actually closing the revenue. You get the benefits "
            f"of an active sales operation without the overhead.</p>"
            f"<p>Worth a quick 5-minute chat this Thursday to see how we do it?</p>"
            f"<p>Best,<br><br>Branden Taylor<br>Hirerainmakers</p>"
            f"<img src='{tracking_url}' width='1' height='1' style='display:none;' />"
        )

        success = send_spacemail(email, subject, body, is_html=True)
        
        if success:
            sent_count += 1
            mark_as_contacted_in_cloud(company, email)
            
            # Smart delay buffer to dodge spam filters cleanly
            sleep_time = random.randint(120, 240)
            print(f"⏳ Sleeping for {sleep_time} seconds before processing next link vector...")
            time.sleep(sleep_time)

    print(f"🏁 Campaign sequence closed. Successfully launched {sent_count} tracking threads.")

if __name__ == "__main__":
    execute_autonomous_campaign()
