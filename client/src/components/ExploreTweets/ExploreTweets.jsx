import React, { useState,useRef,useCallback } from "react";

// import axios from "axios";
// import { useSelector } from "react-redux";
import Tweet from "../Tweet/Tweet";
import useExploreTweet from "../../useExploreTweet";

const ExploreTweets = () => {
  const[pageNumber,setPageNumber]=useState(1);

  const {loading,error,tweets,hasMore}=useExploreTweet(pageNumber)

  const [explore, setExplore] = useState(null);
  // const { currentUser } = useSelector((state) => state.user);
  const observer =useRef();
  const lastTweetElementRef =  useCallback(node =>{
    if(loading) return
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries =>{
      if(entries[0].isIntersecting && hasMore){
        setPageNumber(prevPageNumber=>prevPageNumber+1)
      }
    })
    if (node) observer.current.observe(node)
  },[loading,hasMore])
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const exploreTweets = await axios.get("/tweets/explore");
  //       setExplore(exploreTweets.data);
  //     } catch (err) {
  //       console.log("error", err);
  //     }
  //   };
  //   fetchData();
  // }, [currentUser._id]);
  return (
    <div className="mt-6">
      {loading && <h2>Loading...</h2>}
      {error && <h2>Error</h2>}
      {tweets &&
        tweets.map((tweet,index) => {
          if(tweets.length === index+1){
            return (<div ref={lastTweetElementRef} key={tweet._id} className="p-2">
                        <Tweet tweet={tweet} setData={setExplore} />
                        
                    </div>)
          }
          else{
            return (
            <div key={tweet._id} className="p-2">
              <Tweet tweet={tweet} setData={setExplore} />
            </div>
          )};
        })}
    </div>
  );
};

export default ExploreTweets;
