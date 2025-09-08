import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteVehicle, updateVehicle } from "../store/vehicleSlice"; // ✅ ensure plural "vehiclesSlice"
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const VehicleTable = ({ vehicles }) => {
  const dispatch = useDispatch();
  const [viewVehicle, setViewVehicle] = useState(null);
  const [editVehicle, setEditVehicle] = useState(null);

  // ✅ Convert image file -> Base64 string
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result); // base64 string
      reader.onerror = (error) => reject(error);
    });

  // handle edit form changes
  const handleEditChange = async (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const base64 = await toBase64(files[0]);
      setEditVehicle((prev) => ({
        ...prev,
        image: base64, // ✅ stored in Redux
      }));
    } else {
      setEditVehicle((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSave = () => {
    dispatch(updateVehicle(editVehicle));
    setEditVehicle(null);
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Price per Km</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id} className="border-b hover:bg-gray-100">
              <td className="px-4 py-2">
                <img
                  src={v.image}
                  alt={v.name}
                  className="w-16 h-12 object-cover rounded"
                />
              </td>
              <td className="px-4 py-2">{v.name}</td>
              <td className="px-4 py-2">${v.pricePerKm}</td>
              <td className="px-4 py-2">{v.description}</td>
              <td className="px-4 py-2 space-x-3">
                <button
                  className="text-blue-500"
                  onClick={() => setViewVehicle(v)}
                >
                  <FaEye />
                </button>
                <button
                  className="text-green-500"
                  onClick={() => setEditVehicle(v)}
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => dispatch(deleteVehicle(v.id))}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ----- View Modal ----- */}
      {viewVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{viewVehicle.name}</h2>
            <img
              src={viewVehicle.image}
              alt={viewVehicle.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <p>
              <b>Price:</b> ${viewVehicle.pricePerKm}
            </p>
            <p>
              <b>Description:</b> {viewVehicle.description}
            </p>
            <p>
              <b>Status:</b> {viewVehicle.status}
            </p>
            <button
              onClick={() => setViewVehicle(null)}
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ----- Edit Modal ----- */}
      {editVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Vehicle</h2>
            <input
              type="text"
              name="name"
              value={editVehicle.name}
              onChange={handleEditChange}
              placeholder="Car Name"
              className="border rounded px-3 py-2 w-full mb-2"
            />
            <input
              type="number"
              name="pricePerKm"
              value={editVehicle.pricePerKm}
              onChange={handleEditChange}
              placeholder="Price per Km"
              className="border rounded px-3 py-2 w-full mb-2"
            />
            <input
              type="text"
              name="description"
              value={editVehicle.description}
              onChange={handleEditChange}
              placeholder="Description"
              className="border rounded px-3 py-2 w-full mb-2"
            />
            <select
              name="status"
              value={editVehicle.status}
              onChange={handleEditChange}
              className="border rounded px-3 py-2 w-full mb-2"
            >
              <option value="active">Active</option>
              <option value="outofservice">Out of Service</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={handleEditChange}
              className="border rounded px-3 py-2 w-full mb-2"
            />
            {editVehicle.image && (
              <img
                src={editVehicle.image}
                alt="preview"
                className="w-full h-32 object-cover rounded mb-2"
              />
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditVehicle(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleTable;
