import multiprocessing
from main import start
from dotenv import dotenv_values
from pymongo import MongoClient
from bson.json_util import dumps
from bson.json_util import loads
from bson.objectid import ObjectId


def run(
    scenario_group_id,
    agent_group_id,
    test_mode,
    loop_limit,
    action_frequency,
    reply_probablity,
):

    stop_event = multiprocessing.Event()
    processes = []
    agents = []
    config = dotenv_values(".env")
    mongodb_client = MongoClient(config["ATLAS_URI"])
    database = mongodb_client[config["DB_NAME"]]
    agent_collection = database["agents"]
    agent_group_collection = database["agentgroups"]
    # print(agent_group_id,"**")
    if agent_group_id == "":
        agents = loads(dumps(agent_collection.find({"agentGroupId": ""})))
    else:
        agent_group = agent_group_collection.find({"_id": ObjectId(agent_group_id)})
        # agent_ids = agent_group.fetchall("agentIds", [])
        # agent_ids = loads(dumps(agent_group["agentIds"]))
        # print(loads(dumps(agent_group))[-1], "--")
        agent_ids = loads(dumps(agent_group))[-1]["agentIds"]

        agents = loads(dumps(agent_collection.find({"_id": {"$in": agent_ids}})))

    print(agents)

    for agent in agents:
        p = multiprocessing.Process(
            target=start,
            args=(
                stop_event,
                agent["alias"],
                agent["_id"],
                scenario_group_id,
                agent_group_id,
                test_mode,
                loop_limit,
                action_frequency,
                reply_probablity,
            ),
        )  # true means debug mode and finite loop
        p.start()
        processes.append(p)

        temp = agent["alias"]
        print(f"{temp} started with PID {p.pid}")
        # break

    # try:
    #     input("Press Enter to stop the processes...")
    # except KeyboardInterrupt:
    #     print("\nInterrupted by user.")

    # Set the event to stop processes
    # stop_event.set()

    # Join processes
    for p in processes:
        p.join()
        print(f"Process {p.pid} stopped.")
