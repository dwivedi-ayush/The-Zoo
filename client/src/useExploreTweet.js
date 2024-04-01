import {useEffect,useState} from 'react'
import axios from 'axios'
export default function useExploreTweet(pageNumber){
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState(false)
    const [tweets,setTweets]=useState([])
    const [hasMore,setHasMore]=useState(false)

    useEffect(()=>{
        setLoading(true)
        setError(false)

        axios({
            method:"GET",
            url:"/tweets/explore/page/"+pageNumber
        }).then(res=>{
            setTweets(prevTweets=>{
                return [...new Set([...prevTweets,...res.data])]
            })
            setHasMore(res.data.length>0)
            setLoading(false)
            console.log(res.data)
        }).catch(e=>{
            setError(true)
            return e
        })
    },[pageNumber])
    return {loading,error,tweets,hasMore}
}