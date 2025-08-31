import { useState } from "react";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import UserRow from "./UserRow";
import ViewUserModal from "./modals/ViewUserModal";
import EditUserModal from "./modals/EditUserModal";
const UserTable = ({ users, onDeleteSuccess, onUpdateSuccess }) => {
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  // Pagination
  const totalPages = Math.max(1, Math.ceil(tableUsers.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + rowsPerPage);
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-gray-300">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#dfdfdf] dark:bg-gray-700 border-b border-gray-400 dark:border-gray-800">
              <th className="p-3">Profile</th>
              <th className="p-3">User ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <UserRow
                key={user.userId}
                user={user}
                onView={() => setSelectedUser(user)}
                onEdit={() => setEditUser(user)}
                onDelete={onDeleteSuccess}
              />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />

      <ViewUserModal
        user={selectedUser}
        onCancel={() => setSelectedUser(null)}
      />
      {editUser && (
        <EditUserModal
          user={editUser}
          onCancel={() => setEditUser(null)}
          onUpdateSuccess={onUpdateSuccess} // <-- update table after save
        />
      )}
    </div>
  );
};

export default UserTable;
