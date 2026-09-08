import json
import os
import time
import random
from datetime import datetime, timedelta
from spacemail_sender import send_spacemail

LEADS_FILE = "leads.json"
DAILY_FOLLOWUP_CAP = 25  # Lower cap for follow-ups to maintain safety balances

def load_leads():
    if not os.path.exists(LEADS_FILE):
        return []
    try:
        with open(LEADS_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return []

def run_followup_sequence():
    print("🤖 AI Follow-Up Agent scanning for pending pipeline touchpoints...")
    leads = load_leads()
    if not leads:
        print("No leads discovered to process.")
        return

    sent_today = 0
    today = datetime.now()

    for lead in leads:
        if sent_today >= DAILY_FOLLOWUP_CAP:
            print(f"🛑 Reached safe daily follow-up cap of {DAILY_FOLLOWUP_CAP}.")
            break

        email = lead.get("email")
        name = lead.get("name", "Founder")
        company = lead.get("company", "your enterprise")
        
        # Check if they were emailed but haven't received follow-up #1 yet
        was_contacted = lead.get("contacted") is True
        already_followed_up = lead.get("followup_1_sent") is True
        is_replied_or_closed = lead.get("status") in ["Replied", "Closed", "Warm"]

        if not was_contacted or already_followed_up or is_replied_or_closed:
            continue

        # Parse the initial contact date safely
        date_str = lead.get("date_contacted")
        if not date_str:
            continue

        try:
            contact_date = datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            continue

        # Replicate top models: Only follow up if at least 3 days have passed
        if today - contact_date < timedelta(days=3):
            continue

        print(f"\n✉️ Sending personalized Step-2 follow-up to {email}...")

        subject = "Quick bump / pipeline fix"
        body = (
            f"Hi {name},\n\n"
            f"I know your inbox is likely flooded, so I wanted to keep this brief.\n\n"
            f"Since we last spoke, another agency owner reached out about their "
            f"hiring bottlenecks costing them close to $8k/month in lost opportunities.\n\n"
            f"If you're still looking to scale your outbound revenue engine to a "
            f"predictable pace without internal hiring overhead, let me know if "
            f"Thursday still works.\n\n"
            f"Worth a quick 5-minute look?\n\n"
            f"Best,\n\n"
            f"Branden Miller\n"
            f"Hirerainmakers"
        )

        success = send_spacemail(email, subject, body)

        if success:
            sent_today += 1
            lead["followup_1_sent"] = True
            lead["date_followup_1"] = today.strftime("%Y-%m-%d")

            # Update database status immediately
            with open(LEADS_FILE, "w") as f:
                json.dump(leads, f, indent=2)

            # Human-paced pacing mechanism
            sleep_duration = random.randint(120, 300)
            print(f"⏳ Humanized delay: sleeping for {sleep_duration} seconds...")
            time.sleep(sleep_duration)
        else:
            print(f"❌ Could not deliver follow-up to {email}")

    print(f"\n✅ Follow-up session complete. Processed {sent_today} records safely.")

if __name__ == "__main__":
    run_followup_sequence()
