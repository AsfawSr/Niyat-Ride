import React, { useRef, useState } from "react";
import { Input } from "@mui/material";
import api from "../../../api/api";

const EditUserModal = ({ user, onCancel, onUpdateSuccess }) => {
  if (!user) return null;
  const fileInputRef = useRef(null);
  const [localUser, setLocalUser] = useState(user);
  const [previewImage, setPreviewImage] = useState(user.avatar || "");
  const [loading, setLoading] = useState(false);
  // Handle input changes
  const handleChange = (e) => {
    setLocalUser({ ...localUser, [e.target.name]: e.target.value });
  };
  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const handleImageClick = () => fileInputRef.current.click();
  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(localUser).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (fileInputRef.current.files[0]) {
        formData.append("avatar", fileInputRef.current.files[0]);
      }
      const response = await api.put(`/users/${localUser.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUpdateSuccess();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // Deactivate user
  const handleDeactivate = async () => {
    if (!window.confirm("Are you sure you want to deactivate this user?"))
      return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/users/${localUser.id}`, {
        ...localUser,
        status: "Inactive",
      });
      if (onUpdateSuccess) onUpdateSuccess(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-96 relative shadow-lg dark:shadow-gray-700">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={onCancel}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-gray-200">
          Edit User Details
        </h2>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={previewImage}
            alt={localUser.name}
            className="w-24 h-24 rounded-full mb-2 object-cover border border-gray-300 dark:border-gray-700"
          />
          <button
            onClick={handleImageClick}
            className="border px-3 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Change
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        {/* Form Fields */}
        <div className="space-y-3">
          <Input
            id="name"
            type="text"
            name="name"
            label="Name"
            value={localUser.name}
            onChange={handleChange}
            placeholder="Full Name"
          />
          <Input
            id="email"
            label="Email"
            type="email"
            name="email"
            value={localUser.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <select
            name="role"
            value={localUser.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>Passenger</option>
            <option>Driver</option>
            <option>Admin</option>
            <option>Dispatcher</option>
          </select>
          <select
            name="status"
            value={localUser.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>Banned</option>
          </select>
          <Input
            type="number"
            id="phone"
            name="phone"
            label="Phone Number"
            value={localUser.phone}
            onChange={handleChange}
            placeholder="enter phone Number"
          />
        </div>

        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between mt-4 gap-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleDeactivate}
            disabled={loading}
            className="flex-1 border border-red-500 text-red-500 py-2 rounded hover:bg-red-50 dark:hover:bg-red-900 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Deactivate User"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
