import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_spacemail(to_email, subject, body):
    # Verified Spaceship Spacemail settings
    smtp_server = "mail.spacemail.com"
    smtp_port = 465
    
    sender_email = "branden@hirerainmakers.com"
    sender_password = "Teamrain365!"
    
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject
    
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP_SSL(smtp_server, smtp_port)
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, msg.as_string())
        server.quit()
        print(f"Success! Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Spacemail failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing official mail.spacemail.com endpoint...")
    send_spacemail("branden@hirerainmakers.com", "Test", "Success!")
