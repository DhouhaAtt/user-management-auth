import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Delete token from local storage
    localStorage.removeItem("token");
    // Redirect to login page
    navigate("/login");
  };

  return (
    <nav className="bg-teal-500 p-4 mb-6 flex justify-between items-center">
      <div className="text-white font-bold text-xl">
        User Management System
      </div>
      <button
        onClick={handleLogout}
        className="text-white font-bold px-4 py-2 rounded focus:outline-none hover:bg-teal-600"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
