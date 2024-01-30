from dotenv import load_dotenv, find_dotenv
import openai as ai
import time
import os
import sys
import argparse
from prompt_maker import make_prompt

"""
example:
python main.py personality
python main.py personality -t
python main.py personality -t -l 10
"""

test_mode = True
loop_limit = 5
action_frequency = 5  # action every 5 seconds


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


""" 
check client.chat.completion also instead of prompt it has 
messages(array of previous chat like messages) and role(syste, user, assistant and function), 
may be more suitable for our needs
model predicts the next logical step
client.completion is legacy (used here for testing only)
"""

is_error = False
while True:
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
    prompt_content = make_prompt(personality_id, is_error=is_error)
    model = "gpt-3.5-turbo-instruct"
    temperature = 0.8
    max_tokens = 280

    if is_error:
        # maybe change temperature or model
        is_error = False

    # get response
    response = client.completions.create(
        model=model,
        prompt=prompt_content,
        temperature=temperature,
        max_tokens=max_tokens,
    )
    # max_tokens=number
    # if max token very less , reason for stopping becomes length
    print(response)
    print(
        "============================================================================================================"
    )
    print(response.choices[0].text)
    print(
        "============================================================================================================"
    )
    response_string = response.choices[0].text

    # parse response
    respones_array = response_string.split(";")
    command = respones_array[0]
    message_content = recipient = ""
    if command == "like":
        # handle_like()
        pass
    elif command == "newpost":
        message_content = respones_array[1]  # in case of original tweet
        # handle_new_tweet()
    elif command == "reply":
        recipient = respones_array[2]  # in case of reply
        # handle_reply()
    else:
        # handle_error()  # parsing error or response error
        """restart the loop with initial state"""
        is_error = True
        continue

    time.sleep(action_frequency)
