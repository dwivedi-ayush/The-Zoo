import React, { useState, useCallback } from "react";
import TimelineTweet from "../TimelineTweet/TimelineTweet";
// import ExploreTweets from "../ExploreTweets/ExploreTweets";
import { useSelector } from "react-redux";

import axios from "axios";

const MainTweet = () => {
  const [title, setTitle] = useState("");
  const [scenarioText, setScenarioText] = useState("");
  const [scenarioSuccess, setScenarioSuccess] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const currentScenarioGroup = useSelector(
    (state) => state.scenarioGroup.currentScenarioGroup
  );
  const handleScenarioTextChange = useCallback(
    (e) => {
      // console.log(e.target.value)t
      e.preventDefault();

      setScenarioText(e.target.value);
    },
    [setScenarioText]
  );
  const handleGenerateTweet = async (e) => {};
  const handleReset = async (e) => {};
  const handleSubmit = async (e) => {
    e.preventDefault();

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
              className="bg-blue-500 text-white py-2 px-4 mr-2 rounded-full transition-all duration-200 hover:bg-blue-600 hover:scale-105 hover:-translate-y-1"
            >
              Generate Tweets
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
