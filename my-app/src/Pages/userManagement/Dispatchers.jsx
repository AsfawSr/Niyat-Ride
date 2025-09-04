import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import Sidebar from "../../Components/Sidebar";
import UserTable from "../../components/usermanagement/UserTable";
import UserStats from "../../components/usermanagement/UserStats";
import SearchBar from "../../components/usermanagement/SearchBar";
import Pagination from "../../components/usermanagement/Pagination";
import { fetchDispatchers } from "../../store/userManagement/dispatchersSlice";
const Dispatchers = () => {
  const dispatch = useDispatch();
  const { dispatchers, status, totalPages, error } = useSelector(
    (state) => state.dispatchers
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    dispatch(
      fetchDispatchers({
        search: searchQuery,
        page: currentPage,
        limit: rowsPerPage,
      })
    );
  }, [dispatch, searchQuery, currentPage, rowsPerPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleDeleteDispatcher = () => {
    dispatch(
      fetchDispatchers({
        search: searchQuery,
        page: currentPage,
        limit: rowsPerPage,
      })
    );
  };

  const handleUpdateSuccess = () => {
    dispatch(
      fetchDispatchers({
        search: searchQuery,
        page: currentPage,
        limit: rowsPerPage,
      })
    );
  };
  return (
    <div className="flex">
      <Sidebar />
      {/* Main Dispatcher Table Panel */}
      <div className="dark:bg-gray-900 dark:shadow-gray-700 flex-1 p-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
          Dispatchers{" "}
          <NavLink
            to="/signup/Dispatcher"
            className="rounded bg-blue-500 text-white p-4 inline-block"
          >
            Create Dispatcher
          </NavLink>
        </h1>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} filter="dispatchers" />

        {/* Status Messages */}
        {status === "loading" && <p>Loading dispatchers...</p>}
        {status === "failed" && <p className="text-red-500">{error}</p>}
        {status === "succeeded" && dispatchers.length === 0 && (
          <p>No dispatchers found.</p>
        )}

        {/* Dispatcher Table */}
        {status === "succeeded" && dispatchers.length > 0 && (
          <UserTable
            users={dispatchers}
            onDeleteSuccess={handleDeleteDispatcher}
            onUpdateSuccess={handleUpdateSuccess}
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

      {/* Dispatcher Stats Panel */}
      <div className="col-span-4">
        <UserStats />
      </div>
    </div>
  );
};

export default Dispatchers;
