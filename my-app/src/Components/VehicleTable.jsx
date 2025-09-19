// src/Components/VehicleTable.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteVehicleType,
  updateVehicleType,
} from "../store/vehicleSlice"; // adjust path if needed
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

/**
 * VehicleTable
 * - props:
 *    vehicles: array of vehicle type DTOs (id, name, pricePerKm, image, description, isActive...)
 */
const VehicleTable = ({ vehicles = [] }) => {
  const dispatch = useDispatch();
  const [viewVehicle, setViewVehicle] = useState(null);
  const [editVehicle, setEditVehicle] = useState(null);
  const [busy, setBusy] = useState(false);

  // convert image file to base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const handleEditOpen = (v) => {
    // create a shallow clone so we can edit
    setEditVehicle({ ...v });
  };

  const handleEditChange = async (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const base64 = await toBase64(files[0]);
      setEditVehicle((prev) => ({ ...prev, image: base64 }));
    } else {
      setEditVehicle((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSave = async () => {
    if (!editVehicle?.id) return;
    setBusy(true);
    try {
      // dispatch update
      await dispatch(updateVehicleType(editVehicle)).unwrap();
      setEditVehicle(null);
    } catch (err) {
      console.error("Update vehicle failed:", err);
      // you may want to show toast/error message
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vehicle type?")) return;
    setBusy(true);
    try {
      await dispatch(deleteVehicleType(id)).unwrap();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setBusy(false);
    }
  };

  const fallbackImage =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='120'><rect fill='%23f3f4f6' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='14'>No Image</text></svg>";

  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-white">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Price per Km</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">
                <img
    src={`${import.meta.env.VITE_BASE_URL}/uploads/${v.image}`}
    alt={v.name}
    className="w-16 h-12 object-contain rounded"
    onError={(e) => {
        e.currentTarget.src = fallbackImage;
    }}
/>
              </td>
              <td className="px-4 py-3">{v.name}</td>
              <td className="px-4 py-3">${v.pricePerKm}</td>
              <td className="px-4 py-3">{v.description}</td>
              <td className="px-4 py-3">
                {v.isActive === false || v.isActive === "false"
                  ? "Out of Service"
                  : "Active"}
              </td>
              <td className="px-4 py-3 space-x-3">
                <button
                  title="View"
                  className="text-blue-500"
                  onClick={() => setViewVehicle(v)}
                >
                  <FaEye />
                </button>
                <button
                  title="Edit"
                  className="text-green-500"
                  onClick={() => handleEditOpen(v)}
                >
                  <FaEdit />
                </button>
                <button
                  title="Delete"
                  className="text-red-500"
                  onClick={() => handleDelete(v.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
          {vehicles.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                No vehicles found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* View modal */}
      {viewVehicle && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded shadow p-5 w-96">
            <h3 className="text-lg font-semibold mb-3">{viewVehicle.name}</h3>
            <img
              src={`${import.meta.env.VITE_BASE_URL}/uploads/${viewVehicle.image}`}
              alt={viewVehicle.name}
              className="w-full h-40 object-contain rounded mb-3"
            />
            <p>
              <strong>Price:</strong> ${viewVehicle.pricePerKm}
            </p>
            <p>
              <strong>Description:</strong> {viewVehicle.description}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {viewVehicle.isActive ? "Active" : "Out of Service"}
            </p>
            <div className="mt-4 text-right">
              <button
                onClick={() => setViewVehicle(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editVehicle && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded shadow p-5 w-96">
            <h3 className="text-lg font-semibold mb-3">Edit {editVehicle.name}</h3>

            <input
              name="name"
              value={editVehicle.name || ""}
              onChange={handleEditChange}
              placeholder="Name"
              className="w-full mb-2 border rounded px-3 py-2"
            />
            <input
              name="pricePerKm"
              type="number"
              value={editVehicle.pricePerKm || ""}
              onChange={handleEditChange}
              placeholder="Price per Km"
              className="w-full mb-2 border rounded px-3 py-2"
            />
            <input
              name="description"
              value={editVehicle.description || ""}
              onChange={handleEditChange}
              placeholder="Description"
              className="w-full mb-2 border rounded px-3 py-2"
            />
            <select
              name="isActive"
              value={
                editVehicle.isActive === false || editVehicle.isActive === "false"
                  ? "false"
                  : "true"
              }
              onChange={(e) =>
                handleEditChange({ target: { name: "isActive", value: e.target.value } })
              }
              className="w-full mb-2 border rounded px-3 py-2"
            >
              <option value="true">Active</option>
              <option value="false">Out of Service</option>
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={handleEditChange}
              className="w-full mb-2"
            />
            {editVehicle.image && (
              <img
                src={`${import.meta.env.VITE_BASE_URL}/uploads/${editVehicle.image}`}
                alt="preview"
                className="w-full h-28 object-contain rounded mb-2"
                onError={(e) => (e.currentTarget.src = fallbackImage)}
              />
            )}

            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setEditVehicle(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
                disabled={busy}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={busy}
              >
                {busy ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleTable;
