import React, { useEffect, useState } from "react";
import SearchResultsList from "../search-results-section/SearchResultsList";
import axios from "axios";
import { Button } from "@/components/ui/button";

const BlogsContainer = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [maxResults] = useState(10); // Adjust per page results if needed

  const fetchRepos = async (pageNum) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/search-blogs?q=artificial intelligence&max_results=${maxResults}`
      );
      setData(res?.data?.blogs);
    } catch (err) {
      console.error("Error while fetching research papers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos(page);
  }, [page]);

  if (loading) {
    return <h3 className="text-center text-xl font-medium">Loading...</h3>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Latest AI Blogs</h2>
      <div className="flex-1">
        <SearchResultsList results={data} />
      </div>

    </div>
  );
};

export default BlogsContainer;
