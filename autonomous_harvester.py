import os, time, requests, random, urllib.parse
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

# Fixed to use your exact live Supabase project database URL
SUPABASE_URL = "https://supabase.co"
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL")

TARGET_SECTORS = ['Logistics', 'Material Handling', 'Commercial Security', 'Packaging']
TARGET_CITIES = ['Cleveland, OH', 'Akron, OH', 'Canton, OH', 'Youngstown, OH']
ROLES = ['Owner', 'CEO', 'President', 'Operations Manager', 'Director']

def stream_direct_to_supabase(payload):
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    try:
        res = requests.post(SUPABASE_URL, headers=headers, json=payload, timeout=8)
        return res.status_code < 300
    except Exception as e:
        print(f"Sync error: {str(e)}")
        return False

def search_lead_intel(driver, sector, city, role):
    leads = []
    query = f'site:://linkedin.com "{role}" "{sector}" "{city}" email'
    encoded_query = urllib.parse.quote_plus(query)
    
    search_engines = [
        f"https://duckduckgo.com{encoded_query}",
        f"https://bing.com{encoded_query}"
    ]
    
    url = random.choice(search_engines)
    print(f"🔍 Harvesting via: {url}")
    
    try:
        driver.get(url)
        time.sleep(random.uniform(3, 7))
        
        page_text = driver.find_element(By.TAG_NAME, "body").text
        words = page_text.split()
        
        emails = set([w.strip("(),.递") for w in words if "@" in w and "." in w])
        
        for email in emails:
            low = email.lower()
            if not any(k in low for k in ['embold', 'marketing', 'design', 'agency']):
                # Perfectly targets your specific database schema columns
                leads.append({
                    "email": email,
                    "company": f"{sector} Lead ({role})",
                    "name": "Valued Partner",
                    "contacted": False
                })
    except Exception as e:
        print(f"Scrape pass exception: {str(e)}")
        
    return leads

def run_247_dataaxle_cloud_harvest():
    sector = random.choice(TARGET_SECTORS)
    city = random.choice(TARGET_CITIES)
    role = random.choice(ROLES)
    print(f"🚀 Initializing Deep Hunt for: {role} - {sector} in {city}...")
    
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-extensions")
    
    chrome_bin = os.environ.get("CHROME_BIN")
    if chrome_bin:
        options.binary_location = chrome_bin

    driver = webdriver.Chrome(options=options)
    
    raw_hits = search_lead_intel(driver, sector, city, role)
    if raw_hits:
        print(f"📈 Found {len(raw_hits)} fresh contacts. Syncing to database...")
        stream_direct_to_supabase(raw_hits)
    else:
        print("ℹ️ No new distinct email signatures discovered in this pass.")
        
    driver.quit()

if __name__ == "__main__":
    run_247_dataaxle_cloud_harvest()
