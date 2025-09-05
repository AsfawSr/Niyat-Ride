import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../Components/Sidebar";
import UserTable from "../../Components/userManagement/UserTable";
import SearchBar from "../../Components/userManagement/SearchBar";
import Pagination from "../../Components/userManagement/Pagination";
import { clearState, fetchAdmins } from "../../store/userManagement/adminSlice";
import { NavLink } from "react-router-dom";

const Admins = () => {
  const dispatch = useDispatch();
  const { admins, status, totalPages, error } = useSelector(
    (state) => state.admins
  );

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    dispatch(
      fetchAdmins({
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

  const handleDeleteAdmin = () => {
    dispatch(
      fetchAdmins({
        search: searchQuery,
        page: currentPage,
        limit: rowsPerPage,
      })
    );
  };
  const handleUpdateSuccess = () => {
    dispatch(
      fetchAdmins({
        search: searchQuery,
        page: currentPage,
        limit: rowsPerPage,
      })
    );
  };

  return (
    <div className="flex">
      <Sidebar />

      {/* Main Admin Table Panel */}
      <div className="dark:bg-gray-900 dark:shadow-gray-700 flex-1 p-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
          Admins{" "}
          <NavLink
            to="/signup/Admin"
            className="rounded bg-blue-500 text-white p-4 inline-block"
          >
            Create Admin
          </NavLink>
        </h1>
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} filter="admins" />
        {/* Status Messages */}
        {status === "loading" && <p>Loading admins...</p>}
        {status === "failed" && <p className="text-red-500">failed</p>}
        {status === "succeeded" && admins.length === 0 && (
          <p>No admins found.</p>
        )}
        {/* Admin Table */}
        {status === "succeeded" && admins.length > 0 && (
          <UserTable
            users={admins}
            onDeleteSuccess={handleDeleteAdmin}
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
  );
};
export default Admins;
