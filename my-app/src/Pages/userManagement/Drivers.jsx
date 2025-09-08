import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../Components/Sidebar";
import UserTable from "../../Components/userManagement/UserTable";
import SearchBar from "../../Components/userManagement/SearchBar";
import {
  clearState,
  fetchDrivers,
} from "../../store/userManagement/driversSlice";
import Pagination from "../../Components/userManagement/Pagination";
import Loading from "../../Components/Loading";

const Drivers = () => {
  const dispatch = useDispatch();
  const { drivers, status, totalPages } = useSelector((state) => state.drivers);
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
    return () => {
      dispatch(clearState());
    };
  }, [dispatch, searchQuery, currentPage, rowsPerPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); //
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
          Drivers Page
        </h1>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} filter="drivers" />
        <div className="flex flex-col justify-between h-125">
          <div className="text-center pt-4">
            {/* Status Messages */}
            {status === "loading" && <Loading />}
            {status === "failed" && <p className="text-red-500">failed</p>}
            {status === "succeeded" && drivers.length === 0 && (
              <p>No drivers found.</p>
            )}
          </div>
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
      </div>
    </div>
  );
};
export default Drivers;
