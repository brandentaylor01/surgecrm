import json
import os

LEADS_FILE = "leads.json"

def print_queue_summary():
    if not os.path.exists(LEADS_FILE):
        print("No leads file found. Run your scraper first!")
        return
        
    with open(LEADS_FILE, "r") as f:
        leads = json.load(f)
        
    print("\n" + "="*50)
    print("       CURRENT CAMPAIGN OUTBOUND QUEUE")
    print("="*50)
    
    for i, lead in enumerate(leads, 1):
        name = lead.get("name", "Unknown")
        email = lead.get("email", "No Email")
        company = lead.get("company", "Unknown Company")
        
        # Check if the lead has already been contacted
        status = "✉️ SENT" if lead.get("contacted") else "⏳ PENDING"
        
        print(f"{i}. [{status}] {name} | {company} ({email})")
        
    print("="*50 + "\n")

if __name__ == "__main__":
    print_queue_summary()
