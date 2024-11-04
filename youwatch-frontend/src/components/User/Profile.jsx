import React, { useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    profilePicture: null,
  });
  const [file, setFile] = useState(null);

  // Fetch user data (you can replace this with your API call)
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     const response = await axios.get('/api/v1/user');
  //     setUser(response.data);
  //   };
  //   fetchUserData();
  // }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const formData = new FormData();
  //   if (file) {
  //     formData.append('profilePicture', file);
  //   }
  //   formData.append('name', user.name);
  //   formData.append('email', user.email);
  //   formData.append('bio', user.bio);

  //   try {
  //     await axios.patch('/api/v1/user', formData, {
  //       withCredentials: true,
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     alert('Profile updated successfully!');
  //   } catch (error) {
  //     console.error('Error updating profile:', error);
  //   }
  // };
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("submitted");
    setUser({ name: "", email: "", bio: "", profilePicture: null });
    event.target.reset();
  };
  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Bio:</label>
          <textarea
            name="bio"
            value={user.bio}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Profile Picture:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
                       file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition duration-200"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
