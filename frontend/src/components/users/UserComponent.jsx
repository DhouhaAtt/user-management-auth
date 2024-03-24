import React from "react";

function UserList({
  users,
  toggleDropdown,
  dropdownOpen,
  handleDelete,
  setShowDetailsModal,
  setSelectedUserId,
  handleUpdateUser,
}) {
  const handleShowDetails = (userId) => {
    setSelectedUserId(userId);
    setShowDetailsModal(true);
    toggleDropdown(userId);
  };

  const handleUpdate = (userId) => {
    handleUpdateUser(userId);
    toggleDropdown(userId);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">First Name</th>
              <th className="px-4 py-2">Last Name</th>
              <th className="px-4 py-2">Age</th>
              <th className="px-4 py-2">Gender</th>
              <th className="px-4 py-2">City</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200">
                <td className="px-4 py-2 text-center">{user.first_name}</td>
                <td className="px-4 py-2 text-center">{user.last_name}</td>
                <td className="px-4 py-2 text-center">{user.age}</td>
                <td className="px-4 py-2 text-center">{user.gender}</td>
                <td className="px-4 py-2 text-center">{user.city}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    type="button"
                    onClick={() => toggleDropdown(user.id)}
                    className="inline-flex justify-center w-24 rounded-md border border-gray-300 shadow-sm px-3 py-1 bg-teal-500 text-sm font-medium text-white hover:bg-teal-600 focus:outline-none relative z-10"
                    id={`options-menu-${user.id}`}
                    aria-expanded={dropdownOpen[user.id]}
                    aria-haspopup="true"
                  >
                    Actions
                    <svg
                      className="-mr-1 ml-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                      />
                    </svg>
                  </button>

                  {dropdownOpen[user.id] && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby={`options-menu-${user.id}`}
                    >
                      <div className="py-1" role="none">
                        <button
                          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                          onClick={() => handleShowDetails(user.id)}
                        >
                          Details
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                          onClick={() => handleUpdate(user.id)}
                        >
                          Update
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserList;
