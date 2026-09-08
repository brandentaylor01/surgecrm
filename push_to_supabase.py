import csv
import os
import requests

CSV_FILE = "leads.csv"
SUPABASE_URL = "https://vercel.app"
SUPABASE_KEY = "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL"

def push_csv_to_supabase():
    if not os.path.exists(CSV_FILE):
        print(f"Error: {CSV_FILE} not found. Place your library list here!")
        return

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }

    print("🚀 Initiating cloud database sync from library export...")
    success_count = 0
    session = requests.Session()
    session.headers.update(headers)

    with open(CSV_FILE, mode='r', encoding='utf-8-sig', errors='ignore') as f:
        reader = csv.DictReader(f)
        for row in reader:
            company = row.get("Company Name", row.get("Business Name", "Ohio Local Biz")).strip()
            first = row.get("Executive First Name", "").strip()
            last = row.get("Executive Last Name", "").strip()
            name = f"{first} {last}".strip() if (first or last) else "Business Owner"
            email = row.get("Email Address", "").strip()

            if not email:
                continue

            payload = {
                "company": company,
                "name": name,
                "email": email.lower(),
                "value": 2500,
                "status": "Verified Intake",
                "priority": "High"
            }

            try:
                res = session.post(SUPABASE_URL, json=payload, timeout=5)
                if 200 <= res.status_code < 300:
                    success_count += 1
            except Exception:
                continue

    print(f"⚡ Live Sync Complete! Pushed {success_count} Ohio records straight to your website dashboard.")

if __name__ == "__main__":
    push_csv_to_supabase()
