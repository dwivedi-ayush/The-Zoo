from datetime import datetime
import pytz
import requests
from bs4 import BeautifulSoup
from personalities import personalities
from explore import get_tweets,explore_tweets
from summary_algo_test import openAI_summariser
from dotenv import dotenv_values
from pymongo import MongoClient

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


def make_prompt(
    personality_id="",explore_tweets="" ,previous_post="", random_activity="",activity_type="", is_error=False
):
    # print(get_time(timezone="America/New_York"))  # extra
    """
    activity_type = 1 => tweet
    activity_type = 2 => reply
    """
    """
    personality + instruction + current info about the world(time, weather, custom scenario (maybe location dependant), random event (from event creator)) + previous summary
    fetch everything saperately
    different summary algos to be explored
    """
    prompt="this is an error prompt, if you see this prompt, only reply with word error and nothing else. example response: 'Error' "
    location_info = get_location_info("Bangalore")  # might be unreliable
    config = dotenv_values(".env")
    mongodb_client = MongoClient(config["ATLAS_URI"])
    database = mongodb_client[config["DB_NAME"]]
    agents = database['agents']
    agent = agents.find_one({"alias":personality_id }) #personalities[personality_id]
    agent_personality=""
    if agent:
        agent_personality=agent["personality"]
    else:
        print("Agent not fount in DB")
        return "ERROR PROMPT --- OUTPUT JUST ONE WORK i.e. ERROR"
    if activity_type==2:

        reply_prompt="""Twitter is your whole world and you need to use this platform to interact with other people and what you are doing using the below 2 things - 1) your personality; 2) Current information about the surrounding world; you have to reply to the given tweets using the tweet itself , the replies to that tweet if any and your personality and opinions what a person of that personality would have.For example if you want to reply to directly tweet number 1 the format should be "replyto-1;reply_content_goes_here", if you want to reply to 2nd reply of tweet number 1 the format should be "replyto-1-reply-2;reply_content_goes_here." .Use index number only to indicate the recepiant of the reply,ONLY reply in this format, only one reply should be outputted in your resposnse and it should be in that exact format. It is ok to assume things about the other person and assume their behavior, it is ok to be biased.
        Adhere to this strict format only.
        """
        
       
        prompt = (
        reply_prompt
        + "Your personality is given below: "
        + agent_personality          
        + "This is today's surrounding information"
        + str(location_info)
        + "context tweets are as follows -"
        + str(explore_tweets)
        + "END context tweets."
        + "comment on one of these tweets, the comment can be sarcastic, or playful or hateful or anything that can hold the reader's retention."
    )
        

    
    else:
        tweet_prompt="""
    Twitter is your whole world and you need to use this platform to interact with other people and what you are doing using the below 2 things - 1) your personality; 2) Current information about the surrounding world; Avoid the things you said in the previous tweets, summary is provided below. The new tweet must be what you would like to post. an example response is "newtweet;tweet content goes here;". notice the semicolon-separated response. you should respond in this strict manner only. The response should only contain the new tweet content in that exact manner. Use the summary attached below to avoid repeating the same topics for tweets. Ensure that your tweets are unique and do not repeat. 
    """
        # Adhere to your personality given and do not stray from it.
        previous_tweets=get_tweets(personality_id)
        previous_summary=openAI_summariser(" ".join(previous_tweets))
        # only get random activity after a certain amount of time has passed
        prompt = (
            tweet_prompt
            + "Your personality is given below: "
            + agent_personality
            + " assume details about what you are about to do and tweet about the same. A random activity you are about to do can be this:"
            + random_activity
            + "previous tweet summary is as follows -"
            + previous_summary
            + "END SUMMARY. Try not to repeat same tweet or similar tweets more than once,never be monotonous, use this summary to avoid the topics you have already touched."
            + "previous tweet that you made is given below, avoid this or related topics at all costs."
            + previous_post
            + "..end post.."
            # + "This is today's surrounding information"
            # + str(location_info)
            
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


# print(make_prompt(personality_id="batman",activity_type=1))
