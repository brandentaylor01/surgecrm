import subprocess
from agent_scraper import search_and_scrape_prospects

def launch_targeted_hunt():
    # Targets experiencing hiring pinches, payment processing, or operational strains
    target_verticals = [
        "sales+hiring+struggle+contact",
        "b2b+collections+invoice+issue",
        "accounts+receivable+management",
        "urgent+hiring+sales+representative"
    ]
    
    print("🚀 Deploying Rainmaker Agent for bottleneck targets...")
    for target in target_verticals:
        search_and_scrape_prospects(target)
        
    print("\n🎯 Target acquisition complete! Ready for outreach loop.")

if __name__ == "__main__":
    launch_targeted_hunt()
