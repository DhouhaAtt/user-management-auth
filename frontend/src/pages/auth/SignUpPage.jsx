import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
  
    // Check if any field is empty
    if (password === "" || confirmPassword === "" || username === "") {
      setMessage("Please fill in all fields.");
      return;
    }
  
    // If all checks pass, proceed with signup
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/signup/`, {
        username: username,
        password: password,
      })
      .then((response) => {
        console.log("Signup successful");
        localStorage.setItem("token", response.data.token);
        setMessage("Sign up successful. Redirecting you now...");
        setTimeout(() => {
          navigate("/users");
        }, 2000);
      })
      .catch((error) => {
        setMessage("Signup failed. Please try again.");
      });
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-semibold mb-4 text-center">Sign Up</h1>
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {message && (
            <p className={message.includes("successful") ? "text-green-500 text-sm mb-4" : "text-red-500 text-sm mb-4"}>
              {message}
            </p>
          )}
          <button
            onClick={handleSignUp}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign Up
          </button>
          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500 focus:outline-none focus:underline transition ease-in-out duration-150">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
