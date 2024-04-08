from dotenv import dotenv_values
from pymongo import MongoClient
from datetime import datetime
from bson.objectid import ObjectId


def save_reply(agent_alias, agent_id, tweet_id, description):

    config = dotenv_values(".env")
    mongodb_client = MongoClient(config["ATLAS_URI"])
    database = mongodb_client[config["DB_NAME"]]
    tweets_collection = database["tweets"]

    # Retrieve the tweet having tweet_id from the tweets collection
    tweet = tweets_collection.find_one({"_id": ObjectId(tweet_id)})

    new_reply = {
        "agentId": agent_id,
        "alias": agent_alias,
        "description": description,
    }

    result = tweets_collection.update_one(
        {"_id": ObjectId(tweet_id)},
        {"$push": {"replies": new_reply}},
    )

    if result.acknowledged:
        print("Reply saved successfully")
        # Update the replies field of the tweet schema and set it to the unique ID generated

        return True
    else:
        print("Failed to save reply")
        return False


def save_tweet(agent_alias, agent_id, scenario_group_id, tweet):
    config = dotenv_values(".env")
    mongodb_client = MongoClient(config["ATLAS_URI"])

    database = mongodb_client[config["DB_NAME"]]
    tweets_collection = database["tweets"]
    # print("Connected to the MongoDB database!")
    new_tweet = {
        "alias": agent_alias,
        "agentId": agent_id,
        "description": tweet,
        "scenarioGroupId": scenario_group_id,
        "likes": [],
        "replies": [],
        "createdAt": datetime.now().isoformat(),
        "updatedAt": datetime.now().isoformat(),
    }
    result = tweets_collection.insert_one(new_tweet)
    if result.acknowledged:
        print("Tweet saved successfully for", agent_alias)

        return True
    else:
        print("Failed to save tweet for", agent_alias)
        return False
