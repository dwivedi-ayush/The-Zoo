import React from "react";
import ExploreTweets from "../../components/ExploreTweets/ExploreTweets";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import Navbar from "../../components/Navbar/Navbar";
import GroupDropdown from "../../components/Dropdown/GroupDropdown";
import { useSelector } from "react-redux";
import Signin from "../Signin/Signin";

const Explore = () => {
  const { currentUser } = useSelector((state) => state.user);

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
                <GroupDropdown type={"agent"} />
              </div>
              <div className="col-span-6 border-x-2 border-t-slate-800 px-6">
                <ExploreTweets />
              </div>
              <div className="col-span-2 pl-6">
                <GroupDropdown type={"scenario"} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Explore;
