from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
import openai
import os
import requests
from pydantic import BaseModel
from run import run

openai.api_key = os.getenv("API_KEY")

app = Flask(__name__)
cors = CORS(app, origins="http://localhost:3000")
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


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response


# @app.route("/generate-tweet", methods=["POST", "OPTIONS"])
@app.route("/generatetweet", methods=["POST"])
def generate_tweet():
    # if request.method == "OPTIONS":  # CORS preflight
    #     return _build_cors_preflight_response()
    scenario_group_id = request.json.get("scenario_group_id")
    agent_group_id = request.json.get("agent_group_id")
    test_mode = request.json.get("test_mode")
    loop_limit = request.json.get("loop_limit")
    action_frequency = request.json.get("action_frequency")
    reply_probability = request.json.get("reply_probability")

    count = get_tweet_count(scenario_group_id, agent_group_id)
    print("Received data:")
    print("Scenario Group ID:", scenario_group_id)
    print("Agent Group ID:", agent_group_id)
    print("Test Mode:", test_mode)
    print("Loop Limit:", loop_limit)
    print("Action Frequency:", action_frequency)
    print("Reply Probability:", reply_probability)
    if count < 10:
        run(
            scenario_group_id,
            agent_group_id,
            test_mode,
            loop_limit,
            action_frequency,
            0,
        )
    else:
        run(
            scenario_group_id,
            agent_group_id,
            test_mode,
            loop_limit,
            action_frequency,
            reply_probability,
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
    app.run(debug=True, host="localhost")
