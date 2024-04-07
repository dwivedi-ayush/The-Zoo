import React, { useState, useEffect, useSelector } from "react";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useLocation } from "react-router-dom";
import UserPlaceholder from "../UserPlaceholder/UserPlaceholder";

const Navbar = ({ alias, currentUser }) => {
  // const { currentUser } = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null);
  const location = useLocation().pathname;
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    // console.log(location);
    const fetchData = async () => {
      try {
        const user = await axios.get(`/users/find/${currentUser._id}`);
        if (user.data.following && user.data.following.includes(alias)) {
          setIsFollowing(true);
        }
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchData();
  }, [alias, currentUser._id]);
  const handleFollow = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `users/follow/alias/${alias}/id/${currentUser._id}`
      );
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
        `http://localhost:8000/api/users/unfollow/alias/${alias}/id/${currentUser._id}`
      );
      console.log(response);
      if (response.status === 200) {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
      // Handle error
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 my-5 justify-center">
      <div className="col-span-2 mx-auto md:mx-0">
        <img
          src="/twitter-logo.png"
          alt="Logo"
          width={"100px"}
          className="ml-8"
        />
      </div>

      <div className="col-span-6 md:border-x-2 md:border-slate-200 md:px-6 my-6 md:my-0">
        <div className="mt-6 flex justify-between items-center">
          <h2 className=" font-bold text-2xl">
            {location.includes("agentprofile") ? (
              alias
            ) : location.includes("explore") ? (
              "Explore"
            ) : location.includes("profile") ? (
              <UserPlaceholder setUserData={setUserData} userData={userData} />
            ) : (
              "Home"
            )}
          </h2>
          {location.includes("agentprofile") ? (
            isFollowing ? (
              <button
                onClick={handleUnfollow}
                className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
              >
                Follow
              </button>
            )
          ) : (
            <StarBorderPurple500Icon />
          )}
        </div>
      </div>

      <div className=" mt-6 col-span-2 px-0 md:px-6 mx-auto">
        <SearchIcon className="absolute m-2" />
        <input type="text" className="bg-blue-100 rounded-full py-2 px-8" />
      </div>
    </div>
  );
};

export default Navbar;
