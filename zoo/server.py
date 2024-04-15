from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
import requests
from pydantic import BaseModel
from run import run

openai.api_key = os.getenv("API_KEY")

app = Flask(__name__)
CORS(app)


def get_personality(form_data):
    prompt = """
        You have just received a form submission with the following data:
        {form_data}

        Using this information, create a human-like personality that could have submitted this form. Describe this personality in detail, including their background, interests, goals, and any other relevant characteristics. Do not use exact words from the form data, instead understand the context and then create teh personality 
        Do not reference the person anywhere in teh prompt.
        Respond in first person singular ( talking like you are explaining your own personality ).
        Respond with only the personality description, without any additional context or instructions.
        """

    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": prompt},
        ],
        temperature=0.8,
        max_tokens=280,
    )

    personality = response.choices[0].message.content
    # print('Personality:', personality)

    return personality


def send_to_DB(personality, alias):
    url = "http://localhost:8000/api/agents/v2/create"

    payload = {
        "alias": alias,
        "personality": personality,
        "userId": "some_user_id",
        "agentGroupId": "some_agent_group_id",
    }

    # Make the POST request to the API
    response = requests.post(url, json=payload)

    # Check the response status code
    if response.status_code == 200:
        print("Agent created successfully!")
        print(response.json())
    else:
        print("Failed to create agent. Error:", response.status_code, response.text)


@app.route("/submit-form", methods=["POST"])
def handle_form_submission():
    form_data = request.get_json()
    print("Received form data:", form_data["Name"])

    personality = get_personality(form_data)
    send_to_DB(personality, form_data["Name"])

    return jsonify({"message": "Form data received successfully"})


@app.route("/generate-tweet/", methods=["POST"])
def generate_tweet():

    scenario_group_id = request.json.get("scenario_group_id")
    agent_group_id = request.json.get("agent_group_id")
    test_mode = request.json.get("test_mode")
    loop_limit = request.json.get("loop_limit")
    action_frequency = request.json.get("action_frequency")
    reply_probablity = request.json.get("reply_probablity")

    print("Received data:")
    print("Scenario Group ID:", scenario_group_id)
    print("Agent Group ID:", agent_group_id)
    print("Test Mode:", test_mode)
    print("Loop Limit:", loop_limit)
    print("Action Frequency:", action_frequency)
    print("Reply Probablity:", reply_probablity)
    run(
        scenario_group_id,
        agent_group_id,
        test_mode,
        loop_limit,
        action_frequency,
        reply_probablity,
    )
    # asyncio.create_task(
    #     run_async(
    #         scenario_group_id,
    #         agent_group_id,
    #         test_mode,
    #         loop_limit,
    #         action_frequency,
    #         reply_probablity,
    #     )
    # )
    return {"message": "Generation Started successfully!"}


if __name__ == "__main__":
    app.run(debug=True)
