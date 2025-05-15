import { useEffect, useState } from "react";
import { getUserTweets } from "../api/tweetApi";
import TweetForm from "../components/TweetForm";
import TweetList from "../components/TweetList";
import { CiLight } from "react-icons/ci";
import Footer from "../../components/Footer";

export default function Home() {
  const [tweets, setTweets] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const fetchTweets = async () => {
    const res = await getUserTweets(user._id);
    setTweets(res.data.data);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <div>
      <div className="w-full dark:bg-zinc-800 bg-zinc-300  px-20 mx-auto py-10 shadow-md ">
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
      <Footer />
    </div>
  );
}
