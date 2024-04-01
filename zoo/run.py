import multiprocessing
from main import start
from dotenv import dotenv_values
from pymongo import MongoClient
from bson.json_util import dumps
from bson.json_util import loads


if __name__ == "__main__":
    
    stop_event = multiprocessing.Event()
    processes = []

    config = dotenv_values(".env")
    mongodb_client = MongoClient(config["ATLAS_URI"])
    database = mongodb_client[config["DB_NAME"]]
    agent_collection = database['agents']
    agents= loads(dumps(agent_collection.find()))
    
    for agent in agents:
        p = multiprocessing.Process(target=start, args=(stop_event,agent["alias"],True,10,1,)) # true means debug mode and finite loop
        p.start()
        processes.append(p)
        temp=agent["alias"]
        print(f"{temp} started with PID {p.pid}")
        

    try:
        input("Press Enter to stop the processes...")
    except KeyboardInterrupt:
        print("\nInterrupted by user.")

    # Set the event to stop processes
    stop_event.set()

    # Join processes
    for p in processes:
        p.join()
        print(f"Process {p.pid} stopped.")
