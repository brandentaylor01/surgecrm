import json
import os

LEADS_FILE = "leads.json"

def scrub_leads():
    if not os.path.exists(LEADS_FILE):
        print("No leads database file discovered.")
        return

    with open(LEADS_FILE, "r") as f:
        try:
            leads = json.load(f)
        except Exception:
            print("Database file is empty.")
            return

    initial_count = len(leads)
    cleaned_leads = []
    seen_emails = set()

    for lead in leads:
        email = lead.get("email", "").strip().lower()
        
        # Core checks: drop empty lines or obvious duplicate items
        if not email or email in seen_emails:
            continue
            
        # Standardize properties
        lead["email"] = email
        lead["name"] = lead.get("name", "Business Owner").strip()
        lead["company"] = lead.get("company", "Local Enterprise").strip()
        
        seen_emails.add(email)
        cleaned_leads.append(lead)

    with open(LEADS_FILE, "w") as f:
        json.dump(cleaned_leads, f, indent=2)
        
    print(f"📍 Clean Pass: Retained {len(cleaned_leads)} out of {initial_count} unique prospects.")

if __name__ == "__main__":
    scrub_leads()
