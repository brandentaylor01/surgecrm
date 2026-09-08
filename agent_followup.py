import requests, json, time, random
from datetime import datetime, timedelta
from spacemail_sender import send_spacemail

SUPABASE_URL = "https://supabase.co"
SUPABASE_KEY = "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL"

def get_rainmaker_followup_body(name, company, step, unsubscribe_link):
    """Generates localized value-driven B2B outreach copy focused 100% on Rainmaker sales systems."""
    
    # 21-Step Dynamic Value-Drop Allocation Matrix
    if step <= 3:
        headline = "The pipeline conversion bottleneck"
        text = "Our internal sales data shows that close to 74% of B2B cold outreach campaigns fail because agencies demand a formal meeting block too quickly. Shifting to an interest-based, low-friction format fixes this immediately."
    elif step <= 6:
        headline = "Data decay & generic lists"
        text = f"Relying on standard static directory databases means you are messaging the exact same old profiles as your competitors. Building highly targeted, clean intent loops gives your outreach a completely clean run at {company}."
    elif step <= 9:
        headline = "Internal tracking pixel insights"
        text = "Tracking raw email delivery rates is misleading. Utilizing serverless tracking pixels helps you monitor immediate interest states by logging the exact second a prospect re-opens your pitch."
    elif step <= 12:
        headline = "Internal sales team overhead"
        text = "Managing an internal sales desk carries high overhead in software seat licensing, data cleaning hours, and employee ramp-up times. Offloading the infrastructure deployment layer removes that operational drag."
    elif step <= 15:
        headline = "Outbound conversion velocity"
        text = "Scaling your pipeline isn't about sending massive email volume. It requires optimizing localized conversion metrics to ensure you add consistent transactional deal records to your dynamic dashboard every week."
    elif step <= 18:
        headline = "Accountability in agency models"
        text = "Most B2B groups drop off generic spreadsheets and vanish. We think that structure is broken. True pipeline development requires taking real, hand-in-hand accountability for the actual conversion cycles."
    else:
        headline = "Final assessment window"
        text = "We are wrapping up our regional enterprise outreach passes for the month. We wanted to offer one final check to see if adding an automated, high-velocity outbound engine aligns with your growth parameters."

    # Premium minimal luxury layout
    return (
        f"<div style='font-family:sans-serif;font-size:13px;color:#111;line-height:1.6;max-width:550px;'><p>Hi {name},</p>"
        f"<p>Following up with a brief data metric on your industry environment — <strong>{headline}</strong>.</p>"
        f"<p>{text}</p><p>Worth a short check to see if adding an active sales operation makes sense for your team right now?</p>"
        f"<p>Best,<br><br>Branden Taylor<br><strong>RAINMAKER</strong></p>"
        f"<br><br><hr style='border:0;border-top:1px solid #eee;' />"
        f"<p style='font-size:10px;color:#aaa;'><a href='{unsubscribe_link}' style='color:#888;'>Unsubscribe</a> from future industry insight updates.</p></div>"
    )

def run_automated_followup_cadence():
    print("🔄 Initializing 24/7 Rainmaker Focused Follow-Up Drip Matrix Engine...")
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}", "Content-Type": "application/json"}
    
    # Target active negotiation records who have not opted out
    url = f"{SUPABASE_URL}?unsubscribed=eq.false&status=eq.In+Negotiation"
    try:
        res = requests.get(url, headers=headers, timeout=5)
        if res.status_code != 200: return
        leads = res.json()
    except Exception: return

    for lead in leads:
        email = lead.get("email")
        name = lead.get("name", "Founder")
        company = lead.get("company", "your enterprise")
        sent_count = lead.get("sequences_sent", 1) 
        last_date_str = lead.get("last_contacted_at")

        if not email or sent_count >= 21: continue

        # ENFORCE 3-DAY DELAY BETWEEN OUTBOUND DROPS
        if last_date_str:
            try:
                last_date = datetime.fromisoformat(last_date_str.replace('Z', '+00:00'))
                if datetime.now(last_date.tzinfo) < last_date + timedelta(days=3):
                    continue
            except Exception: pass

        next_step = sent_count + 1
        unsubscribe_url = f"https://surgecrm.site{requests.utils.quote(email)}&action=unsubscribe"
        
        subject = f"outbound pipeline analysis // update {next_step}"
        body_content = get_rainmaker_followup_body(name, company, next_step, unsubscribe_url)

        print(f"✉️ Dispensing Rainmaker follow-up step {next_step} to {email}...")
        if send_spacemail(email, subject, body_content, is_html=True):
            update_payload = {
                "sequences_sent": next_step,
                "last_contacted_at": datetime.now().isoformat()
            }
            # LOCK OUT GATES AT STEP 21: Change status badge indicator to alert state immediately
            if next_step == 21:
                update_payload["status"] = "ALERT: 21 Drops Executed"
                print(f"🚨 ALARM: Rainmaker outreach maximum sequence threshold hit for {email}!")

            requests.patch(f"{SUPABASE_URL}?email=eq.{requests.utils.quote(email)}", headers=headers, json=update_payload, timeout=5)
            time.sleep(random.randint(60, 180))

if __name__ == "__main__":
    run_automated_followup_cadence()
