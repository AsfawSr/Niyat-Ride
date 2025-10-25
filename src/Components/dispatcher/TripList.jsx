// src/Pages/dispatcher/TripList.jsx
import React from "react";

// Badge component
export function Badge({ status }) {
  const statusMeta = {
    EN_ROUTE_TO_PICKUP: {
      label: "En Route (to pickup)",
      badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    PICKED_UP: {
      label: "Picked Up",
      badge: "bg-blue-100 text-blue-800 border-blue-300",
    },
    ON_TRIP: {
      label: "On Trip",
      badge: "bg-green-100 text-green-800 border-green-300",
    },
  };
  const meta = statusMeta[status] || {
    label: status,
    badge: "bg-gray-100 text-gray-700 border-gray-300",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${meta.badge}`}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />{" "}
      {meta.label}
    </span>
  );
}

// Section title
export function SectionTitle({ children }) {
  return (
    <h2 className="text-lg md:text-xl font-semibold tracking-tight text-gray-100">
      {children}
    </h2>
  );
}
// TopBar component
export function TopBar({ count, onSearch }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Ride Status Tracking
        </h1>
        <p className="text-gray-300 text-sm">
          Monitor ongoing trips and intervene when necessary.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search rider, driver, or #ID…"
          className="w-64 rounded-xl bg-gray-800/60 border border-gray-700 px-3 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => onSearch?.(e.target.value)}
        />
        <span className="text-sm text-gray-400">{count} active</span>
      </div>
    </div>
  );
}
// ActionsMenu
export function ActionsMenu({ trip, onReassign, onCancel, onEmergency }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onReassign(trip)}
        className="rounded-xl bg-indigo-500/90 hover:bg-indigo-500 text-white px-3 py-1.5 text-sm shadow-sm"
      >
        Reassign
      </button>
      <button
        onClick={() => onCancel(trip)}
        className="rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-100 px-3 py-1.5 text-sm shadow-sm"
      >
        Cancel
      </button>
      <button
        onClick={() => onEmergency(trip)}
        className="rounded-xl bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 text-sm shadow-sm"
      >
        Emergency
      </button>
    </div>
  );
}
