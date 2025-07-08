import { useAuth } from "../ContextAPI/AuthContext"; // Import the custom hook
import VideoList from "../components/Videos/VideoList";
import Footer from "./Footer";
import CustomToast from "./custom/CustomToast";

const Dashboard = () => {
  const { isLoggedIn } = useAuth(); // Get isLoggedIn state from the context

  return (
    <div className="min-h-screen flex-1 ">
      <VideoList />
      {/* Render Footer only if the user is logged in */}
      {isLoggedIn && <Footer />}
      <CustomToast />
    </div>
  );
};

export default Dashboard;
