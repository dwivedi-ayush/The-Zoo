import time
def start(a,personality_id,test_mode,loop_limit,action_frequency=1):
    a=3
    while(a>0):
        # if stop_event.is_set():
        #     print(f"{personality_id} ending")
        #     break
        a-=1
        print(f"{personality_id} running...")
        time.sleep(1)
    
from pymongo import MongoClient
from datetime import datetime
from dotenv import dotenv_values
def delete():
    config = dotenv_values(".env")
    mongodb_client = MongoClient(config["ATLAS_URI"])
    database = mongodb_client[config["DB_NAME"]]
    tweet_collection = database['tweets']
    
    # Calculate the date for March 31, 2024
    end_date = datetime(2024, 4, 1, 00, 00, 00, 999000).isoformat()

    # Construct the filter query to find documents created after March 31, 2024
    filter_query = {'createdAt': {'$gte': end_date}}

    # Delete documents that match the filter
    result = tweet_collection.delete_many(filter_query)

    # Print the number of documents deleted
    print('Deleted', result.deleted_count, 'documents.')

delete()

