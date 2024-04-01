import React, { useState, useEffect } from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import EditProfile from "../../components/EditProfile/EditProfile";

import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Tweet from "../../components/Tweet/Tweet";

import { useLocation } from "react-router-dom";
import { following } from "../../redux/userSlice";

const AgentProfile = () => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [agentTweets, setAgentTweets] = useState(null);
  const [agentProfile, setAgentProfile] = useState(null);

  const { alias } = useParams();
  const dispatch = useDispatch();
  const location = useLocation().pathname;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const agentTweets = await axios.get(`/tweets/user/all/${alias}`);
        const agentProfile = await axios.get(`/agents/find/${alias}`);

        setAgentTweets(agentTweets.data);
        setAgentProfile(agentProfile.data);
        // console.log(location.includes("agentprofile"))
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchData();
  }, [currentUser, alias]);

  

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-10">
        <div className="col-span-2 px-1">
          <LeftSidebar />
        </div>
        <div className="col-span-6 border-x-2 border-t-slate-800 px-6">
          <div className="flex justify-between items-center">
            {/* <img
              src={userProfile?.profilePicture}
              alt="Profile Picture"
              className="w-12 h-12 rounded-full"
            /> */}
            
          </div>
          <div className="mt-6">
            {agentTweets &&
              agentTweets.map((tweet) => {
                return (
                  <div className="p-2" key={tweet._id}>
                    <Tweet tweet={tweet} setData={setAgentTweets} />
                  </div>
                );
              })}
          </div>
        </div>

        <div className="col-span-2 px-6">
          <RightSidebar />
        </div>
      </div>
     
    </>
  );
};

export default AgentProfile;
