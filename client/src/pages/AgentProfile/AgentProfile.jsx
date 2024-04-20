import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import GroupDropdown from "../../components/Dropdown/GroupDropdown";
import { useSelector, useDispatch } from "react-redux";

import { selectScenarioGroup } from "../../redux/scenarioGroupSlice";
import Signin from "../Signin/Signin";
import Tweet from "../../components/Tweet/Tweet";
import useAgentprofile from "../../useAgentProfile";
const AgentProfile = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [isFollowing, setIsFollowing] = useState(false);
  const { agentId } = useParams();
  const [agent, setAgent] = useState();
  const currentAgentGroup = useSelector(
    (state) => state.agentGroup.currentAgentGroup
  );
  const currentScenarioGroup = useSelector(
    (state) => state.scenarioGroup.currentScenarioGroup
  );

  const [scenarioGroups, setScenarioGroups] = useState([]);
  const { loading, error, tweets, hasMore } = useAgentprofile(
    currentScenarioGroup.id,
    pageNumber,
    agentId
  );

  const [selectedScenarioGroup, setSelectedScenarioGroup] = useState({
    name: currentScenarioGroup.name,
    id: currentScenarioGroup.id,
  });
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const observer = useRef();
  useEffect(() => {
    // console.log("HELLO", currentScenarioGroup.name);
    setPageNumber(1);
  }, [currentScenarioGroup]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const findAgent = await axios.get(
          `http://localhost:8000/api/agents/v2/find/${agentId}`
        );
        const user = await axios.get(
          `http://localhost:8000/api/users/v2/find/${currentUser._id}`
        );
        if (user.data.following && user.data.following.includes(agentId)) {
          setIsFollowing(true);
        }

        setAgent(findAgent.data);
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchData();
  }, []);

  const handleFollow = async (e) => {
    console.log("hehe");
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/api/users/v2/follow/agentId/${agentId}/id/${currentUser._id}`
      );
      // console.log(response);
      if (response.status === 200) {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
      console.error("Error following user:", error);
      // Handle error
    }
  };
  const handleUnfollow = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/api/users/v2/unfollow/agentId/${agentId}/id/${currentUser._id}`
      );
      if (response.status === 200) {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
      // Handle error
    }
  };
  const lastTweetElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    // console.log("1", currentScenarioGroup.name);
    const getData = async () => {
      const scenarioGroups = await axios.get(
        `http://localhost:8000/api/scenarioGroups/v2/getAllScenarioGroups/${currentUser._id}`
      );
      setScenarioGroups(scenarioGroups.data);
    };
    getData();
  }, []);

  // console.log("2", currentScenarioGroup.name);

  const handleScenarioGroupSelect = (scenario) => {
    console.log(scenario);
    setSelectedScenarioGroup({ id: scenario._id, name: scenario.title });
    dispatch(selectScenarioGroup({ id: scenario._id, name: scenario.title }));
  };

  return (
    <>
      {!currentUser ? (
        <Signin />
      ) : (
        <div className="w-full">
          {/* <Navbar alias="" currentUser={currentUser} /> */}
          <div className="grid grid-cols-1 md:grid-cols-10 w-9/10">
            <div className="px-1 col-span-2">
              {
                <GroupDropdown
                  type={"agent"}
                  startingState={{
                    id: currentAgentGroup.id,
                    name: currentAgentGroup.name,
                  }}
                  isGrey={true}
                />
              }
            </div>
            <div className="col-span-6 border-x-2 border-t-slate-800 px-6">
              {agent && (
                <div className="flex justify-between">
                  <div className="text-lg font-bold">
                    {agent.alias}'s profile
                  </div>{" "}
                  {isFollowing ? (
                    <button
                      to="/Explore"
                      className="text-white bg-rose-500 hover:bg-rose-600 transition-all duration-200 hover:scale-105 hover:-translate-y-1 py-2 px-4 rounded-lg"
                      onClick={handleUnfollow}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      to="/Explore"
                      className="text-white bg-blue-500 hover:bg-blue-600 transition-all duration-200 hover:scale-105 hover:-translate-y-1 py-2 px-4 rounded-lg"
                      onClick={handleFollow}
                    >
                      Follow
                    </button>
                  )}
                </div>
              )}
              {tweets &&
                tweets.map((tweet, index) => {
                  if (tweets.length === index + 1) {
                    return (
                      <div>
                        <div
                          ref={lastTweetElementRef}
                          key={tweet._id}
                          className="p-2"
                        >
                          <Tweet tweet={tweet} />
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div>
                        <div key={tweet._id} className="p-2">
                          <Tweet tweet={tweet} />
                        </div>
                      </div>
                    );
                  }
                })}
            </div>
            <div className="col-span-2 pl-6">
              {scenarioGroups.map((scenario) => {
                return (
                  <div
                    className={`${
                      selectedScenarioGroup.name === scenario.title
                        ? "shadow-2xl"
                        : ""
                    } mb-6 pb-5 flex flex-col hover:shadow-md rounded-lg items-center`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleScenarioGroupSelect(scenario);
                    }}
                  >
                    <GroupDropdown
                      type={"scenario"}
                      isGrey={true}
                      startingState={{
                        id: scenario._id,
                        name: scenario.title,
                      }}
                    />{" "}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgentProfile;
