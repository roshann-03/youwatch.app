import { useEffect, useState } from "react";
import { getUserTweets } from "../api/tweetApi";
import TweetForm from "../components/TweetForm";
import TweetList from "../components/TweetList";
import { CiLight } from "react-icons/ci";

export default function Home() {
  const [tweets, setTweets] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user._id);
  const fetchTweets = async () => {
    const res = await getUserTweets(user._id);
    setTweets(res.data.data);
    console.log(res.data);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 border rounded shadow-md">
      <TweetForm
        onTweetCreated={(newTweet) => setTweets([newTweet, ...tweets])}
      />
      <TweetList
        tweets={[...tweets].reverse()}
        onDelete={(id) => setTweets(tweets.filter((t) => t._id !== id))}
        onUpdate={(updated) =>
          setTweets(tweets.map((t) => (t._id === updated._id ? updated : t)))
        }
      />
    </div>
  );
}
