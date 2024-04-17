import React, { useState, useEffect } from "react";
import axios from "axios";
import DetailsCard from "../../components/Card/DetailsCard";
import GroupDropdown from "../../components/Dropdown/GroupDropdown";
import { useSelector, useDispatch } from "react-redux";
import { selectAgentGroup } from "../../redux/agentGroupSlice";
import { selectScenarioGroup } from "../../redux/scenarioGroupSlice";
import Signin from "../Signin/Signin";

const AgentProfile = () => {
  const currentAgentGroup = useSelector(
    (state) => state.agentGroup.currentAgentGroup
  );
  const currentScenarioGroup = useSelector(
    (state) => state.scenarioGroup.currentScenarioGroup
  );
  const [agentGroupOptions, setAgentGroupOptions] = useState([]);
  const [scenarioGroupOptions, setScenarioGroupOptions] = useState([]);
  const [selectedAgentGroup, setSelectedAgentGroup] =
    useState("Global Agent Group");
  const [selectedScenarioGroup, setSelectedScenarioGroup] = useState(
    "Default Scenario Group"
  );
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAgentGroupOptions = async () => {
      // Get agent Groups
    };
    const fetchScenarioGroupOptions = async () => {
      // Get Scenario groups
    };
    fetchAgentGroupOptions();
    fetchScenarioGroupOptions();
  }, [currentUser._id, dispatch]);
  const [defaultScenarioId, setDefaultScenarioId] = useState("");

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

  const handleAgentGroupSelect = (option) => {
    setSelectedAgentGroup(option);
    dispatch(selectAgentGroup(option));
  };

  const handleScenarioGroupSelect = (option) => {
    setSelectedScenarioGroup(option);
    dispatch(selectScenarioGroup(option));
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
              {defaultScenarioId && (
                <GroupDropdown
                  type={"agent"}
                  startingState={{
                    id: currentAgentGroup.id,
                    name: currentAgentGroup.name,
                  }}
                  isGrey={true}
                />
              )}
            </div>
            <div className="col-span-6 border-x-2 border-t-slate-800 px-6">
              <></>
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
      )}
    </>
  );
};

export default AgentProfile;
