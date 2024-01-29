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
this is legacy (used here for testing only)
"""

response = client.completions.create(
    model="gpt-3.5-turbo-instruct",
    prompt="hi, who are you?",
    temperature=0,
    max_tokens=10,
)
# if max topen very less , reason for stopping becomes length
print(response.choices[0].text)
