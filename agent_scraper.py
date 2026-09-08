import json
import os
import re
import time
import requests
from bs4 import BeautifulSoup

LEADS_FILE = "leads.json"

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
    print(f"📁 Saved {added_count} brand new prospects.")

def search_and_scrape_prospects(query_topic):
    print(f"🔍 Searching for: '{query_topic}'...")
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
                found_prospects.append({
                    "name": "Prospect Name",
                    "company": "Discovered Enterprise",
                    "email": extracted_email,
                    "status": "Cold Intake",
                    "priority": "Medium",
                    "conversion": 50,
                    "health": "Excellent"
                })
        if found_prospects:
            append_to_leads(found_prospects)
        else:
            print("No public signatures found in this pass.")
    except Exception as e:
        print(f"⚠️ Scraping pass stopped: {e}")
