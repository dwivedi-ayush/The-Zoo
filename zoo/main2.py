import time
from bson.json_util import dumps
from bson.json_util import loads


def start(a, personality_id, test_mode, loop_limit, action_frequency=1):
    a = 3
    while a > 0:
        # if stop_event.is_set():
        #     print(f"{personality_id} ending")
        #     break
        a -= 1
        print(f"{personality_id} running...")
        time.sleep(1)


from pymongo import MongoClient
from datetime import datetime
from dotenv import dotenv_values


def delete_tweet():
    config = dotenv_values(".env")
    mongodb_client = MongoClient(config["ATLAS_URI"])
    database = mongodb_client[config["DB_NAME"]]
    tweet_collection = database["tweets"]

    # Calculate the date for March 31, 2024
    end_date = datetime(2024, 4, 1, 00, 00, 00, 999000).isoformat()

    # Construct the filter query to find documents created after March 31, 2024
    filter_query = {"createdAt": {"$gte": end_date}}

    # Delete documents that match the filter
    result = tweet_collection.delete_many(filter_query)

    # Print the number of documents deleted
    print("Deleted", result.deleted_count, "documents.")


def delete_reply():

    config = dotenv_values(".env")
    mongodb_client = MongoClient(config["ATLAS_URI"])
    database = mongodb_client[config["DB_NAME"]]
    replies_collection = database["replies"]

    tweet_collection = database["tweets"]
    tweet_collection.update_many({}, {"$set": {"replies": ""}})

    # Print the number of documents deleted
    # Delete documents that match the filter
    result = replies_collection.delete_many({})

    # Print the number of documents deleted
    print("Deleted", result.deleted_count, "documents.")


def migrate_to_v2():
    config = dotenv_values(".env")
    mongodb_client = MongoClient(config["ATLAS_URI"])
    old_database = mongodb_client["test"]
    new_database = mongodb_client["the-zoo"]
    old_agents = old_database["agents"]
    new_agents = new_database["agents"]
    old_agents_list = loads(dumps(old_agents.find()))
    for old_agent in old_agents_list:
        new_agent = {
            "alias": old_agent["alias"],
            "personality": old_agent["personality"],
            "userId": "",
            "agentGroupId": "",
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat(),
        }
        result = new_agents.insert_one(new_agent)
        if result.acknowledged:
            print("success", new_agent["alias"])
        else:
            print("error", new_agent["alias"])
