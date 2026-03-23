from telethon.sync import TelegramClient
import os
import json
from datetime import datetime
import sys

# Add the src directory to the path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from config import TRACKED_COINS
from pipeline.sentiment import analyze_post_alpha

def scrape_telegram():
    print("Telegram Alpha: Monitoring signal channels...")
    
    api_id = os.getenv("TELEGRAM_API_ID")
    api_hash = os.getenv("TELEGRAM_API_HASH")
    
    if not api_id or not api_hash:
        print("Telegram Alpha Error: Missing API_ID or API_HASH in environment.")
        print(json.dumps([]))
        return

    try:
        api_id = int(api_id)
    except ValueError:
        print(f"Telegram Alpha Error: Invalid API_ID format: {api_id}")
        print(json.dumps([]))
        return
    
    channels = ["@MemeCoinSignals", "@CryptoMoonShots", "@BinanceKillers"]
    posts = []
    
    try:
        with TelegramClient("sigma_spy_session", api_id, api_hash) as client:
            for channel in channels:
                for message in client.get_messages(channel, limit=20):
                    if not message.text: continue
                    
                    text = message.text
                    # SIGMA Intelligence Check: Is this a tracked meme asset?
                    for ticker in TRACKED_COINS:
                        if ticker.lower() in text.lower():
                            label, score = analyze_post_alpha(text)
                            posts.append({
                                "platform": "telegram",
                                "text": text,
                                "coin_ticker": ticker,
                                "engagement": 10, # Telegram base-weighting
                                "sentiment_label": label,
                                "sentiment_score": score,
                                "author": "hidden_spy",
                                "timestamp": message.date.isoformat()
                            })
        
        print(f"Telegram Alpha: Scraped {len(posts)} messages")
        print(json.dumps(posts))
    except Exception as e:
        print(f"Telegram scraper error: {str(e)}")
        print(json.dumps([]))

if __name__ == "__main__":
    scrape_telegram()