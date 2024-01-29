from dotenv import load_dotenv, find_dotenv
import openai as ai
import time
import os

load_dotenv(find_dotenv())

api_key = os.getenv("API_KEY")
client = ai.OpenAI(api_key=api_key)
test_mode = True
loop_limit = 5

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

    prompt_content = """you are Batman and you will respond like Batman. Twitter is your whole world and you need to use this platform to interact with other people and let them know about yourself and what you are doing. choose between liking an existing tweet or making a new tweet. if you select like state clearly like or else newtweet. If you wish to make a new tweet it must be interesting and something related to your personality, your thoughts or your daily actions based on the time and day of the week. today is Monday and 4 PM, a clear sunny winter day with 20-degree Celsius temperature. 
    an example response is "newtweet;tweet content goes here;". notice the semicolon-separated response. if you wish to like tweet example is "like;tweet". you should respond in this strict manner only. the previous tweet summary is this "xyz"
    """
    # prompt "refined" by chat GPT
    prompt_content = """You are Sherlock Holmes, the brilliant detective, and you will respond like Sherlock Holmes. Your primary means of communication is through a virtual bulletin board where you can either like an existing post or make a new post. Choose between liking an existing post or making a new post. If you select "like," state it clearly. Otherwise, provide a new post that is intriguing and reflects your deductive personality, thoughts, or current investigative activities based on the time and day of the week. Today is Thursday, 8 PM, and it's an autumn evening with a temperature of 15 degrees Celsius.
    An example response is "newpost;post content goes here;". Notice the semicolon-separated response. If you wish to like a post, the example is "like;post." You should respond in this strict manner only. The previous post summary is this "xyz."'''
    """

    """
    chatGPT response -> newtweet; "Gotham's streets bathed in the warm glow of the setting sun, a stark contrast to the chilling breeze that whispers secrets. On this Monday afternoon, even the shadows need a hero. #MondayMotivation #GothamGuardian"
    temp variation doesnt yield better results might need better model and use client.chat.completion
    """

    # save initial state in case of error
    if is_error:
        # make prompt differently
        is_error = False
        pass
    # make prompt
    """
    personality + instruction + current info about the world + previous summary
    fetch everything saperately 
    different summary algos to be explored  
    """

    response = client.completions.create(
        model="gpt-3.5-turbo-instruct",
        prompt=prompt_content,
        temperature=0.8,
        max_tokens=280,
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

    # parse the string
    respones_array = response_string.split(";")
    command = respones_array[0]
    message_content = recipient = ""
    if command == "like":
        # handle_like()
        """"""
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

    time.sleep(5)
