import requests
from datetime import datetime

def explore_tweets():
    tweet_response = requests.get('http://localhost:3001/tweets')
    reply_response = requests.get('http://localhost:3001/replies')
    if tweet_response.status_code == 200 and reply_response.status_code == 200:
        tweets = tweet_response.json()
    
        replies=reply_response.json()
        reply_ids=replies.keys()

        descriptions = {}
        if len(tweets) > 10:
            sorted_tweets = sorted(tweets, key=lambda x: datetime.fromisoformat(
                x['createdAt']), reverse=True)
            latest_tweets = sorted_tweets[:10]
            for tweet in latest_tweets:
                descriptions[tweet['id']] = {}
                descriptions[tweet['id']]["tweet"]=tweet['description']
                if tweet["replies"] in reply_ids:
                     descriptions[tweet['id']]["replies"]=replies[tweet["replies"]]

                # print(tweet)
        else:
            for tweet in tweets:
                descriptions[tweet['id']] = {}
                descriptions[tweet['id']]["tweet"]=tweet['description']
                if tweet["replies"] in reply_ids:
                     descriptions[tweet['id']]["replies"]=replies[tweet["replies"]]
                # if tweet["replies"] in reply_ids:
                #     descriptions[tweet['id']]+=replies[tweet["replies"]]
                # replies[tweet["replies"]]
                # print(tweet)
    else:
        print(f"Request failed with status code {tweet_response.status_code}")
    return descriptions


tweet_list = explore_tweets()
print(tweet_list)

