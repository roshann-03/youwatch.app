// components/SearchBar.jsx

import { useState } from "react";
import { useSearchResult } from "../../ContextAPI/SearchResultContext"; // adjust path
import { CiSearch } from "react-icons/ci";
import { axiosJSON } from "../../api/axiosInstances";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { showResults, hideResults } = useSearchResult();

  const handleChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      hideResults();
      return;
    }

    try {
      const res = await axiosJSON.get(`/search/search-user/?query=${value}`);
      const data =
        res.data.data.length > 0
          ? res.data.data
          : [{ _id: "no-results", fullName: "No result found.", username: "" }];
      showResults(data);
    } catch (err) {
      console.error("Search error:", err);
      hideResults();
    }
  };

  return (
    <form className="relative w-full max-w-md">
      <div className="flex items-center border border-zinc-700 rounded-full dark:bg-zinc-800 dark:text-white">
        <input
          type="text"
          className="w-full px-4 py-2 bg-transparent dark:text-white focus:outline-none"
          placeholder="Search"
          value={searchTerm}
          onChange={handleChange}
        />
        <button type="submit" className="p-3 bg-zinc-800 rounded-r-full">
          <CiSearch size={20} color="white" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
