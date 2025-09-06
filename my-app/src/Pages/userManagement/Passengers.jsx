import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../Components/Sidebar";
import UserTable from "../../Components/userManagement/UserTable";
import SearchBar from "../../Components/userManagement/SearchBar";
import {
  clearState,
  fetchPassengers,
} from "../../store/userManagement/passengersSlice";
import Pagination from "../../Components/userManagement/Pagination";
import Loading from "../../Components/Loading";
const Passengers = () => {
  const dispatch = useDispatch();
  const { passengers, status, totalPages, error } = useSelector(
    (state) => state.passengers
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(
      fetchPassengers({
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
    setCurrentPage(1);
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

      <div className="dark:bg-gray-900 dark:shadow-gray-700 flex-1 p-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
          Passengers
        </h1>

        <SearchBar onSearch={handleSearch} filter="passengers" />
        <div className="flex flex-col justify-between h-125">
          <div className="text-center pt-4">
            {status === "loading" && (
              <p>
                Loading passengers...
                <Loading />
              </p>
            )}
            {status === "failed" && <p className="text-red-500">failed</p>}
            {status === "succeeded" && passengers.length === 0 && (
              <p>No passengers found.</p>
            )}
          </div>
          {status === "succeeded" && passengers.length > 0 && (
            <UserTable
              users={passengers}
              onDeleteSuccess={handleDeletePassenger}
              updateSuccess={handleUpdateSuccess}
            />
          )}
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
export default Passengers;
