import React from "react";
import { CiSearch } from "react-icons/ci";

const SearchBar = () => {
  const handleSearch = () => {
    // Handle search logic here
    const [searchTerm, setSearchTerm] = useState("");

    if (searchTerm) {
      // Perform search logic
      console.log("Searching for:", searchTerm);
    } else {
      // Show error message
      console.log("Please enter a search term.");
    }
  };

  return (
    <div className="flex font-[inter] w-[60vw] bg-black rounded-3xl relative">
      <input
        type="text"
        placeholder="Search"
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow text-gray-200  px-4 py-2 border border-zinc-700 bg-transparent rounded-3xl focus:outline-none focus:ring-1  focus:ring-[#20689fd5] "
      />
      <button
        type="button"
        onClick={handleSearch}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-r-full p-2 px-5  bg-zinc-800 hover:bg-zinc-600 transition duration-200"
      >
        <CiSearch style={{ fontSize: "24px", color: "white" }} />
      </button>
    </div>
  );
};

export default SearchBar;
