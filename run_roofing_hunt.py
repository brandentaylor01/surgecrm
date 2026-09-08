import subprocess
from agent_scraper import search_and_scrape_prospects

def launch_ohio_roofing_hunt():
    # Targeted search segments across active Ohio storm sectors
    ohio_storm_vectors = [
        "property+management+columbus+ohio",
        "real+estate+investments+cleveland",
        "property+management+cincinnati+ohio",
        "commercial+real+estate+toledo",
        "residential+asset+manager+dayton"
    ]
    
    print("🚀 Rainmaker Agent deploying storm-chaser roofing campaign hunt...")
    for target in ohio_storm_vectors:
        search_and_scrape_prospects(target)
        
    print("\n🎯 Ohio property lead sweep complete! Pipelines loaded.")

if __name__ == "__main__":
    launch_ohio_roofing_hunt()
