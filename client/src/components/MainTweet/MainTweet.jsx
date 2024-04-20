import React, { useState, useCallback } from "react";
import TimelineTweet from "../TimelineTweet/TimelineTweet";
// import ExploreTweets from "../ExploreTweets/ExploreTweets";
import { useSelector } from "react-redux";

import axios from "axios";

const MainTweet = () => {
  const [title, setTitle] = useState("");
  const [scenarioText, setScenarioText] = useState("");
  const [scenarioSuccess, setScenarioSuccess] = useState(false);
  const [isGenerating, setIsGeneration] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const currentScenarioGroup = useSelector(
    (state) => state.scenarioGroup.currentScenarioGroup
  );
  const currentAgentGroup = useSelector(
    (state) => state.agentGroup.currentAgentGroup
  );
  const handleScenarioTextChange = useCallback(
    (e) => {
      // console.log(e.target.value)t
      e.preventDefault();

      setScenarioText(e.target.value);
    },
    [setScenarioText]
  );

  const handleGenerateTweet = async (e) => {
    e.preventDefault();
    const body = {
      scenario_group_id: currentScenarioGroup.id,
      agent_group_id: currentAgentGroup.id,
      test_mode: true,
      loop_limit: 10,
      action_frequency: 1,
      reply_probablity: 0.75,
    };
    setIsGeneration(true);
    axios.post("http://localhost:5000/generatetweet", body);
    // setTimeout(() => {
    //   window.location.reload();
    // }, 5000);
    setIsGeneration(false);
  };
  const handleReset = async (e) => {};
  const handleSubmit = async (e) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/scenarios/v2/scenarios",
        {
          userId: currentUser._id,
          title: title,
          description: scenarioText,
          scenarioGroupId: currentScenarioGroup.id,
        }
      );

      if (response.status === 201) {
        setScenarioSuccess(true);
      } else {
        console.log("Error: Request failed with status", response.status);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <div>
      {currentUser && (
        <p className="font-bold pl-2 my-2">{currentUser.username}</p>
      )}

      <form className="border-b-2 pb-6">
        <div className="flex flex-col mb-2">
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="text"
            placeholder="Set scenario Title"
            maxLength={50}
            className="bg-slate-200 rounded-lg  p-2 mb-2"
            style={{ height: "4vh" }} // Adjust the height as needed
          />
          <textarea
            value={scenarioText}
            onChange={handleScenarioTextChange}
            type="text"
            placeholder="create your own custom scenario that affects this world"
            maxLength={280}
            className="bg-slate-200 rounded-lg w-full p-2 mb-2"
          ></textarea>
        </div>
        <div className="flex items-center justify-between transition-all duration-200">
          <div className="flex items-center">
            {!scenarioSuccess ? (
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white py-2 px-4 rounded-full w-max transition-all duration-200 hover:bg-blue-600 hover:scale-105 hover:-translate-y-1"
              >
                Create scenario
              </button>
            ) : (
              <button
                disabled
                className="bg-blue-500/50 text-white py-2 px-4 w-max rounded-full "
              >
                Create scenario
              </button>
            )}

            {scenarioSuccess && (
              // <p className="ml-4 border border-green-500 rounded-full p-2">
              //   Custom Scenario Active
              // </p>}
              <button
                onClick={() => {
                  setScenarioSuccess(false);
                  setScenarioText("");
                }}
                className="ml-4 border border-green-500 py-2 px-4 rounded-full transition-all duration-200 hover:scale-105 hover:-translate-y-1 hover:bg-rose-600 hover:text-white"
                title="Click to deactivate"
              >
                Custom Scenario Active
              </button>
            )}
          </div>
          <div className="border-solid border-1 border-black flex justify-end item-center">
            <button
              onClick={handleGenerateTweet}
              className={
                isGenerating
                  ? "bg-blue-400 text-white py-2 px-4 mr-2 rounded-full"
                  : "bg-blue-500 text-white py-2 px-4 mr-2 rounded-full transition-all duration-200 hover:bg-blue-600 hover:scale-105 hover:-translate-y-1"
              }
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="flex item-center justify-between">
                  <svg
                    aria-hidden="true"
                    class="w-4 h-4 mr-2 mt-1 text-gray-200 animate-spin fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  Generating Tweets...
                </div>
              ) : (
                "Generate Tweets"
              )}
            </button>
            <button
              onClick={handleReset}
              className="bg-rose-500 text-white py-2 px-4 rounded-full transition-all duration-200 hover:bg-rose-600 hover:scale-105 hover:-translate-y-1"
            >
              Reset
            </button>
          </div>
        </div>
      </form>
      <TimelineTweet />
      {/* <ExploreTweets /> */}
    </div>
  );
};

export default MainTweet;
