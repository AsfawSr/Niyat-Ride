import React, { useState, useEffect } from "react";
import { initialUsers } from "./data/users";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import UserRow from "./UserRow";
import ViewUserModal from "./modals/ViewUserModal";
import EditUserModal from "./modals/EditUserModal";
const UserTable = ({ filter }) => {
  const [allUsers, setAllUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();

    const byStatus = (u) => {
      if (filter === "banned") return u.status.toLowerCase() === "banned";
      if (filter === "active") return u.status.toLowerCase() === "active";
      if (filter === "inactive") return u.status.toLowerCase() === "inactive";
      return true;
    };

    const bySearch = (u) =>
      !term ||
      String(u.id).includes(term) ||
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term) ||
      u.status.toLowerCase().includes(term);

    const next = allUsers.filter(byStatus).filter(bySearch);
    setFilteredUsers(next);
    setCurrentPage(1);
  }, [searchTerm, filter, allUsers]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };
  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setAllUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };
  const saveChanges = () => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === editUser.id ? editUser : u))
    );
    setEditUser(null);
  };
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />

      {/* User Table */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 ">
            <th className="p-3">Profile</th>
            <th className="p-3">User ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onView={setSelectedUser}
              onEdit={setEditUser}
              onDelete={handleDelete}
            />
          ))}
          {paginatedUsers.length === 0 && (
            <tr>
              <td
                className="p-4 text-center text-gray-500 dark:text-gray-400"
                colSpan={7}
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modals */}
      <ViewUserModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
      <EditUserModal
        user={editUser}
        onChange={handleEditChange}
        onSave={saveChanges}
        onCancel={() => setEditUser(null)}
      />
    </div>
  );
};

export default UserTable;
