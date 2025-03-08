import { useSearch } from "@/context/SearchContext";
import React from "react";
import RepositoryListSection from "../repositoryListSection/RepositoryListSection";
import SearchResultsSection from "../search-results-section";

const AllResourcesContainer = () => {
  const { searchResults } = useSearch();
  console.log("search results", searchResults);

  return (
    <div>
      AllResourcesContainer
      <div>
        {searchResults?.results && (
          <SearchResultsSection data={searchResults?.results} />
        )}
      </div>
    </div>
  );
};

export default AllResourcesContainer;
