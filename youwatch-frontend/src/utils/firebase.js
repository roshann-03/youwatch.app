// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB6dooNTk9IGa0iE2Nzz5byn0CHJ4zF_3g",
  authDomain: "youwatch-200a9.firebaseapp.com",
  projectId: "youwatch-200a9",
  storageBucket: "youwatch-200a9.firebasestorage.app",
  messagingSenderId: "865862135917",
  appId: "1:865862135917:web:0d0b154d09beabc1d60f64",
  vapidKey:
    "BDnhVx-TeyAWqFxdw74dk9tkjELi4oWg0jIuh2tfm587uzI9q65I4Dp1vH6AFQCoJykQg6eaisMcPt5mK_kRz6E",
};
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: firebaseConfig.vapidKey,
    });
    if (currentToken) {
      console.log("FCM Token:", currentToken);
      return currentToken;
    } else {
      console.log("No registration token available.");
    }
  } catch (err) {
    console.error("An error occurred while retrieving token.", err);
  }
};

export { messaging, onMessage };
