from dotenv import load_dotenv, find_dotenv
import openai as ai
import time
import os
import requests
from datetime import datetime


# import sys
import argparse
from prompt_maker import make_prompt
from summary_algo_test import openAI_summariser

"""
example:
python main.py personality
python main.py personality -t
python main.py personality -t -l 10
"""


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
    print("random activity is : ", activity)
    return activity


def save_response(resp):
    try:
        file_name = "./tweet_history/" + personality_id + ".txt"
        f = open(file_name, "a+")  # open file in write mode
        f.write(resp)
        f.close()
    except Exception as error:
        print("Error Saving info :", error)


def get_response_log():
    try:
        file_name = "./tweet_history/" + personality_id + ".txt"
        f = open(file_name, "r")  # open file in write mode
        data = f.read()
        f.close()
        return data
    except Exception as error:
        print("Error getting info :", error)
        return ""


def get_summary():
    log = get_response_log()
    if log == "":
        return ""
    return openAI_summariser(log)


test_mode = True
loop_limit = 5
action_frequency = 1  # action every 5 seconds


parser = argparse.ArgumentParser()
parser.add_argument("personality", type=str, help="Specify the personality (required)")
parser.add_argument("-t", "--test_mode", action="store_true", help="Enable test mode")
parser.add_argument(
    "-l", "--loop_limit", type=int, help="Specify loop limit for test mode"
)
args = parser.parse_args()


personality_id = args.personality
test_mode = args.test_mode
loop_limit = args.loop_limit

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
    previous_summary = get_summary()
    print("=============")
    print("previous_summary: ", previous_summary)
    print("=============")

    now = datetime.now()
    current_time = now.strftime("%H")

    if initial_loop or abs(int(current_time) - previous_activity_time) >= 1:
        random_activity = get_random_activity(
            type_id=8
        )  # 8 is busywork activity, can use random number or some heuristics
        previous_activity_time = int(current_time)
        initial_loop = False

    prompt_content = make_prompt(
        personality_id,
        previous_summary,
        previous_post,
        random_activity,
        is_error=is_error,
    )
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
    print(response_string)
    print("end")
    print(
        "============================================================================================================"
    )

    # parse responses
    respones_array = response_string.split(";")
    command = respones_array[0]
    message_content = recipient = ""
    print("Time this iteration: ", (time.time() - start_time))
    time.sleep(max(0, action_frequency - (time.time() - start_time)))
    command = command.lower()  # to handle "Newtweet"
    command = command.replace(" ", "")  # to handle "new tweet"

    if command == "like":
        print("COMMAND :", command)
        # handle_like()
        pass
    elif command == "newtweet":
        print("COMMAND :", command)
        save_response(response_string + "\n")  # save only new post
        message_content = respones_array[1]  # in case of original tweet
        previous_post = message_content
        # handle_new_tweet()
    elif command == "reply":
        recipient = respones_array[2]  # in case of reply
        # handle_reply()
    else:
        # handle_error()  # parsing error or response error
        """restart the loop with initial state"""
        is_error = True
        # continue
