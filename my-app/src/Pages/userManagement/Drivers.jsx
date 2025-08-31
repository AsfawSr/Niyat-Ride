import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserTable from "../../components/usermanagement/UserTable";
import UserStats from "../../components/usermanagement/UserStats";
import Sidebar from "../../Components/Sidebar";
import SearchBar from "../../components/usermanagement/SearchBar";
import { fetchDrivers } from "../../store/userManagement/driversSlice"; // your thunk

const Drivers = () => {
  const dispatch = useDispatch();
  const { drivers, status, error } = useSelector((state) => state.drivers);

  useEffect(() => {
    dispatch(fetchDrivers()); // initial fetch
  }, [dispatch]);
  const handleSearch = (query) => {
    dispatch(fetchDrivers({ search: query })); // fetch filtered drivers
  };
  const handleDeleteUser = () => {
    dispatch(fetchDrivers());
  };
  const handleUpdateSuccess = () => {
    dispatch(fetchDrivers());
  };
  return (
    <div className="flex">
      <Sidebar />
      {/* Main Driver Table Panel */}
      <div className="dark:bg-gray-900 dark:shadow-gray-700 flex-1 p-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
          Drivers
        </h1>
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />
        {/* Status Messages */}
        {status === "loading" && <p>Loading drivers...</p>}
        {status === "failed" && <p className="text-red-500">{error}</p>}
        {status === "succeeded" && drivers.length === 0 && (
          <p>No drivers found.</p>
        )}
        {/* Driver Table */}
        {status === "succeeded" && drivers.length > 0 && (
          <UserTable
            users={drivers}
            onDeleteSuccess={handleDeleteUser}
            updateSuccess={handleUpdateSuccess}
          />
        )}
      </div>

      {/* User Stats Panel */}
      <div className="col-span-4 space-y-4">
        <UserStats />
      </div>
    </div>
  );
};

export default Drivers;
