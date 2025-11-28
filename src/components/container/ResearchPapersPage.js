import React, { useEffect, useState } from "react";
import SearchResultsList from "../search-results-section/SearchResultsList";
import axios from "axios";
import { Button } from "@/components/ui/button";

const ResearchPapersPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [maxResults] = useState(10); // Adjust per page results if needed

  const fetchPapers = async (pageNum) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://ai-resources-hub-backend.onrender.com/search-arxiv-papers?q=artificial intelligence&max_results=${maxResults}&page=${pageNum}`
      );
      setData(res?.data?.papers);
    } catch (err) {
      console.error("Error while fetching research papers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers(page);
  }, [page]);

  if (loading) {
    return <h3 className="text-center text-base sm:text-lg md:text-xl font-medium">Loading...</h3>;
  }

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Research Papers</h2>
      <div className="flex-1">
        <SearchResultsList results={data} />
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-6">
        <Button 
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          variant="outline"
          className="w-full sm:w-auto text-xs sm:text-sm"
        >
          Prev
        </Button>
        <span className="text-base sm:text-lg font-medium">Page {page}</span>
        <Button 
          onClick={() => setPage((prev) => prev + 1)}
          variant="outline"
          className="w-full sm:w-auto text-xs sm:text-sm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ResearchPapersPage;
