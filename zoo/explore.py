import requests
from datetime import datetime

def explore_tweets():
    response = requests.get('http://localhost:3001/tweets')
    if response.status_code == 200:
        tweets = response.json()
        descriptions = {}
        if len(tweets) > 10:
            sorted_tweets = sorted(tweets, key=lambda x: datetime.fromisoformat(
                x['createdAt']), reverse=True)
            latest_tweets = sorted_tweets[:10]
            for tweet in latest_tweets:
                descriptions[tweet['id']] = tweet['description']
                print(tweet)
        else:
            for tweet in tweets:
                descriptions[tweet['id']] = tweet['description']
                print(tweet)
    else:
        print(f"Request failed with status code {response.status_code}")
    return descriptions


tweet_list = explore_tweets()
print(tweet_list)

