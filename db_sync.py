import requests

# We route directly through your site's secure API pipeline channel
SITE_API_URL = "https://vercel.app"

def add_to_web_opportunities(company_name, contact_name, email, value=2500):
    payload = {
        "company": company_name,
        "name": contact_name,
        "email": email,
        "value": value,
        "status": "In Negotiation",
        "priority": "High"
    }
    
    try:
        # Pings your website directly, bypassing Supabase 405 gateway blocks
        response = requests.post(SITE_API_URL, json=payload, timeout=10)
        
        if response.status_code >= 200 and response.status_code < 300:
            print(f"⚡ Live Sync: Added {company_name} to your web CRM dashboard!")
            return True
        else:
            print(f"⚠️ Website API responded with code {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Connection to website api failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing secure website API integration loop...")
    add_to_web_opportunities("Test Enterprise LLC", "Branden Test", "test@test.com")
