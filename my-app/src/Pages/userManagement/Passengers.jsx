import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserTable from "../../components/userManagement/UserTable";
import UserStats from "../../components/userManagement/UserStats";
import Sidebar from "../../Components/Sidebar";
import SearchBar from "../../components/userManagement/SearchBar";
import { fetchPassengers } from "../../store/userManagement/passengersSlice"; // your thunk
const Passengers = () => {
  const dispatch = useDispatch();
  const { passengers, status, error } = useSelector(
    (state) => state.passengers
  );
  useEffect(() => {
    dispatch(fetchPassengers()); // initial fetch
  }, [dispatch]);
  const handleSearch = (query) => {
    dispatch(fetchPassengers({ search: query })); // fetch filtered passengers
  };
  const handleDeleteUser = () => {
    dispatch(fetchPassengers());
  };
  const handleUpdateSuccess = () => {
    dispatch(fetchPassengers());
  };
  return (
    <div className="flex">
      <Sidebar />
      {/* Main Passenger Table Panel */}
      <div className="dark:bg-gray-900 dark:shadow-gray-700 flex-1 p-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
          Passengers
        </h1>
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />
        {/* Status Messages */}
        {status === "loading" && <p>Loading passengers...</p>}
        {status === "failed" && <p className="text-red-500">{error}</p>}
        {status === "succeeded" && passengers.length === 0 && (
          <p>No passengers found.</p>
        )}

        {/* Passenger Table */}
        {status === "succeeded" && passengers.length > 0 && (
          <UserTable
            users={passengers}
            onDeleteSuccess={handleDeleteUser}
            updateSuccess={handleUpdateSuccess}
          />
        )}
      </div>
      {/* User Stats Panel */}
      <div className="flex flex-col justify-between items-center">
        <UserStats />
      </div>
    </div>
  );
};

export default Passengers;
