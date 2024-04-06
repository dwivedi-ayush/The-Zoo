import { useEffect, useState } from 'react'
// import { useLocation } from "react-router-dom";
import axios from 'axios'
export default function useTimeline(currentUser, pageNumber) {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [tweets, setTweets] = useState([])
    const [hasMore, setHasMore] = useState(false)
    // const location = useLocation().pathname;
    useEffect(() => {

        setLoading(true)
        setError(false)
        let cancel
        axios({
            method: "GET",
            url: "tweets/timeline/user/" + currentUser + "/page/" + pageNumber,
            cancelToken: new axios.CancelToken(c => cancel = c),

        }).then(res => {
            // const uniqueTweets = [...new Set(res.data.map(tweet => tweet.id))].map(id => res.data.find(tweet => tweet.id === id));

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
    }, [pageNumber, currentUser])
    return { loading, error, tweets, hasMore }
}