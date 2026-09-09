import requests

SITE_API_URL = "https://surgecrm.site"

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
        response = requests.post(SITE_API_URL, json=payload, timeout=5)
        if 200 <= response.status_code < 300:
            print(f"⚡ Live Sync: Added {company_name} to your SurgeCRM dashboard!")
            return True
        else:
            print(f"⚠️ Production API responded with code {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Connection to live server failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing secure live production server API integration loop...")
    add_to_web_opportunities("Test Enterprise LLC", "Branden Test", "test@test.com")
