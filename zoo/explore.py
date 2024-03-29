import requests
import json
from datetime import datetime
from pymongo import MongoClient
from dotenv import dotenv_values

config = dotenv_values(".env")
mongodb_client = MongoClient(config["ATLAS_URI"])
db = mongodb_client[config["DB_NAME"]]
collection = db['tweets']
tweet_response = collection.find()
for _ in tweet_response:
    print(_)



def get_tweets(userId):
    # tweet_response = requests.get('http://localhost:3001/tweets')

    # db = client['test']
    # collection = db['tweets']
    # tweet_response = collection.find()
    # print(tweet_response)




    if tweet_response.status_code == 200:
        # tweets = tweet_response.json()
        descriptions = []
        tweets = [tweet for tweet in tweet_response.json() if tweet['userId'] == userId]
        if len(tweets) > 5:
            sorted_tweets = sorted(tweets, key=lambda x: datetime.fromisoformat(
                x['createdAt']), reverse=True)
            latest_tweets = sorted_tweets[:10]
            for tweet in latest_tweets:
                descriptions.append(tweet['description'])
        else:
            for tweet in tweets:
                descriptions.append(tweet['description'])

    else:
        print(f"Request failed with status code {tweet_response.status_code}")
    return descriptions

def explore_tweets():
    tweet_response = requests.get('http://localhost:3001/tweets')
    reply_response = requests.get('http://localhost:3001/replies') # for now retireve all tweets, once we shift to mongo db it wont matter
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
                key=tweet['userId']+"-"+tweet['id']
                descriptions[key] = {}
                descriptions[key]["tweet"]=tweet['description']
                if tweet["replies"] in reply_ids:
                     descriptions[key]["replies"]=replies[tweet["replies"]]

                # print(tweet)
        else:
            for tweet in tweets:
                key=tweet['userId']+"-"+tweet['id']
                descriptions[key] = {}
                descriptions[key]["tweet"]=tweet['description']
                descriptions[key]["replies"]={}
                if tweet["replies"] in reply_ids:
                     descriptions[key]["replies"]=replies[tweet["replies"]]
               
    else:
        print(f"Request failed with status code {tweet_response.status_code}")
    indexed_descriptions=dict()
    for i,key in enumerate(descriptions.keys()):
        indexed_descriptions[i]={}
        indexed_descriptions[i]["Author"]=key.split("-")[0]
        indexed_descriptions[i]["Tweet content"]=descriptions[key]["tweet"]
        indexed_descriptions[i]["replies"]={}
        # print(descriptions[key],"\n\n",descriptions[key]["replies"])
        if descriptions[key]["replies"]:
            # print(descriptions[key]["replies"])
            for j,reply in enumerate(descriptions[key]["replies"]):
                # print(j,reply)
                indexed_descriptions[i]["replies"][j]={}
                indexed_descriptions[i]["replies"][j]["Author"]=reply["userID"]
                indexed_descriptions[i]["replies"][j]["reply content"]=reply["description"]
    # print(indexed_descriptions)
    return descriptions,indexed_descriptions


# tweet_list = get_tweets("65b66c3f7d94dfa8ce1d4699")
# explore_tweets()

