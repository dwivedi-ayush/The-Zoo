import React, { useState, useEffect } from "react";
import ExploreTweets from "../../components/ExploreTweets/ExploreTweets";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import Navbar from "../../components/Navbar/Navbar";
import { useSelector, useDispatch } from "react-redux";
import GroupDropdown from "../../components/Dropdown/GroupDropdown";
import axios from "axios";
import { selectAgentGroup } from "../../redux/agentGroupSlice";
import { selectScenarioGroup } from "../../redux/scenarioGroupSlice";
import Signin from "../Signin/Signin";

const Explore = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [defaultScenarioId, setDefaultScenarioId] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const getData = async () => {
      const defaultScenarioId = await axios.get(
        `http://localhost:8000/api/scenarioGroups/v2/userId/${currentUser._id}`
      );
      setDefaultScenarioId(defaultScenarioId.data);

      dispatch(selectAgentGroup({ name: "Global Agent Group", id: "0" }));
      dispatch(
        selectScenarioGroup({
          name: "Default Scenario Group",
          id: defaultScenarioId.data,
        })
      );
    };
    getData();
  }, []);
  return (
    <>
      {!currentUser ? (
        <Signin />
      ) : (
        <>
          {/* <Navbar alias="" currentUser={currentUser} /> */}
          <div className="w-full">
            {/* <Navbar alias="" currentUser={currentUser} /> */}
            <div className="grid grid-cols-1 md:grid-cols-10 w-9/10">
              <div className="px-1 col-span-2">
                {defaultScenarioId && (
                  <GroupDropdown
                    type={"agent"}
                    startingState={{ id: "0", name: "Global Agent Group" }}
                  />
                )}
              </div>
              <div className="col-span-6 border-x-2 border-t-slate-800 px-6">
                <ExploreTweets />
              </div>
              <div className="col-span-2 pl-6">
                {defaultScenarioId && (
                  <GroupDropdown
                    type={"scenario"}
                    startingState={{
                      id: defaultScenarioId,
                      name: "Default Scenario Group",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Explore;
