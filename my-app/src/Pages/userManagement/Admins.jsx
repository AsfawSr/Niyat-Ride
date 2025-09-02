import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../Components/Sidebar";
import UserTable from "../../components/usermanagement/UserTable";
import UserStats from "../../components/usermanagement/UserStats";
import SearchBar from "../../components/usermanagement/SearchBar";
import Pagination from "../../components/usermanagement/Pagination";
import { fetchAdmins } from "../../store/userManagement/adminSlice";

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
          <button className="rounded bg-blue-500 text-white p-4">
            <NavLink to="/signup">Create Admin</NavLink>
          </button>
        </h1>
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} filter="admins" />
        {/* Status Messages */}
        {status === "loading" && <p>Loading admins...</p>}
        {status === "failed" && <p className="text-red-500">{error}</p>}
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

      {/* Admin Stats Panel */}
      <div className="col-span-4">
        <UserStats />
      </div>
    </div>
  );
};
export default Admins;
