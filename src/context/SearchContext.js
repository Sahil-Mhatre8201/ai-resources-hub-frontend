import { createContext, useContext, useState } from "react";

// Create the context
const SearchContext = createContext();

// Provider component
export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");

  return (
    <SearchContext.Provider
      value={{ searchResults, setSearchResults, query: query, setQuery: setQuery }}
    >
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to use the context
export const useSearch = () => useContext(SearchContext);
