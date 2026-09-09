import os
import glob
import pandas as pd
from supabase import create_client

SUPABASE_URL = "https://supabase.co"
SUPABASE_KEY = "YOUR_SUPABASE_SERVICE_ROLE_KEY" 

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_leads():
    csv_files = glob.glob("*.csv")
    if not csv_files:
        print("❌ No CSV files discovered in the root directory.")
        return

    print(f"🔎 Found {len(csv_files)} tracking files to process...")
    
    for file in csv_files:
        if file == "delivered_leads.csv":
            continue
            
        print(f"🚀 Parsing: {file}")
        try:
            df = pd.read_csv(file)
            df.columns = [c.lower().strip() for c in df.columns]
            
            e_col = next((c for c in df.columns if c in ['email', 'contact']), None)
            n_col = next((c for c in df.columns if c in ['name', 'business_name']), None)

            if not e_col:
                print(f"   ⚠️ Skipping {file}: No valid email header column located.")
                continue

            for _, row in df.iterrows():
                email = str(row[e_col]).strip()
                name = str(row[n_col]).strip() if n_col and pd.notna(row[n_col]) else "Partner"

                if "@" in email:
                    try:
                        supabase.table("leads").insert(
                            {"email": email, "name": name, "contacted": False}
                        ).execute()
                        print(f"   ✅ Synchronized: {email}")
                    except Exception:
                        pass
        except Exception as e:
            print(f"   ❌ Read failed for {file}: {str(e)}")

if __name__ == "__main__":
    upload_leads()
