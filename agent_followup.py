import requests
from datetime import datetime, timedelta
from spacemail_sender import send_spacemail

SUPABASE_URL = "https://supabase.co"
SUPABASE_KEY = "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL"

def run_automated_followup_cadence():
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    # Target only active pipeline entries who have NOT unsubscribed
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
        sent_count = lead.get("sequences_sent", 0)
        last_date_str = lead.get("last_contacted_at")

        # CRITICAL SAFEGUARD GATES: Drop execution if thresholds are breached
        if not email or sent_count >= 21:
            continue

        # 3-DAY TIMELINE EVALUATION: Verify if it's time to follow up
        if last_date_str:
            # Parse ISO layout structure components safely
            last_date = datetime.fromisoformat(last_date_str.replace('Z', '+00:00'))
            if datetime.now(last_date.tzinfo) < last_date + timedelta(days=3):
                continue # Skip if 3 days haven't passed yet

        # BUILD DEPLOYMENT DATA LAYOUTS
        unsubscribe_link = f"https://vercel.app{requests.utils.quote(email)}&action=unsubscribe"
        
        subject = "following up on your sales pipeline"
        body = (
            f"<p>Hi {name},</p>"
            f"<p>Just checking in on this. I know you're busy running {company}, "
            f"but building an optimized outbound pipeline is the fastest way to scale your revenue.</p>"
            f"<p>Do you have 5 minutes to chat this week?</p>"
            f"<br><br><a href='{unsubscribe_link}' style='color:#555;font-size:10px;'>Unsubscribe</a>"
        )

        if send_spacemail(email, subject, body, is_html=True):
            new_count = sent_count + 1
            
            # CRITICAL ALERT CONDITION MET: Signal alert state at 21 sent messages
            update_payload = {
                "sequences_sent": new_count,
                "last_contacted_at": datetime.now().isoformat()
            }
            if new_count == 21:
                update_payload["status"] = "ALERT: 21 Drops Executed"
                print(f"🚨 ALERT STATE REACHED: 21 outbound emails dispatched to {email}!")

            # Push row synchronization matrices directly back to Supabase tables
            requests.patch(f"{SUPABASE_URL}?email=eq.{requests.utils.quote(email)}", headers=headers, json=update_payload, timeout=5)

if __name__ == "__main__":
    run_automated_followup_cadence()
