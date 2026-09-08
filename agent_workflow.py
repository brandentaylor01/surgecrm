import json
import os
import time
import random
from datetime import datetime
from spacemail_sender import send_spacemail

LEADS_FILE = "leads.json"
DAILY_MAX_CAP = 45  # Safe daily limit for domain protection

def is_business_hours():
    current_hour = datetime.now().hour
    # Only send between 9 AM and 5 PM
    return 9 <= current_hour < 17

def load_leads():
    if not os.path.exists(LEADS_FILE):
        return []
    try:
        with open(LEADS_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return []

def run_humanized_outreach():
    print("🤖 AI Agent initiating human-simulated outreach campaign...")
    
    if not is_business_hours():
        print("🛑 Outside of human business hours (9AM-5PM). Pausing engine for domain safety.")
        return
        
    leads = load_leads()
    if not leads:
        print("No prospects found.")
        return

    sent_today = 0
    
    for lead in leads:
        if sent_today >= DAILY_MAX_CAP:
            print(f"🛑 Reached the daily maximum limit of {DAILY_MAX_CAP} safe sends. Stopping.")
            break
            
        name = lead.get("name", "Founder")
        email = lead.get("email")
        company = lead.get("company", "your enterprise")
        
        # Skip if already contacted or missing email
        if not email or lead.get("contacted") is True:
            continue
            
        print(f"\n✉️ Sending human-paced outreach to {email} ({sent_today + 1}/{DAILY_MAX_CAP})...")
        
        subject = "Fixing your pipeline bottlenecks"
        body = (
            f"Hi {name},\n\n"
            f"Building an elite internal sales engine is incredibly painful right now. "
            f"Between struggling to find premium candidates who can actually close, "
            f"and waiting on slow client payments, it stalls your kinetic growth.\n\n"
            f"At Hirerainmakers, we install a complete outbound pipeline engine "
            f"and high-ticket closing system for a flat $2,500/month—significantly "
            f"less than the overhead of a single full-time hire.\n\n"
            f"We bring the pipeline, handle the conversion velocity, and secure the revenue.\n\n"
            f"Do you have 5 minutes this Thursday for a brief walkthrough?\n\n"
            f"Best,\n\n"
            f"Branden Miller\n"
            f"Hirerainmakers"
        )
        
        success = send_spacemail(email, subject, body)
        
        if success:
            sent_today += 1
            lead["contacted"] = True
            lead["date_contacted"] = datetime.now().strftime("%Y-%m-%d")
            
            # Save progress instantly so we never double-email
            with open(LEADS_FILE, "w") as f:
                json.dump(leads, f, indent=2)
                
            # Humanizing sleep: Random interval between 2 and 5 minutes
            sleep_duration = random.randint(120, 300)
            print(f"⏳ Mimicking human delay. Sleeping for {sleep_duration} seconds...")
            time.sleep(sleep_duration)
        else:
            print(f"❌ Transmission dropped for {email}")

    print(f"\n✅ Safe session complete. Paced {sent_today} emails out successfully.")

if __name__ == "__main__":
    run_humanized_outreach()
