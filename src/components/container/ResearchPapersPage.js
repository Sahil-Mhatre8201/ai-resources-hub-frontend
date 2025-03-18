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
    return <h3 className="text-center text-xl font-medium">Loading...</h3>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Research Papers</h2>
      <div className="flex-1">
        <SearchResultsList results={data} />
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center space-x-4 mt-6">
        <Button 
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          variant="outline"
        >
          Prev
        </Button>
        <span className="text-lg font-medium">Page {page}</span>
        <Button 
          onClick={() => setPage((prev) => prev + 1)}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ResearchPapersPage;
