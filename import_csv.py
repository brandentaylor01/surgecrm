import csv
import json
import os

CSV_FILE = "leads.csv"
LEADS_FILE = "leads.json"

def import_library_records():
    if not os.path.exists(CSV_FILE):
        print(f"File {CSV_FILE} not found. Place your library export here!")
        return

    imported_leads = []
    
    with open(CSV_FILE, mode='r', encoding='utf-8-sig', errors='ignore') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Common Reference Solutions field formats
            company = row.get("Company Name", row.get("Business Name", "")).strip()
            name = row.get("Executive First Name", "") + " " + row.get("Executive Last Name", "")
            email = row.get("Email Address", "").strip()
            
            if email:
                imported_leads.append({
                    "name": name.strip() if name.strip() else "Business Owner",
                    "company": company if company else "Local Enterprise",
                    "email": email.lower(),
                    "status": "Premium Intake"
                })

    # Save to your live automation data pool
    with open(LEADS_FILE, "w") as f:
        json.dump(imported_leads, f, indent=2)
        
    print(f"📦 Imported {len(imported_leads)} premium library leads to your live tracker!")

if __name__ == "__main__":
    import_library_records()
