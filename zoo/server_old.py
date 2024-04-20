from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

# from run import run
import asyncio

app = FastAPI()


class RunParams(BaseModel):
    scenario_group_id: str
    agent_group_id: str
    test_mode: bool
    loop_limit: int
    action_frequency: float
    reply_probablity: float


@app.post("/create_scenario/")
async def create_scenario(RunParams: RunParams):
    print(RunParams)
    scenario_group_id = RunParams.scenario_group_id
    agent_group_id = RunParams.agent_group_id
    test_mode = RunParams.test_mode
    loop_limit = RunParams.loop_limit
    action_frequency = RunParams.action_frequency
    reply_probablity = RunParams.reply_probablity

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
    uvicorn.run(app, host="localhost", port=8001)
