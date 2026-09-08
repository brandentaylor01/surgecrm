import requests

# Routes directly through your local development server gateway channel
SITE_API_URL = "http://localhost:3000/api/opportunities"

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
        # Direct mathematical check for standard insertion success
        if response.status_code >= 200 and response.status_code < 300:
            print(f"⚡ Live Sync: Added {company_name} to your local CRM dashboard!")
            return True
        else:
            print(f"⚠️ Local API responded with code {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Connection to local server failed: {e}")
        print("💡 Tip: Make sure 'npm run dev' is actively running in your first terminal!")
        return False

if __name__ == "__main__":
    print("Testing secure local server API integration loop...")
    add_to_web_opportunities("Test Enterprise LLC", "Branden Test", "test@test.com")
