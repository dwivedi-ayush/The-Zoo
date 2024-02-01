import requests
from collections import defaultdict


def make_id_dict():
    url = "http://localhost:3000/users/"
    html = requests.get(url)
    html = html.json()


    user_id = defaultdict(list)
    for user in html:
        user_id[user["username"]] = user["_id"]

    return user_id




