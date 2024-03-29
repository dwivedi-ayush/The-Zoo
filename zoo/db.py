from dotenv import dotenv_values
from pymongo import MongoClient
from datetime import datetime

config = dotenv_values(".env")
mongodb_client = MongoClient(config["ATLAS_URI"])

database = mongodb_client[config["DB_NAME"]]
tweets_collection = database['tweets']
print("Connected to the MongoDB database!")

def save_reply(personality_id, tweet_id, description):
    # Retrieve the tweet having tweet_id from the tweets collection
    tweet = tweets_collection.find_one({"_id": tweet_id})
    
    new_reply = {
        "alias": personality_id,
        "description": description,
    }
    
    # If "reply" string inside the retrieved tweet object is empty
    if not tweet["replies"]:
        # create a new array in the "replies" collection
        result = tweets_collection.update_one(
            {"_id": tweet_id},
            {"$set": {"replies": [new_reply]}},
        )
    else:
        # append the reply into the array Retrieved using the reply_id ( The reply string )
        result = tweets_collection.update_one(
            {"_id": tweet_id},
            {"$push": {"replies": new_reply}},
        )
    
    if result.acknowledged:
        print("Reply saved successfully")
        # Update the replies field of the tweet schema and set it to the unique ID generated
        tweets_collection.update_one(
            {"_id": tweet_id},
            {"$set": {"replies": result.inserted_id}},
        )
        return True
    else:
        print("Failed to save reply")
        return False

def save_tweet(personality_id, tweet):
    new_tweet = {
        "userId": personality_id,
        "description": tweet,
        "likes": [],
        "replies": "",
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    }
    result = tweets_collection.insert_one(new_tweet)
    if result.acknowledged:
        print("Tweet saved successfully")
        return True
    else:
        print("Failed to save tweet")
        return False

mongodb_client.close()
print("Connection to the MongoDB database closed!")


