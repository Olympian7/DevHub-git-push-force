import requests
import json
from datetime import datetime
import time
import sys
import os

# Add the src directory to the path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from config import TRACKED_COINS
from pipeline.sentiment import analyze_post_alpha

HEADERS = {"User-Agent": "memescan/1.0"}

SUBREDDITS = ["cryptocurrency", "CryptoCurrency", "bitcoin", "CryptoMarkets"]

KEYWORDS = ["memecoin", "moonshot", "100x", "LFG", "WAGMI", "ape in", "just launched", "next doge", "next shib", "next pepe", "DOGE", "SHIB", "PEPE", "FLOKI", "BONK", "WIF","Dogecoin","Siren",
"Pudgy Penguins","FLOKI"]

def extract_coin_mentions(text):
    mentioned = [coin for coin in TRACKED_COINS if coin.lower() in text.lower()]
    return mentioned if mentioned else ["GENERAL"]

def scrape_reddit():
    posts = []
    try:
        for subreddit in SUBREDDITS:
            url = f"https://www.reddit.com/r/{subreddit}/new.json?limit=25"
            try:
                response = requests.get(url, headers=HEADERS, timeout=10)
                print(f"Fetching r/{subreddit}: Status {response.status_code}")
                if response.status_code != 200:
                    print(f"Failed to fetch r/{subreddit}: {response.status_code}")
                    continue
                data = response.json()
                if "data" not in data or "children" not in data["data"]:
                    print(f"Unexpected response structure for r/{subreddit}")
                    continue
                print(f"Found {len(data['data']['children'])} posts in r/{subreddit}")
                post_count = 0
                for post in data["data"]["children"]:
                    if post_count >= 5:  # Limit to 5 posts per subreddit for testing
                        break
                    post_data = post["data"]
                    text = f"{post_data['title']} {post_data.get('selftext', '')}"
                    # For testing, include all posts
                    mentioned_coins = extract_coin_mentions(text)
                    if not mentioned_coins:
                        mentioned_coins = ["GENERAL"]
                    for coin in mentioned_coins:
                        label, score = analyze_post_alpha(text)
                        posts.append({
                            "platform": "reddit",
                            "text": text[:500],
                            "coin_ticker": coin,
                            "engagement": post_data["score"] + post_data["num_comments"],
                            "sentiment_label": label,
                            "sentiment_score": score,
                            "timestamp": datetime.utcnow().isoformat()
                        })
                    post_count += 1
            except Exception as e:
                print(f"Error fetching r/{subreddit}: {str(e)}")
                continue
        print(f"Reddit Alpha: Scraped {len(posts)} posts for analysis")
        print(json.dumps(posts))
    except Exception as e:
        print(f"Reddit scraper error: {str(e)}")
        print(json.dumps([]))

if __name__ == "__main__":
    scrape_reddit()