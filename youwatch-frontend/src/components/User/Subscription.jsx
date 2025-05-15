import React, { useState, useEffect } from "react";
import { axiosJSON } from "../../api/axiosInstances";

const Subscription = ({ channelId }) => {
  const [isSelf, setIsSelf] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const response = await axiosJSON.get(
          `/subscriptions/c/subscription-status/${channelId}`
        );
        setSubscriptionStatus(response.data.data.isSubscribed);
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser?._id === channelId) {
          setIsSelf(true);
        }
      } catch (error) {
        console.error("Error fetching channel data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [channelId]);

  const handleSubscribe = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (isSelf) return;

    try {
      const response = await axiosJSON.post(`/subscriptions/c/${channelId}`);
      if (response.status === 200 || response.status === 201) {
        setSubscriptionStatus(response.data.data.isSubscribed);
      } else {
        console.error("Subscription failed", response);
      }
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (isSelf) return null;

  return (
    <div className="subscribeButton">
      <button
        className={`${
          subscriptionStatus ? "bg-red-600 text-white" : "bg-gray-800 text-white dark:bg-white dark:text-black"
        }  text-sm  font-semibold px-4 py-2 rounded-3xl`}
        onClick={handleSubscribe}
      >
        {subscriptionStatus ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  );
};

export default Subscription;
