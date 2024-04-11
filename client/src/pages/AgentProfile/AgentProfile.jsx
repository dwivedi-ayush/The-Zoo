import React, { useState, useEffect } from "react";
import axios from "axios";
import DetailsCard from "../../components/Card/DetailsCard";
import GroupDropdown from "../../components/Dropdown/GroupDropdown";
import { useSelector, useDispatch } from "react-redux";
import { selectAgentGroup } from "../../redux/agentGroupSlice";
import { selectScenarioGroup } from "../../redux/scenarioGroupSlice";


const AgentProfile = () => {
  const [agentGroupOptions, setAgentGroupOptions] = useState([]);
  const [scenarioGroupOptions, setScenarioGroupOptions] = useState([]);
  const [selectedAgentGroup, setSelectedAgentGroup] = useState("null");
  const [selectedScenarioGroup, setSelectedScenarioGroup] = useState(null);
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

  const handleAgentGroupSelect = (option) => {
    setSelectedAgentGroup(option);
    dispatch(selectAgentGroup(option));
  };

  const handleScenarioGroupSelect = (option) => {
    setSelectedScenarioGroup(option);
    dispatch(selectScenarioGroup(option));
  };

  return (
    <div className="flex h-screen w-auto">
      <div className="flex-1 border-r border-black">
        <GroupDropdown
          options={agentGroupOptions}
          selectedOption={selectedAgentGroup}
          onSelectOption={handleAgentGroupSelect}
        />
      </div>
      <div className="flex-1 border-r border-black">
        {selectedAgentGroup && <DetailsCard />}
      </div>
      <div className="flex-1 border-r border-black">
        {selectedScenarioGroup && <DetailsCard />}
      </div>
      <div className="flex-1 border-l border-black">
        <GroupDropdown
          options={scenarioGroupOptions}
          selectedOption={selectedScenarioGroup}
          onSelectOption={handleScenarioGroupSelect}
        />
      </div>
    </div>
  );
};

export default AgentProfile;
