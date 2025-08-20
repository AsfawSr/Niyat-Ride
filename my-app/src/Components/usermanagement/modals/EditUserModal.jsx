import React, { useRef, useState } from "react";

const EditUserModal = ({ user, onChange, onSave, onCancel }) => {
  if (!user) return null;

  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(user.avatar);

  // Handle file selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Preview image
        onChange({
          target: { name: "avatar", value: reader.result }, // Update user avatar
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handleImageClick = () => {
    fileInputRef.current.click();
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

        {/* Header */}
        <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-gray-200">
          Edit User Details
        </h2>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={previewImage}
            alt={user.name}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={onChange}
              className="w-full border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={onChange}
              className="w-full border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                name="role"
                value={user.role}
                onChange={onChange}
                className="w-full border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
              >
                <option>Passenger</option>
                <option>Driver</option>
                <option>Admin</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                name="status"
                value={user.status}
                onChange={onChange}
                className="w-full border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>Banned</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={onChange}
              className="w-full border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row justify-between mt-4 gap-2">
          <button
            onClick={onSave}
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => alert("Deactivate User")}
            className="flex-1 border border-red-500 text-red-500 py-2 rounded hover:bg-red-50 dark:hover:bg-red-900 transition"
          >
            Deactivate User
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
