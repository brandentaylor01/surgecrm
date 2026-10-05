import os
import glob
import pandas as pd
from supabase import create_client

SUPABASE_URL = "https://supabase.co"
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
ACTIVE_TENANT_ID = "tenant_workspace_rainmaker_ohio"

def upload_leads():
    csv_files = glob.glob("*.csv")
    if not csv_files:
        print("❌ No data pools tracked in root directory.")
        return

    for file in csv_files:
        print(f"🚀 Processing Multitenant Stream for: {file}")
        try:
            df = pd.read_csv(file)
            df.columns = [c.lower().strip() for c in df.columns]
            
            e_col = next((c for c in df.columns if c in ['email', 'contact', 'email address']), None)
            n_col = next((c for c in df.columns if c in ['name', 'business_name', 'company', 'company name']), None)

            if not e_col: continue

            for _, row in df.iterrows():
                email = str(row[e_col]).strip().lower()
                company = str(row[n_col]).strip() if n_col and pd.notna(row[n_col]) else "Target Enterprise"

                if "@" in email:
                    try:
                        supabase.table("leads").insert({
                            "tenant_id": ACTIVE_TENANT_ID,
                            "email": email,
                            "company": company,
                            "status": "Verified Intake",
                            "sequences_sent": 0
                        }).execute()
                        print(f"   ✅ Tenant Enrolled Node: {email}")
                    except Exception: pass
        except Exception as e:
            print(f"   ❌ Read failure on template asset {file}: {str(e)}")

if __name__ == "__main__":
    upload_leads()
