import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../Components/Sidebar";
import UserTable from "../../components/userManagement/UserTable";
import UserStats from "../../components/userManagement/UserStats";
import SearchBar from "../../components/userManagement/SearchBar";
import { fetchPassengers } from "../../store/userManagement/passengersSlice";
import Pagination from "../../components/usermanagement/Pagination";

const Passengers = () => {
  const dispatch = useDispatch();
  const { passengers, status, totalPages, error } = useSelector(
    (state) => state.passengers
  );

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch passengers whenever filters change
  useEffect(() => {
    dispatch(
      fetchPassengers({
        search: searchQuery,
        page: currentPage,
        limit: rowsPerPage,
      })
    );
  }, [dispatch, searchQuery, currentPage, rowsPerPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // ✅ Reset to first page on new search
  };

  const handleDeletePassenger = () => {
    dispatch(
      fetchPassengers({
        search: searchQuery,
        page: currentPage,
        limit: rowsPerPage,
      })
    );
  };

  const handleUpdateSuccess = () => {
    dispatch(
      fetchPassengers({
        search: searchQuery,
        page: currentPage,
        limit: rowsPerPage,
      })
    );
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
        <SearchBar onSearch={handleSearch} filter="passengers" />

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
            onDeleteSuccess={handleDeletePassenger}
            updateSuccess={handleUpdateSuccess}
          />
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>

      {/* User Stats Panel */}
      <div className="flex flex-col justify-between items-center">
        <UserStats />
      </div>
    </div>
  );
};

export default Passengers;
