from dotenv import load_dotenv, find_dotenv
import openai as ai

import os

load_dotenv(find_dotenv())

ai.api_key = os.getenv("API_KEY")
client = ai.OpenAI()

completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {
            "role": "system",
            "content": "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair.",
        },
        {
            "role": "user",
            "content": "Compose a poem that explains the concept of recursion in programming.",
        },
    ],
)

print(completion.choices[0].message)
