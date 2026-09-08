import os, time, requests, random
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from spacemail_sender import send_spacemail

# 1. Update this to your ACTUAL Supabase project reference URL!
# Example: "https://supabase.co"
SUPABASE_URL = "https://supabase.co"
SUPABASE_KEY = "sb_publishable_CJ3gu19QTicTZq_W2M2inA_UglF98EL"

# 2. Dynamic targeting lists to ensure loops always fish for brand new target audiences
TARGET_SECTORS = ['Logistics', 'Solar Energy', 'Material Handling', 'Commercial Security', 'Packaging']
TARGET_CITIES = ['Cleveland, OH', 'Columbus, OH', 'Cincinnati, OH', 'Dayton, OH', 'Toledo, OH']

def stream_direct_to_supabase(payload):
    headers = {
        "apikey": SUPABASE_KEY, 
        "Authorization": f"Bearer {SUPABASE_KEY}", 
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    try:
        res = requests.post(SUPABASE_URL, headers=headers, json=payload, timeout=8)
        return res.status_code < 300
    except Exception: 
        return False

def fire_instant_outreach(lead):
    name = lead.get("name", "Founder")
    email = lead.get("email")
    if not email or email == "N/A": return
    
    subject = "outbound pipeline"
    tracking_url = f"https://vercel.app{requests.utils.quote(email)}&client=rainmaker"
    
    body = (
        f"<p style='font-family:sans-serif;font-size:13px;color:#111;line-height:1.6;'>Hi {name},</p>"
        f"<p style='font-family:sans-serif;font-size:13px;color:#111;line-height:1.6;'>"
        f"I noticed your group is actively expanding customer acquisition efforts across the region.</p>"
        f"<p style='font-family:sans-serif;font-size:13px;color:#111;line-height:1.6;'>"
        f"Most founders are exhausted by agencies that blast generic lists and vanish. We do the opposite—we build your outbound workflows and take accountability for the actual conversion cycles.</p>"
        f"<p style='font-family:sans-serif;font-size:13px;color:#111;line-height:1.6;'>"
        f"Would you be open to reviewing a short, 3-sentence breakdown of how we added <strong>$42k in revenue in just one month</strong> for a similar team?</p>"
        f"<p style='font-family:sans-serif;font-size:13px;color:#111;line-height:1.6;'>"
        f"Best,<br><br>Branden Taylor<br><strong>RAINMAKER</strong></p>"
        f"<img src='{tracking_url}' width='1' height='1' style='display:none;' />"
    )
    send_spacemail(email, subject, body, is_html=True)

def run_247_dataaxle_cloud_harvest():
    # Pick a completely random target vector for this execution loop
    current_sector = random.choice(TARGET_SECTORS)
    current_city = random.choice(TARGET_CITIES)
    print(f"🚀 Initializing Data Axle Scan for: {current_sector} in {current_city}...")
    
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")

if __name__ == "__main__":
    run_247_dataaxle_cloud_harvest()
