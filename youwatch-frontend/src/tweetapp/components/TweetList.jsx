import TweetItem from "./TweetItem";

export default function TweetList({ tweets, onDelete, onUpdate }) {
  return (
    <div>
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
