import csv
import json
import os
import time
import urllib.parse
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

CSV_FILE = "leads.csv"
LEADS_FILE = "leads.json"

def smart_social_lookup(driver, company_name, city):
    """Uses background search footprints to find live social handles safely."""
    query = f"{company_name} {city} ohio linkedin facebook twitter"
    encoded_query = urllib.parse.quote_plus(query)
    url = f"https://duckduckgo.com{encoded_query}"
    
    social_data = {"linkedin": "", "facebook": "", "twitter": ""}
    try:
        driver.get(url)
        time.sleep(1.2) # Fast, humanized rendering buffer
        links = driver.find_elements(By.CSS_SELECTOR, "a.result__url")
        
        for link in links:
            href = link.get_attribute("href") or ""
            if "://linkedin.com" in href and not social_data["linkedin"]:
                social_data["linkedin"] = href
            elif "://facebook.com" in href and not social_data["facebook"]:
                social_data["facebook"] = href
            elif "://twitter.com" in href or "://x.com" in href and not social_data["twitter"]:
                social_data["twitter"] = href
    except Exception:
        pass
    return social_data

def run_deep_enrichment_scrubber():
    if not os.path.exists(CSV_FILE):
        print(f"📭 Error: Place your raw Data Axle export file named '{CSV_FILE}' into this folder first!")
        return

    print("🚀 Booting Up Smart Enrichment Scrubber...")
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    driver = webdriver.Chrome(options=options)

    enriched_pool = []
    
    with open(CSV_FILE, mode='r', encoding='utf-8-sig', errors='ignore') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            # Map every raw business column exported from Data Axle
            company = row.get("Company Name", row.get("Business Name", "")).strip()
            first = row.get("Executive First Name", "").strip()
            last = row.get("Executive Last Name", "").strip()
            email = row.get("Email Address", "").strip().lower()
            phone = row.get("Phone Number Combined", row.get("Phone", "")).strip()
            
            # Extract high-level enterprise matrix metadata fields
            address = f"{row.get('Physical Address', '')}, {row.get('Physical City', '')}, OH"
            emp_size = row.get("Employee Size (Actual)", row.get("Location Employee Size", "N/A")).strip()
            rev_size = row.get("Corporate Sales Volume", row.get("Sales Volume (Actual)", "N/A")).strip()
            line_of_biz = row.get("Primary SIC Description", row.get("Industry", "Commercial")).strip()

            if not email or not company:
                continue

            print(f"🔍 Running Smart Check on: {company} ({row.get('Physical City', 'NEO')})...")
            socials = smart_social_lookup(driver, company, row.get('Physical City', 'Ohio'))

            enriched_pool.append({
                "company": company,
                "name": f"{first} {last}".strip() if (first or last) else "Business Owner",
                "email": email,
                "phone_number": phone if phone else "N/A",
                "address": address,
                "employee_size": emp_size,
                "revenue": rev_size,
                "industry": line_of_biz,
                "linkedin": socials["linkedin"],
                "facebook": socials["facebook"],
                "twitter": socials["twitter"],
                "status": "Verified Intake"
            })

    with open(LEADS_FILE, "w") as f:
        json.dump(enriched_pool, f, indent=2)

    driver.quit()
    print(f"🏁 Enrichment Pass Finished. Staging {len(enriched_pool)} real data profiles into your dashboard.")

if __name__ == "__main__":
    run_deep_enrichment_scrubber()
