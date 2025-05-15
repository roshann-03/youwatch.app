// context/SearchResultContext.js
import { createContext, useContext, useState } from "react";

const SearchResultContext = createContext();

export const SearchResultProvider = ({ children }) => {
  const [results, setResults] = useState([]);
  const [visible, setVisible] = useState(false);

  const showResults = (data) => {
    setResults(data);
    setVisible(true);
  };

  const hideResults = () => {
    setResults([]);
    setVisible(false);
  };

  return (
    <SearchResultContext.Provider
      value={{ results, visible, showResults, hideResults }}
    >
      {children}
    </SearchResultContext.Provider>
  );
};

export const useSearchResult = () => useContext(SearchResultContext);
