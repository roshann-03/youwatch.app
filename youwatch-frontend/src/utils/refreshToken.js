import { axiosJSON } from "@/api/axiosInstances";

let refreshTimeout = null;

function refreshToken() {
  const expireTime = import.meta.env.VITE_ACCESS_TOKEN_EXPIRE; // e.g., "24h", "30d", "5m"
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  if (!expireTime || !apiUrl) {
    console.error("Missing required environment variables.");
    return;
  }

  const unit = expireTime.slice(-1).toLowerCase();
  const value = parseInt(expireTime.slice(0, -1), 10);

  if (isNaN(value) || !["h", "d", "m"].includes(unit)) {
    console.error(
      "Invalid ACCESS_TOKEN_EXPIRE format. Use values like '15m', '24h', or '7d'."
    );
    return;
  }

  // Convert to milliseconds
  let totalMs;
  switch (unit) {
    case "m":
      totalMs = value * 60 * 1000;
      break;
    case "h":
      totalMs = value * 60 * 60 * 1000;
      break;
    case "d":
      totalMs = value * 24 * 60 * 60 * 1000;
      break;
  }

  // Don't refresh if the total lifespan is too short (<2 minutes)
  if (totalMs < 2 * 60 * 1000) {
    console.warn("Token expiry too short (<2m). Skipping refresh scheduling.");
    return;
  }

  // Default: refresh 10 minutes before
  let refreshOffset = 10 * 60 * 1000;

  // If token lifespan is less than 10 minutes, refresh 1 minute before
  if (totalMs <= refreshOffset) {
    refreshOffset = 1 * 60 * 1000;
  }

  const executionTime = Math.max(totalMs - refreshOffset, 0);

  clearTimeout(refreshTimeout);

  refreshTimeout = setTimeout(async () => {
    try {
      await axiosJSON.post(`${apiUrl}/users/refresh-token`);
      refreshToken(); // schedule the next refresh
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  }, executionTime);
}

export default refreshToken;
