import React, { useState } from "react";
import axios from "axios";
import Snackbar from "../../components/Snackbar";

function UpdateUserModal({ user, handleClose, handleUpdate }) {
  const [updatedUserData, setUpdatedUserData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    age: user.age,
    gender: user.gender,
    city: user.city,
  });
  const [errorMessages, setErrorMessages] = useState({
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    city: "",
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    // Validate age to ensure it's a number
    if (name === "age" && isNaN(value)) {
      errorMessage = "Age must be a number.";
    }
    // Validate other fields to ensure they're text (except gender)
    if (name !== "age" && name !== "gender" && !/^[a-zA-Z\s]*$/.test(value)) {
      errorMessage = `${name} must contain only letters and spaces.`;
    }
    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    setUpdatedUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateUser = () => {
    const requiredFields = ["first_name", "last_name", "age", "gender", "city"];
    const emptyFields = requiredFields.filter(
      (field) => !updatedUserData[field]
    );

    if (emptyFields.length > 0) {
      emptyFields.forEach((field) => {
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          [field]: `${field.replace("_", " ")} is required.`,
        }));
      });
      return;
    }
    axios
      .put(
        `${process.env.REACT_APP_SERVER_URL}/users/${user.id}/update/`,
        updatedUserData
      )
      .then((response) => {
        handleUpdate(response.data);
        handleClose();
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        setSnackbarVisible(true);
        setSnackbarMessage("Error updating user.");
        setSnackbarType("error");
      });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl mb-4">Update User</h2>
        <div className="flex flex-col mb-4">
          <label className="mb-2 font-bold text-gray-700" htmlFor="first_name">
            First Name:
          </label>
          <input
            className="border rounded-md py-2 px-3"
            type="text"
            id="first_name"
            name="first_name"
            value={updatedUserData.first_name}
            onChange={handleChange}
          />
          {errorMessages.first_name && (
            <span className="text-red-500">{errorMessages.first_name}</span>
          )}
        </div>
        <div className="flex flex-col mb-4">
          <label className="mb-2 font-bold text-gray-700" htmlFor="last_name">
            Last Name:
          </label>
          <input
            className="border rounded-md py-2 px-3"
            type="text"
            id="last_name"
            name="last_name"
            value={updatedUserData.last_name}
            onChange={handleChange}
          />
          {errorMessages.last_name && (
            <span className="text-red-500">{errorMessages.last_name}</span>
          )}
        </div>
        <div className="flex flex-col mb-4">
          <label className="mb-2 font-bold text-gray-700" htmlFor="age">
            Age:
          </label>
          <input
            className="border rounded-md py-2 px-3"
            type="text"
            id="age"
            name="age"
            value={updatedUserData.age}
            onChange={handleChange}
          />
          {errorMessages.age && (
            <span className="text-red-500">{errorMessages.age}</span>
          )}
        </div>
        <div className="flex flex-col mb-4">
          <label className="mb-2 font-bold text-gray-700" htmlFor="gender">
            Gender:
          </label>
          <select
            className="border rounded-md py-2 px-3"
            id="gender"
            name="gender"
            value={updatedUserData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
          {errorMessages.gender && (
            <span className="text-red-500">{errorMessages.gender}</span>
          )}
        </div>
        <div className="flex flex-col mb-4">
          <label className="mb-2 font-bold text-gray-700" htmlFor="city">
            City:
          </label>
          <input
            className="border rounded-md py-2 px-3"
            type="text"
            id="city"
            name="city"
            value={updatedUserData.city}
            onChange={handleChange}
          />
          {errorMessages.city && (
            <span className="text-red-500">{errorMessages.city}</span>
          )}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateUser}
            disabled={Object.values(errorMessages).some((msg) => msg !== "")}
            className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none"
          >
            Update
          </button>
        </div>
      </div>
      {snackbarVisible && (
        <Snackbar
          message={snackbarMessage}
          setMessage={setSnackbarMessage}
          type={snackbarType}
        />
      )}
    </div>
  );
}

export default UpdateUserModal;
