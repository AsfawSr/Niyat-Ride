import React from "react";

const EditUserModal = ({ user, onChange, onSave, onCancel }) => {
  if (!user) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onCancel}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          Edit User Details
        </h2>

        <div className="flex flex-col items-center mb-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full mb-2"
          />
          <button className="border px-3 py-1 rounded text-sm">Change</button>
        </div>

        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={onChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={onChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium">Role</label>
              <select
                name="role"
                value={user.role}
                onChange={onChange}
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
                value={user.status}
                onChange={onChange}
                className="w-full border p-2 rounded"
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>Banned</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={onChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div className="flex justify-between mt-4 gap-2">
          <button
            onClick={onSave}
            className="flex-1 bg-blue-500 text-white py-2 rounded"
          >
            Save Changes
          </button>
          <button onClick={onCancel} className="flex-1 border py-2 rounded">
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
  );
};

export default EditUserModal;
