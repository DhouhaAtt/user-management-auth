import React, { useEffect } from "react";

function Snackbar({ message, setMessage, type }) {
  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage(""); // Clear the message after a timeout
      }, 3000); // Adjust the timeout duration as needed (e.g., 3000 milliseconds for 3 seconds)
      return () => clearTimeout(timeout); // Clear the timeout on component unmount
    }
  }, [message, setMessage]);

  const getColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-900";
    }
  };

  return (
    <div
      className={`fixed bottom-0 right-0 mb-4 mr-4 text-white px-4 py-2 rounded-md ${getColor()} ${
        message ? "visible" : "invisible"
      }`}
    >
      {message}
    </div>
  );
}

export default Snackbar;
