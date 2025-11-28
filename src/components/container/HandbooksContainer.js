import React, { useEffect, useState } from "react";
import SearchResultsList from "../search-results-section/SearchResultsList";
import axios from "axios";
import { Button } from "@/components/ui/button";

const HandbooksContainer = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [maxResults] = useState(10); // Adjust per page results if needed

  const fetchRepos = async (pageNum) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://ai-resources-hub-backend.onrender.com/ai-handbooks`
      );
      setData(res?.data?.handbooks);
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
    return <h3 className="text-center text-base sm:text-lg md:text-xl font-medium">Loading...</h3>;
  }

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Latest AI Handbooks</h2>
      <div className="flex-1">
        <SearchResultsList results={data} />
      </div>

    </div>
  );
};

export default HandbooksContainer;
