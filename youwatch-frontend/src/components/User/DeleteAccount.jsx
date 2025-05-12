// DeleteAccount.jsx
import React from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../ContextAPI/AuthContext";
import { Link, useNavigate } from "react-router-dom";
const DeleteAccount = () => {
  //   const navigate = useNavigate();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:8000/api/v1/users/delete-account",
        {
          headers: {
            "Content-Type": "application/json",
            // Uncomment below line if token is needed
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true, // ✅ this is correct
        }
      );

      const data = await response.data;

      if (response.status == 200) {
        alert("Account deleted successfully");
        // Optional: logout or redirect
        //   localStorage.removeItem('token');
        logout();
        navigate("/login");
      } else {
        alert(`Message: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex h-screen w-full justify-center items-center bg-gray-700">
      <div className="flex flex-col items-center justify-around w-2/3 h-1/2 bg-white rounded p-5">
        <h2 className="text-3xl font-semibold text-center">
          Confirmation Delete Account
        </h2>
        <button
          onClick={handleDelete}
          className="bg-red-600 w-fit text-white font-bold text-xl  p-5 rounded-xl"
        >
          Delete My Account
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;
