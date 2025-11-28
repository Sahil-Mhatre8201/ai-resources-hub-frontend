"use client";

import { useEffect, useState } from "react";
import SearchResultsList from "./SearchResultsList";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/context/SearchContext";
import axios from "axios";
import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

const SearchResultsSection = ({ data = [] }) => {
  const [filters, setFilters] = useState({
    github: false,
    research_papers: false,
    blogs: false,
    courses: false,
    handbook: false
  });
  const { setSearchResults, query } = useSearch();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastFetchedPage, setLastFetchedPage] = useState(1);


  const maxResults = 15; // Number of results per page

  useEffect(() => {
    if (page !== lastFetchedPage) {
      handleApplyFilters();
    }
  }, [page]);


  const handleFilterChange = (filterName) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  };

  const handleApplyFilters = () => {
    setLoading(true);
    let filtersToPass = (Object.keys(filters) || []).filter(
      (key) => filters[key] == true
    );
    axios
      .get(
        `https://ai-resources-hub-backend.onrender.com/get-filtered-resources?q=${query}&filters=${filtersToPass}&page=${page}&max_results=${maxResults}`
      )
      .then((res) => {
        setSearchResults(res?.data);
        setLastFetchedPage(page); 
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  return (
    <>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div className="w-full lg:w-64 space-y-4">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Filters</h3>
            <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <Checkbox
                id="github"
                checked={filters.github}
                onCheckedChange={() => handleFilterChange("github")}
                />
                <Label htmlFor="github" className="text-sm sm:text-base cursor-pointer">GitHub</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                id="researchPapers"
                checked={filters.research_papers}
                onCheckedChange={() => handleFilterChange("research_papers")}
                />
                <Label htmlFor="researchPapers" className="text-sm sm:text-base cursor-pointer">Research Papers</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                id="blogs"
                checked={filters.blogs}
                onCheckedChange={() => handleFilterChange("blogs")}
                />
                <Label htmlFor="blogs" className="text-sm sm:text-base cursor-pointer">Blogs</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                id="courses"
                checked={filters.courses}
                onCheckedChange={() => handleFilterChange("courses")}
                />
                <Label htmlFor="courses" className="text-sm sm:text-base cursor-pointer">Courses</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                id="handbooks"
                checked={filters.handbook}
                onCheckedChange={() => handleFilterChange("handbook")}
                />
                <Label htmlFor="handbooks" className="text-sm sm:text-base cursor-pointer">Handbooks</Label>
            </div>
            </div>
            <div className="flex items-center space-x-2">
            <Button type="button" className="w-full text-sm sm:text-base" onClick={handleApplyFilters}>
                {loading ? (
                <>
                    <Loader2 className="animate-spin mr-2" />
                    Applying Filters...
                </>
                ) : (
                "Apply Filters"
                )}
            </Button>
            </div>
        </div>
        <div className="flex-1">
            <SearchResultsList results={data} />
        </div>
        </div>
        <Pagination className="flex justify-center mt-6 sm:mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="text-xs sm:text-sm"
            />
          </PaginationItem>
          <PaginationItem>
            <span className="px-4 py-2 text-lg font-semibold">{page}</span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((prev) => prev + 1)}
              disabled={data.length < maxResults} // Disable if fewer results than max
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default SearchResultsSection;
