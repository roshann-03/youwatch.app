import TweetItem from "./TweetItem";

export default function TweetList({ tweets, onDelete, onUpdate }) {
  return (
    <div className="flex flex-col gap-10 mt-5">
      {tweets.map((tweet) => (
        <TweetItem
          key={tweet._id}
          tweet={tweet}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
