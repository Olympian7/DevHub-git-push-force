import requests
import json

HEADERS = {"User-Agent": "memescan/1.0"}

url = "https://www.reddit.com/r/cryptocurrency/new.json?limit=5"
response = requests.get(url, headers=HEADERS, timeout=10)
print(f"Status: {response.status_code}")

if response.status_code == 200:
    data = response.json()
    print(f"Found {len(data['data']['children'])} posts")
    for i, post in enumerate(data['data']['children'][:2]):
        print(f"Post {i+1}: {post['data']['title'][:50]}...")
else:
    print(f"Error: {response.text}")