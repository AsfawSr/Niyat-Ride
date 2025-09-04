import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../Components/Sidebar";
import UserTable from "../../components/usermanagement/UserTable";
import UserStats from "../../components/usermanagement/UserStats";
import SearchBar from "../../components/usermanagement/SearchBar";
import { fetchDrivers } from "../../store/userManagement/driversSlice";
import Pagination from "../../components/usermanagement/Pagination";

const Drivers = () => {
  const dispatch = useDispatch();
  const { drivers, status, totalPages, error } = useSelector(
    (state) => state.drivers
  );

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(
      fetchDrivers({
        search: searchQuery,
        page: currentPage,
        limit: rowsPerPage,
      })
    );
  }, [dispatch, searchQuery, currentPage, rowsPerPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // ✅ Reset page on new search
  };

  const handleDeleteDriver = () => {
    dispatch(
      fetchDrivers({
        search: searchQuery,
        page: currentPage,
        limit: rowsPerPage,
      })
    );
  };

  const handleUpdateSuccess = () => {
    dispatch(
      fetchDrivers({
        search: searchQuery,
        page: currentPage,
        limit: rowsPerPage,
      })
    );
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
        <SearchBar onSearch={handleSearch} filter="drivers" />

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
            onDeleteSuccess={handleDeleteDriver}
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
      <div className="col-span-4 space-y-4">
        <UserStats />
      </div>
    </div>
  );
};
export default Drivers;
