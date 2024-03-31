import axios from "axios";
import React, { useState } from "react";
import formatDistance from "date-fns/formatDistance";

import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Tweet_old = ({ tweet, setData }) => {
  const { currentUser } = useSelector((state) => state.user);

  const [userData, setUserData] = useState();

  const dateStr = formatDistance(new Date(tweet.createdAt), new Date());
  const location = useLocation().pathname;
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(tweet)
        const findUser = await axios.get(`/users/find/${tweet.userId}`);

        setUserData(findUser.data);
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchData();
  }, [tweet.userId, tweet.likes]);

  const handleLike = async (e) => {
    e.preventDefault();

    try {
      const like = await axios.put(`/tweets/${tweet._id}/like`, {
        id: currentUser._id,
      });

      if (location.includes("profile")) {
        const newData = await axios.get(`/tweets/user/all/${id}`);
        setData(newData.data);
      } else if (location.includes("explore")) {
        const newData = await axios.get(`/tweets/explore`);
        setData(newData.data);
      } else {
        const newData = await axios.get(`/tweets/timeline/${currentUser._id}`);
        setData(newData.data);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <div>
      {userData && (
        <>
          <div className="flex space-x-2">
            {/* <img src="" alt="" /> */}
            <Link to={`/profile/${userData._id}`}>
              <h3 className="font-bold">{userData.username}</h3>
            </Link>

            <span className="font-normal">@{userData.username}</span>
            <p> - {dateStr}</p>
          </div>

          <p>{tweet.description}</p>
          <button onClick={handleLike}>
            {tweet.likes.includes(currentUser._id) ? (
              <FavoriteIcon className="mr-2 my-2 cursor-pointer"></FavoriteIcon>
            ) : (
              <FavoriteBorderIcon className="mr-2 my-2 cursor-pointer"></FavoriteBorderIcon>
            )}
            {tweet.likes.length}
          </button>
        </>
      )}
    </div>
  );
};








const Tweet = ({ tweet, setData }) => {
  const { currentUser } = useSelector((state) => state.user);

  const [agentData, setAgentData] = useState();
  const [isReply,setIsReply] = useState();
  const [replies,setReplies]=useState();
  const [flag,setFlag]=useState(false);
  const dateStr = formatDistance(new Date(tweet.createdAt), new Date());
  const location = useLocation().pathname;
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const findAgent = await axios.get(`/agents/find/${tweet.alias}`);
        // console.log("hehe",findAgent.data)
        setIsReply(tweet.replies[0])
        setAgentData(findAgent.data);
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchData();
  }, [tweet.alias, tweet.likes]);



 
  const handleReply = async(e)=>{
    e.preventDefault();
    setFlag(!flag);
    if(!flag){
      const replies = await axios.get(`/tweets/reply/${tweet.replies[0]}`);
      console.log(replies.data)
      setReplies(replies.data)};
  };



  const handleLike = async (e) => {
    // e.preventDefault();

    try {
      const like = await axios.put(`/tweets/${tweet._id}/like`, {
        id: currentUser._id,
      });

      if (location.includes("profile")) {
        const newData = await axios.get(`/tweets/user/all/${id}`);
        setData(newData.data);
      } else if (location.includes("explore")) {
        const newData = await axios.get(`/tweets/explore`);
        setData(newData.data);
      } else {
        const newData = await axios.get(`/tweets/timeline/${currentUser._id}`);
        setData(newData.data);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <div>
      {agentData && (
        <>
          <div className="flex space-x-2">
            {/* <img src="" alt="" /> */}
            <Link to={`/agentprofile/${agentData.alias}`}>
              <h3 className="font-bold">{agentData.alias}</h3>
            </Link>

            <span className="font-normal">@{agentData.alia}</span>
            <p> - {dateStr}</p>
          </div>

          <p>{tweet.description}</p>
          <div className="flex space-x-4 mt-2">
          <button onClick={handleLike}>
            {tweet.likes.includes(currentUser._id) ? (
              <FavoriteIcon className="mr-2 my-2 cursor-pointer"></FavoriteIcon>
            ) : (
              <FavoriteBorderIcon className="mr-2 my-2 cursor-pointer"></FavoriteBorderIcon>
            )}
            {tweet.likes.length}
          </button>
          {!flag && isReply && (<div className="mt-1 font-normal hover:font-bold">
            <a href="#"  onClick={handleReply}>replies</a>
          </div>)}
          </div>
          { flag && replies && (<div >
            <a href="#" className="mb-1 font-normal hover:font-bold" onClick={handleReply}>replies:</a>
            <div className="p-2 rounded-md bg-zinc-200">
              {
              replies.reply_array.map((reply) => {
                return (<div className="text-sm mb-2"><span className="font-bold">{reply.alias}</span> : {reply.description}</div>);
              })
              }
              </div>
          </div>)}
          
        </>
      )}
    </div>
  );
};
export default Tweet;
