import React from "react";
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
];

const UserTable = ({ view }) => {
  let filteredUsers = users;

  if (view === "Active Users") {
    filteredUsers = users.filter((u) => u.status === "Active");
  } else if (view === "Inactive Users") {
    filteredUsers = users.filter((u) => u.status === "Inactive");
  } else if (view === "Banned Users") {
    filteredUsers = users.filter((u) => u.status === "Banned");
  }

  return (
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
        {filteredUsers.map((user) => (
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
  );
};

export default UserTable;
