import time
import random
import sys
from agent_scraper import search_and_scrape_prospects

def launch_televoi_hunt():
    target_verticals = [
        "local+medical+clinic+ohio+contact",
        "insurance+agency+canton+ohio",
        "law+office+cleveland+phone+contact",
        "logistics+brokerage+columbus+ohio"
    ]
    
    print("🚀 Deploying Televoi Agent for phone-heavy enterprise targets...")
    for index, target in enumerate(target_verticals):
        print(f"\n⚡ Processing Televoi Target Vector [{index + 1}/{len(target_verticals)}]: {target}")
        try:
            search_and_scrape_prospects(target)
            if index < len(target_verticals) - 1:
                time.sleep(random.randint(45, 90))
        except Exception as e:
            print(f"⚠️ Vector bypassed: {e}", file=sys.stderr)
            continue
            
    print("\n🎯 Televoi target acquisition complete! Ready for outreach loop.")

if __name__ == "__main__":
    launch_televoi_hunt()
