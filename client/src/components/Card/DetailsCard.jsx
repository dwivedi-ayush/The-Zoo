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





import React, { useState } from "react";

const DetailsCard = () => {
  const [details, setDetails] = useState([
    "Agent/Scenario 1",
    "Agent/Scenario 2",
    "Agent/Scenario 3",
    "Agent/Scenario 4",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);

  const handleDelete = (index) => {
    const updatedDetails = [...details];
    updatedDetails.splice(index, 1);
    setDetails(updatedDetails);
  };

  const filteredDetails = details.filter((detail) =>
    detail.toLowerCase().includes(searchTerm.toLowerCase())
  );

//   const handleMouseDown = (e) => {
//     setIsDragging(true);
//     setPosition({
//       x: e.clientX - e.target.offsetLeft,
//       y: e.clientY - e.target.offsetTop,
//     });
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   const handleMouseMove = (e) => {
//     if (isDragging) {
//       setPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
//     }
//   };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-6 w-3/4 md:w-1/3"
      style={{ left: position.x, top: position.y }}
      
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-800 font-bold">Details</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-100 px-4 py-2 rounded-md pr-10"
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
        {filteredDetails.map((detail, index) => (
          <li
            key={index}
            className="bg-gray-100 rounded-md px-4 py-2 flex justify-between items-center"
          >
            {detail}
            <button
              className="text-red-500 hover:text-red-600 focus:outline-none"
              onClick={() => handleDelete(index)}
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
