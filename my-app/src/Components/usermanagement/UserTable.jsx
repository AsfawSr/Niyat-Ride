import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    role: "Passenger",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    role: "Passenger",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Michael Lee",
    email: "michaellee@example.com",
    role: "Driver",
    status: "Banned",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emilydavis@example.com",
    role: "Passenger",
    status: "Active",
  },
  {
    id: 5,
    name: "Robert Brown",
    email: "robertbrown@example.com",
    role: "Driver",
    status: "Active",
  },
  // ... you can add more users to test pagination
];

const UserTable = ({ view }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(30);

  // Filter users based on view and search term
  let filteredUsers = users
    .filter((user) => {
      if (view === "Active Users") return user.status === "Active";
      if (view === "Inactive Users") return user.status === "Inactive";
      if (view === "Banned Users") return user.status === "Banned";
      return true;
    })
    .filter((user) => {
      const term = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
      );
    });

  return (
    <div>
      {/* Search and Rows per page */}
      <div className="flex justify-between mb-4 items-center">
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-1/2"
        />
        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          className="p-2 border rounded"
        >
          <option value={30}>30 rows</option>
          <option value={50}>50 rows</option>
          <option value={100}>100 rows</option>
        </select>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-3">User ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.slice(0, rowsPerPage).map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{user.id}</td>
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3">{user.status}</td>
              <td className="p-3 flex gap-3">
                <FaEye className="cursor-pointer text-blue-500" />
                <FaEdit className="cursor-pointer text-green-500" />
                <FaTrash className="cursor-pointer text-red-500" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
