import React from "react";

const ViewUserModal = ({ user, onClose }) => {
  if (!user) return null;
  return (
    <div className="fixed inset-0   backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-96 relative shadow-lg dark:shadow-gray-700">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✖
        </button>

        <div className="text-center">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-500">{user.role}</p>
          <span className="px-3 py-.5 border rounded disabled:opacity-50 bg-white dark:bg-gray-800">
            {user.status}
          </span>
        </div>
        <div className="mt-4 space-y-1" da>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Address:</strong> {user.address}
          </p>
          <p>
            <strong>Joined Date:</strong> {user.joinedDate}
          </p>
          <p>
            <strong>Last Active:</strong> {user.lastActive}
          </p>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Activity Summary</h3>
          <p>
            <strong>Total Rides:</strong> {user.totalRides}
          </p>
          <p>
            <strong>Cancellation Count:</strong> {user.cancellationCount}
          </p>
          <p>
            <strong>Rating:</strong> {user.rating}
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewUserModal;
