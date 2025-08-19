import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const initialUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1 234 567 890",
    address: "123 Main St.",
    joinedDate: "April 24, 2024",
    lastActive: "April 25, 2024",
    role: "Passenger",
    status: "Active",
    totalRides: 523,
    cancellationCount: 12,
    rating: 4.8,
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    phone: "+1 987 654 321",
    address: "456 Oak Ave.",
    joinedDate: "March 15, 2024",
    lastActive: "August 10, 2025",
    role: "Passenger",
    status: "Inactive",
    totalRides: 210,
    cancellationCount: 5,
    rating: 4.2,
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1 555 666 777",
    address: "789 Pine St.",
    joinedDate: "Jan 10, 2024",
    lastActive: "August 18, 2025",
    role: "Driver",
    status: "Active",
    totalRides: 134,
    cancellationCount: 3,
    rating: 4.5,
    avatar: "https://i.pravatar.cc/100?img=3",
  },
  {
    id: 4,
    name: "Bob Williams",
    email: "bob@example.com",
    phone: "+1 222 333 444",
    address: "321 Maple Rd.",
    joinedDate: "Feb 20, 2024",
    lastActive: "August 19, 2025",
    role: "Admin",
    status: "Banned",
    totalRides: 0,
    cancellationCount: 0,
    rating: 0,
    avatar: "https://i.pravatar.cc/100?img=4",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie@example.com",
    phone: "+1 111 222 333",
    address: "654 Elm St.",
    joinedDate: "May 5, 2024",
    lastActive: "August 18, 2025",
    role: "Passenger",
    status: "Active",
    totalRides: 78,
    cancellationCount: 1,
    rating: 4.1,
    avatar: "https://i.pravatar.cc/100?img=5",
  },
  {
    id: 6,
    name: "Diana Prince",
    email: "diana@example.com",
    phone: "+1 999 888 777",
    address: "987 Cedar Ln.",
    joinedDate: "July 1, 2024",
    lastActive: "August 18, 2025",
    role: "Driver",
    status: "Active",
    totalRides: 230,
    cancellationCount: 8,
    rating: 4.7,
    avatar: "https://i.pravatar.cc/100?img=6",
  },
  {
    id: 7,
    name: "Eve Adams",
    email: "eve@example.com",
    phone: "+1 444 555 666",
    address: "111 Birch Blvd.",
    joinedDate: "June 12, 2024",
    lastActive: "August 17, 2025",
    role: "Passenger",
    status: "Inactive",
    totalRides: 90,
    cancellationCount: 2,
    rating: 4.0,
    avatar: "https://i.pravatar.cc/100?img=7",
  },
];

const UserTable = ({ filter }) => {
  // Single source of truth for data (edits & deletes persist)
  const [allUsers, setAllUsers] = useState(initialUsers);

  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);

  // Search + status filter (by ID, Name, Email, Role, Status)
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

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const goToPage = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  // Edit handlers
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const saveChanges = () => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === editUser.id ? editUser : u))
    );
    setEditUser(null);
  };

  return (
    <div>
      {/* Search and Rows per page */}
      <div className="flex justify-between mb-4 items-center">
        <input
          type="text"
          placeholder="Search by ID, Name, Email, Role, or Status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-1/2"
        />
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="p-2 border rounded"
        >
          <option value={3}>3 rows</option>
          <option value={5}>5 rows</option>
          <option value={10}>10 rows</option>
        </select>
      </div>

      {/* User Table */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
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
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td className="p-3">{user.id}</td>
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3">{user.status}</td>
              <td className="p-3 flex gap-3">
                <FaEye
                  className="cursor-pointer text-blue-500"
                  onClick={() => setSelectedUser(user)}
                />
                <FaEdit
                  className="cursor-pointer text-green-500"
                  onClick={() => setEditUser(user)}
                />
                <FaTrash className="cursor-pointer text-red-500" />
              </td>
            </tr>
          ))}
          {paginatedUsers.length === 0 && (
            <tr>
              <td className="p-4 text-center text-gray-500" colSpan={7}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* View Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedUser(null)}
            >
              ✖
            </button>

            <div className="text-center">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h2 className="text-xl font-bold">{selectedUser.name}</h2>
              <p className="text-gray-500">{selectedUser.role}</p>
              <span className="inline-block px-2 py-1 mt-2 text-sm bg-gray-200 rounded">
                {selectedUser.status}
              </span>
            </div>

            <div className="mt-4 space-y-1">
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedUser.phone}
              </p>
              <p>
                <strong>Address:</strong> {selectedUser.address}
              </p>
              <p>
                <strong>Joined Date:</strong> {selectedUser.joinedDate}
              </p>
              <p>
                <strong>Last Active:</strong> {selectedUser.lastActive}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Activity Summary</h3>
              <p>
                <strong>Total Rides:</strong> {selectedUser.totalRides}
              </p>
              <p>
                <strong>Cancellation Count:</strong>{" "}
                {selectedUser.cancellationCount}
              </p>
              <p>
                <strong>Rating:</strong> {selectedUser.rating}
              </p>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setEditUser(null)}
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">
              Edit User Details
            </h2>

            <div className="flex flex-col items-center mb-4">
              <img
                src={editUser.avatar}
                alt={editUser.name}
                className="w-24 h-24 rounded-full mb-2"
              />
              <button className="border px-3 py-1 rounded text-sm">
                Change
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editUser.name}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={editUser.email}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium">Role</label>
                  <select
                    name="role"
                    value={editUser.role}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded"
                  >
                    <option>Passenger</option>
                    <option>Driver</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium">Status</label>
                  <select
                    name="status"
                    value={editUser.status}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Banned</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={editUser.phone}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            <div className="flex justify-between mt-4 gap-2">
              <button
                onClick={saveChanges}
                className="flex-1 bg-blue-500 text-white py-2 rounded"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditUser(null)}
                className="flex-1 border py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => alert("Deactivate User")}
                className="flex-1 border border-red-500 text-red-500 py-2 rounded"
              >
                Deactivate User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
