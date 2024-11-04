import React, { useState, useEffect } from "react";
import axios from "axios";

const Subscription = ({ channelId }) => {
  const [channel, setChannel] = useState(null);
  const [isSelf, setIsSelf] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const API_URL = "http://localhost:8000/api/v1";

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/subscriptions/c/subscription-status/${channelId}`,
          {
            withCredentials: true,
          }
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
    if (isSelf) {
      return; // Don't allow self-subscription
    }
    try {
      const response = await axios.post(
        `${API_URL}/subscriptions/c/${channelId}`,
        null,
        { withCredentials: true }
      );

      if (response.status === 201 || response.status === 200) {
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
          subscriptionStatus ? "bg-red-600 text-white" : "bg-white text-black "
        }  font-[inter] text-sm font-semibold  px-4 py-2 rounded-3xl`}
        onClick={handleSubscribe}
      >
        {subscriptionStatus ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  );
};

export default Subscription;
