from dotenv import load_dotenv, find_dotenv
import openai as ai

import os

load_dotenv(find_dotenv())

api_key = os.getenv("API_KEY")
client = ai.OpenAI(api_key=api_key)

response = client.completions.create(
    model="gpt-3.5-turbo-instruct", prompt="hi, who are you?", temperature=0
)

print(response.choices[0].text)
