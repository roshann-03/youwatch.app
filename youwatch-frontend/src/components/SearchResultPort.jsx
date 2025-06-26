import { useNavigate } from "react-router-dom";
import { useSearchResult } from "../ContextAPI/SearchResultContext";
import { useEffect, useRef, useState } from "react";

const SearchResultPortal = () => {
  const { results, visible, hideResults } = useSearchResult();
  const navigate = useNavigate();
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const itemRefs = useRef([]);

  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e) => {
      if (results.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev <= 0 ? results.length - 1 : prev - 1
        );
      } else if (e.key === "Enter" && highlightIndex !== -1) {
        const selectedUser = results[highlightIndex];
        if (selectedUser?._id !== "no-results") {
          navigate(`/channel/${selectedUser.username}`);
          hideResults();
        }
      } else if (e.key === "Escape") {
        hideResults();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [highlightIndex, results, visible, navigate, hideResults]);

  // Scroll to highlighted element when it changes
  useEffect(() => {
    if (highlightIndex !== -1 && itemRefs.current[highlightIndex]) {
      itemRefs.current[highlightIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightIndex]);

  if (!visible || !results.length) return null;

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-[1000] w-full max-w-xl px-4">
      <ul className="bg-white dark:bg-[#0b1320] rounded-xl shadow-2xl border border-gray-200 dark:border-cyan-500 dark:shadow-[0_0_25px_#00FFF7] overflow-y-auto max-h-64 backdrop-blur-md transition-all duration-300">
        {results.map((user, index) => {
          const isActive = index === highlightIndex;
          const isNoResult = user._id === "no-results";

          return (
            <li
              ref={(el) => (itemRefs.current[index] = el)}
              key={user._id || index}
              className={`p-4 cursor-pointer transition-all duration-200 font-medium border-b last:border-b-0
                ${
                  isNoResult
                    ? "text-center text-gray-500 dark:text-cyan-600"
                    : `hover:bg-gray-100 dark:hover:bg-[#1a2332] ${
                        isActive
                          ? "bg-gray-200 dark:bg-[#1e2d44] dark:shadow-[0_0_12px_#00FFF7]"
                          : ""
                      }`
                }
                border-gray-100 dark:border-cyan-800 text-gray-800 dark:text-cyan-200 tracking-wide`}
              onClick={() => {
                if (!isNoResult) {
                  navigate(`/channel/${user.username}`);
                  hideResults();
                }
              }}
              onMouseEnter={() => setHighlightIndex(index)}
            >
              {isNoResult ? (
                <p>{user.fullName}</p>
              ) : (
                <>
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-sm opacity-60">@{user.username}</p>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchResultPortal;
