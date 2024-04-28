from flask import Flask, request, jsonify, make_response

from flask_cors import CORS, cross_origin
import openai
import os
import requests
from pydantic import BaseModel
from run import run

openai.api_key = os.getenv("API_KEY")

app = Flask(__name__)
# cors = CORS(app)
cors = CORS(app, origins="http://localhost:3000")
# cors = CORS(app, resources={r"/generatetweet": {"origins": "http://localhost:3000"}})
# app.config["CORS_HEADERS"] = "Content-Type"


def get_personality(form_data):
    prompt = (
        """
        You have just received a form submission with the following data:
        """
        + str(form_data)
        + """
        Using this information, create a human-like personality that could have submitted this form. Describe this personality in detail, including their background, interests, goals, and any other relevant characteristics. Do not use exact words from the form data, instead understand the context and then create teh personality 
        Do not reference the person anywhere in teh prompt.
        Respond in first person singular ( talking like you are explaining your own personality ).
        Respond with only the personality description, without any additional context or instructions.
        """
    )

    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": prompt},
        ],
        temperature=0.8,
        max_tokens=280,
    )

    personality = response.choices[0].message.content
    print("Personality:", personality)

    return personality


def send_to_DB(personality, alias, user_id, agent_group_id):
    url = "http://localhost:8000/api/agents/v2/create"

    payload = {
        "alias": alias,
        "personality": personality,
        "userId": user_id,
        "agentGroupId": agent_group_id,
    }

    # Make the POST request to the API
    response = requests.put(url, json=payload)

    # Check the response status code
    if (response.status_code - 200) < 100:
        print("Agent created successfully!")
        print(response.json())
    else:
        print("Failed to create agent. Error:", response.status_code, response.text)


@app.route("/submit-form", methods=["POST", "OPTIONS"])
def handle_form_submission():
    form_data = request.get_json()
    print("Received form data:", form_data["Name"])

    personality = get_personality(form_data)
    send_to_DB(
        personality, form_data["Name"], form_data["UserID"], form_data["AgentGroupID"]
    )

    return jsonify({"message": "Form data received successfully"})


def get_tweet_count(scenario_group_id, agent_group_id):
    url = f"http://localhost:8000/api/tweets/v2/explore/scenarioGroup/{scenario_group_id}/agentGroup/{agent_group_id}"
    response = requests.get(url)
    return response.json()
    # pass


# @cross_origin(origin="*")
@app.route("/generatetweet", methods=["POST", "OPTIONS"])
def generate_tweet():
    if request.method == "OPTIONS":  # CORS preflight
        return {}, 200
    scenario_group_id = request.json.get("scenario_group_id")
    print("Scenario Group ID:", scenario_group_id)
    agent_group_id = request.json.get("agent_group_id")
    print("Agent Group ID:", agent_group_id)
    test_mode = request.json.get("test_mode")
    print("Test Mode:", test_mode)
    scenario_focus = request.json.get("scenario_focus")
    print("Scenario Focus:", scenario_focus)
    loop_limit = request.json.get("loop_limit")
    print("Loop Limit:", loop_limit)
    action_frequency = request.json.get("action_frequency")
    print("Action Frequency:", action_frequency)
    reply_probability = request.json.get("reply_probability")
    print("Reply Probability:", reply_probability)

    count = get_tweet_count(scenario_group_id, agent_group_id)
    print("Tweet Count:", count)
    if count < 10:
        run(
            scenario_group_id,
            agent_group_id,
            test_mode,
            scenario_focus,
            loop_limit,
            action_frequency,
            0,
        )
    else:
        run(
            scenario_group_id,
            agent_group_id,
            test_mode,
            scenario_focus,
            loop_limit,
            action_frequency,
            reply_probability,
        )

    response = {"message": "Generation Started successfully!"}
    # response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


if __name__ == "__main__":
    app.run(host="localhost", port=8080)
