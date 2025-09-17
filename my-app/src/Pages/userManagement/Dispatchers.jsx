import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import Sidebar from "../../Components/Sidebar";
import UserTable from "../../Components/userManagement/UserTable";
import SearchBar from "../../Components/userManagement/SearchBar";
import Pagination from "../../Components/userManagement/Pagination";
import {
  clearState,
  fetchDispatchers,
} from "../../store/userManagement/dispatchersSlice";
import Loading from "../../Components/Loading";

const Dispatchers = () => {
  const dispatch = useDispatch();
  const { dispatchers, status, totalPages } = useSelector(
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
    return () => {
      dispatch(clearState());
    };
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
      <div className="dark:bg-gray-900 dark:shadow-gray-700 p-4 flex-1 flex flex-col justify-between h-160 ">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-200 flex items-center justify-center gap-10">
          Dispatcher Page
          <NavLink
            to="/signup/Dispatcher"
            className="rounded bg-blue-500 text-white px-4 py-2 text-base h-auto inline-block hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 transition"
            aria-label="Create a new dispatcher"
          >
            Create Dispatcher
          </NavLink>
        </h1>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} filter="dispatchers" />
        <div className="flex flex-col justify-between h-125">
          <div className="text-center pt-4">
            {status === "loading" && <Loading />}
            {status === "failed" && <p className="text-red-500">failed</p>}
            {status === "succeeded" && dispatchers.length === 0 && (
              <p>No dispatchers found.</p>
            )}
          </div>

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
      </div>
    </div>
  );
};

export default Dispatchers;
