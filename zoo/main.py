from dotenv import load_dotenv, find_dotenv,dotenv_values
from pymongo import MongoClient
import openai as ai
import time
import os
import requests
from datetime import datetime
import random
import json
import uuid
# import sys
import argparse
from prompt_maker import make_prompt
from explore import get_tweets,explore_tweets
from db import save_reply,save_tweet
# from summary_algo_test import openAI_summariser

"""
example:
python main.py personality
python main.py personality -t
python3 main.py batman -t -l 3

personality_id == alias

"""

# def save_tweet(personality_id, tweet):
#     url = "http://localhost:3001/tweets"
#     new_tweet = {
#         "userId": personality_id,
#         "description": tweet,
#         "likes": [],
#         "replies": "",
#         "createdAt": datetime.now().isoformat(),
#         "updatedAt": datetime.now().isoformat()
#     }
#     headers = {'Content-type': 'application/json'}
#     response = requests.post(url, data=json.dumps(new_tweet), headers=headers)
#     if response.status_code == 201:
#         print("Tweet saved successfully")
#         return True
#     else:
#         print("Failed to save tweet")
#         return False

# def save_reply(personality_id, tweet_id, description):
#     url = "http://localhost:3001/replies"
#     new_reply = {
#         "userID": personality_id,
#         "description": description,
#         "repliedTO": tweet_id
#     }
#     headers = {'Content-type': 'application/json'}
#     response = requests.post(url, data=json.dumps(new_reply), headers=headers)
#     if response.status_code == 201:
#         print("Reply saved successfully")
#         return True
#     else:
#         print("Failed to save reply")
#         return False


def get_random_activity(type_id=-1, accessibility=-1, participants=-1, price=-1):
    type = [
        "education",
        "recreational",
        "social",
        "diy",
        "charity",
        "cooking",
        "relaxation",
        "music",
        "busywork",
    ]
    url = "http://www.boredapi.com/api/activity?"
    query = ""
    if type_id != -1:
        query += "&type=" + type[type_id]
    if accessibility != -1:
        query += "&accessibility=" + str(accessibility)
    if participants != -1:
        query += "&participants=" + str(participants)
    if price != -1:
        query += "&price=" + str(price)

    activity = eval(requests.get(url + query).content)["activity"]
    # print("random activity is : ", activity)
    return activity

def get_smart_activitiy(client,alias):
    config = dotenv_values(".env")
    mongodb_client = MongoClient(config["ATLAS_URI"])
    database = mongodb_client[config["DB_NAME"]]
    agent_collection = database['agents']
    agent = agent_collection.find_one({"alias": alias})
    personality=agent["personality"]
    prompt=f"give an activity that is suitable for {alias} and is logical for them to do. Their personality is {personality}. The activity can be mundane day to day work or a special one time thing. respond only with the activity and nothing else. example response is -- activity:*activity name and description* "
    model = "gpt-3.5-turbo-1106"
    temperature = 0.8
    max_tokens = 280
    response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": prompt},
            ],
            temperature=temperature,
            max_tokens=max_tokens,
        )
    return response.choices[0].message.content


# def save_response(resp):
#     try:
#         file_name = "./tweet_history/" + personality_id + ".txt"
#         f = open(file_name, "a+")  # open file in write mode
#         f.write(resp)
#         f.close()
#     except Exception as error:
#         print("Error Saving info :", error)


# def get_response_log():
#     try:
#         file_name = "./tweet_history/" + personality_id + ".txt"
#         f = open(file_name, "r")  # open file in write mode
#         data = f.read()
#         f.close()
#         return data
#     except Exception as error:
#         print("Error getting info :", error)
#         return ""


# def get_summary():
#     log = get_response_log()
#     if log == "":
#         return ""
#     return openAI_summariser(log)

# personality_id="batman"
test_mode = True
loop_limit = 5
action_frequency = 1  # action every 5 seconds


# parser = argparse.ArgumentParser()
# parser.add_argument("personality", type=str, help="Specify the personality (required)")
# parser.add_argument("-t", "--test_mode", action="store_true", help="Enable test mode")
# parser.add_argument(
#     "-l", "--loop_limit", type=int, help="Specify loop limit for test mode"
# )
# args = parser.parse_args()


# personality_id = args.personality
# test_mode = args.test_mode
# loop_limit = args.loop_limit



def start(stop_event,personality_id,test_mode,loop_limit,action_frequency=1):

    load_dotenv(find_dotenv())

    api_key = os.getenv("API_KEY")
    client = ai.OpenAI(api_key=api_key)


    response_string = ""
    is_error = False
    initial_loop = True
    random_activity = ""
    previous_activity_time = ""
    previous_post = ""
    """============== core ==============="""
    while True:
        if stop_event.is_set():
            break
        start_time = time.time()
        if test_mode:
            if loop_limit == 0:
                break
            loop_limit -= 1

        # save initial state in case of error
        prompt_content = ""

        # ====================================================================================================
        # check if the previous action is saved before proceeding (check here or just after executing action)
        # ====================================================================================================

        # API call params
        # previous_summary = get_summary()
        # print("=============")
        # print("previous_summary: ", previous_summary)
        # print("=============")
        # instead of summary we directly take previous tweets


        now = datetime.now()
        current_time = now.strftime("%H")

        
        """
        activity_type = 1 => tweet
        activity_type = 2 => reply
        """
        random_activity=""
        activity_type=2
        indexed_tweet_dict=""
        if random.randint(1,4)==4: # 1 in 4 chance of tweet else reply
            print("GOING TO MAKE A NEW TWEET")
            activity_type=1
            if initial_loop or abs(int(current_time) - previous_activity_time) >= 1:
                # random_activity = get_random_activity(
                #     type_id=8
                # )  # 8 is busywork activity, can use random number or some heuristics
                random_activity=get_smart_activitiy(client,personality_id)
                
                previous_activity_time = int(current_time)
                initial_loop = False
        else:
            print("GOING TO REPLY")
            previous_tweets,indexed_tweet_dict=explore_tweets()
            # for now the dictionary will only be 2 nested -- main tweet and its replies
        
        prompt_content = make_prompt(
            personality_id=personality_id,
            explore_tweets=indexed_tweet_dict,
            previous_post=previous_post,
            random_activity=random_activity,
            activity_type=activity_type,
            is_error=is_error,
            )
        # print("Prompt content is --- ", prompt_content)
        model = "gpt-3.5-turbo-1106"
        temperature = 0.8
        max_tokens = 280
        if is_error:
            # maybe change temperature or model
            is_error = False

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": prompt_content},
            ],
            temperature=temperature,
            max_tokens=max_tokens,
        )

        print(
            "============================================================================================================"
        )
        response_string = response.choices[0].message.content
        print(response_string,random_activity)
        if response_string=="Error" or response_string=="error":
            is_error=True
            print("Error has occured")
            continue
        print("end")
        print(
            "============================================================================================================"
        )

        # parse responses
        respones_array = response_string.split(";")
        command=respones_array[0]
        message_content = recipient = ""
        print("Time this iteration: ", (time.time() - start_time))
        time.sleep(max(0, action_frequency - (time.time() - start_time)))
        command = command.lower()  # to handle "Newtweet"
        command = command.replace(" ", "")  # to handle "new tweet"

        
        if command == "newtweet":
            print("COMMAND :", command)
            # save_response(response_string + "\n")  # save only new post
            previous_post = respones_array[1]
            if save_tweet(personality_id,respones_array[1]):
                print("Tweet saved successfully")
            else:
                print("DB Error")
                break
            # handle_new_tweet()
        elif command.split("-")[0]=="replyto":
            #reply case
            print("COMMAND :", command)
            l=command.split("-") #length can be 2 (reply to original tweet) or 4 reply to a reply of the tweet
            print("THE ARRAY L: ", l)
            if len(l)==2:
                # previous_tweets
                # indexed_tweet_dict
                for i,tweet in enumerate(previous_tweets):
                    if i==int(l[1]):
                        # found the target tweet
                        if save_reply(personality_id,tweet.split('-')[1],respones_array[1]):
                            print("Reply saved successfully")
                        else:
                            print("DB Error")
                        break 
            elif len(l)==4:
                for i,tweet in enumerate(previous_tweets):
                    if i==int(l[1]):
                        for j,reply in enumerate(previous_tweets["replies"]):
                            if j==j[3]:
                                # found the target reply   
                                if save_reply(personality_id, tweet.split('-')[1], respones_array[1]):
                                    print("Reply saved successfully")
                                else:
                                    print("DB Error")
                            break 
                        break
        # elif command == "reply":
        #     recipient = respones_array[2]  # in case of reply
        #     # handle_reply()
        else:
            # handle_error()  # parsing error or response error
            """restart the loop with initial state"""
            print("******* Errored response *******")
            is_error = True
            # continue
    print("------",personality_id,"stopped ------")



# start("","batman",True,2,1)

