import React from "react";
import { MdClose } from "react-icons/md";

const ViewUserModal = ({ user, onClose }) => {
  // Prevent rendering if no user is selected
  if (!user) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-96 relative shadow-lg dark:shadow-gray-700">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <MdClose size={24} />
        </button>

        {/* User Info */}
        <div className="text-center">
          {/* Optional avatar placeholder */}
          <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center text-gray-500">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <h2 className="text-xl font-bold">{`${user.firstName} ${user.lastName}`}</h2>
          <p className="mb-2 capitalize">{user.role}</p>
          <span className="px-3 py-1 border rounded bg-white dark:bg-gray-800">
            {user.status}
          </span>
        </div>

        {/* Contact & Dates */}
        <div className="mt-4 space-y-1">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phoneNumber}
          </p>
          <p>
            <strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Last Updated:</strong>{" "}
            {new Date(user.updatedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Optional activity summary */}
        {user.totalRides !== undefined && (
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
        )}

        {/* Close button */}
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
