import React, { useEffect, useState,useRef,useCallback } from "react";

import axios from "axios";
import { useSelector } from "react-redux";
import Tweet from "../Tweet/Tweet";

const ExploreTweets = () => {
  const [explore, setExplore] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const observer =useRef();
  const lastTweetelementRef =  useCallback(node =>{
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries =>{
      if(entries[0].isIntersecting){
        console.log("Visible")
      }
    })
    if (node) observer.current.observe(node)
  },[])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const exploreTweets = await axios.get("/tweets/explore");
        setExplore(exploreTweets.data);
      } catch (err) {
        console.log("error", err);
      }
    };
    fetchData();
  }, [currentUser._id]);
  return (
    <div className="mt-6">
      {!explore && <h2>Loading...</h2>}
      {explore &&
        explore.map((tweet,index) => {
          if(explore.length === index+1){
            return (<div ref={lastTweetelementRef} key={tweet.description} className="p-2">
                        <Tweet tweet={tweet} setData={setExplore} />
                        
                    </div>)
          }
          else{
            return (
            <div key={tweet.description} className="p-2">
              <Tweet tweet={tweet} setData={setExplore} />
            </div>
          )};
        })}
    </div>
  );
};

export default ExploreTweets;
