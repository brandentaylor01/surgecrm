import requests

SUPABASE_URL = "https://supabase.co"
SUPABASE_KEY = "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL"

def add_to_web_opportunities(company_name, contact_name, email, value=2500):
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    payload = {
        "company": company_name,
        "name": contact_name,
        "email": email,
        "value": value,
        "status": "In Negotiation",
        "priority": "High"
    }
    try:
        response = requests.post(SUPABASE_URL, headers=headers, json=payload, timeout=10)
        # Direct math check for successful insertion status codes
        if response.status_code >= 200 and response.status_code < 300:
            print(f"⚡ Live Sync: Added {company_name} to your web CRM dashboard!")
            return True
        else:
            print(f"⚠️ Supabase response {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"❌ HTTP sync connection failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing restful webhook connection channel...")
    add_to_web_opportunities("Test Enterprise LLC", "Branden Test", "test@test.com")
