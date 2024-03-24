import React, { useState } from "react";
import Snackbar from "../../components/Snackbar";

function CreateUserModal({ handleClose, handleChange, handleCreateUser, newUserData }) {
  
  const [errorMessages, setErrorMessages] = useState({
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    city: "",
  });  const isAnyError = Object.values(errorMessages).some((error) => error !== "");

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");

  const handleChangeInternal = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    // Validate age to ensure it's a number
    if (name === "age" && isNaN(value)) {
      errorMessage = "Age must be a number.";
    } else if (!value.trim()) {
      // Validate other fields to ensure they're not empty
      errorMessage = `${name.replace("_", " ")} is required.`;
    } else if (name !== "age" && name !== "gender" && !/^[a-zA-Z\s]*$/.test(value)) {
      // Validate other fields to ensure they're text (except gender)
      errorMessage = `${name.replace("_", " ")} must contain only letters and spaces.`;
    }

    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    handleChange(e);
  };

  const handleCreateUserClick = () => {
    Object.keys(newUserData).forEach((name) => {
      const value = newUserData[name];
      handleChangeInternal({ target: { name, value } });
    });
  
    const anyError = Object.values(errorMessages).some((msg) => msg !== "");
  
    if (!anyError) {
      handleCreateUser();
    } else {
      setSnackbarVisible(true);
      setSnackbarMessage("Please fix the errors before creating the user.");
      setSnackbarType("error");
    }
  };
  

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl mb-4">Create User</h2>
        <div className="flex flex-col mb-4">
          <label className="mb-2 font-bold text-gray-700" htmlFor="first_name">
            First Name:
          </label>
          <input
            className="border rounded-md py-2 px-3"
            type="text"
            id="first_name"
            name="first_name"
            value={newUserData.first_name}
            onChange={handleChangeInternal}
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
            value={newUserData.last_name}
            onChange={handleChangeInternal}
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
            value={newUserData.age}
            onChange={handleChangeInternal}
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
            value={newUserData.gender}
            onChange={handleChangeInternal}
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
            value={newUserData.city}
            onChange={handleChangeInternal}
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
            onClick={handleCreateUserClick}
            className={`px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none ${
              isAnyError ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={Object.values(errorMessages).some((msg) => msg !== "")}
          >
            Create
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

export default CreateUserModal;
