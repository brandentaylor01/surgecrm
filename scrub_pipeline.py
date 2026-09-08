import json
import os

LEADS_FILE = "leads.json"

# Strict Northeast Ohio (NEO) geographic metrics
NEO_AREA_CODES = ["330", "216", "440"]
NEO_COUNTIES = ["stark", "summit", "cuyahoga", "mahoning", "lorain"]

def is_northeast_ohio(lead):
    text_blob = f"{lead.get('company', '')} {lead.get('email', '')} {lead.get('name', '')}".lower()
    # Lock down validation to your immediate target markets
    return any(marker in text_blob for marker in NEO_AREA_CODES + NEO_COUNTIES)

def scrub_leads():
    if not os.path.exists(LEADS_FILE):
        print("No pool targets discovered.")
        return

    with open(LEADS_FILE, "r") as f:
        try:
            leads = json.load(f)
        except Exception:
            return

    neo_exclusive = []
    for lead in leads:
        if not lead.get("email"):
            continue
        if is_northeast_ohio(lead):
            neo_exclusive.append(lead)

    with open(LEADS_FILE, "w") as f:
        json.dump(neo_exclusive, f, indent=2)
        
    print(f"📍 Neo Filter: Retained {len(neo_exclusive)} verified Northeast Ohio records.")

if __name__ == "__main__":
    scrub_leads()
