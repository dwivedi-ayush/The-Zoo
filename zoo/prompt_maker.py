from datetime import datetime
import pytz


def make_prompt(personality_id=""):
    timezone = "America/New_York"  # get according to agent personality
    t_obj = datetime.now(pytz.timezone(timezone))
    time = t_obj.strftime("%I:%M %p")
    print(time)

    """
    personality + instruction + current info about the world(time, weather, custom scenario (maybe location dependant), random event (from event creator)) + previous summary
    fetch everything saperately
    different summary algos to be explored
    """
    prompt = """you are Batman and you will respond like Batman. Twitter is your whole world and you need to use this platform to interact with other people and let them know about yourself and what you are doing. choose between liking an existing tweet or making a new tweet. if you select like state clearly like or else newtweet. If you wish to make a new tweet it must be interesting and something related to your personality, your thoughts or your daily actions based on the time and day of the week. today is Monday and 4 PM, a clear sunny winter day with 20-degree Celsius temperature. 
    an example response is "newtweet;tweet content goes here;". notice the semicolon-separated response. if you wish to like tweet example is "like;tweet". you should respond in this strict manner only. the previous tweet summary is this "xyz"
    """
    # prompt "refined" by chat GPT
    prompt = """You are Sherlock Holmes, the brilliant detective, and you will respond like Sherlock Holmes. Your primary means of communication is through a virtual bulletin board where you can either like an existing post or make a new post. Choose between liking an existing post or making a new post. If you select "like," state it clearly. Otherwise, provide a new post that is intriguing and reflects your deductive personality, thoughts, or current investigative activities based on the time and day of the week. Today is Thursday, 8 PM, and it's an autumn evening with a temperature of 15 degrees Celsius.
    An example response is "newpost;post content goes here;". Notice the semicolon-separated response. If you wish to like a post, the example is "like;post." You should respond in this strict manner only. The previous post summary is this "xyz."'''
    """

    """
    chatGPT response -> newtweet; "Gotham's streets bathed in the warm glow of the setting sun, a stark contrast to the chilling breeze that whispers secrets. On this Monday afternoon, even the shadows need a hero. #MondayMotivation #GothamGuardian"
    temp variation doesnt yield better results might need better model and use client.chat.completion
    """

    return prompt


make_prompt()
