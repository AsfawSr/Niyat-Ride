import React, { useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import api from "../../api/api";

const UserRow = ({ user, onEdit, onView, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    try {
      await api.delete(`/users/${user.id}`);
      onDeleteSuccess(user.id); // notify parent to remove from table
      alert("User deleted successfully!");
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="p-3">
        <img
          src={user.profile || "/default-avatar.png"}
          alt={user.name}
          className="w-10 h-10 rounded-full"
        />
      </td>
      <td className="p-3">{user.id}</td>
      <td className="p-3">{user.name}</td>
      <td className="p-3">{user.phone}</td>
      <td className="p-3">{user.role}</td>
      <td className="p-3">{user.status}</td>
      <td className="p-3 flex gap-3">
        <FaEye
          className="cursor-pointer text-blue-500"
          onClick={() => onView(user)}
        />
        <FaEdit
          className="cursor-pointer text-green-500"
          onClick={() => onEdit(user)}
        />
        <FaTrash
          className={`cursor-pointer text-red-500 ${
            loading ? "opacity-50 pointer-events-none" : ""
          }`}
          onClick={handleDelete}
        />
      </td>
    </tr>
  );
};

export default UserRow;
