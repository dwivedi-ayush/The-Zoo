import React, { useState, useEffect } from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import EditProfile from "../../components/EditProfile/EditProfile";
import Navbar from "../../components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Tweet from "../../components/Tweet/Tweet";
import { BulletList } from "react-content-loader";
import { following } from "../../redux/userSlice";
import GroupDropdown from "../../components/Dropdown/GroupDropdown";
import DetailsCard from "../../components/Card/DetailsCard";
const Profile = () => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  // const [userTweets, setUserTweets] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isSmall, setIsSmall] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const userTweets = await axios.get(`/tweets/user/all/${id}`);
        const userProfile = await axios.get(`/users/find/${currentUser._id}`);

        // setUserTweets(userTweets.data);
        setUserProfile(userProfile.data);
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchData();
  }, [currentUser, id]);

  const handleFollow = async () => {
    if (!currentUser.following.includes(id)) {
      try {
        const follow = await axios.put(`/users/follow/${id}`, {
          id: currentUser._id,
        });
        dispatch(following(id));
      } catch (err) {
        console.log("error", err);
      }
    } else {
      try {
        const unfollow = await axios.put(`/users/unfollow/${id}`, {
          id: currentUser._id,
        });

        dispatch(following(id));
      } catch (err) {
        console.log("error", err);
      }
    }
  };
  return (
    <div>
      <div className="w-full">
        {/* <Navbar alias="" currentUser={currentUser} /> */}
        <div className="grid grid-cols-1 md:grid-cols-10 w-9/10">
          <div className="px-1 col-span-2">
            <GroupDropdown type={"agent"} />
          </div>

          <div className="flex col-span-6 border-x-2 border-t-slate-800 px-6">
            <div className="flex-1 mr-4">
              <div className="mb-4">
                <h1 className="text-xl font-bold mb-2 ml-3">Agent Details</h1>
                <DetailsCard
                  type={"agent"}
                  alreadySmall={true}
                  // setIsSmall={setIsSmall}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-xl font-bold mb-2 ml-3">
                  Scenario Details
                </h1>
                <DetailsCard
                  type={"scenario"}
                  alreadySmall={true}
                  // setIsSmall={setIsSmall}
                />
              </div>
            </div>
          </div>

          <div className="col-span-2 pl-6">
            <GroupDropdown type={"scenario"} />
          </div>
        </div>
      </div>
    </div>
  );
  // return (
  //   <>
  //     <div className="grid grid-cols-1 md:grid-cols-10">
  //       <div className="col-span-2 px-1">
  //         <LeftSidebar />
  //       </div>
  //       <div className="col-span-6 border-x-2 border-t-slate-800 px-1">
  //         {/* <div className="flex justify-between items-center">
  //           <img
  //             src={userProfile?.profilePicture}
  //             alt="Profile Picture"
  //             className="w-12 h-12 rounded-full"
  //           />
  //           {currentUser._id === id ? (
  //             <button
  //               className="px-4 -y-2 bg-blue-500 rounded-full text-white"
  //               onClick={() => setOpen(true)}
  //             >
  //               Edit Profile
  //             </button>
  //           ) : currentUser.following.includes(id) ? (
  //             <button
  //               className="px-4 -y-2 bg-blue-500 rounded-full text-white"
  //               onClick={handleFollow}
  //             >
  //               Following
  //             </button>
  //           ) : (
  //             <button
  //               className="px-4 -y-2 bg-blue-500 rounded-full text-white"
  //               onClick={handleFollow}
  //             >
  //               Follow
  //             </button>
  //           )}
  //         </div> */}
  //         {userProfile ? (
  //           <>
  //             <div className="mt-6">Agents following:</div>
  //             {userProfile.following.length > 0 ? (
  //               <ul className="list-disc list-inside">
  //                 {userProfile.following.map((item) => (
  //                   <li key={item}>{item}</li>
  //                 ))}
  //               </ul>
  //             ) : (
  //               <p className="text-gray-500 mt-2">No agents followed.</p>
  //             )}
  //           </>
  //         ) : (
  //           <BulletList />
  //         )}
  //       </div>
  //       <div className="col-span-2 px-1">
  //         <RightSidebar />
  //       </div>
  //     </div>
  //     {open && <EditProfile setOpen={setOpen} />}
  //   </>
  // );
};

export default Profile;
