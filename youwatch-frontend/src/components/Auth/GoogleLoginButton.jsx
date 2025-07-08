import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosJSON } from "../../api/axiosInstances"; // Import your axios instance
import { useAuth } from "../../ContextAPI/AuthContext";
import refreshToken from "@/utils/refreshToken";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleLoginSuccess = async (response) => {
    const idToken = response.credential; // ✅ Correctly access the token

    try {
      const res = await axiosJSON.post(
        "/users/auth/google-auth", // Adjusted to use the base URL from axiosJSON
        { idToken }, // Sending the idToken in the body
        { withCredentials: true } // So cookies are stored!
      );
      if (res.data.success) {
        const { user } = res.data;
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Successfully logged in with Google!");
        if (user?.hasPassword) {
          login();
          refreshToken();
          navigate("/", { replace: true });
        } else {
          navigate("/set-password", { replace: true });
        }
      } else {
        toast.error("Failed to login with Google. Please try again!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleLoginFailure = () => {
    toast.error("Google login failed. Please try again!");
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
        useOneTap={true}
      />
    </div>
  );
};

export default GoogleLoginButton;
