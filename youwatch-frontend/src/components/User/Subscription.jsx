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
        onClick={handleSubscribe}
        className={`px-5 py-2 text-sm font-bold rounded-full transition-all duration-300 tracking-wider shadow-md
          ${
            subscriptionStatus
              ? // 🔴 SUBSCRIBED
                `bg-red-600 text-white hover:bg-red-700
                dark:bg-[#FF2C75] dark:text-white dark:shadow-[0_0_12px_#FF2C75] 
                dark:hover:shadow-[0_0_18px_#FF2C75]`
              : // ⚪ SUBSCRIBE
                `bg-gray-200 text-gray-800 hover:bg-gray-300
                dark:bg-[#0F172A] dark:text-cyan-300 dark:border dark:border-cyan-400
                dark:hover:bg-[#1e293b] dark:shadow-[0_0_10px_#00FFF7]
                dark:hover:shadow-[0_0_15px_#00FFF7]`
          }`}
      >
        {subscriptionStatus ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  );
};

export default Subscription;
