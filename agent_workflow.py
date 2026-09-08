import json
import os
import time
import random
from datetime import datetime
from spacemail_sender import send_spacemail
from db_sync import add_to_web_opportunities

LEADS_FILE = "leads.json"
DAILY_MAX_CAP = 45 

def load_leads():
    if not os.path.exists(LEADS_FILE):
        return []
    try:
        with open(LEADS_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return []

def run_humanized_outreach():
    print("🤖 AI Agent initiating tracked outreach campaign...")
    leads = load_leads()
    if not leads:
        return

    sent_today = 0
    
    for lead in leads:
        if sent_today >= DAILY_MAX_CAP:
            break
            
        lead_id = lead.get("id", "0")
        name = lead.get("name", "Founder")
        email = lead.get("email")
        company = lead.get("company", "your enterprise")
        
        if not email or lead.get("contacted") is True:
            continue
            
        print(f"\n✉️ Sending tracked email to {email}...")
        
        subject = "quick question about your outbound pipeline"
        
        # Build clean HTML content containing the tracking pixel parameter
        tracking_url = f"https://vercel.app{lead_id}&client=rainmaker"
        
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
        
        # Spacemail sender handles transmission execution
        success = send_spacemail(email, subject, body)
        
        if success:
            sent_today += 1
            lead["contacted"] = True
            lead["date_contacted"] = datetime.now().strftime("%Y-%m-%d")
            with open(LEADS_FILE, "w") as f:
                json.dump(leads, f, indent=2)
                
            add_to_web_opportunities(company, name, email)
                
            sleep_duration = random.randint(120, 300)
            print(f"⏳ Sleeping for {sleep_duration} seconds...")
            time.sleep(sleep_duration)

if __name__ == "__main__":
    run_humanized_outreach()
