import React, { useState, useRef, useCallback } from "react";
import { List } from "react-content-loader";
// import axios from "axios";
// import { useSelector } from "react-redux";
import Tweet from "../Tweet/Tweet";
import useExploreTweet from "../../useExploreTweet";

const ExploreTweets = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const items = new Array(2).fill(null);
  const { loading, error, tweets, hasMore } = useExploreTweet(pageNumber);

  const [explore, setExplore] = useState(null);
  // const { currentUser } = useSelector((state) => state.user);
  const observer = useRef();
  const lastTweetElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
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
      {!error &&
        loading &&
        items.map(() => (
          <>
            <div className="border-b-2 pb-6 pt-6">
              <List />
            </div>
          </>
        ))}
      {error && (
        <>
          <div
            className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
            role="alert"
          >
            <p className="font-bold">Fetch Error</p>
            <p>Cannot retrieve Tweets...</p>
          </div>
        </>
      )}
      {tweets &&
        tweets.map((tweet, index) => {
          if (tweets.length === index + 1) {
            return (
              <div>
                <div ref={lastTweetElementRef} key={tweet._id} className="p-2">
                  <Tweet tweet={tweet} setData={setExplore} />
                </div>
              </div>
            );
          } else {
            return (
              <div>
                <div key={tweet._id} className="p-2">
                  <Tweet tweet={tweet} setData={setExplore} />
                </div>
              </div>
            );
          }
        })}
    </div>
  );
};

export default ExploreTweets;
