import { useEffect, useState } from "react";
import { getAllTweets } from "../api/tweetApi";
import TweetList from "../components/TweetList";
import Footer from "../../components/Footer";

export default function AllTweets() {
  const [tweets, setTweets] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const res = await getAllTweets(page);
        setTweets(res.data.data.tweets);
        setTotalPages(res.data.data.totalPages);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("Error fetching tweets", err);
      }
    };
    fetchTweets();
  }, [page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-black text-gray-800 dark:text-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-zinc-700">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Explore Posts
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Discover what others are saying in the community.
            </p>
          </div>

          <div className="p-4 sm:p-6">
            {tweets.length > 0 ? (
              <TweetList
                tweets={tweets}
                onDelete={(id) => setTweets(tweets.filter((t) => t._id !== id))}
                onUpdate={(updated) =>
                  setTweets(
                    tweets.map((t) => (t._id === updated._id ? updated : t))
                  )
                }
              />
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-200">
                No tweets found.
              </p>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center px-6 py-4 border-t dark:border-zinc-700 text-sm">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-600 dark:text-gray-300">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
