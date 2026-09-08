import requests
import json
import time
import random
from spacemail_sender import send_spacemail

SUPABASE_URL = "https://supabase.co"
SUPABASE_KEY = "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL"
DAILY_MAX_CAP = 45

def fetch_fresh_targets():
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    url = f"{SUPABASE_URL}?status=eq.Verified+Intake&limit={DAILY_MAX_CAP}"
    try:
        res = requests.get(url, headers=headers, timeout=5)
        if res.status_code == 200: return res.json()
    except Exception: pass
    return []

def mark_as_contacted_in_cloud(email):
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    url = f"{SUPABASE_URL}?email=eq.{requests.utils.quote(email.lower())}"
    try:
        requests.patch(url, headers=headers, json={"status": "In Negotiation", "priority": "High"}, timeout=5)
    except Exception: pass

def execute_autonomous_campaign():
    print("🚀 Rainmaker Cloud Mail Worker initialized...")
    targets = fetch_fresh_targets()
    if not targets: return

    sent_count = 0
    for lead in targets:
        company = lead.get("company", "your enterprise")
        name = lead.get("name", "Founder")
        email = lead.get("email")
        if not email: continue

        subject = "outbound pipeline"
        tracking_url = f"https://surgecrm.site{requests.utils.quote(email)}&client=rainmaker"
        
        body = (
            f"<p style='font-family:sans-serif;font-size:13px;color:#222;line-height:1.5;'>Hi {name},</p>"
            f"<p style='font-family:sans-serif;font-size:13px;color:#222;line-height:1.5;'> "
            f"Most growth groups pitch the world, send a list of generic scraped targets, and vanish. "
            f"It is an operational headache.</p>"
            f"<p style='font-family:sans-serif;font-size:13px;color:#222;line-height:1.5;'>"
            f"We do this differently. We build custom outbound pipelines and manage the actual conversion "
            f"cycles directly. You get an active sales operation without the traditional overhead.</p>"
            f"<p style='font-family:sans-serif;font-size:13px;color:#222;line-height:1.5;'>"
            f"Worth a brief 5-minute conversation this Thursday to see if our frameworks align?</p>"
            f"<p style='font-family:sans-serif;font-size:13px;color:#222;line-height:1.5;'>"
            f"Best,<br><br>Branden Taylor<br><strong>RAINMAKER</strong></p>"
            f"<img src='{tracking_url}' width='1' height='1' style='display:none;' />"
        )

        if send_spacemail(email, subject, body, is_html=True):
            sent_count += 1
            mark_as_contacted_in_cloud(email)
            time.sleep(random.randint(120, 240))

    print(f"🏁 Campaign sequence closed. Dispatched {sent_count} tracking profiles.")

if __name__ == "__main__":
    execute_autonomous_campaign()
