import time
import random
import sys
from agent_scraper import search_and_scrape_prospects

def launch_roofing_hunt():
    target_verticals = [
        "commercial+property+management+cleveland",
        "manufacturing+facility+akron+ohio",
        "industrial+warehouse+canton+contact",
        "self+storage+facility+columbus+ohio"
    ]
    
    print("🚀 Deploying Aim Restoration Agent for storm damage evaluation targets...")
    for index, target in enumerate(target_verticals):
        print(f"\n⚡ Processing Aim Restoration Vector [{index + 1}/{len(target_verticals)}]: {target}")
        try:
            search_and_scrape_prospects(target)
            if index < len(target_verticals) - 1:
                time.sleep(random.randint(45, 90))
        except Exception as e:
            print(f"⚠️ Vector bypassed: {e}", file=sys.stderr)
            continue
            
    print("\n🎯 Aim Restoration target acquisition complete! Ready for inspection loop.")

if __name__ == "__main__":
    launch_roofing_hunt()
