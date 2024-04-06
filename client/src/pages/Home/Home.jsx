import React from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import MainTweet from "../../components/MainTweet/MainTweet";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import Signin from "../Signin/Signin";
import Navbar from "../../components/Navbar/Navbar";
import { useSelector } from "react-redux";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      {!currentUser ? (
        <Signin />
      ) : (
        <>
          <Navbar />
          <div className="grid grid-cols-1 md:grid-cols-10 w-9/10">
            <div className="px-1 col-span-2">
              <LeftSidebar />
            </div>
            <div className="col-span-6 border-x-2 border-t-slate-800 px-6">
              <MainTweet />
            </div>
            <div className="col-span-2 pl-6">
              <RightSidebar />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
