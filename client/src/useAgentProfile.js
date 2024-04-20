import { useEffect, useState } from 'react'
// import { useLocation } from "react-router-dom";
import axios from 'axios'
export default function useAgentprofile(scenarioGroupId, pageNumber, agentId) {
    // console.log(scenarioGroupId, pageNumber, agentId)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [tweets, setTweets] = useState([])
    const [hasMore, setHasMore] = useState(false)
    // const location = useLocation().pathname;
    useEffect(() => {
        if (pageNumber === 1) {
            setTweets([]);
        }
        setLoading(true)
        setError(false)
        let cancel

        axios({
            method: "GET",
            url: `http://localhost:8000/api/tweets/v2/agent/${agentId}/scenarioGroup/${scenarioGroupId}/page/${pageNumber}`,
            cancelToken: new axios.CancelToken(c => cancel = c),
        }).then(res => {
            // const uniqueTweets = [...new Set(res.data.map(tweet => tweet.id))].map(id => res.data.find(tweet => tweet.id === id));
            // console.log(res.data)
            // setTweets(prevTweets => [...prevTweets, ...uniqueTweets])
            setTweets(prevTweets => {
                return [...new Set([...prevTweets, ...res.data])]
            })
            setHasMore(res.data.length > 0)
            setLoading(false)
            // console.log(location)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
            return e
        })
        return () => cancel()
    }, [pageNumber, scenarioGroupId])
    return { loading, error, tweets, hasMore }
}