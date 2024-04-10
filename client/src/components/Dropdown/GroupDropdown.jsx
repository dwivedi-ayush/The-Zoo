import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const GroupInput = ({ handleGroupInput }) => {
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroup, setNewGroup] = useState("");

  const handleAddGroup = () => {
    handleGroupInput(newGroup);
    setNewGroup("");
    setIsAddingGroup(false);
  };

  return (
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
  );
};
// const GroupMemberInput = ({ handleGroupMemberInput }) => {
//   const [isAddingMember, setIsAddingMember] = useState(false);
//   const [newMember, setNewMember] = useState("");

//   const handleAddGroup = () => {
//     handleGroupMemberInput(newMember);
//     setNewMember("");
//     setIsAddingMember(false);
//   };

//   return (
//     <div>
//       {isAddingMember ? (
//         <div className="flex items-center">
//           <input
//             type="text"
//             value={newMember}
//             onChange={(e) => setNewMember(e.target.value)}
//             placeholder="Enter group name"
//             className="border border-gray-300 shadow-sm rounded-md pl-1 py-1 m-1 text-sm"
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 handleAddGroup();
//               }
//             }}
//           />
//           <button
//             onClick={() => setIsAddingMember(false)}
//             className="cursor-default flex justify-between hover:bg-gray-100 text-sm m-1 text-gray-700"
//           >
//             x
//           </button>
//         </div>
//       ) : (
//         <button
//           onClick={() => setIsAddingMember(true)}
//           className="cursor-default flex justify-between hover:bg-gray-100 px-4 py-2 text-sm text-gray-700"
//         >
//           +
//         </button>
//       )}
//     </div>
//   );
// };

const GroupDropdown = ({ allowDelete = true }) => {
  const [groups, setGroups] = useState(["Default Group"]);
  const [selectedGroup, setSelectedGroup] = useState("Default Group");
  const [isOpen, setIsOpen] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);

  const handleGroupInput = (newGroup) => {
    // Add the new member to the list of groups
    setGroups([...groups, newGroup]);
  };
  const handleGroupMemberInput = (newMember) => {
    // Add the new member to the list of groups
    setGroupMembers([...groupMembers, newMember]);
  };

  useEffect(() => {
    // setGroups()
    setGroupMembers(["member1", "member2", "member3"]);
  }, []);

  const handleDelete = (index) => {
    if (allowDelete && index !== 0) {
      setGroups(groups.filter((_, i) => i !== index));
    }
  };
  const handleMemberDelete = (index) => {
    if (allowDelete && selectedGroup !== "Default Group") {
      setGroupMembers(groupMembers.filter((_, i) => i !== index));
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setIsOpen(false);
  };

  return (
    <div className=" mt-10 ml-10 relative inline-block text-left">
      <button
        type="button"
        className="inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-6 w-48 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
        id="options-menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={toggleDropdown}
      >
        {selectedGroup}
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
                key={index}
                className="cursor-default flex justify-between hover:bg-gray-100 px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                onClick={() => handleGroupSelect(group)}
              >
                <span>{group}</span>
                <button
                  type="button"
                  className={`text-gray-400 hover:text-gray-600 focus:outline-none ${
                    index !== 0
                      ? "cursor-default"
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
            <GroupInput handleGroupInput={handleGroupInput} />
          </div>
        </div>
      ) : (
        <>
          {groupMembers.map((item, index) => {
            return (
              <div className="cursor-default flex justify-between border-b-2 text-sm text-gray-700">
                <div className="cursor-default  py-2 text-sm text-gray-700">
                  {item}
                </div>
                <button
                  type="button"
                  className={`text-gray-400 hover:text-gray-600 focus:outline-none ${
                    selectedGroup !== "Default Group"
                      ? "cursor-default"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMemberDelete(index);
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
          <div>
            <Link className="text-sm text-gray-700" to="/agentform">
              + create new Agent
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default GroupDropdown;
