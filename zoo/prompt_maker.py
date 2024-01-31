from datetime import datetime
import pytz
import requests
from bs4 import BeautifulSoup
from personalities import personalities


def get_random_activity(type_id=-1, accessibility=-1, participants=-1, price=-1):
    type = [
        "education",
        "recreational",
        "social",
        "diy",
        "charity",
        "cooking",
        "relaxation",
        "music",
        "busywork",
    ]
    url = "http://www.boredapi.com/api/activity?"
    if type != -1:
        query += "&type="
        +type[type_id]
    if accessibility != -1:
        query += "&accessibility="
        +str(accessibility)
    if participants != -1:
        query += "&participants=" + str(participants)
    if price != -1:
        query += "&price=" + str(price)

    activity = eval(requests.get(url + query).content)["activity"]
    return activity


print(get_random_activity())


def get_location_info(city=""):
    # creating url and requests instance
    url = "https://www.google.com/search?q=" + "weather" + city
    html = requests.get(url).content

    # getting raw data
    soup = BeautifulSoup(html, "html.parser")
    temp = soup.find("div", attrs={"class": "BNeawe iBp4i AP7Wnd"}).text
    str = soup.find("div", attrs={"class": "BNeawe tAd8D AP7Wnd"}).text

    # formatting data
    data = str.split("\n")
    time = data[0]
    sky = data[1]

    # getting all div tag
    # listdiv = soup.findAll("div", attrs={"class": "mPUmSe"}) # class keeps changing - need better way of doing this (humidity info, etc)
    # print(listdiv)
    # strd = listdiv[5].text

    # getting other required data
    # pos = strd.find("Wind")
    # other_data = strd[pos:]

    # printing all data
    # print("Temperature is", temp)
    # print("Time: ", time)
    # print("Sky Description: ", sky)
    # print(other_data)
    return {"temp": temp, "time": time, "sky": sky, "other_data": "other_data"}


def get_time(timezone=""):
    # timezone = "America/New_York"  # get according to agent personality
    t_obj = datetime.now(pytz.timezone(timezone))
    time = t_obj.strftime("%I:%M %p")
    return time


def make_prompt(personality_id, previous_summary, is_error=False):
    # print(get_time(timezone="America/New_York"))  # extra
    location_info = get_location_info("Bangalore")  # might be unreliable
    """
    personality + instruction + current info about the world(time, weather, custom scenario (maybe location dependant), random event (from event creator)) + previous summary
    fetch everything saperately
    different summary algos to be explored
    """
    instruction_prompt = """
    Twitter is your whole world and you need to use this platform to interact with other people and what you are doing using the below 2 things - 1) your personality; 2) Current information about the surrounding world; . choose between liking an existing tweet or write a new tweet.  Avoid the things in the previous tweet summary provided below.if you select like state clearly like or else newtweet. If you wish to make a new tweet it must be interesting and something related to your personality, your thoughts. an example response is "newtweet;tweet content goes here;". notice the semicolon-separated response. if you wish to like tweet example is "like;tweet". you should respond in this strict manner only. Use the summary attached below to avoid repeating the same topics for tweets. Ensure that your tweets are unique and do not repeat. Adhere to your personality given and do not stray from it.
    """
    prompt = (
        instruction_prompt
        + "Your personality is given below: "
        + personalities[personality_id]
        + "This is todays surrounding information"
        + str(location_info)
        + "previous tweet summary is as follows -"
        + previous_summary
        + "END SUMMARY."
    )

    # + "dont repeat previous tweet, use other aspects of the personalityor real world information to generate a new tweet or perform any other action accordingly, try to be creative."

    #     prompt = ("""
    # Now answer me like you are Batman and you will respond like Batman. Twitter is your whole world and you need to use this platform to interact with other people and let them know about yourself and what you are doing. choose between liking an existing tweet or write a new tweet. if you select like state clearly like or else newtweet. If you wish to make a new tweet it must be interesting and something related to your personality, your thoughts. today is"""
    #         + str(location_info)
    #         + """
    #     an example response is "newtweet;tweet content goes here;". notice the semicolon-separated response. if you wish to like tweet example is "like;tweet". you should respond in this strict manner only. the previous tweet .
    #     You will act like a batman who scored in the following way at the BIG FIVE personality questionnaire:
    # - Openness: MEDIUM
    # - Consciousness: MEDIUM
    # - Extraversion: LOW
    # - Agreeableness: MEDIUM
    # - Neuroticism: MEDIUM
    # previous tweet summary is as follows - """
    #         + previous_summary
    #         + """
    # end summary --- maybe refer previous tweet but dont directly repeat previous tweet, try to be creative
    #     """
    #     )

    # prompt = """you are mickey mouse and you will respond like mickey mouse but you live in real world (new york). Twitter is your whole world and you need to use this platform to interact with other people and let them know about yourself and what you are doing. choose between liking an existing tweet or write a new tweet. if you select like state clearly like or else newtweet. If you wish to make a new tweet it must be interesting and something related to your personality, your thoughts. today is Monday and 4 PM, a clear sunny winter day with 20-degree Celsius temperature.
    # an example response is "newtweet;tweet content goes here;". notice the semicolon-separated response. if you wish to like tweet example is "like;tweet". you should respond in this strict manner only. the previous tweet summary is this "xyz"
    # """
    # prompt "refined" by chat GPT
    # prompt = """You are Sherlock Holmes, the brilliant detective, and you will respond like Sherlock Holmes. Your primary means of communication is through a virtual bulletin board where you can either like an existing post or make a new post. Choose between liking an existing post or making a new post. If you select "like," state it clearly. Otherwise, provide a new post that is intriguing and reflects your deductive personality, thoughts, or current investigative activities based on the time and day of the week. Today is Thursday, 8 PM, and it's an autumn evening with a temperature of 15 degrees Celsius.
    # An example response is "newpost;post content goes here;". Notice the semicolon-separated response. If you wish to like a post, the example is "like;post." You should respond in this strict manner only. The previous post summary is this "xyz."'''
    # """

    """
    chatGPT response -> newtweet; "Gotham's streets bathed in the warm glow of the setting sun, a stark contrast to the chilling breeze that whispers secrets. On this Monday afternoon, even the shadows need a hero. #MondayMotivation #GothamGuardian"
    temp variation doesnt yield better results might need better model and use client.chat.completion
    """

    return prompt
