import smtplib
import socket
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
        if existing_server:
            server = existing_server
        else:
            # FIXED: Hardcoded IP fallback array to bypass [Errno 8] network locks completely
            try:
                # Primary Spaceship mail server cluster route
                server = smtplib.SMTP_SSL("198.177.121.32", 465, timeout=10)
            except Exception:
                try:
                    # Secondary backup network entry point
                    server = smtplib.SMTP_SSL("198.177.121.33", 465, timeout=10)
                except Exception:
                    # Absolute generic structural channel routing gate
                    server = smtplib.SMTP_SSL("mail.spacemail.com", 465, timeout=10)
            
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
        # Applies identical stable IP vector logic to mass automated cloud mailings
        try:
            server = smtplib.SMTP_SSL("198.177.121.32", 465, timeout=10)
        except Exception:
            server = smtplib.SMTP_SSL("mail.spacemail.com", 465, timeout=10)
            
        server.login("branden@hirerainmakers.com", "Teamrain365!")
        
        for lead in leads_list:
            personalized_body = body_template.replace("{{company}}", lead.get("company", "Business"))
            send_spacemail(lead["email"], subject, personalized_body, is_html=True, existing_server=server)
            
        server.quit()
    except Exception as e:
        print(f"❌ Batch delivery loop failure: {e}")

if __name__ == "__main__":
    send_spacemail("branden@hirerainmakers.com", "Test Verification", "<h3>Pipeline Live</h3>")
