import React, { useEffect } from "react";
import UserTable from "../../components/usermanagement/UserTable";
import UserStats from "../../components/usermanagement/UserStats";
import Sidebar from "../../Components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../store/userManagement/allUsersSlice";
import SearchBar from "../../components/usermanagement/SearchBar";
const AllUsers = () => {
  const dispatch = useDispatch();
  const { allUsers, status, error } = useSelector((state) => state.allUsers);
  useEffect(() => {
    dispatch(fetchAllUsers()); // initial fetch
  }, [dispatch]);
  const handleSearch = (query) => {
    dispatch(fetchAllUsers({ search: query })); // search term → fetch filtered list
  };
  const handleDeleteUser = () => {
    dispatch(fetchAllUsers());
  };
  const handleUpdateSuccess = () => {
    dispatch(fetchAllUsers());
  };

  return (
    <div className="flex">
      <Sidebar />
      {/* Main User Table Panel */}
      <div className="dark:bg-gray-900 dark:shadow-gray-700 flex-1 p-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
          All Users
        </h1>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} filter="users" />
        {/* Status Messages */}
        {status === "loading" && <p>Loading users...</p>}
        {status === "failed" && <p className="text-red-500">{error}</p>}
        {status === "succeeded" && allUsers.length === 0 && (
          <p>No users found.</p>
        )}
        {/* User Table */}
        {status === "succeeded" && allUsers.length > 0 && (
          <UserTable
            users={allUsers}
            onDeleteSuccess={handleDeleteUser}
            onUpdateSuccess={handleUpdateSuccess}
          />
        )}
      </div>
      {/* User Stats Panel */}
      <div className="col-span-4">
        <UserStats />
      </div>
    </div>
  );
};

export default AllUsers;
