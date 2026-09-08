import subprocess
import webbrowser
import time
import os

def launch():
    print("Starting local CRM environment...")
    
    # 1. Trigger deployment setup scripts
    if os.path.exists("local_deploy.py"):
        subprocess.run(["python3", "local_deploy.py"])
        
    # 2. Boot up the Next.js local server
    print("Launching dev server...")
    proc = subprocess.Popen(
        ["npm", "run", "dev"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    
    # 3. Grace periods for local server bind
    time.sleep(3)
    
    # 4. Open dashboard in default browser
    webbrowser.open("http://localhost:3000")
    print("Dashboard open! Press Ctrl+C to stop.")
    
    try:
        proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        proc.terminate()

if __name__ == "__main__":
    launch()
