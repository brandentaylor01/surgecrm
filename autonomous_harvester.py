import os, time, requests, random, urllib.parse, uuid, json, smtplib, re
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

SUPABASE_URL = "https://supabase.co"
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL")
AI_KEY = os.environ.get("OPENAI_API_KEY")

# Target sectors matching trades, commercial contractors, and small industrial outfits
TARGET_SECTORS = [
    'Roofing Contractor', 'HVAC Mechanical', 'Electrical Contractor',
    'Commercial Plumbing', 'Excating Concrete', 'Tree Service Commercial',
    'Machine Shop Industrial', 'Metal Fabrication', 'Warehousing Logistics'
]

# Strategic matrix of Northeast Ohio hubs covering every primary trade zone
NE_OHIO_ZIPS = [
    '44310', '44312', '44319', '44305', '44720', '44702', '44256', '44087',
    '44221', '44266', '44236', '44281', '44691', '44114', '44130', '44139'
]

ROLES = ['Owner', 'CEO', 'President', 'Partner', 'Founder']

def send_autonomous_pitch(to_email, company_name):
    msg = MIMEMultipart()
    msg['From'] = '"Branden Taylor" <branden@hirerainmakers.com>'
    msg['To'] = to_email
    msg['Subject'] = 'operational bottleneck?'

    body = f"""<p>Hi Partner,</p>
    <p>Most business owners I speak with in Ohio tell me they are completely fed up with the
    exhausting cycle of recruiting, training, and managing sales staff—only for them to
    underperform or leave right when the pipeline starts moving.</p>
    <p>We built Rainmaker Sales LLC as a white-label solution to solve that exact headache.
    We completely take over the hiring, training, marketing, and closing execution from
    start to finish, so you can just focus on operations.</p>
    <p>I have no idea if your team at {company_name} is currently dealing with workflow shortages
    right now, or if you already have a locked-in staff that hits their numbers every week.</p>
    <p>Either way, do you have 15 minutes next week to see if it makes sense to explore
    this further? If not, no worries at all.</p>"""
    
    msg.attach(MIMEText(body, 'html'))
    try:
        with smtplib.SMTP("smtp.spaceship.email", 587) as server:
            server.starttls()
            server.login("branden@hirerainmakers.com", "Teamrain365!")
            server.sendmail("branden@hirerainmakers.com", to_email, msg.as_string())
        print(f"   📬 Automated Outbound Success: Pitch sent cleanly to {to_email}")
        return True
    except Exception as e:
        print(f"   ⚠️ Cloud SMTP Block: {str(e)}")
        return False

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

def extract_raw_emails_via_regex(html_content):
    pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    found = re.findall(pattern, html_content)
    return [e.lower() for e in found if not any(k in e.lower() for k in [
        'png', 'jpg', 'jpeg', 'gif', 'bootstrap', 'w3', 'wix', 'wordpress'
    ])]

def crawl_company_site_deep(driver, domain):
    emails = set()
    paths = ['', '/contact', '/about', '/team', '/contact-us', '/about-us']
    for path in paths:
        try:
            driver.get(f"https://{domain}{path}")
            time.sleep(2)
            page_emails = extract_raw_emails_via_regex(driver.page_source)
            emails.update(page_emails)
            if len(emails) > 2: break
        except Exception: continue
    return list(emails)

def parse_intel_with_ai(raw_text, sector, zip_code):
    if not AI_KEY: return []
    prompt = (
        f"Analyze this raw scraped contractor directory context: '{raw_text[:2500]}'. "
        f"Extract real business data rows matching the sector '{sector}' near zip '{zip_code}'. "
        f"Format response strictly as a JSON object with a single root key 'leads' containing an array of objects. "
        f"Each object must use keys exactly: 'email', 'company_name', 'city', 'domain', 'executive_name'."
    )
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
        content = json.loads(data['choices']['message']['content'])
        leads_out = []
        for item in content.get("leads", []):
            email = item.get("email")
            if email and "@" in email:
                leads_out.append({
                    "id": str(uuid.uuid4()),
                    "email": email,
                    "company_account": item.get("company_name", f"{sector} Contractor"),
                    "industry_sector": sector.upper(),
                    "city": item.get("city", "Northeast Ohio"),
                    "status": "qualifying",
                    "client_workspace": "rainmaker"
                })
        return leads_out
    except Exception: return []

def search_lead_intel(driver, sector, zip_code, role):
    leads = []
    # High-intensity search dork targeting contractors and private phone/email structures
    dorks = [
        f'"{sector}" "{zip_code}" "owner" email OR contact',
        f'site:://linkedin.com "{role}" "{sector}" "Greater Cleveland" OR "Akron"',
        f'"{sector}" "{zip_code}" "email"'
    ]
    query = random.choice(dorks)
    encoded_query = urllib.parse.quote_plus(query)
    
    # Bypasses normal engines by targeting raw regional directory streams directly
    fallback_url = (
        f"https://yellowpages.com?"
        f"search_terms={urllib.parse.quote(sector)}&"
        f"geo_location={zip_code}"
    )
    
    try:
        print(f"🔍 Scraping regional trade coordinates for Zip [{zip_code}]...")
        driver.get(fallback_url)
        time.sleep(random.uniform(4, 7))
        page_text = driver.find_element(By.TAG_NAME, "body").text
        
        parsed_leads = parse_intel_with_ai(page_text, sector, zip_code)
        if parsed_leads:
            leads.extend(parsed_leads)
    except Exception as e:
        print(f"Scrape pass exception: {str(e)}")
        
    return leads

def run_247_dataaxle_cloud_harvest():
    sector = random.choice(TARGET_SECTORS)
    zip_code = random.choice(NE_OHIO_ZIPS)
    role = random.choice(ROLES)
    print(f"🚀 Initializing Dynamic Search Grid: {role} - {sector} inside Zip [{zip_code}]...")
    
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)
    
    raw_hits = search_lead_intel(driver, sector, zip_code, role)
    if raw_hits and len(raw_hits) > 0:
        print(f"📈 Sourced {len(raw_hits)} targeted small business trades. Initiating blasts...")
        for lead in raw_hits:
            send_autonomous_pitch(lead["email"], lead["company_account"])
        stream_direct_to_supabase(raw_hits)
    else:
        print("ℹ️ Zip radius sweep complete. Moving to next automated cron slot.")
    driver.quit()

if __name__ == "__main__":
    run_247_dataaxle_cloud_harvest()
