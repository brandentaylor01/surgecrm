#!/bin/bash
while true
do
  echo "🚀 Launching autonomous lead generation loop..."
  
  # 1. Execute your internal automated lead data scraper
  python3 autonomous_harvester.py
  
  # 2. Tell the system to pause for 1 hour before sweeping the next Northeast Ohio zip code matrix
  echo "⏳ Batch complete. Throttling data extraction for 1 hour to keep search footprints safe..."
  sleep 3600
done
