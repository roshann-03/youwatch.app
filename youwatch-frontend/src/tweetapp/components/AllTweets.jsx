import { useEffect, useState } from "react";
import { getAllTweets } from "../api/tweetApi";
import TweetList from "../components/TweetList";

export default function AllTweets() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const res = await getAllTweets();
        setTweets(res.data.data);
      } catch (err) {
        console.error("Error fetching all tweets", err);
      }
    };
    fetchTweets();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 border rounded shadow-md">
      <h2 className="text-2xl font-bold p-4 border-b">Posts</h2>
      <TweetList
        tweets={tweets}
        onDelete={(id) => setTweets(tweets.filter((t) => t._id !== id))}
        onUpdate={(updated) =>
          setTweets(tweets.map((t) => (t._id === updated._id ? updated : t)))
        }
      />
    </div>
  );
}
