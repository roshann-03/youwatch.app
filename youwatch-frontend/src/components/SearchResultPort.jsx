// components/SearchResultPortal.jsx
import { useNavigate } from "react-router-dom";
import { useSearchResult } from "../ContextAPI/SearchResultContext";

const SearchResultPortal = () => {
  const { results, visible, hideResults } = useSearchResult();
  const navigate = useNavigate();

  if (!visible || !results.length) return null;

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-[1000] w-full max-w-xl px-4">
      <ul className="dark:bg-zinc-800 text-white rounded-lg shadow-lg max-h-64 overflow-y-auto">
        {results.map((user, index) => (
          <li
            key={user._id || index}
            className="p-3 border-b border-zinc-700 cursor-pointer bg-zinc-200 text-gray-700  hover:bg-zinc-300  dark:hover:bg-zinc-700"
            onClick={() => {
              if (user._id !== "no-results") {
                navigate(`/channel/${user.username}`);
                hideResults();
              }
            }}
          >
            {user._id === "no-results" ? (
              <p className="text-center text-gray-400">{user.fullName}</p>
            ) : (
              <>
                <p className="font-semibold">{user.fullName}</p>
                <p className="text-sm text-gray-400">@{user.username}</p>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultPortal;
