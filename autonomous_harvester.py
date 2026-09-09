import os, time, requests, random, urllib.parse, uuid, json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

SUPABASE_URL = "https://supabase.co"
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL")
AI_KEY = os.environ.get("OPENAI_API_KEY")

TARGET_SECTORS = ['Logistics', 'Material Handling', 'Commercial Security', 'Packaging']
TARGET_CITIES = ['Cleveland', 'Akron', 'Canton', 'Youngstown']
ROLES = ['Owner', 'CEO', 'President', 'Operations Manager']

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

def parse_intel_with_ai(raw_text, sector, default_city):
    if not AI_KEY:
        # Fallback tracking payload if no API key is present
        return [{
            "id": str(uuid.uuid4()),
            "email": "info@placeholder.com",
            "company_account": f"{sector} Company",
            "industry_sector": sector.upper(),
            "city": default_city,
            "status": "qualifying"
        }]

    # Instructs the AI layer to parse unstructured search text into real data
    prompt = f"Extract business email, real company name, and Ohio city from this text: {raw_text}"
    try:
        res = requests.post(
            "https://openai.com",
            headers={"Authorization": f"Bearer {AI_KEY}", "Content-Type": "application/json"},
            json={
                "model": "gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
                "response_format": { "type": "json_object" }
            },
            timeout=10
        )
        data = res.json()
        content = json.loads(data['choices'][0]['message']['content'])
        
        return [{
            "id": str(uuid.uuid4()),
            "email": content.get("email"),
            "company_account": content.get("company_name", f"{sector} Co"),
            "industry_sector": sector.upper(),
            "city": content.get("city", default_city),
            "status": "qualifying",
            "client_workspace": "rainmaker"
        }]
    except Exception:
        return []

def search_lead_intel(driver, sector, city, role):
    leads = []
    query = f'site:://linkedin.com "{role}" "{sector}" "{city}" email'
    encoded_query = urllib.parse.quote_plus(query)
    
    search_engines = [
        f"https://duckduckgo.com{encoded_query}",
        f"https://bing.com{encoded_query}"
    ]
    
    url = random.choice(search_engines)
    try:
        driver.get(url)
        time.sleep(random.uniform(3, 7))
        
        page_text = driver.find_element(By.TAG_NAME, "body").text
        parsed_leads = parse_intel_with_ai(page_text[:2000], sector, city)
        leads.extend(parsed_leads)
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
    if raw_hits and raw_hits[0].get("email") != "info@placeholder.com":
        print(f"📈 Found actual contact: {raw_hits[0]['email']}. Syncing...")
        stream_direct_to_supabase(raw_hits)
    else:
        print("ℹ️ Waiting for AI Key validation to stream live records.")
        
    driver.quit()

if __name__ == "__main__":
    run_247_dataaxle_cloud_harvest()
