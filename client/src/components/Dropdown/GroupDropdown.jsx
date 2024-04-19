import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAgentGroup } from "../../redux/agentGroupSlice";
import { selectScenarioGroup } from "../../redux/scenarioGroupSlice";
import { useLocation } from "react-router-dom";
const GroupDropdown = ({
  allowDelete = true,
  type,
  isGrey = false,
  startingState,
}) => {
  const location = useLocation().pathname;
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroup, setNewGroup] = useState("");
  const dispatch = useDispatch();
  const currentAgentGroup = useSelector(
    (state) => state.agentGroup.currentAgentGroup
  );
  const currentScenarioGroup = useSelector(
    (state) => state.scenarioGroup.currentScenarioGroup
  );
  const handleAddGroup = () => {
    if (type === "agent") {
      const saveAgentGroup = async () => {
        try {
          const agentGroupBody = {
            groupName: newGroup,
            userId: currentUser._id,
          };
          const res = await axios.put(
            `http://localhost:8000/api/agentGroups/v2/`,
            agentGroupBody
          );

          setGroups([
            ...groups,
            { name: res.data.groupName, id: res.data._id },
          ]);
          if (res.status !== 201) {
            throw new Error(
              `Agent group creation request failed with status: ${res.status}`
            );
          }
        } catch (err) {
          console.log("error", err);
        }
      };
      saveAgentGroup();
    } else if (type === "scenario") {
      const saveScenarioGroup = async () => {
        try {
          const scenarioGroupBody = {
            title: newGroup,
            userId: currentUser._id,
          };
          const res = await axios.put(
            `http://localhost:8000/api/scenarioGroups/v2/`,
            scenarioGroupBody
          );

          setGroups([...groups, { name: res.data.title, id: res.data._id }]);
          if (res.status !== 201) {
            throw new Error(
              `Scenario group creation request failed with status: ${res.status}`
            );
          }
        } catch (err) {
          console.log("error", err);
        }
      };
      saveScenarioGroup();
    }

    setNewGroup("");

    setIsAddingGroup(false);
  };

  // const handleGroupMemberInput = (newMember) => {
  //   setGroupMembers([...groupMembers, newMember]);
  // };
  useEffect(() => {
    if (selectedGroup) {
      if (type === "agent") {
        // setSelectedGroup(selectedGroup);
        dispatch(selectAgentGroup(selectedGroup));
        const fetchData = async () => {
          try {
            // const user = await axios.get(`users/v2/find/${currentUser._id}`);
            // console.log(startingState.id, "hehe");
            const agents = await axios.get(
              `http://localhost:8000/api/agents/v2/getbygroup/${selectedGroup.id}`
            );
            const AgentsNamesWithIds = await Promise.all(
              agents.data.map(async (agent) => {
                console.log(agent);
                return { name: agent.alias, id: agent._id };
              })
            );
            setGroupMembers(AgentsNamesWithIds);
          } catch (err) {
            console.log("error", err);
          }
        };
        fetchData();
      } else if (type === "scenario") {
        const fetchData = async () => {
          try {
            // const user = await axios.get(`users/v2/find/${currentUser._id}`);
            const scenarios = await axios.get(
              `http://localhost:8000/api/scenarios/v2/getbygroup/${selectedGroup.id}`
            );

            const scenarioTitlesWithIds = await Promise.all(
              scenarios.data.map(async (scenario) => {
                return { name: scenario.title, id: scenario._id };
              })
            );
            setGroupMembers(scenarioTitlesWithIds);
          } catch (err) {
            console.log("error", err);
          }
        };
        fetchData();
      }
    }
  }, [selectedGroup]);

  useEffect(() => {
    // console.log(location);
    setSelectedGroup({ name: startingState.name, id: startingState.id });
    if (type === "agent") {
      // setGroups([{ name: "Global Agent Group", id: "" }]);
      dispatch(
        selectAgentGroup({ name: startingState.name, id: startingState.id })
      );
      const fetchData = async () => {
        try {
          const user = await axios.get(
            `http://localhost:8000/api/users/v2/find/${currentUser._id}`
          );
          // const getAgents =
          const getAgents = await axios.get(
            `http://localhost:8000/api/agents/v2/getbygroup/${startingState.id}`
          );

          const AgentsNamesWithIds = await Promise.all(
            getAgents.data.map(async (agent) => {
              return { name: agent.alias, id: agent._id };
            })
          );
          setGroupMembers(AgentsNamesWithIds);
          // setGroupMembers([
          //   ...getAgents.data.map((item) => {
          //     return item.alias;
          //   }),
          // ]);

          // const user = await axios.get(`users/v2/find/${currentUser._id}`);
          const agentGroupNamesWithIds = await Promise.all(
            user.data.agentGroupIds.map(async (id) => {
              const { data } = await axios.get(
                `http://localhost:8000/api/agentgroups/v2/${id}`
              );

              return { name: data.groupName, id: id };
            })
          );

          setGroups([
            { name: "Global Agent Group", id: "0" },

            ...agentGroupNamesWithIds,
          ]);
        } catch (err) {
          console.log("error", err);
        }
      };
      fetchData();
    } else if (type === "scenario") {
      const fetchData = async () => {
        try {
          const user = await axios.get(
            `http://localhost:8000/api/users/v2/find/${currentUser._id}`
          );
          const getScenarios = await axios.get(
            `http://localhost:8000/api/scenarios/v2/getbygroup/${startingState.id}`
          );
          console.log(getScenarios.data);
          const scenarioNamesWithIds = await Promise.all(
            getScenarios.data.map(async (scenario) => {
              return { name: scenario.title, id: scenario._id };
            })
          );
          setGroupMembers(scenarioNamesWithIds);

          const scenarioGroupNamesWithIds = await Promise.all(
            user.data.scenarioGroupIds.map(async (id) => {
              const { data } = await axios.get(
                `http://localhost:8000/api/scenariogroups/v2/${id}`
              );
              return { name: data.title, id: id };
            })
          );

          // doesnot work when we need to call multiple dropdown like in agent profile dispatch it in the place of calling of dropdown
          // dispatch(
          //   selectScenarioGroup({
          //     name: startingState.name,
          //     id: startingState.id,
          //   })
          // );

          // const scenarioGroup = scenarioGroupNamesWithIds.find(
          //   (group) => group.name === "Default Scenario Group"
          // );
          // if (scenarioGroup) {
          //   setSelectedGroup({
          //     name: "Default Scenario Group",
          //     id: scenarioGroup.id,
          //   });
          //   dispatch(
          //     selectScenarioGroup({
          //       name: "Default Scenario Group",
          //       id: scenarioGroup.id,
          //     })
          //   );
          // }
          setGroups([...scenarioGroupNamesWithIds]);
        } catch (err) {
          console.log("error", err);
        }
      };
      fetchData();
    }
  }, []);

  const handleDelete = async (index) => {
    if (allowDelete && index !== 0) {
      try {
        if (type === "agent") {
          await axios.delete(
            `http://localhost:8000/api/agentGroups/v2/${groups[index].id}`
          );
          dispatch(selectAgentGroup({ name: "Global Agent Group", id: "" }));
        } else if (type === "scenario") {
          await axios.delete(`scenarioGroups/v2/${groups[index].id}`);
          const scenarioGroup = groups.find(
            (group) => group.name === "Default Scenario Group"
          );
          if (scenarioGroup) {
            setSelectedGroup({
              name: "Default Scenario Group",
              id: scenarioGroup.id,
            });
            dispatch(
              selectScenarioGroup({
                name: "Default Scenario Group",
                id: scenarioGroup.id,
              })
            );
          }
        }

        setGroups(groups.filter((_, i) => i !== index));
      } catch (error) {
        console.error("Error deleting group:", error);
      }
    }
  };
  const handleMemberDelete = async (member, index) => {
    if (
      allowDelete &&
      type === "agent" &&
      selectedGroup.name !== "Global Agent Group"
    ) {
      // do we want to delete tweets of deleted agents?
      await axios.delete(
        `http://localhost:8000/api/agents/v2/delete/${member.id}`
      );
      setGroupMembers(groupMembers.filter((_, i) => i !== index));
    } else if (allowDelete && type === "scenario") {
      setGroupMembers(groupMembers.filter((_, i) => i !== index));
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    const fetchGroupMembers = async () => {
      if (type === "agent") {
        // const agents = await axios.get(`agents/v2/getbygroup/${group.id}`);
        dispatch(selectAgentGroup(group));
        // setGroupMembers([
        //   ...agents.data.map((item) => {
        //     return item.alias;
        //   }),
        // ]);
      } else if (type === "scenario") {
        // const scenarios = await axios.get(
        //   `scenarios/v2/getbygroup/${group.id}`
        // );
        dispatch(selectScenarioGroup(group));
        // setGroupMembers([
        //   ...scenarios.data.map((item) => {
        //     return item.title;
        //   }),
        // ]);
      }
    };
    fetchGroupMembers();
    setIsOpen(false);
  };
  const dropdownClasses = isGrey
    ? "bg-gray-200 cursor-not-allowed"
    : "bg-white cursor-pointer";

  return (
    <div className=" mt-5 relative inline-block text-left">
      <button
        type="button"
        className={`inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-6 w-48 py-2 text-sm font-medium ${dropdownClasses}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={toggleDropdown}
        disabled={isGrey}
      >
        {selectedGroup && <>{selectedGroup.name}</>}
        {isOpen ? (
          <svg
            className="-mr-1 ml-2 h-5 w-5 transform rotate-180 transition-transform duration-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="-mr-1 ml-2 h-5 w-5 transition-transform duration-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {isOpen ? (
        <div
          className="origin-top-right absolute left-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {groups.map((group, index) => (
              <div
                key={index + type}
                className={`cursor-default flex justify-between hover:bg-gray-100 px-4 py-2 text-sm text-gray-700 ${
                  isGrey ? "opacity-50 cursor-not-allowed" : ""
                }`}
                role="menuitem"
                onClick={() => handleGroupSelect(group)}
              >
                <span>{group.name}</span>
                <button
                  type="button"
                  className={`text-gray-400  focus:outline-none ${
                    index !== 0
                      ? "cursor-default hover:text-gray-600"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(index);
                  }}
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <div>
              <div>
                {isAddingGroup ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={newGroup}
                      onChange={(e) => setNewGroup(e.target.value)}
                      placeholder="Enter group name"
                      className="border border-gray-300 shadow-sm rounded-md pl-1 py-1 m-1 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddGroup();
                        }
                      }}
                    />
                    <button
                      onClick={() => setIsAddingGroup(false)}
                      className="cursor-default flex justify-between hover:bg-gray-100 text-sm m-1 text-gray-700"
                    >
                      x
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingGroup(true)}
                    className="cursor-default flex justify-between hover:bg-gray-100 px-4 py-2 text-sm text-gray-700"
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {groupMembers.map((member, index) => {
            return (
              <div className="cursor-default flex justify-between border-b-2 text-sm text-gray-700">
                <div className="cursor-default  py-2 text-sm text-gray-700">
                  {member.name}
                </div>
                <button
                  type="button"
                  className={`text-gray-400  focus:outline-none ${
                    selectedGroup && selectedGroup.id !== "0"
                      ? "cursor-default hover:text-gray-600"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMemberDelete(member, index);
                  }}
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
          {selectedGroup &&
            type === "agent" &&
            selectedGroup.name !== "Global Agent Group" && (
              <div>
                <Link className="text-sm text-gray-700" to="/agentadd">
                  + create new Agent
                </Link>
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default GroupDropdown;
