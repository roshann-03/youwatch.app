import { useState, useRef, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { axiosJSON } from "../../api/axiosInstances";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const response = await axiosJSON.get(
        `/search/search-user/?query=${searchTerm}`,
        { withCredentials: true }
      );

      setResults(response.data.data);

      if (response.data.data.length === 0) {
        setResults([
          { _id: "no-results", fullName: "No result found.", username: "" },
        ]);
      }
    } catch (error) {
      console.error(
        "Search error:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setHighlightedIndex(-1);

    if (value.trim()) {
      try {
        const response = await axiosJSON.get(
          `/search/search-user/?query=${value}`,
          { withCredentials: true }
        );

        setResults(response.data.data);

        if (response.data.data.length === 0) {
          setResults([
            { _id: "no-results", fullName: "No result found.", username: "" },
          ]);
        }
      } catch (error) {
        console.error("Live search error:", error.message);
      }
    } else {
      setResults([]);
    }
  };

  const handleKeyDown = (e) => {
    if (results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % results.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(
          (prev) => (prev - 1 + results.length) % results.length
        );
        break;
      case "Enter":
        if (highlightedIndex >= 0) {
          navigate(`/channel/${results[highlightedIndex].username}`);
          setSearchTerm("");
          setResults([]);
        }
        break;
      case "Tab":
        if (highlightedIndex >= 0) {
          navigate(`/channel/${results[highlightedIndex].username}`);
          setSearchTerm("");
          setResults([]);
          e.preventDefault(); // Prevent default tab behavior
        }
        break;
      default:
        break;
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setResults([]);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <form
      onSubmit={handleSearch}
      ref={wrapperRef}
      className="relative w-full  rounded-3xl"
    >
      <div className="flex items-center  border border-zinc-700 rounded-3xl overflow-hidden bg-transparent">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-grow dark:text-gray-200 w-[10vw]   px-4 py-2 bg-transparent focus:outline-none"
        />
        <button
          type="submit"
          className="p-3 bg-zinc-800 hover:bg-zinc-600 transition"
        >
          <CiSearch style={{ fontSize: "24px", color: "white" }} />
        </button>
      </div>

      {results.length > 0 && (
        <ul className="absolute left-0 right-0 mt-2 z-50 dark:bg-zinc-800 bg-zinc-200  rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((user, index) => (
            <li
              key={user._id || index}
              className={`transition duration-150 p-3 border-b border-zinc-800 cursor-pointer 
                ${
                  index === highlightedIndex
                    ? "bg-zinc-700 text-white"
                    : "hover:bg-zinc-700 hover:text-white"
                }`}
              onClick={() => {
                if (user._id !== "no-results") {
                  navigate(`/channel/${user.username}`);
                  setSearchTerm("");
                  setResults([]);
                }
              }}
            >
              {user._id === "no-results" ? (
                <p className="text-center text-gray-500">{user.fullName}</p>
              ) : (
                <>
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-sm">@{user.username}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default SearchBar;
