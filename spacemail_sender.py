import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_spacemail(to_email, subject, body, is_html=True, existing_server=None):
    sender_email = "branden@hirerainmakers.com"
    sender_password = "Teamrain365!"
    
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject
    
    msg.attach(MIMEText(body, 'html' if is_html else 'plain'))
    
    try:
        server = existing_server if existing_server else smtplib.SMTP_SSL("://spacemail.com", 465)
        if not existing_server:
            server.login(sender_email, sender_password)
            
        server.sendmail(sender_email, to_email, msg.as_string())
        
        if not existing_server:
            server.quit()
        print(f"Success! Outreach sent to {to_email}")
        return True
    except Exception as e:
        print(f"⚠️ Spacemail transaction error: {e}")
        return False

def send_batch_campaign(leads_list, subject, body_template):
    try:
        server = smtplib.SMTP_SSL("://spacemail.com", 465)
        server.login("branden@hirerainmakers.com", "Teamrain365!")
        
        for lead in leads_list:
            personalized_body = body_template.replace("{{company}}", lead.get("company", "Business"))
            send_spacemail(lead["email"], subject, personalized_body, is_html=True, existing_server=server)
            
        server.quit()
    except Exception as e:
        print(f"❌ Batch delivery loop failure: {e}")

if __name__ == "__main__":
    print("Testing secure bulk pipeline configurations...")
    send_spacemail("branden@hirerainmakers.com", "Test Verification", "<h3>Pipeline Live</h3>")
