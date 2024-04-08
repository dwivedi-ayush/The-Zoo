import requests
import json
from datetime import datetime
from pymongo import MongoClient
from dotenv import dotenv_values
from bson.json_util import dumps
from bson.json_util import loads


def get_tweets(agent_id, scenario_group_id):
    config = dotenv_values(".env")
    mongodb_client = MongoClient(config["ATLAS_URI"])
    db = mongodb_client[config["DB_NAME"]]
    collection = db["tweets"]
    query_filter = {"agentId": agent_id, "scenarioGroupId": scenario_group_id}

    tweet_response = collection.find(query_filter).sort([("createdAt", -1)]).limit(5)
    tweets = loads(dumps(tweet_response))
    if tweet_response:
        descriptions = []
        for tweet in tweets:
            descriptions.append(tweet["description"])
    else:
        print(f"Request failed with status code {tweet_response.status_code}")
    return descriptions


def explore_tweets(current_agent_id, agent_group_id, scenario_group_id):
    config = dotenv_values(".env")
    mongodb_client = MongoClient(config["ATLAS_URI"])
    database = mongodb_client[config["DB_NAME"]]
    tweet_collection = database["tweets"]
    agent_group_collection = database["agentGroups"]

    agent_group = agent_group_collection.find({"_id": agent_group_id})
    tweet_response = ""
    if agent_group:
        agent_ids = [
            agent_id
            for agent_id in agent_group.get("agentIds", [])
            if agent_id != current_agent_id
        ]
        tweet_response = (
            tweet_collection.find(
                {"agentId": {"$in": agent_ids}, "scenarioGroupId": scenario_group_id}
            )
            .sort([("createdAt", -1)])
            .limit(10)
        )
    if tweet_response:
        latest_tweets = loads(dumps(tweet_response))
        descriptions = {}
        for tweet in latest_tweets:
            key = tweet["alias"] + "-" + str(tweet["_id"])
            descriptions[key] = {}
            descriptions[key]["tweet"] = tweet["description"]
            descriptions[key]["replies"] = {}
            if tweet["replies"]:
                descriptions[key]["replies"] = tweet["replies"]

            # print(key,descriptions[key])
            # print(tweet)

    else:
        print(f"Request failed with status code {tweet_response.status_code}")
    indexed_descriptions = dict()
    # print(descriptions)
    for i, key in enumerate(descriptions.keys()):
        # i=i+1
        indexed_descriptions[i + 1] = {}
        indexed_descriptions[i + 1]["Author"] = key.split("-")[0]
        indexed_descriptions[i + 1]["Tweet content"] = descriptions[key]["tweet"]
        indexed_descriptions[i + 1]["replies"] = ""
        # i=i-1
        temp = {}
        # print(descriptions[key],"\n\n",descriptions[key]["replies"])
        # print(key,descriptions[key])
        if descriptions[key]["replies"]:
            # print(descriptions[key]["replies"])
            for j, reply in enumerate(descriptions[key]["replies"]):

                # indexed_descriptions[i+1]["replies"]+="author:"+reply["alias"]+"-"+reply["description"]+"\n"
                # # print(j,reply)
                temp["reply no. " + str(j + 1)] = {}
                temp["reply no. " + str(j + 1)]["replied by"] = reply["alias"]
                temp["reply no. " + str(j + 1)]["reply content"] = reply["description"]
        indexed_descriptions[i + 1]["replies"] = str(temp)
    # print(descriptions)
    # print(indexed_descriptions)
    return descriptions, indexed_descriptions


# tweet_list = get_tweets("65b66c3f7d94dfa8ce1d4699")
a, b = explore_tweets()
print(a)
print("------")
print(b)
