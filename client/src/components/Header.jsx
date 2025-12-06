import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../Context/AppContext";

const Header = () => {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Navigate to login if not authenticated, or to dashboard/home if authenticated
    navigate(userData ? "/" : "/login");
  };

  return (
    <div className="flex flex-col items-center px-4 mt-20 text-center text-gray-800">
      <img
        src={assets.header_img}
        className="object-cover mb-6 rounded-full w-36 h-36"
        alt="Profile"
      />
      <h1 className="mb-2 text-xl font-medium sm:text-3xl">
        Hey {userData?.name ? userData.name.split(" ")[0] : "Developer!"}{" "}
        <img 
          className="inline-block w-8 aspect-square" 
          src={assets.hand_wave} 
          alt="Waving hand" 
          aria-hidden="true"
        />
      </h1>
      <h2 className="mb-4 text-3xl font-semibold sm:text-5xl">
        Welcome to {import.meta.env.VITE_APP_NAME || "Our App"}!
      </h2>
      <p className="max-w-md mb-8 text-sm text-gray-600 sm:text-base">
        {userData
          ? "Ready to explore all the features?"
          : "Let's start with the authentication process"}
      </p>
      <button 
        onClick={handleGetStarted}
        className="rounded-full border border-gray-500 px-8 py-2.5 hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        {userData ? "Continue Exploring" : "Get Started"}
      </button>
    </div>
  );
};

export default Header;