import json
import os
import time
import random
from spacemail_sender import send_spacemail

LEADS_FILE = "leads.json"

def run_roofing_campaign():
    if not os.path.exists(LEADS_FILE):
        print("No database records found.")
        return
        
    with open(LEADS_FILE, "r") as f:
        leads = json.load(f)

    sent_count = 0
    
    for lead in leads:
        # Prevent duplicate emails or mailing your other clients
        if lead.get("roofing_contacted") is True or not lead.get("email"):
            continue
            
        name = lead.get("name", "Property Manager")
        email = lead.get("email")
        company = lead.get("company", "your property portfolio")
        
        print(f"✉️ Dispatching free roof inspection offer to {email}...")
        
        subject = "Complimentary storm damage & roof integrity report"
        body = (
            f"Hi {name},\n\n"
            f"With the recent high wind and severe hail storms moving across Ohio, "
            f"commercial and multi-family roof systems are facing hidden structural strain.\n\n"
            f"Even minor hail bruising or wind uplift can compromise your property "
            f"insurance recovery windows if left undocumented.\n\n"
            f"We are currently in your area providing complimentary, comprehensive roof "
            f"integrity inspections and digital structural reports for local portfolios.\n\n"
            f"Would you be open to a quick on-site diagnostic walkthrough for your "
            f"buildings later this week? Zero obligation, we just provide the data.\n\n"
            f"Best regards,\n\n"
            f"Branden Miller\n"
            f"Hirerainmakers"
        )
        
        success = send_spacemail(email, subject, body)
        
        if success:
            sent_count += 1
            lead["roofing_contacted"] = True
            with open(LEADS_FILE, "w") as f:
                json.dump(leads, f, indent=2)
                
            sleep_time = random.randint(120, 300)
            print(f"⏳ Sleeping for {sleep_time}s to preserve domain score...")
            time.sleep(sleep_time)

    print(f"✅ Safe session ended. Sent {sent_count} roofing pitches.")

if __name__ == "__main__":
    run_roofing_campaign()
