import React, { useState, useEffect } from "react";
import axios from "axios";

function UserDetailsModal({ userId, handleClose }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/users/${userId}`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [userId]);

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl mb-4">User Details</h2>
        {userData && (
          <div>
            <p className="mb-2"><strong>First Name:</strong> {userData.first_name}</p>
            <p className="mb-2"><strong>Last Name:</strong> {userData.last_name}</p>
            <p className="mb-2"><strong>Age:</strong> {userData.age}</p>
            <p className="mb-2"><strong>Gender:</strong> {userData.gender}</p>
            <p className="mb-2"><strong>City:</strong> {userData.city}</p>
          </div>
        )}
        <button
          onClick={handleClose}
          className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default UserDetailsModal;
