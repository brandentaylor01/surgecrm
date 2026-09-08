import re
import requests

TEXT_SOURCE = "scraped_text.txt"
SUPABASE_URL = "https://supabase.co"
SUPABASE_KEY = "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL"

def run_extraction_sync():
    if not os.path.exists(TEXT_SOURCE):
        # Creates a template block if you haven't dropped your notes yet
        with open(TEXT_SOURCE, "w") as f:
            f.write("Company: Akron Enterprise\nEmail: contact@akronbiz.com\n")
        print(f"Created template {TEXT_SOURCE}. Paste your screen copies there!")
        return

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }

    with open(TEXT_SOURCE, "r") as f:
        raw_content = f.read()

    # Intelligent text parsing using lookahead regular expressions
    records = re.findall(r'([\w\s\.-]+)[\s,]+([\w\.-]+@[\w\.-]+\.\w+)', raw_content)
    sync_count = 0

    for item in records:
        company_name = item[0].strip()
        email_address = item[1].strip().lower()
        
        payload = {
            "company": company_name if company_name else "Northeast Ohio Client",
            "name": "Business Owner",
            "email": email_address,
            "value": 2500,
            "status": "Verified Intake",
            "priority": "High"
        }
        
        try:
            res = requests.post(SUPABASE_URL, headers=headers, json=payload, timeout=5)
            if res.status_code >= 200 and res.status_code < 300:
                sync_count += 1
        except Exception:
            continue

    print(f"⚡ Extraction Complete: Synced {sync_count} new cards directly to your site!")

import os
if __name__ == "__main__":
    run_extraction_sync()
