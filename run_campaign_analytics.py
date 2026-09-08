import json
import os

LEADS_FILE = "leads.json"

def analyze_pipeline():
    if not os.path.exists(LEADS_FILE):
        print("Pipeline is clear. Feed your scraper first.")
        return

    with open(LEADS_FILE, "r") as f:
        leads = json.load(f)

    total = len(leads)
    contacted = sum(1 for l in leads if l.get("contacted") is True)
    queue = total - contacted

    print("=" * 30)
    print(" RAINMAKER CRM LEADS ANALYTICS ")
    print("=" * 30)
    print(f"📈 Total Profiles Scraped : {total}")
    print(f"✉️ Outreach Dispatched    : {contacted}")
    print(f"⏳ Leads Pending in Queue : {queue}")
    print("=" * 30)

if __name__ == "__main__":
    analyze_pipeline()
