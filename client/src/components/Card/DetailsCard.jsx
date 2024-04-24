import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAgentGroup } from "../../redux/agentGroupSlice";
import { selectScenarioGroup } from "../../redux/scenarioGroupSlice";
import axios from "axios";
import "./DetailsCard.css";

const DetailsCard = ({ type, alreadySmall }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [isSmall, setIsSmall] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [groups, setGroups] = useState([]);
  const [following, setFollowing] = useState();
  const dispatch = useDispatch();
  const [showOnlyFollowing, setShowOnlyFollowing] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [currentGroup, setCurrentGroup] = useState("");
  const [deletePopup, setDeletePopup] = useState(false);
  const [toBeDeletedmember, setToBeDeletedmember] = useState({
    index: "",
    memeber: "",
  });
  const currentAgentGroup = useSelector(
    (state) => state.agentGroup.currentAgentGroup
  );
  const currentScenarioGroup = useSelector(
    (state) => state.scenarioGroup.currentScenarioGroup
  );
  const [cardClass, setCardClass] = useState("card-normal");
  // const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setCardClass(isSmall ? "card-small" : "card-normal");
  }, [isSmall]);
  const handleClick = (event) => {
    // console.log(isSmall);
    setIsSmall(!isSmall); // Toggle the isSmall state
    // const offsetX = event.clientX - position.x;
    // const offsetY = event.clientY - position.y;

    // // Update the card's position
    // setPosition({
    //   x: event.clientX - offsetX,
    //   y: event.clientY - offsetY,
    // });
  };
  useEffect(() => {
    if (type === "agent") {
      setCurrentGroup(currentAgentGroup);
    } else if (type === "scenario") {
      setCurrentGroup(currentScenarioGroup);
    }
  }, [currentAgentGroup, currentScenarioGroup]);
  useEffect(() => {
    if (type === "agent") {
      setGroups([{ name: "Global Agent Group", id: "" }]);
      setCurrentGroup({ name: "Global Agent Group", id: "" });
      dispatch(selectAgentGroup({ name: "Global Agent Group", id: "" }));
      const fetchData = async () => {
        try {
          const user = await axios.get(
            `http://localhost:8000/api/users/v2/find/${currentUser._id}`
          );
          const golbalAgents = await axios.get(
            `http://localhost:8000/api/agents/v2/getglobal`
          );
          setFollowing(user.data.following);
          const golbalAgentsNamesWithIds = await Promise.all(
            golbalAgents.data.map(async (agent) => {
              return {
                name: agent.alias,
                id: agent._id,
                text: agent.personality,
              };
            })
          );
          setGroupMembers(golbalAgentsNamesWithIds);
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
            { name: "Global Agent Group", id: "" },
            ...groups.slice(1),
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
          const scenarioGroupNamesWithIds = await Promise.all(
            user.data.scenarioGroupIds.map(async (id) => {
              const { data } = await axios.get(
                `http://localhost:8000/api/scenariogroups/v2/${id}`
              );
              return { name: data.title, id: id };
            })
          );
          const scenarioGroup = scenarioGroupNamesWithIds.find(
            (group) => group.name === "Default Scenario Group"
          );
          if (scenarioGroup) {
            setCurrentGroup({
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
          setGroups([...groups, ...scenarioGroupNamesWithIds]);
        } catch (err) {
          console.log("error", err);
        }
      };
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (currentGroup) {
      if (type === "agent") {
        // console.log(currentGroup, "hehe");
        setCurrentGroup(currentGroup);
        dispatch(selectAgentGroup(currentGroup));
        const fetchData = async () => {
          try {
            // const user = await axios.get(`users/v2/find/${currentUser._id}`);
            const agents =
              currentGroup.id === ""
                ? await axios.get(
                    `http://localhost:8000/api/agents/v2/getglobal`
                  )
                : await axios.get(
                    `http://localhost:8000/api/agents/v2/getbygroup/${currentGroup.id}`
                  );
            const AgentsNamesWithIds = await Promise.all(
              agents.data.map(async (agent) => {
                return {
                  name: agent.alias,
                  id: agent._id,
                  text: agent.personality,
                };
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
              `http://localhost:8000/api/scenarios/v2/getbygroup/${currentGroup.id}`
            );

            const scenarioTitlesWithIds = await Promise.all(
              scenarios.data.map(async (scenario) => {
                return {
                  name: scenario.title,
                  id: scenario._id,
                  text: scenario.description,
                };
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
  }, [currentGroup]);

  const handleFollowUnfollow = async (e, member, index) => {
    e.preventDefault();
    if (following.includes(member.id)) {
      try {
        const response = await axios.put(
          `http://localhost:8000/api/users/v2/unfollow/agentId/${member.id}/id/${currentUser._id}`
        );
        if (response.status === 200) {
          const updatedFollowing = following.filter((id) => id !== member.id);
          setFollowing(updatedFollowing);
        }
      } catch (error) {
        console.error("Error unfollowing user:", error);
        // Handle error
      }
    } else {
      try {
        const response = await axios.put(
          `http://localhost:8000/api/users/v2/follow/agentId/${member.id}/id/${currentUser._id}`
        );
        if (response.status === 200) {
          setFollowing([...following, member.id]);
        }
      } catch (error) {
        console.error("Error following user:", error);
        // Handle error
      }
    }
  };
  const handleDelete = (index, member) => {
    if (type === "agent" && currentGroup !== "Global Agent Group") {
      const updatedGroup = [...groupMembers];
      updatedGroup.splice(index, 1);
      setGroups(updatedGroup);
    } else if (type === "scenario") {
      setDeletePopup(true);
      setToBeDeletedmember({ index: index, member: member });
    }
  };

  // Function to handle checkbox toggle
  const handleCheckboxChange = () => {
    // Update the state variable based on the current checked state
    setShowOnlyFollowing((prev) => !prev);
  };
  const filteredMembers = groupMembers.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // console.log(type, currentGroup);
  return (
    ((type === "agent" && following) || type === "scenario") && (
      <div
        className={`bg-white overflow-auto rounded-lg p-6 w-full h-[70vh] sm:w-auto md:w-auto lg:w-auto m-3 ${
          type === "agent"
            ? "shadow-red origin-top-left"
            : "shadow-green origin-top-right"
        }  transition ease-in-out duration-300${
          isSmall && alreadySmall ? "" : ""
        } `}
        // style={{ left: position.x, top: position.y }}
        onClick={handleClick}
      >
        {/* {deletePopup && (
        <DeleteScenarioDialogueBox
          toBeDeletedmember={toBeDeletedmember}
          setDeletePopup={setDeletePopup}
          deletePopup={deletePopup}
          setGroupMembers={setGroupMembers}
        />
      )} */}
        <div className="flex flex-col md:flex-col sm:flex-col justify-between items-start md:items-center mb-4">
          <h2 className="text-gray-800 font-bold text-lg mb-2 md:mb-3">
            {currentGroup.name}
          </h2>

          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 px-4 py-2 rounded-md pr-10 w-full md:w-auto"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute top-1/2 transform -translate-y-1/2 right-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {type === "agent" && (
            <div>
              <p className="text-gray-700 text-xs">Click to follow/unfollow</p>
              <div className="flex item-center">
                <p className="text-gray-700 text-xs mr-1">
                  Show only following:
                </p>
                <input
                  type="checkbox"
                  checked={showOnlyFollowing}
                  onChange={handleCheckboxChange}
                ></input>
              </div>
            </div>
          )}
        </div>
        <ul className="space-y-2">
          {filteredMembers.map((member, index) =>
            type === "agent" ? (
              (!showOnlyFollowing || following.includes(member.id)) && (
                <li
                  key={index}
                  className={`bg-gray-100 rounded-md px-4 py-2 flex justify-between items-center ${
                    type === "agent" && following.includes(member.id)
                      ? "border-solid border-2 border-blue-300 "
                      : ""
                  } transition-all duration-300 ${
                    type === "agent" ? "hover:scale-tiny cursor-pointer" : ""
                  }`}
                  onClick={(e) => handleFollowUnfollow(e, member, index)}
                >
                  {member.name} {member.text && `: ${member.text}`}
                  {type === "" && (
                    <button
                      className={`text-red-500 hover:text-red-600 focus:outline-none ${
                        (type === "agent" &&
                          currentGroup.name !== "Global Agent Group") ||
                        type === "scenario"
                          ? "cursor-default"
                          : "cursor-not-allowed opacity-50"
                      }`}
                      onClick={() => handleDelete(index, member)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </li>
              )
            ) : (
              <li
                key={index}
                className={`bg-gray-100 rounded-md px-4 py-2 flex justify-between items-center`}
                onClick={(e) => handleFollowUnfollow(e, member, index)}
              >
                {member.name} {member.text && `: ${member.text}`}
              </li>
            )
          )}
        </ul>
      </div>
    )
  );
};

export default DetailsCard;
