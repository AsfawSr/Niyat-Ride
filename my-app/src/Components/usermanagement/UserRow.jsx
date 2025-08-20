import React from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const UserRow = ({ user, onEdit, onDelete, onView }) => {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="p-3">
        <img
          src={user.profile}
          alt={user.name}
          className="w-10 h-10 rounded-full"
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
          onClick={() => onView(user)}
        />
        <FaEdit
          className="cursor-pointer text-green-500"
          onClick={() => onEdit(user)}
        />
        <FaTrash
          className="cursor-pointer text-red-500"
          onClick={() => onDelete(user.id)}
        />
      </td>
    </tr>
  );
};

export default UserRow;
