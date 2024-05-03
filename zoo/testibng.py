from openai import OpenAI
import os

client = OpenAI(
    api_key=""
)

models = client.models.list()

print(models)
