import React, { useRef, useState, useEffect } from "react";
import { Input } from "@mui/material";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  clearState,
  editUser,
} from "../../../store/userManagement/editUserSlice";

const EditUserModal = ({ user, onCancel, onUpdateSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.editUser);

  const fileInputRef = useRef(null);
  const [localUser, setLocalUser] = useState(user);
  const [previewImage, setPreviewImage] = useState(user.avatar || "");

  // Reset Redux state when unmounting
  useEffect(() => () => dispatch(clearState()), [dispatch]);

  // Trigger success callback
  useEffect(() => {
    if (success) {
      onUpdateSuccess();
      dispatch(clearState());
    }
  }, [success, onUpdateSuccess, dispatch]);

  const handleChange = (e) => {
    setLocalUser({ ...localUser, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleSave = () => {
    const formData = new FormData();

    if (localUser.role === "admin" || localUser.role === "dispatcher") {
      Object.entries(localUser).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });
      if (fileInputRef.current?.files.length > 0) {
        formData.append("avatar", fileInputRef.current.files[0]);
      }
      dispatch(
        editUser({ data: formData, id: localUser.id, role: localUser.role })
      );
    } else {
      dispatch(
        editUser({
          data: localUser.status,
          id: localUser.id,
          role: localUser.role,
        })
      );
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-96 relative shadow-lg dark:shadow-gray-700">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={onCancel}
        >
          <MdClose />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-gray-200">
          Edit User Details
        </h2>

        {(localUser.role === "admin" || localUser.role === "dispatcher") && (
          <>
            <div className="flex flex-col items-center mb-4">
              <img
                src={previewImage}
                alt={localUser.firstName}
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

            <div className="space-y-3">
              <Input
                id="firstName"
                type="text"
                name="firstName"
                value={localUser.firstName || ""}
                onChange={handleChange}
                placeholder="Update first name"
              />
              <Input
                id="lastName"
                type="text"
                name="lastName"
                value={localUser.lastName || ""}
                onChange={handleChange}
                placeholder="Update last name"
              />
              <Input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={localUser.phoneNumber || ""}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
          </>
        )}

        <select
          name="status"
          value={localUser.status || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-3"
        >
          <option>ACTIVE</option>
          <option>DEACTIVATED</option>
          <option>DELETED</option>
        </select>

        {loading && (
          <p className="text-blue-500 mt-2 text-center">Updating user...</p>
        )}
        {error && (
          <p className="text-red-500 mt-2 text-center">
            Failed to update: {JSON.stringify(error)}
          </p>
        )}
        {success && (
          <p className="text-green-500 mt-2 text-center">
            User updated successfully!
          </p>
        )}

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
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
