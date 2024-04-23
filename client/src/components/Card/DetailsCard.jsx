// import React, { useState } from "react";

// const DetailsCard = () => {
//   const [details, setDetails] = useState([
//     "User/Scenario 1",
//     "User/Scenario 2",
//     "User/Scenario 3",
//     "User/Scenario 4",
//   ]);
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleDelete = (index) => {
//     const updatedDetails = [...details];
//     updatedDetails.splice(index, 1);
//     setDetails(updatedDetails);
//   };

//   const filteredDetails = details.filter((detail) =>
//     detail.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="bg-white shadow-md rounded-lg p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-gray-800 font-bold">Details</h2>
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="bg-gray-100 px-4 py-2 rounded-md pr-10"
//           />
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5 text-gray-400 absolute top-1/2 transform -translate-y-1/2 right-3"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//             />
//           </svg>
//         </div>
//       </div>
//       <ul className="space-y-2">
//         {filteredDetails.map((detail, index) => (
//           <li
//             key={index}
//             className="bg-gray-100 rounded-md px-4 py-2 flex justify-between items-center"
//           >
//             {detail}
//             <button
//               className="text-red-500 hover:text-red-600 focus:outline-none"
//               onClick={() => handleDelete(index)}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                 />
//               </svg>
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default DetailsCard;

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAgentGroup } from "../../redux/agentGroupSlice";
import { selectScenarioGroup } from "../../redux/scenarioGroupSlice";
import axios from "axios";
import "./DetailsCard.css";

import { DeleteScenarioDialogueBox } from "../Dropdown/GroupDropdown";

const DetailsCard = ({ type, alreadySmall }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [isSmall, setIsSmall] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [groups, setGroups] = useState([]);
  const dispatch = useDispatch();
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
          // setGroupMembers([
          //   ...golbalAgents.data.map((item) => {
          //     return item.alias;
          //   }),
          // ]);
          const golbalAgentsNamesWithIds = await Promise.all(
            golbalAgents.data.map(async (agent) => {
              return { name: agent.alias, id: agent._id };
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
              `http://localhost:8000/api/scenarios/v2/getbygroup/${currentGroup.id}`
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
  }, [currentGroup]);

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

  const filteredMembers = groupMembers.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // console.log(type, currentGroup);
  return (
    <div
      className={`bg-white overflow-auto rounded-lg p-6 w-full aspect-square sm:w-auto md:w-auto lg:w-auto m-3 ${
        type === "agent"
          ? "shadow-red origin-top-left"
          : "shadow-green origin-top-right"
      }  transition ease-in-out delay-200 ${
        isSmall && alreadySmall ? "scale-50" : ""
      } `}
      // style={{ left: position.x, top: position.y }}
      onClick={handleClick}
    >
      {deletePopup && (
        <DeleteScenarioDialogueBox
          toBeDeletedmember={toBeDeletedmember}
          setDeletePopup={setDeletePopup}
          deletePopup={deletePopup}
          setGroupMembers={setGroupMembers}
        />
      )}
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
      </div>
      <ul className="space-y-2">
        {filteredMembers.map((member, index) => (
          <li
            key={index}
            className="bg-gray-100 rounded-md px-4 py-2 flex justify-between items-center"
          >
            {member.name}
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DetailsCard;
