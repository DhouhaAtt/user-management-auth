import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import UserComponent from "../../components/users/UserComponent";
import CreateUserModal from "../../components/users/CreateUserModal";
import UserDetailsModal from "../../components/users/UserDetailsModal";
import Snackbar from "../../components/Snackbar";
import UpdateUserModal from "../../components/users/UpdateUserModal";
import { useNavigate } from "react-router-dom";

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [filterField, setFilterField] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbarType, setSnackbarType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const [newUserData, setNewUserData] = useState({
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    city: "",
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/users/`)
      .then((response) => {
        setUsers(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first");
      navigate("/login");
    }
  }, []);

  const toggleDropdown = (userId) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

  const handleFilterChange = (e) => {
    setFilterField(e.target.value);
    setFilterValue("");
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  const applyFilter = () => {
    if (filterField && filterValue) {
      axios
        .get(
          `${process.env.REACT_APP_SERVER_URL}/users/filter/?${filterField}=${filterValue}`
        )
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error("Error applying filter:", error);
        });
    }
  };

  const handleSearch = (e) => {
    const searchText = e.target.value;
    setSearchTerm(searchText);

    const filtered = users.filter((user) =>
      Object.values(user).some((val) =>
        val.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    setFilteredUsers(users.slice((currentPage - 1) * 5, currentPage * 5));
  }, [users, currentPage]);

  const totalPages = Math.ceil(users.length / 5);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleDelete = (userId) => {
    axios
      .delete(`${process.env.REACT_APP_SERVER_URL}/users/${userId}/delete/`)
      .then(() => {
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
        setSnackbarVisible(true);
        handleDeleteSuccess();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const handleCreateUser = () => {
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/users/create/`, newUserData)
      .then((response) => {
        setUsers([...users, response.data]);
        setSnackbarVisible(true);
        handleCreateSuccess();
        setShowCreateModal(false);
        setNewUserData({
          first_name: "",
          last_name: "",
          age: "",
          gender: "",
          city: "",
        });
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        setSnackbarVisible(true);
        setShowCreateModal(false);
        handleCreateError();
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validate age to ensure it's a number
    // if (name === "age" && isNaN(value)) {
    //   setSnackbarVisible(true);
    //   setSnackbarMessage("Age must be a number.");
    //   setSnackbarType("error");
    //   return;
    // }

    // // Validate other fields to ensure they're text (except gender)
    // if (name !== "age" && name !== "gender" && !/^[a-zA-Z\s]*$/.test(value)) {
    //   setSnackbarVisible(true);
    //   setSnackbarMessage(`${name} must contain only letters and spaces.`);
    //   setSnackbarType("error");
    //   return;
    // }
    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeleteSuccess = () => {
    setSnackbarMessage("User deleted successfully.");
    setSnackbarType("success");
  };

  const handleCreateSuccess = () => {
    setSnackbarMessage("User added successfully.");
    setSnackbarType("success");
  };

  const handleCreateError = () => {
    setSnackbarMessage("Error creating user");
    setSnackbarType("error");
  };

  const handleUpdateUser = (userId) => {
    const userToUpdate = users.find((user) => user.id === userId);
    setSelectedUser(userToUpdate);
    setShowUpdateModal(true);
  };

  const handleUpdate = (updatedUser) => {
    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);
    setSnackbarVisible(true);
    setSnackbarMessage("User updated successfully.");
    setSnackbarType("success");
  };
  return (
    <div className="container mx-auto">
      <Navbar />
      <div className="flex justify-between items-center mb-4">
        <div className="flex">
          <span className="mr-2">Filter by:</span>
          <select
            value={filterField}
            onChange={handleFilterChange}
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
          >
            <option value="">Select Field</option>
            <option value="first_name">First Name</option>
            <option value="last_name">Last Name</option>
            <option value="age">Age</option>
            <option value="gender">Gender</option>
            <option value="city">City</option>
          </select>
          {filterField && (
            <input
              type="text"
              value={filterValue}
              onChange={handleFilterValueChange}
              placeholder={`Filter by ${filterField}`}
              className="ml-2 px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
            />
          )}
          <button
            onClick={applyFilter}
            className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
          >
            Apply Filter
          </button>
        </div>
        <div className="flex">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search"
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
          />
          <button
            onClick={() => setShowCreateModal(true)}
            className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
          >
            Create User
          </button>
        </div>
      </div>
      <UserComponent
        users={filteredUsers.length > 0 ? filteredUsers : users}
        toggleDropdown={toggleDropdown}
        dropdownOpen={dropdownOpen}
        handleDelete={handleDelete}
        setShowDetailsModal={setShowDetailsModal}
        setSelectedUserId={setSelectedUserId}
        handleUpdateUser={handleUpdateUser}
      />
      {/* Pagination UI */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 rounded-md ${
              currentPage === index + 1
                ? "bg-teal-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {showDetailsModal && (
        <UserDetailsModal
          userId={selectedUserId}
          handleClose={() => setShowDetailsModal(false)}
        />
      )}
      {showCreateModal && (
        <CreateUserModal
          handleClose={() => setShowCreateModal(false)}
          handleChange={handleChange}
          handleCreateUser={handleCreateUser}
          newUserData={newUserData}
        />
      )}
      {showUpdateModal && (
        <UpdateUserModal
          user={selectedUser}
          handleClose={() => setShowUpdateModal(false)}
          handleUpdate={handleUpdate}
        />
      )}
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

export default UserListPage;
