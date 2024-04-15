import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { List } from "react-content-loader";
import { useSelector } from "react-redux";
import Tweet from "../Tweet/Tweet";
import useTimeline from "../../useTimeline";
const TimelineTweet = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const items = new Array(2).fill(null);
  const [timeLine, setTimeLine] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const currentAgentGroup = useSelector(
    (state) => state.agentGroup.currentAgentGroup
  );
  const currentScenarioGroup = useSelector(
    (state) => state.scenarioGroup.currentScenarioGroup
  );
  const { loading, error, tweets, hasMore } = useTimeline(
    currentUser._id,
    currentScenarioGroup.id,
    currentAgentGroup.id,
    pageNumber
  );

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

  // console.log("Timeline", timeLine);s
  return (
    <div className="mt-6">
      <>{currentAgentGroup.id + " " + currentScenarioGroup.id}</>
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
            <p>Cannot retrieve Timeline...</p>
          </div>
        </>
      )}
      {tweets &&
        tweets.map((tweet, index) => {
          if (tweets.length === index + 1) {
            return (
              <div>
                <div ref={lastTweetElementRef} key={tweet._id} className="p-2">
                  <Tweet tweet={tweet} setData={setTimeLine} />
                </div>
              </div>
            );
          } else {
            return (
              <div>
                <div key={tweet._id} className="p-2">
                  <Tweet tweet={tweet} setData={setTimeLine} />
                </div>
              </div>
            );
          }
        })}
    </div>
  );
};

export default TimelineTweet;
