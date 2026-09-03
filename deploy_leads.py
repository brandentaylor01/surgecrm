import os
import sys
import json
import requests
from datetime import datetime

# Server Destination Configuration Node
TARGET_API_ENDPOINT = "http://localhost:3000/api/leads"

def stream_lead_to_crm(lead_payload):
    """
    Transmits a parsed lead payload bundle directly into the Next.js API core.
    """
    print(f"[⚙️ SYSTEM] Transmitting lead record target for: {lead_payload.get('company')}")
    
    try:
        # Fire network HTTP POST payload transmission
        response = requests.post(
            TARGET_API_ENDPOINT,
            headers={"Content-Type": "application/json"},
            json=lead_payload,
            timeout=10
        )
        
        if response.status_code == 200:
            server_data = response.json()
            print(f"[✅ SUCCESS] Lead successfully ingested. Cluster ID: {server_data.get('lead', {}).get('id')}")
            return True
        else:
            print(f"[❌ SERVER ERROR] Rejected status code: {response.status_code} - {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("[🚨 CONNECTION FAILURE] Could not reach Next.js server cores.")
        print("👉 Make sure your Next.js local cluster is active via: npm run dev")
        return False
    except Exception as e:
        print(f"[🚨 FAILURE] Unhandled automation exception met: {str(e)}")
        return False

if __name__ == "__main__":
    print("==================================================")
    print("⚡ SURGECRM UTILITY // LEAD PIPELINE INGEST STREAM")
    print("==================================================")
    
    # 1. Compile fresh programmatic mock data payload targets
    mock_scraped_leads = [
        {
            "company": "Cleveland Logistics Logistics",
            "city": "Cleveland",
            "niche": "Logistics 3PL Services",
            "email": "ops@clevelandspeedy3pl.com",
            "status": "New",
            "value": 24000,
            "assignedClientId": "client_1"
        },
        {
            "company": "Columbus Solar Solutions",
            "city": "Columbus",
            "niche": "Renewable Energy",
            "email": "partnerships@columbussolarohio.com",
            "status": "New",
            "value": 18500,
            "assignedClientId": "client_1"
        }
    ]
    
    # 2. Iterate and feed lead clusters down network pipes sequentially
    processed_count = 0
    for lead in mock_scraped_leads:
        success = stream_lead_to_crm(lead)
        if success:
            processed_count += 1
            
    print("==================================================")
    print(f"📊 INGEST CONCLUSION: Transmitted ({processed_count}/{len(mock_scraped_leads)}) records safely.")
    print("==================================================")
