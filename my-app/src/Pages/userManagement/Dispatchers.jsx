import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import UserTable from "../../components/usermanagement/UserTable";
import UserStats from "../../components/usermanagement/UserStats";
import Sidebar from "../../Components/Sidebar";
import SearchBar from "../../components/usermanagement/SearchBar";
import { fetchDispatchers } from "../../store/userManagement/dispatchersSlice";
import Pagination from "../../components/usermanagement/Pagination";

const Dispatchers = () => {
  const dispatch = useDispatch();
  const { dispatchers, status, totalPages, error } = useSelector(
    (state) => state.dispatchers
  );

  const [rowsPerPage, setRowsPerPage] = useState(3);
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

  const handleDeleteUser = () => {
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
      <div className="dark:bg-gray-900 dark:shadow-gray-700 flex-1 p-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
          Dispatchers
        </h1>
        <SearchBar onSearch={handleSearch} />

        {status === "loading" && <p>Loading dispatchers...</p>}
        {status === "failed" && <p className="text-red-500">{error}</p>}
        {status === "succeeded" && dispatchers.length === 0 && (
          <p>No dispatchers found.</p>
        )}

        <button className="rounded bg-blue-500 text-white p-4">
          <NavLink to="/signup">Create dispatcher</NavLink>
        </button>
        {status === "succeeded" && dispatchers.length > 0 && (
          <UserTable
            users={dispatchers}
            onDeleteSuccess={handleDeleteUser}
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

        <div className="col-span-4">
          <UserStats />
        </div>
      </div>
    </div>
  );
};

export default Dispatchers;
