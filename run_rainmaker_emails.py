import requests, json, time, random

SUPABASE_URL = "https://supabase.co"
SUPABASE_KEY = "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL"
DAILY_MAX_CAP = 45

def fetch_fresh_targets():
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}", "Content-Type": "application/json"}
    try:
        res = requests.get(f"{SUPABASE_URL}?status=eq.Verified+Intake&limit={DAILY_MAX_CAP}", headers=headers, timeout=5)
        if res.status_code == 200: return res.json()
    except Exception: pass
    return []

def mark_as_contacted_in_cloud(email):
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}", "Content-Type": "application/json"}
    try:
        requests.patch(f"{SUPABASE_URL}?email=eq.{requests.utils.quote(email.lower())}", headers=headers, json={"status": "In Negotiation", "priority": "High"}, timeout=5)
    except Exception: pass

def execute_autonomous_campaign():
    print("🚀 Rainmaker Cloud Mail Worker initialized...")
    targets = fetch_fresh_targets()
    if not targets: return

    sent_count = 0
    from spacemail_sender import send_spacemail
    for lead in targets:
        name = lead.get("name", "Founder")
        email = lead.get("email")
        if not email: continue

        subject = "outbound pipeline"
        tracking_url = f"https://surgecrm.site{requests.utils.quote(email)}&client=rainmaker"
        
        body = (
            f"<p style='font-family:sans-serif;font-size:13px;color:#111;line-height:1.6;'>Hi {name},</p>"
            f"<p style='font-family:sans-serif;font-size:13px;color:#111;line-height:1.6;'>"
            f"I noticed your group is actively expanding customer acquisition efforts across the region.</p>"
            f"<p style='font-family:sans-serif;font-size:13px;color:#111;line-height:1.6;'>"
            f"Most founders are exhausted by agencies that blast generic lists and vanish. "
            f"We do the opposite—we build your outbound workflows and take accountability for the actual conversion cycles.</p>"
            f"<p style='font-family:sans-serif;font-size:13px;color:#111;line-height:1.6;'>"
            f"Would you be open to reviewing a short, 3-sentence breakdown of how we added <strong>$42k in revenue in just one month</strong> for a similar team?</p>"
            f"<p style='font-family:sans-serif;font-size:13px;color:#111;line-height:1.6;'>"
            f"Best,<br><br>Branden Taylor<br><strong>RAINMAKER</strong></p>"
            f"<img src='{tracking_url}' width='1' height='1' style='display:none;' />"
        )

        if send_spacemail(email, subject, body, is_html=True):
            sent_count += 1
            mark_as_contacted_in_cloud(email)
            time.sleep(random.randint(120, 240))

if __name__ == "__main__":
    execute_autonomous_campaign()
