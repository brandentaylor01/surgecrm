import subprocess
from agent_scraper import search_and_scrape_prospects

def launch_televoi_local_hunt():
    # Local high-intent target vectors in North Canton needing telecom infrastructure
    local_targets = [
        "medical+clinic+north+canton",
        "accounting+firm+north+canton",
        "manufacturing+office+north+canton",
        "insurance+agency+north+canton"
    ]
    
    print("🚀 Rainmaker Agent deploying local VoIP hunt for client: Televoi...")
    for target in local_targets:
        search_and_scrape_prospects(target)
        
    print("\n🎯 Local North Canton lead sweep complete! Verified targets added to database.")

if __name__ == "__main__":
    launch_televoi_local_hunt()
