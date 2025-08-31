import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserTable from "../../components/usermanagement/UserTable";
import UserStats from "../../components/usermanagement/UserStats";
import Sidebar from "../../Components/Sidebar";
import SearchBar from "../../components/usermanagement/SearchBar";
import { fetchDispatchers } from "../../store/userManagement/dispatchersSlice"; // your thunk

const Dispatchers = () => {
  const dispatch = useDispatch();
  const { dispatchers, status, error } = useSelector(
    (state) => state.dispatchers
  );

  useEffect(() => {
    dispatch(fetchDispatchers()); // initial fetch
  }, [dispatch]);

  const handleSearch = (query) => {
    dispatch(fetchDispatchers({ search: query })); // fetch filtered dispatchers
  };
  const handleDeleteUser = () => {
    dispatch(fetchDispatchers());
  };
  const handleUpdateSuccess = () => {
    dispatch(fetchDispatchers());
  };

  return (
    <div className="flex">
      <Sidebar />
      {/* Main Dispatcher Table Panel */}
      <div className="dark:bg-gray-900 dark:shadow-gray-700 flex-1 p-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
          Dispatchers
        </h1>
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} filter="dispatchers" />
        {/* Status Messages */}
        {status === "loading" && <p>Loading dispatchers...</p>}
        {status === "failed" && <p className="text-red-500">{error}</p>}
        {status === "succeeded" && dispatchers.length === 0 && (
          <p>No dispatchers found.</p>
        )}
        <button className="rounded bg-blue-500 text-white p-4">
          <NavLink to="">Create dispatcher</NavLink>
        </button>
        {/* Dispatcher Table */}
      </div>

      {status === "succeeded" && dispatchers.length > 0 && (
        <UserTable
          users={dispatchers}
          onDeleteSuccess={handleDeleteUser}
          updateSuccess={handleUpdateSuccess}
        />
      )}

      {/* User Stats Panel */}
      <div className="col-span-4">
        <UserStats />
      </div>
    </div>
  );
};

export default Dispatchers;
