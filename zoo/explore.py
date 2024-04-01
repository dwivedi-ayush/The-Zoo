import requests
import json
from datetime import datetime
from pymongo import MongoClient
from dotenv import dotenv_values
from bson.json_util import dumps
from bson.json_util import loads


def get_tweets(alias):
    # tweet_response = requests.get('http://localhost:3001/tweets')

    # db = client['test']
    # collection = db['tweets']
    # tweet_response = collection.find()
    # print(tweet_response)
    config = dotenv_values(".env")
    mongodb_client = MongoClient(config["ATLAS_URI"])
    db = mongodb_client[config["DB_NAME"]]
    collection = db['tweets']
    query_filter = {"alias": alias}
    tweet_response = collection.find(query_filter)
    tweets=(loads(dumps(tweet_response)))
    if tweet_response:
        # tweets = tweet_response.json()
        descriptions = []
        # tweets = [tweet for tweet in tweet_response if tweet['alias'] == alias]
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
    config = dotenv_values(".env")
    mongodb_client = MongoClient(config["ATLAS_URI"])
    db = mongodb_client[config["DB_NAME"]]
    collection = db['tweets']
    tweet_response = collection.find()
    replies_collection = db['replies']
    # reply_response = collection.find()

    # tweet_response = requests.get('http://localhost:3001/tweets')
    # reply_response = requests.get('http://localhost:3001/replies') # for now retireve all tweets, once we shift to mongo db it wont matter
    if tweet_response:
        tweets = loads(dumps(tweet_response))  # use cursor properly if slow
    
        # replies=loads(dumps(reply_response))
        # print(replies)
        # reply_ids=replies.keys()

        descriptions = {}
        if len(tweets) > 10:
            sorted_tweets = sorted(tweets, key=lambda x: datetime.fromisoformat(
                x['createdAt']), reverse=True)
            latest_tweets = sorted_tweets[:10]
            for tweet in latest_tweets:
                
                key=tweet['alias']+"-"+str(tweet['_id'])
                descriptions[key] = {}
                descriptions[key]["tweet"]=tweet['description']
                descriptions[key]["replies"]={}
                if tweet["replies"]:
                    query_filter = {"_id": (tweet["replies"])}
                    
                    #  descriptions[key]["replies"]=replies[tweet["replies"]]
                    descriptions[key]["replies"]=loads(dumps(replies_collection.find(query_filter)))
                # print(key,descriptions[key])
                   

                # print(tweet)
        else:
            for tweet in tweets:
                key=tweet['alias']+"-"+str(tweet['_id'])
                descriptions[key] = {}
                descriptions[key]["tweet"]=tweet['description']
                descriptions[key]["replies"]={}
                if tweet["replies"]:
                    query_filter = {"_id": (tweet["replies"])}
                    descriptions[key]["replies"]=loads(dumps(replies_collection.find(query_filter)))
                    #  descriptions[key]["replies"]=replies[tweet["replies"]]

               
    else:
        print(f"Request failed with status code {tweet_response.status_code}")
    indexed_descriptions=dict()
    # print(descriptions)
    for i,key in enumerate(descriptions.keys()):
        indexed_descriptions[i]={}
        indexed_descriptions[i]["Author"]=key.split("-")[0]
        indexed_descriptions[i]["Tweet content"]=descriptions[key]["tweet"]
        indexed_descriptions[i]["replies"]=""
        # temp={}
        # print(descriptions[key],"\n\n",descriptions[key]["replies"])
        # print(key,descriptions[key])
        if descriptions[key]["replies"]:
            # print(descriptions[key]["replies"])
            for j,reply in enumerate(descriptions[key]["replies"][0]["reply_array"]):
                pass
                # indexed_descriptions[i]["replies"]+="author:"+reply["alias"]+"-"+reply["description"]+"\n"
                # # print(j,reply)
                # temp[j]={}
                # temp[j]["Author"]=reply["alias"]
                # temp[j]["reply content"]=reply["description"]
        # indexed_descriptions[i]["replies"]=str(temp)
    # print(descriptions)
    # print(indexed_descriptions)
    return descriptions,indexed_descriptions


# tweet_list = get_tweets("65b66c3f7d94dfa8ce1d4699")
explore_tweets()

