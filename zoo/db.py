from dotenv import dotenv_values
from pymongo import MongoClient
from datetime import datetime
from bson.objectid import ObjectId


def save_reply(personality_id, tweet_id, description):
    
    config = dotenv_values(".env")
    mongodb_client = MongoClient(config["ATLAS_URI"])

    database = mongodb_client[config["DB_NAME"]]
    replies_collection = database['replies']
    tweets_collection = database['tweets']
    print("Connected to the MongoDB database!")
    # Retrieve the tweet having tweet_id from the tweets collection
    tweet = tweets_collection.find_one({"_id": ObjectId(tweet_id)})
    
    
    new_reply = {
        "alias": personality_id,
        "description": description,
    }
    
    # If "reply" string inside the retrieved tweet object is empty
    if tweet["replies"]:
        # append the reply into the array Retrieved using the reply_id ( The reply string )

        # print("---a----",tweet["replies"],"-----")
        result = replies_collection.update_one(
            {"_id": tweet["replies"]},
            {"$push": {"reply_array": new_reply}},
        )
        
    else:
        # create a new array in the "replies" collection
        result = replies_collection.insert_one(
            {"reply_array": [new_reply]},
        )
        tweets_collection.update_one(
            {"_id": ObjectId(tweet_id)},
            {"$set": {"replies": result.inserted_id,"updatedAt":datetime.now().isoformat()}},
        )
        
    if result.acknowledged:
        print("Reply saved successfully")
        # Update the replies field of the tweet schema and set it to the unique ID generated
        
        return True
    else:
        print("Failed to save reply")
        return False

def save_tweet(personality_id, tweet):
    config = dotenv_values(".env")
    mongodb_client = MongoClient(config["ATLAS_URI"])

    database = mongodb_client[config["DB_NAME"]]
    tweets_collection = database['tweets']
    print("Connected to the MongoDB database!")
    new_tweet = {
        "alias": personality_id,
        "description": tweet,
        "likes": [],
        "replies": "",
        "createdAt": datetime.now().isoformat(),
        "updatedAt": datetime.now().isoformat()
    }
    result = tweets_collection.insert_one(new_tweet)
    if result.acknowledged:
        print("Tweet saved successfully")
        
        return True
    else:
        print("Failed to save tweet")
        return False


