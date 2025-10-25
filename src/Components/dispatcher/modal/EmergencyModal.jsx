// src/Pages/dispatcher/EmergencyModal.jsx
import React, { useState } from "react";

export default function EmergencyModal({ open, trip, onClose, onEmergency }) {
  const [note, setNote] = useState("");

  if (!open || !trip) return null;

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl overflow-visible">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-gray-100">
            Emergency Trip: {trip.id}
          </h3>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onEmergency(note);
          }}
          className="p-4 space-y-4"
        >
          <div className="space-y-1">
            <label className="text-sm text-gray-300">Describe the issue</label>
            <textarea
              className="w-full min-h-[100px] rounded-xl bg-gray-900 border border-gray-800 px-3 py-2 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., Missed pickup, safety concern, vehicle breakdown…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-gray-800 text-gray-200 px-3 py-1.5"
            >
              Close
            </button>
            <button
              type="submit"
              className="rounded-xl bg-red-600 hover:bg-red-500 text-white px-3 py-1.5"
            >
              Trigger Emergency
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
