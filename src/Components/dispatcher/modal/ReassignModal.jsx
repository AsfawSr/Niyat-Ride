// src/Pages/dispatcher/ReassignModal.jsx
import React from "react";
import { MOCK_NEARBY_DRIVERS } from "../TripsData";

export default function ReassignModal({ open, trip, onClose, onReassign }) {
  if (!open || !trip) return null;

  return (
    <div className=" fixed inset-0 z-[9999] grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl overflow-visible">
        {/* Header */}
        <div className=" flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-gray-100">
            Reassign Trip: {trip.id}
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
            Select a nearby driver to take over this trip.
          </p>
          <ul className="space-y-2 max-h-[450px] overflow-y-auto">
            {MOCK_NEARBY_DRIVERS.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 px-3 py-2"
              >
                <div>
                  <div className="font-medium text-gray-100">
                    {d.name} <span className="text-gray-400">({d.id})</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    ~{d.distanceKm} km away
                  </div>
                </div>
                <button
                  onClick={() => onReassign(d.id)}
                  className="rounded-xl bg-indigo-500 hover:bg-indigo-500/90 text-white px-3 py-1.5 text-sm"
                >
                  Assign
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
