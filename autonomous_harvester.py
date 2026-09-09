import os, time, requests, random, urllib.parse, uuid, json, smtplib, re
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup

SUPABASE_URL = "https://supabase.co"
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL")
AI_KEY = os.environ.get("OPENAI_API_KEY")

TARGET_SECTORS = ['Logistics', 'Material Handling', 'Commercial Security', 'Packaging']
TARGET_CITIES = ['Cleveland', 'Akron', 'Canton', 'Youngstown']
ROLES = ['Owner', 'CEO', 'President', 'Operations Manager']

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
    # Aggressive pattern lookup matching valid corporate email layout strings
    pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    found = re.findall(pattern, html_content)
    return [e.lower() for e in found if not any(k in e.lower() for k in [
        'png', 'jpg', 'jpeg', 'gif', 'bootstrap', 'w3', 'wix', 'wordpress'
    ])]

def crawl_company_site_deep(driver, domain):
    print(f"🕵️ Deep hunting internal subpages for: {domain}")
    emails = set()
    paths = ['', '/contact', '/about', '/team', '/contact-us', '/about-us']
    
    for path in paths:
        try:
            driver.get(f"https://{domain}{path}")
            time.sleep(2)
            html = driver.page_source
            page_emails = extract_raw_emails_via_regex(html)
            emails.update(page_emails)
            if len(emails) > 3: break # Limit depth to optimize workflow runtime speeds
        except Exception:
            continue
    return list(emails)

def parse_intel_with_ai(raw_text, sector, default_city):
    if not AI_KEY: return []
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
        content = json.loads(data['choices']['message']['content'])
        email = content.get("email")
        if not email or "@" not in email: return []
        return [{
            "id": str(uuid.uuid4()),
            "email": email,
            "company_account": content.get("company_name", f"{sector} Co"),
            "industry_sector": sector.upper(),
            "city": content.get("city", default_city),
            "status": "qualifying",
            "client_workspace": "rainmaker"
        }]
    except Exception: return []

def search_lead_intel(driver, sector, city, role):
    leads = []
    # Broadened search criteria to catch raw domain maps outside of LinkedIn
    query = f'"{sector}" "{city}" company email contact'
    encoded_query = urllib.parse.quote_plus(query)
    
    url = f"https://duckduckgo.com{encoded_query}"
    try:
        driver.get(url)
        time.sleep(random.uniform(4, 8))
        
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        links = []
        for a in soup.find_all('a', href=True):
            href = a['href']
            if 'uddg=' in href:
                actual_url = urllib.parse.unquote(href.split('uddg=')[1].split('&')[0])
                links.append(actual_url)

        # Grabs the top 3 company websites and rips their internal text matrix
        for link in links[:3]:
            domain_match = re.search(r'https?://([^/]+)', link)
            if not domain_match: continue
            domain = domain_match.group(1).replace('www.', '')
            
            if any(k in domain for k in ['duckduckgo', 'google', 'bing', 'yahoo', 'linkedin']):
                continue
                
            found_emails = crawl_company_site_deep(driver, domain)
            for email in found_emails:
                leads.append({
                    "id": str(uuid.uuid4()),
                    "email": email,
                    "company_account": f"{domain.split('.')[0].upper()} LLC",
                    "industry_sector": sector.upper(),
                    "city": city,
                    "status": "qualifying",
                    "client_workspace": "rainmaker"
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
    driver = webdriver.Chrome(options=options)
    
    raw_hits = search_lead_intel(driver, sector, city, role)
    if raw_hits and len(raw_hits) > 0:
        for lead in raw_hits:
            send_autonomous_pitch(lead["email"], lead["company_account"])
        stream_direct_to_supabase(raw_hits)
    else:
        print("ℹ️ No new distinct email signatures discovered in this pass.")
    driver.quit()

if __name__ == "__main__":
    run_247_dataaxle_cloud_harvest()
