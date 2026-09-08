import time
import random
import sys
from agent_scraper import search_and_scrape_prospects

def launch_targeted_hunt():
    # Targets experiencing heavy enterprise bottlenecks
    target_verticals = [
        "sales+hiring+struggle+contact",
        "b2b+collections+invoice+issue",
        "accounts+receivable+management",
        "urgent+hiring+sales+representative"
    ]
    
    print("🚀 Deploying Rainmaker Agent for bottleneck targets...")
    
    for index, target in enumerate(target_verticals):
        print(f"\n⚡ Processing Campaign Target Vector [{index + 1}/{len(target_verticals)}]: {target}")
        
        try:
            # Executes the core search extraction pass
            search_and_scrape_prospects(target)
            
            # FIXED: Add humanized cool-down delay if there are more targets remaining
            if index < len(target_verticals) - 1:
                sleep_time = random.randint(45, 90)
                print(f"⏳ Cooling down browser engine. Sleeping for {sleep_time} seconds to protect Mac RAM...")
                time.sleep(sleep_time)
                
        except Exception as e:
            print(f"⚠️ Vector transaction bypassed due to processing exception: {e}", file=sys.stderr)
            continue
            
    print("\n🎯 Target acquisition complete! Ready for outreach loop.")

if __name__ == "__main__":
    launch_targeted_hunt()
