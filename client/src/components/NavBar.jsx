import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../Context/AppContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { userData, logout, isLoading, getUserData, backendUrl } = useContext(AppContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sendVerificationOtp = async () => {
    setLocalLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}api/auth/send-verify-otp`,
        {},
        { withCredentials: true }
      );
      await getUserData();
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send verification"
      );
    } finally {
      setLocalLoading(false);
      setShowDropdown(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLocalLoading(true);
      await logout();
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      setLocalLoading(false);
      setShowDropdown(false);
    }
  };

  return (
    <div className="fixed top-0 z-50 flex items-center justify-between w-full p-4 bg-white shadow-md sm:p-6 sm:px-12 lg:px-24">
      {/* Logo */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={assets.logo} alt="Logo" className="w-28 sm:w-32" />
      </div>

      {/* User Section */}
      {userData ? (
        <div className="relative" ref={dropdownRef}>
          {/* User Avatar */}
          <div
            className={`w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center cursor-pointer font-medium hover:bg-indigo-700 transition-colors ${isLoading || localLoading ? "opacity-50" : ""}`}
            onClick={() => !isLoading && !localLoading && setShowDropdown(!showDropdown)}
          >
            {userData?.name ? userData.name[0].toUpperCase() : ""}
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 z-50 w-48 py-1 mt-2 bg-white rounded-md shadow-lg">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {userData.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{userData.email}</p>
              </div>

              {!userData.isAccountVerified && (
                <button
                  onClick={sendVerificationOtp}
                  className="block w-full px-4 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50"
                  disabled={isLoading || localLoading}
                >
                  {localLoading ? "Sending..." : "Verify Email"}
                </button>
              )}

              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50"
                disabled={isLoading || localLoading}
              >
                {localLoading ? "Logging out..." : "Logout"}
              </button>

              <button
                onClick={() => navigate('/reset-password')}
                className="block w-full px-4 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
              >
                Reset Password
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className={`flex items-center gap-2 border border-indigo-600 rounded-full px-6 py-2 text-indigo-600 hover:bg-indigo-50 transition-all font-medium ${isLoading ? "opacity-50" : ""}`}
          disabled={isLoading}
        >
          Login
          <img src={assets.arrow_icon} alt="" className="w-4" />
        </button>
      )}
    </div>
  );
};

export default NavBar;