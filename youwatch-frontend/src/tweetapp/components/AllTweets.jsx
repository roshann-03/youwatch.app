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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white dark:from-[#0a0f1c] dark:to-black text-gray-800 dark:text-gray-100 transition-all">
      {/* <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10"> */}
      {/* Container Card */}
      <div className="bg-white dark:bg-black/70 border border-gray-200 dark:border-cyan-500 shadow-xl dark:shadow-[0_0_30px_#00FFF7]  overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-cyan-700 text-center sm:text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-futuristic tracking-wide text-gray-900 dark:text-cyan-400   ">
            🚀 Explore Posts
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-exo mt-1">
            Discover what others are saying in the community.
          </p>
        </div>

        {/* Tweet List */}
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
            <p className="text-center text-gray-500 dark:text-gray-300 font-exo">
              No tweets found.
            </p>
          )}
          {/* </div> */}

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t dark:border-cyan-700 font-exo">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-gray-200 dark:bg-black border dark:border-cyan-500 hover:bg-gray-300 dark:hover:bg-cyan-700 text-gray-800 dark:text-cyan-300 disabled:opacity-40 transition-all"
            >
              ◀ Previous
            </button>

            <span className="text-gray-600 dark:text-cyan-400 text-sm sm:text-base font-semibold tracking-wide">
              Page <span className="font-bold">{page}</span> of{" "}
              <span className="font-bold">{totalPages}</span>
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-gray-200 dark:bg-black border dark:border-cyan-500 hover:bg-gray-300 dark:hover:bg-cyan-700 text-gray-800 dark:text-cyan-300 disabled:opacity-40 transition-all"
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
