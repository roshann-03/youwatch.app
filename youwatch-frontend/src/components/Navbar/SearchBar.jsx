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
      <div className="flex items-center border border-[#1f2937] rounded-full bg-[#F8FAFC] dark:bg-[#1e293b] dark:text-cyan-300 text-[#0f172a]">
        <input
          type="text"
          className="w-full px-4 py-2 bg-transparent focus:outline-none placeholder:text-slate-400"
          placeholder="Search YouWatch..."
          value={searchTerm}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="p-3 rounded-r-full  dark:hover:bg-[#121822]"
        >
          <CiSearch size={20} color="#00FFF7" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
