// src/Pages/dispatcher/CancelModal.jsx
import React from "react";

export default function CancelModal({ open, trip, onClose, onCancel }) {
  if (!open || !trip) return null;

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl overflow-visible">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-gray-100">
            Cancel Trip: {trip.id}
          </h3>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <p className="text-gray-300 text-sm">
            This will immediately end the trip for the rider and driver.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-xl bg-gray-800 text-gray-200 px-3 py-1.5"
            >
              Close
            </button>
            <button
              onClick={onCancel}
              className="rounded-xl bg-red-600 hover:bg-red-500 text-white px-3 py-1.5"
            >
              Confirm Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
