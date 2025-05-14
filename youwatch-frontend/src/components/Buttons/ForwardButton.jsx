// components/BackButton.jsx
import React from "react";
import { IoMdArrowForward } from "react-icons/io"; // Using IoMdArrowBack from 'react-icons/io'

const ForwardButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-b from-gray-800 to-black dark:bg-gradient-to-r dark:from-gray-100 dark:to-gray-200 dark:text-black   transition duration-200  text-white  p-2 rounded-full flex items-center"
    >
      <IoMdArrowForward />
    </button>
  );
};

export default ForwardButton;
