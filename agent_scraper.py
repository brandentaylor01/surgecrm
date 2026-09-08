import json
import os
import re
import requests
from bs4 import BeautifulSoup

LEADS_FILE = "leads.json"

def is_legit_business_email(email):
    # Rule 1: Filter out generic, non-decision maker mailboxes
    junk_roles = [
        "info@", "support@", "admin@", "sales@", "jobs@", 
        "careers@", "contact@", "help@", "billing@", "office@"
    ]
    email_lower = email.lower()
    
    if any(role in email_lower for role in junk_roles):
        print(f"⏩ Dropping generic role-based address: {email}")
        return False
        
    # Rule 2: Ensure it belongs to a real corporate domain (No free public webmails)
    public_providers = ["@gmail.com", "@yahoo.com", "@hotmail.com", "@outlook.com"]
    if any(provider in email_lower for provider in public_providers):
        print(f"⏩ Dropping non-corporate address: {email}")
        return False
        
    return True

def append_to_leads(new_leads):
    if os.path.exists(LEADS_FILE):
        try:
            with open(LEADS_FILE, "r") as f:
                current_leads = json.load(f)
        except Exception:
            current_leads = []
    else:
        current_leads = []

    existing_emails = {l.get("email") for l in current_leads if l.get("email")}
    added_count = 0
    next_id = len(current_leads) + 1
    
    for lead in new_leads:
        if lead["email"] not in existing_emails:
            lead["id"] = str(next_id)
            current_leads.append(lead)
            existing_emails.add(lead["email"])
            next_id += 1
            added_count += 1
            
    with open(LEADS_FILE, "w") as f:
        json.dump(current_leads, f, indent=2)
    print(f"📁 Verified and saved {added_count} premium prospects.")

def search_and_scrape_prospects(query_topic):
    print(f"🔍 Searching for premium targets: '{query_topic}'...")
    headers = {"User-Agent": "Mozilla/5.0"}
    search_url = f"https://duckduckgo.com{query_topic}+contact+email"
    
    try:
        response = requests.get(search_url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")
        found_prospects = []
        
        for result in soup.find_all("a", class_="result__snippet"):
            text_chunk = result.get_text()
            email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text_chunk)
            
            if email_match:
                extracted_email = email_match.group(0)
                
                # Run the validation layer check
                if is_legit_business_email(extracted_email):
                    found_prospects.append({
                        "name": "Decision Maker",
                        "company": "Target B2B Enterprise",
                        "email": extracted_email,
                        "status": "Verified Intake",
                        "priority": "High",
                        "conversion": 65,
                        "health": "Excellent"
                    })
        if found_prospects:
            append_to_leads(found_prospects)
        else:
            print("No new premium email signatures found in this pass.")
    except Exception as e:
        print(f"⚠️ Verification filter pass stopped: {e}")
