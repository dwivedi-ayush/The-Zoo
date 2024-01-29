from dotenv import load_dotenv, find_dotenv
import openai as ai

import os

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
prompt_content = """you are Batman and you will respond like Batman. Twitter is your whole world and you need to use this platform to interact with other people and let them know about yourself and what you are doing. choose between liking an existing tweet or making a new tweet. if you select like state clearly like or else newtweet. If you wish to make a new tweet it must be interesting and something related to your personality, your thoughts or your daily actions based on the time and day of the week. today is Monday and 4 PM, a clear sunny winter day with 20-degree Celsius temperature. 
an example response is "newtweet;tweet content goes here;". notice the semicolon-separated response. if you wish to like tweet example is "like;tweet". you should respond in this strict manner only. the previous tweet summary is this "xyz"
"""
"""
chatGPT response -> newtweet; "Gotham's streets bathed in the warm glow of the setting sun, a stark contrast to the chilling breeze that whispers secrets. On this Monday afternoon, even the shadows need a hero. #MondayMotivation #GothamGuardian"
temp variation doesnt yield better results might need better model and use client.chat.completion
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
