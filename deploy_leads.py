import requests
TARGET_API_ENDPOINT = "https://vercel.app"
def stream_lead_to_crm(payload):
    print(f"[⚙️ SYSTEM] Transmitting lead: {payload.get('company')}")
    try:
        res = requests.post(TARGET_API_ENDPOINT, headers={"Content-Type": "application/json"}, json=payload, timeout=10)
        if res.status_code == 200:
            print(f"[✅ SUCCESS] Ingested. ID: {res.json().get('lead', {}).get('id')}"); return True
        print(f"[❌ SERVER ERROR] Code {res.status_code}. Response: {res.text[:200]}"); return False
    except Exception as e:
        print(f"[🚨 FAILURE] Error: {e}"); return False
if __name__ == "__main__":
    leads = [{"company": "Cleveland Logistics", "city": "Cleveland", "email": "ops@clevelandspeedy3pl.com", "status": "New", "value": 24000}, {"company": "Columbus Solar", "city": "Columbus", "email": "partnerships@columbussolarohio.com", "status": "New", "value": 18500}]
    for l in leads: stream_lead_to_crm(l)