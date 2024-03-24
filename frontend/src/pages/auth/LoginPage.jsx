import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/login/`, {
        username: username,
        password: password,
      })
      .then((response) => {
        // Handle successful login
        console.log(response.status);
        console.log(response.data);
        localStorage.setItem("token", response.data.token); // Save token in local storage
        setMessage("Login successful. Will redirect you now...");
        setTimeout(() => {
          navigate("/users");
        }, 2000);
      })
      .catch((error) => {
        // Handle login error
        setMessage("Invalid credentials. Please try again.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div>
          <h2 className="text-3xl font-semibold mb-4 text-center">Sign in</h2>
        </div>
        <div className="mt-8">
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
            />
          </div>
          {message && (
            <p className={message.includes("successful") ? "text-green-500 text-sm mb-4" : "text-red-500 text-sm mb-4"}>
              {message}
            </p>
          )}
          <button
            onClick={handleLogin}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-teal-600 hover:text-teal-500 focus:outline-none focus:underline transition ease-in-out duration-150">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
