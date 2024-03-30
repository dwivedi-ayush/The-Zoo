from dotenv import dotenv_values
from pymongo import MongoClient
from bson.json_util import dumps
from bson.json_util import loads
import subprocess
import multiprocessing

if __name__ == "__main__":
    stop_event = multiprocessing.Event()
    processes = []

    config = dotenv_values(".env")
    mongodb_client = MongoClient(config["ATLAS_URI"])
    database = mongodb_client[config["DB_NAME"]]
    agent_collection = database['agents']
    agents= loads(dumps(agent_collection.find()))

    for agent in agents:
        args = [stop_event,agent["alias"],False,1,1,]
        temp=agent["alias"]
        # p = subprocess.Popen(["python", "run_process.py", *args])
        p=subprocess.Popen(["python", "-c", f"from main2 import start; start({repr(temp)},{repr(False)},{1},{1})"])
        processes.append(p)
        print(subprocess.check_output())
        print(f"{agent['alias']} started with PID {p.pid}")

    try:
        input("Press Enter to stop the processes...")
    except KeyboardInterrupt:
        print("\nInterrupted by user.")

    # Set the event to stop processes
    stop_event.set()

    # Wait for processes to finish
    for p in processes:
        p.wait()
        print(f"Process {p.pid} stopped.")
