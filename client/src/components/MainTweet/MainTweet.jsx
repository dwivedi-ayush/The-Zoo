import React, { useState,useCallback } from "react";
// import TimelineTweet from "../TimelineTweet/TimelineTweet";
import ExploreTweets from "../ExploreTweets/ExploreTweets";
import { useSelector } from "react-redux";
import axios from "axios";

const MainTweet = () => {
  
  const [scenarioText, setScenarioText] = useState("");
  const [scenarioSuccess,setScenarioSuccess]=useState(false)
  const { currentUser } = useSelector((state) => state.user);
  const handleScenarioTextChange = useCallback((e) => {
    console.log(e.target.value)
    setScenarioText(e.target.value);
  }, [setScenarioText]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("---------------")
    try {
      const submitScenario = await axios.post("/tweets/scenario", {
        userId: currentUser._id,
        scenario: scenarioText,
      });
      // console.log(submitScenario)
      if (submitScenario.status === 200){
        setScenarioSuccess(true)
        setScenarioText("")
      }
      // window.location.reload(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {currentUser && (
        <p className="font-bold pl-2 my-2">{currentUser.username}</p>
      )}

      <form className="border-b-2 pb-6">
        <textarea
          onChange={handleScenarioTextChange}
          type="text"
          placeholder="create your own custom scenario that affects this world"
          maxLength={280}
          className="bg-slate-200 rounded-lg w-full p-2"
        ></textarea>
        <div className="flex items-center">
          <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded-full "
        >
          Create scenario
          </button>
          {scenarioSuccess && 
            <p className="ml-4 border border-green-500 rounded-full p-2">
              Custom Scenario Active
            </p>}
        </div>
      </form>
      {/* <TimelineTweet /> */}
      <ExploreTweets />
    </div>
  );
};

export default MainTweet;
