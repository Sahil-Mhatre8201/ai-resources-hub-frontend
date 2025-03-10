import React, { useEffect, useState } from 'react'
import SearchResultsList from '../search-results-section/SearchResultsList'
import axios from 'axios'

const ResearchPapersPage = () => {

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/search-arxiv-papers?q=artificial intelligence").then((res) => {
            setLoading(false)
            setData(res?.data?.papers)
        }).catch((err) => {
            console.log("Error while fetching research papers", err)
        })
    }, [])

    if (loading) {
        return <h3>Loading...</h3>
    }


  return (
    <div>ResearchPapersPage
        <div className="flex-1">
            <SearchResultsList results={data} />
        </div>
    </div>
  )
}

export default ResearchPapersPage